import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices.js';
import quizReducer from './slices/quizSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
  },
});