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
    name: 'extroversion',
    positive: '社交的',
    negative: '内向的'
  },
  {
    name: 'openness',
    positive: '創造的',
    negative: '保守的'
  },
  {
    name: 'conscientiousness',
    positive: '几帳面',
    negative: '大雑把'
  },
  {
    name: 'optimism',
    positive: '楽観的',
    negative: '悲観的'
  },
  {
    name: 'independence',
    positive: '独立心が強い',
    negative: '依存心が強い'
  }
]; 