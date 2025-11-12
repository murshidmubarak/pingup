import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

const initialState = {
  value: null,
};

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      console.log('Fetching profile for userId:', userId);

      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const { data } = await api.get(`/getUserById/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Assuming your backend returns { success: true, user: {...} }
      if (data && data.user) {
        return data.user;
      } else {
        return rejectWithValue(data.message || 'User not found');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user profile';
      return rejectWithValue(errorMessage);
    }
  }
);



// userSlice.js
export const fetchUser = createAsyncThunk('user/fetchUser', async (token, { rejectWithValue }) => {
  try {
    console.log('Fetching user with token:', token);
    
    const { data } = await api.get('/fetchUserData', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    // Check if data exists and has user property
    if (data && data.user) {
      toast.success(data.message || 'User fetched successfully');
      return data.user; // Return the user object directly
    } else {
      toast.error(data.message || 'No user data received');
      return rejectWithValue(data.message || 'No user data received');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user data';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});


export const updateUser = createAsyncThunk('user/updateUser', async ({ token, userData }) => {
  const { data } = await api.post('/updateUser', userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (data.success) {
    toast.success(data.message);
    return data.user;
  } else {
    toast.error(data.message);
    return null;
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.value = action.payload;
      });
  },
});

export default userSlice.reducer;
