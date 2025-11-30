import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questions: [],
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizQuestions(state, action) {
      state.questions = action.payload;
    },
    clearQuizQuestions(state) {
      state.questions = [];
    },
  },
});

export const { setQuizQuestions, clearQuizQuestions } = quizSlice.actions;
export default quizSlice.reducer;