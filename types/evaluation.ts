export type PersonalityTrait = {
  name: string;
  positive: string;
  negative: string;
};

export type Evaluation = {
  id: string;
  postId: string;
  userId: string;
  trait: string;
  value: number;
  createdAt: Date;
};

export type EvaluationFormData = {
  trait: string;
  value: number;
};

export const PERSONALITY_TRAITS: PersonalityTrait[] = [
  {
    name: '外向性',
    positive: '社交的',
    negative: '内向的'
  },
  {
    name: '協調性',
    positive: '協力的',
    negative: '自己中心的'
  },
  {
    name: '勤勉性',
    positive: '几帳面',
    negative: '大雑把'
  },
  {
    name: '神経症傾向',
    positive: '敏感',
    negative: '鈍感'
  },
  {
    name: '開放性',
    positive: '創造的',
    negative: '保守的'
  }
]; 