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
      const { data: existingEvaluation, error: checkError } = await supabase
        .from('evaluations')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('trait', trait)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116は「結果が見つからない」エラー
        throw checkError;
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

      // 投稿作成者のプロフィールを直接更新
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          [trait]: value
        })
        .eq('user_id', post.user_id);

      if (profileError) {
        console.error('プロフィール更新エラー:', profileError);
        throw profileError;
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