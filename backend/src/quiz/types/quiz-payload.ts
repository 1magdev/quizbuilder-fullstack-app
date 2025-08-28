export interface QuizPayload {
  name: string;
  description: string;
  questions: questions;
}

export type questions = Array<{
  title: string;
  type: 'short-text' | 'boolean' | 'multiple-choice';
  answer?: string | number | boolean;
  placeholder?: string;
  options?: options;
}>;

type options = Array<{
  id: number;
  text: string;
}>;
