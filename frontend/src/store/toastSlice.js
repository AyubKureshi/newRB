import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "success",
  duration: 4000,
  isOpen: false,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      const { message, type = "success", duration = 4000 } = action.payload || {};
      state.message = message || "";
      state.type = type;
      state.duration = duration;
      state.isOpen = Boolean(message);
    },
    hideToast: (state) => {
      state.isOpen = false;
      state.message = "";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice;
