export interface FormQuestion {
  id: string;
  entryId: string;
  title: string;
  type: string;
  required: boolean;
  options: string[];
  sectionIndex: number;
  order: number;
}

export interface FormData {
  id: string;
  googleFormUrl: string;
  googleFormId: string;
  title: string;
  description?: string;
  status: string;
  questions: FormQuestion[];
  createdAt: string;
}

export interface FillJobData {
  id: string;
  formId: string;
  responseCount: number;
  completedCount: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  spreadEnabled: boolean;
  spreadInterval?: number;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  createdAt: string;
  form?: {
    title: string;
    googleFormUrl: string;
  };
}

export interface AnswerConfigData {
  questionId: string;
  entryId: string;
  questionType: string;
  options: string[];
  ratios: Record<string, number>;
  customTexts?: string[];
}

export interface UserData {
  id: string;
  email: string;
  username: string;
  name?: string;
  credits: number;
  referralCode?: string;
}
