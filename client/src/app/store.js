import { configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice.js';
import connectionsReducer from '../features/connections/connectionsSlice.js';
import authReducer from '../features/auth/authSlice.js';



export const store = configureStore({
  reducer: {
    user: userReducer,
    connections: connectionsReducer,
    auth: authReducer,
  },
});


export default store;



