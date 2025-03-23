import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PersonalityTrait, EvaluationFormData } from '../types/evaluation';

export const usePersonality = (postId: string) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // コンポーネントマウント時に既存の評価を取得
  useEffect(() => {
    const fetchExistingRatings = async () => {
      try {
        setIsLoading(true);

        // ユーザー情報を取得
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('ユーザー取得エラー:', userError);
          return;
        }

        // 投稿の情報を取得（投稿者のIDを取得するため）
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single();

        if (postError || !post) {
          console.error('投稿の取得エラー:', postError);
          return;
        }

        // 既存の評価を取得
        const { data: existingEvaluations, error: evalError } = await supabase
          .from('evaluations')
          .select('trait, value')
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (evalError) {
          console.error('評価の取得エラー:', evalError);
          return;
        }

        // 既存の評価をratingsステートに設定
        const existingRatings: Record<string, number> = {};
        existingEvaluations?.forEach((evaluation) => {
          existingRatings[evaluation.trait] = evaluation.value;
        });

        console.log('既存の評価を読み込みました:', existingRatings);

        // 評価データが存在する場合のみ設定する
        if (Object.keys(existingRatings).length > 0) {
          setRatings(existingRatings);
        }
      } catch (error) {
        console.error('評価の読み込みに失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingRatings();
  }, [postId]);

  const updateRating = (trait: string, value: number) => {
    setRatings((prev) => ({
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
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error('ユーザー取得エラー:', userError);
        throw userError;
      }
      if (!user) {
        console.error('ユーザーが認証されていません');
        throw new Error('ユーザーが認証されていません');
      }

      // 既存の評価を確認
      const { data: existingEvaluation, error: existingCheckError } =
        await supabase
          .from('evaluations')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('trait', trait)
          .single();

      if (existingCheckError && existingCheckError.code !== 'PGRST116') {
        // PGRST116は「結果が見つからない」エラー
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

      // 投稿の情報を取得（投稿者のIDを取得するため）
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

      // personality_ratingsテーブルで既存の評価をチェック
      const { data: existingPersonalityRating, error: existingRatingError } =
        await supabase
          .from('personality_ratings')
          .select('id, value')
          .eq('target_user_id', post.user_id)
          .eq('evaluator_id', user.id)
          .eq('trait', trait)
          .single();

      if (existingRatingError && existingRatingError.code !== 'PGRST116') {
        console.error(
          '既存のパーソナリティ評価確認エラー:',
          existingRatingError
        );
        throw existingRatingError;
      }

      // パーソナリティ評価の保存または更新
      if (existingPersonalityRating) {
        // 既存の評価を単純に新しい値で上書き
        console.log('パーソナリティ評価を更新:', {
          trait,
          oldValue: existingPersonalityRating.value,
          newValue: limitedValue,
        });

        const { error: updateRatingError } = await supabase
          .from('personality_ratings')
          .update({ value: limitedValue })
          .eq('id', existingPersonalityRating.id);

        if (updateRatingError) {
          console.error('パーソナリティ評価の更新エラー:', updateRatingError);
          throw updateRatingError;
        }

        console.log('パーソナリティ評価を更新しました:', {
          trait,
          value: limitedValue,
        });
      } else {
        // 新しい評価を作成
        const { error: insertRatingError } = await supabase
          .from('personality_ratings')
          .insert({
            target_user_id: post.user_id,
            evaluator_id: user.id,
            trait,
            value: limitedValue,
          });

        if (insertRatingError) {
          console.error('パーソナリティ評価の作成エラー:', insertRatingError);
          throw insertRatingError;
        }

        console.log('新しいパーソナリティ評価を作成しました:', {
          trait,
          value: limitedValue,
        });
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
    isLoading,
    updateRating,
    submitRating,
  };
};
