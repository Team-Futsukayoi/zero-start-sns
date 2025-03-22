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

      const { error } = await supabase
        .from('evaluations')
        .upsert({
          post_id: postId,
          user_id: user.id,
          trait,
          value,
        });

      if (error) throw error;

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