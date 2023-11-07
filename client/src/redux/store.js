import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import { usersSlice } from "./userSlice";
import { cyphersSlice } from "./cypherSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: usersSlice,
    cypher: cyphersSlice,
  },
});
