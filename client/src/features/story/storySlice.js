import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  stories: [],
  status: 'idle',
  error: null,
};

export const postStory = createAsyncThunk(
  'story/postStory',
  async (storyData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post('/createStory', storyData, {    
        headers: {
          'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
        });
        if (data.success) {
            return data.story;
        } else {
            return rejectWithValue(data.message || 'Failed to post story');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to post story';
        return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUserStories = createAsyncThunk(
  'story/fetchUserStories',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get('/getUserStories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        return data.stories;
      } else {
        return rejectWithValue(data.message || 'Failed to fetch user stories');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user stories';
      return rejectWithValue(errorMessage);
    }
  }
);


const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postStory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postStory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stories.push(action.payload);
            })
            .addCase(postStory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchUserStories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserStories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stories = action.payload;
            })
            .addCase(fetchUserStories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default storySlice.reducer;