import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi 401 (Token hết hạn hoặc không hợp lệ)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu Backend báo lỗi 401, chứng tỏ Token đã bị lỗi/hết hạn. Ta cần xóa Token cũ đi.
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      window.dispatchEvent(new Event('authChange'));
    }
    return Promise.reject(error);
  }
);

export const getQuizzes = async () => {
  const response = await api.get('/quiz/quizzes/');
  return response.data;
};

export const createQuiz = async (quizData) => {
  const response = await api.post('/quiz/quizzes/', quizData);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/quiz/categories/');
  return response.data;
};

export const getBanks = async () => {
  const response = await api.get('/quiz/question-banks/');
  return response.data;
};

export const getBankDetails = async (bankId) => {
  const response = await api.get(`/quiz/question-banks/${bankId}/`);
  return response.data;
};

export const createBank = async (name, description) => {
  const response = await api.post('/quiz/question-banks/', { name, description });
  return response.data;
};

export const getBankQuestions = async (bankId) => {
  const response = await api.get(`/quiz/questions/?bank=${bankId}`);
  return response.data;
};

export const createQuestion = async (questionData) => {
  const response = await api.post('/quiz/questions/', questionData);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await api.delete(`/quiz/questions/${id}/`);
  return response.data;
};

// --- BLOG API ---
export const getArticles = async () => (await api.get('/quiz/articles/')).data;
export const getArticle = async (id) => (await api.get(`/quiz/articles/${id}/`)).data;
export const getMyArticles = async () => (await api.get('/quiz/articles/my_articles/')).data;
export const getTopics = async () => (await api.get('/quiz/topics/')).data;
export const createArticle = async (data) => (await api.post('/quiz/articles/', data)).data;
export const updateArticle = async (id, data) => (await api.patch(`/quiz/articles/${id}/`, data)).data;

// --- FLASHCARDS API ---
export const getFlashcardSets = async () => (await api.get('/quiz/flashcard-sets/')).data;
export const getMyFlashcardSets = async () => (await api.get('/quiz/flashcard-sets/my_sets/')).data;
export const createFlashcardSet = async (data) => (await api.post('/quiz/flashcard-sets/', data)).data;
export const updateFlashcardSet = async (id, data) => (await api.patch(`/quiz/flashcard-sets/${id}/`, data)).data;

export const getQuizDetails = async (id) => {
  const response = await api.get(`/quiz/quizzes/${id}/`);
  return response.data;
};

export const submitQuiz = async (id, answers) => {
  const response = await api.post(`/quiz/quizzes/${id}/submit/`, { answers });
  return response.data;
};

export const getMyAttempts = async () => {
  const response = await api.get('/quiz/attempts/');
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('username', username);
  }
  return response.data;
};

export const registerUser = async (username, password, email) => {
  const response = await api.post('/auth/register/', { username, password, email });
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
};
