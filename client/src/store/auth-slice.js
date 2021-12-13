import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    email: "",
    isLoggedIn: false,
    image: "",
  },
  reducers: {
    addUser(state, action) {
      const newUser = action.payload;
      state.userId = newUser.userId;
      state.email = newUser.email;
      state.isLoggedIn = true;
      state.image =
        "https://th.bing.com/th/id/R.8f185ac6c4a78763aa31acf73ee3e46b?rik=X7w93PUB4j3AXg&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_568656.png&ehk=YMUL5OvijifwVr2xWFpqoEf4STb07PZwQdnl0ispWMc%3d&risl=&pid=ImgRaw&r=0";
    },
    removeUser(state) {
      state.userId = "";
      state.email = "";
      state.isLoggedIn = false;
      state.image = "";
    },
    updateUser(state, action) {
      state.image = action.payload.image;
    },
  },
});

export const { addUser, removeUser, updateUser } = authSlice.actions;
export default authSlice;
