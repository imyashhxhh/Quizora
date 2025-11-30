import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Check localStorage to see if a token already exists to keep the user logged in
  token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    // This action will be called when a user logs in successfully
    setToken(state, action) {
      state.token = action.payload;
      // Save the token to localStorage
      localStorage.setItem('token', JSON.stringify(action.payload));
    },
    // This action will be called when a user logs out
    clearToken(state) {
      state.token = null;
      // Remove the token from localStorage
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;