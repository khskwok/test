import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  domain: string;
  difficulty: string;
  aws_service: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface StudyGuide {
  id: number;
  title: string;
  content: string;
  domain: string;
  service: string;
  key_points: string;
  use_cases: string;
  best_practices: string;
  pricing_notes: string;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  domain: string;
  service: string;
  difficulty: string;
  tags: string;
  created_at: string;
}

export interface AnswerRequest {
  question_id: number;
  selected_answer: string;
  time_taken?: number;
}

export interface AnswerResponse {
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  domain: string;
}

export interface UserProgress {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number;
  domainStats: Array<{
    domain: string;
    totalQuestions: number;
    answered: number;
    accuracy: number;
  }>;
}

export interface ExamSimulation {
  exam_id: string;
  questions: Question[];
  time_limit: number;
  total_questions: number;
}

class ApiService {
  // Questions
  async getQuestions(params?: {
    domain?: string;
    difficulty?: string;
    limit?: number;
    offset?: number;
  }): Promise<Question[]> {
    const response = await api.get('/api/questions', { params });
    return response.data;
  }

  async getQuestion(id: number): Promise<Question> {
    const response = await api.get(`/api/questions/${id}`);
    return response.data;
  }

  async submitAnswer(answer: AnswerRequest): Promise<AnswerResponse> {
    const response = await api.post('/api/answers', answer);
    return response.data;
  }

  // Study Guides
  async getStudyGuides(params?: {
    domain?: string;
    service?: string;
  }): Promise<StudyGuide[]> {
    const response = await api.get('/api/study-guides', { params });
    return response.data;
  }

  async getStudyGuide(id: number): Promise<StudyGuide> {
    const response = await api.get(`/api/study-guides/${id}`);
    return response.data;
  }

  // Flashcards
  async getFlashcards(params?: {
    domain?: string;
  }): Promise<Flashcard[]> {
    const response = await api.get('/api/flashcards', { params });
    return response.data;
  }

  // Progress
  async getProgress(): Promise<UserProgress> {
    const response = await api.get('/api/progress');
    return response.data;
  }

  // Exam Simulation
  async simulateExam(): Promise<ExamSimulation> {
    const response = await api.get('/api/exam/simulate');
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();