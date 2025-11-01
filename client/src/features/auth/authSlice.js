// // features/auth/authSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     isAuthenticated: false,
//     user: null,
//     isLoading: false,
//   },
//   reducers: {
//     loginStart: (state) => {
//       state.isLoading = true;
//     },
//     loginSuccess: (state, action) => {
//       state.isLoading = false;
//       state.isAuthenticated = true;
//       state.user = action.payload;
//     },
//     loginFailure: (state) => {
//       state.isLoading = false;
//       state.isAuthenticated = false;
//       state.user = null;
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//     },
//     setAuth: (state, action) => {
//       state.isAuthenticated = action.payload.isAuthenticated;
//       state.user = action.payload.user || null;
//     },
//   },
// });

// export const { 
//   loginStart, 
//   loginSuccess, 
//   loginFailure, 
//   logout, 
//   setAuth 
// } = authSlice.actions;

// export default authSlice.reducer;








// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// // Async thunk for login
// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/login', { email, password });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Login failed');
//     }
//   }
// );

// Async thunk for checking auth status
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
 // ✅ Token send cheyyuka
      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);



// Async thunk for completing profile
// export const completeUserProfile = createAsyncThunk(
//   'auth/completeProfile',
//   async (profileData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/complete-profile', profileData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Profile completion failed');
//     }
//   }
// );
export const completeUserProfile = createAsyncThunk(
  'auth/completeProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // 👈 get token from storage

      const response = await api.post('/complete-profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 send token to backend
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile completion failed');
    }
  }
);



// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/signup', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    isProfileComplete: false,
    user: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.isProfileComplete = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    
      // // Login cases
      // .addCase(loginUser.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(loginUser.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isAuthenticated = true;
      //   state.isProfileComplete = action.payload.user.isProfileComplete;
      //   state.user = action.payload.user;
      //   state.error = null;
        
      //   if (action.payload.token) {
      //     localStorage.setItem('token', action.payload.token);
      //   }
      // })
      // .addCase(loginUser.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isAuthenticated = false;
      //   state.isProfileComplete = false;
      //   state.user = null;
      //   state.error = action.payload;
      // })
      
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isProfileComplete = action.payload.user.isProfileComplete;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isProfileComplete = false;
        state.user = null;
        state.error = action.payload;
        localStorage.removeItem('token');
      })
      
      // Complete profile cases
      .addCase(completeUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isProfileComplete = true;
        state.user = action.payload.user;
        state.error = null;
        
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(completeUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isProfileComplete = action.payload.user.isProfileComplete;
        state.user = action.payload.user;
        state.error = null;
        
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isProfileComplete = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;