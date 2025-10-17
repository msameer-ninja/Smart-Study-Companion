
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
