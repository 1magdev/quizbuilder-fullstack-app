import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Quiz {
  id: number;
  name: string;
  description: string;
  questions: Question[];
}

export interface Question {
  title: string;
  type: "short-text" | "boolean" | "multiple-choice";
  answer?: string | number | boolean;
  placeholder?: string;
  options?: Option[];
}

export interface Option {
  id: number;
  text: string;
}

export interface CreateQuizPayload {
  name: string;
  description: string;
  questions: Question[];
}

export const quizApi = {
  async getAll(): Promise<Quiz[]> {
    const response = await api.get("/quiz");
    return response.data;
  },

  async getById(id: number): Promise<Quiz> {
    const response = await api.get(`/quiz/${id}`);
    return response.data;
  },

  async create(payload: CreateQuizPayload): Promise<Quiz> {
    const response = await api.post("/quiz", payload);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/quiz/${id}`);
  },
};
