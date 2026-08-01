import {createAsyncThunk} from "@reduxjs/toolkit";
import clientServer from "@/src/config";

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",async(_, thunkAPI) =>{
try{

const response = await clientServer.get('/posts')
return thunkAPI.fulfillWithValue(response.data)




}catch(err){
    return thunkAPI.rejectWithValue(err.response.data)
}

    }
)