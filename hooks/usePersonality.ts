import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PersonalityTrait, EvaluationFormData } from '../types/evaluation';

export const usePersonality = (postId: string) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRating = (trait: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [trait]: value,
    }));
  };

  const submitRating = async (trait: string, value: number) => {
    try {
      setIsSubmitting(true);
      // 評価値を-1から1の範囲に制限
      const limitedValue = Math.max(-1, Math.min(1, value));
      console.log('評価を開始:', { trait, value: limitedValue, postId });

      // ユーザー情報を取得
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('ユーザー取得エラー:', userError);
        throw userError;
      }
      if (!user) {
        console.error('ユーザーが認証されていません');
        throw new Error('ユーザーが認証されていません');
      }

      // 既存の評価を確認
      const { data: existingEvaluation, error: existingCheckError } = await supabase
        .from('evaluations')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('trait', trait)
        .single();

      if (existingCheckError && existingCheckError.code !== 'PGRST116') { // PGRST116は「結果が見つからない」エラー
        console.error('既存の評価確認エラー:', existingCheckError);
        throw existingCheckError;
      }

      if (existingEvaluation) {
        console.log('既存の評価を更新:', existingEvaluation.id);
        // 既存の評価を更新
        const { error: updateError } = await supabase
          .from('evaluations')
          .update({ value: limitedValue })
          .eq('id', existingEvaluation.id);

        if (updateError) {
          console.error('評価の更新エラー:', updateError);
          throw updateError;
        }
      } else {
        console.log('新しい評価を作成');
        // 新しい評価を作成
        const { error: insertError } = await supabase
          .from('evaluations')
          .insert({
            post_id: postId,
            user_id: user.id,
            trait,
            value: limitedValue,
          });

        if (insertError) {
          console.error('評価の作成エラー:', insertError);
          throw insertError;
        }
      }

      // 投稿の情報を取得
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (postError) {
        console.error('投稿の取得エラー:', postError);
        throw postError;
      }

      if (!post) {
        console.error('投稿が見つかりません');
        throw new Error('投稿が見つかりません');
      }

      console.log('投稿情報:', post);

      // 投稿者の現在のプロフィールを取得
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('extroversion, openness, conscientiousness, optimism, independence')
        .eq('user_id', post.user_id)
        .single();

      if (profileError) {
        console.error('プロフィール取得エラー:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.error('プロフィールが見つかりません');
        throw new Error('プロフィールが見つかりません');
      }

      console.log('現在のプロフィール:', profile);
      console.log('評価対象の特性:', trait);
      console.log('評価値:', limitedValue);

      // プロフィールを更新（投稿者のプロフィールを更新）
      const currentValue = profile[trait as keyof typeof profile];
      const newValue = currentValue + limitedValue;
      
      // 更新対象の特性のみを含むオブジェクトを作成
      const updateData: Record<string, number> = {};
      updateData[trait] = newValue;

      console.log('更新データ:', updateData);
      console.log('ユーザーID:', post.user_id);
      console.log('現在の値:', currentValue);
      console.log('新しい値:', newValue);

      // 更新操作を実行（3回までリトライ）
      let retryCount = 0;
      let updateSuccess = false;
      let lastError = null;

      while (retryCount < 3 && !updateSuccess) {
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('user_id', post.user_id);

          if (updateError) {
            console.error(`プロフィール更新エラー (試行 ${retryCount + 1}/3):`, updateError);
            lastError = updateError;
            retryCount++;
            // 少し待ってから再試行
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }

          // 更新が成功したか確認
          const { data: checkProfile, error: checkError } = await supabase
            .from('profiles')
            .select('extroversion, openness, conscientiousness, optimism, independence')
            .eq('user_id', post.user_id)
            .single();

          if (checkError) {
            console.error('更新確認エラー:', checkError);
            lastError = checkError;
            retryCount++;
            continue;
          }

          if (checkProfile[trait as keyof typeof profile] === newValue) {
            updateSuccess = true;
            console.log('プロフィール更新成功:', checkProfile);
          } else {
            console.warn(`更新値が一致しません (試行 ${retryCount + 1}/3):`, {
              expected: newValue,
              actual: checkProfile[trait as keyof typeof profile]
            });
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`予期せぬエラー (試行 ${retryCount + 1}/3):`, error);
          lastError = error;
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!updateSuccess) {
        throw lastError || new Error('プロフィールの更新に失敗しました');
      }

      // 成功したらローカルの状態も更新
      updateRating(trait, limitedValue);
    } catch (error) {
      console.error('評価の保存に失敗しました:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ratings,
    isSubmitting,
    updateRating,
    submitRating,
  };
}; 