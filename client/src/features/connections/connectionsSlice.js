import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   followers: [],
   following: []
};


export const connectionsSlice = createSlice({
    name:'connections',
    initialState,
    reducers:{

    }
});

export default connectionsSlice.reducer;