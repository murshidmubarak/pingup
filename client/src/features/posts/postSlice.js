import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";



export const fetchFeedPosts = createAsyncThunk(
  "posts/fetchFeedPosts",
  async (page = 1, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get(`/fetchFeed?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { page, posts: res.data.posts, hasMore: res.data.hasMore };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);




//fetch users posts
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/user/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);



// Like / Unlike Post
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.put(`/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Add Comment
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);



const postsSlice = createSlice({
  name: "posts",
  initialState: {
    // posts: [],
    // loading: false,
    // error: null,

      posts: [],
  loading: false,
  hasMore: true,
  error: null,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      // .addCase(fetchFeedPosts.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchFeedPosts.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.posts = action.payload;
      // })
      // .addCase(fetchFeedPosts.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      .addCase(fetchFeedPosts.pending, (state) => {
  state.loading = true;
})
.addCase(fetchFeedPosts.fulfilled, (state, action) => {
  state.loading = false;
  state.hasMore = action.payload.hasMore;

  if (action.payload.page === 1) {
    state.posts = action.payload.posts;
  } else {
    state.posts = [...state.posts, ...action.payload.posts];
  }
})
.addCase(fetchFeedPosts.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })



      // Like Toggle
.addCase(toggleLike.fulfilled, (state, action) => {
  const { postId, likes_count } = action.payload;
  state.posts = state.posts.map((post) =>
    post._id === postId ? { ...post, likes_count } : post
  );
})


      

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const updated = action.payload;
        state.posts = state.posts.map((post) =>
          post._id === updated._id ? updated : post
        );
      })


  },
});

export default postsSlice.reducer;
