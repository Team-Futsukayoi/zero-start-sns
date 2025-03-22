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
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('ユーザーが認証されていません');

      // 投稿の作成者を取得
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (postError) throw postError;
      if (!post) throw new Error('投稿が見つかりません');

      // 既存の評価を確認
      const { data: existingEvaluation, error: existingCheckError } = await supabase
        .from('evaluations')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('trait', trait)
        .single();

      if (existingCheckError && existingCheckError.code !== 'PGRST116') { // PGRST116は「結果が見つからない」エラー
        throw existingCheckError;
      }

      let evaluationError;
      if (existingEvaluation) {
        // 既存の評価を更新
        const { error } = await supabase
          .from('evaluations')
          .update({ value })
          .eq('id', existingEvaluation.id);
        evaluationError = error;
      } else {
        // 新規評価を作成
        const { error } = await supabase
          .from('evaluations')
          .insert({
            post_id: postId,
            user_id: user.id,
            trait,
            value,
          });
        evaluationError = error;
      }

      if (evaluationError) throw evaluationError;

      // 投稿者の現在のプロフィールを取得
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('extroversion, openness, conscientiousness, optimism, independence')
        .eq('user_id', post.user_id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('プロフィールが見つかりません');

      console.log('Current profile:', profile);
      console.log('Trait:', trait);
      console.log('Value:', value);

      // プロフィールを更新（投稿者のプロフィールを更新）
      const currentValue = profile[trait as keyof typeof profile];
      const newValue = Math.max(-10, Math.min(10, currentValue + value));
      
      const updateData = {
        [trait as keyof typeof profile]: newValue
      };

      console.log('Update data:', updateData);
      console.log('User ID:', post.user_id);
      console.log('Current value:', currentValue);
      console.log('New value:', newValue);

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', post.user_id);

      if (updateError) {
        console.error('プロフィール更新エラー:', updateError);
        console.error('更新データ:', updateData);
        throw updateError;
      }

      // 少し待機してから更新後のプロフィールを確認
      await new Promise(resolve => setTimeout(resolve, 1000));

      // キャッシュをクリアしてから確認
      const { data: updatedProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('extroversion, openness, conscientiousness, optimism, independence')
        .eq('user_id', post.user_id)
        .single()
        .throwOnError();

      if (profileCheckError) {
        console.error('更新後のプロフィール確認エラー:', profileCheckError);
      } else {
        console.log('Updated profile:', updatedProfile);
        // 更新が反映されているか確認
        if (updatedProfile[trait as keyof typeof profile] !== newValue) {
          console.warn('プロフィールの更新が反映されていません');
          // 再試行
          const { data: retryProfile, error: retryError } = await supabase
            .from('profiles')
            .select('extroversion, openness, conscientiousness, optimism, independence')
            .eq('user_id', post.user_id)
            .single()
            .throwOnError();
          
          if (!retryError) {
            console.log('Retry profile:', retryProfile);
          }
        }
      }

      // 成功したらローカルの状態も更新
      updateRating(trait, value);
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