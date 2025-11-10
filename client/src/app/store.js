import { configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice.js';
import connectionsReducer from '../features/connections/connectionsSlice.js';
import authReducer from '../features/auth/authSlice.js';
import postsReducer from '../features/posts/postSlice.js';



export const store = configureStore({
  reducer: {
    user: userReducer,
    connections: connectionsReducer,
    auth: authReducer,
    posts: postsReducer,
  },
});


export default store;



