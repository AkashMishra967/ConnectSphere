import {createAsyncThunk} from "@reduxjs/toolkit"
import clientServer from "@/src/config"


export const loginUser = createAsyncThunk("user/login",async(user,thunkAPI) =>{
    try{
        const response = await clientServer.post(`/login`,{
            email: user.email,
            password: user.password
        });

        if(response.data.token){
            localStorage.setItem("token",response.data.token)
        }else{
            return thunkAPI.rejectWithValue({
                message:"token not provided"
            })
        }
        return thunkAPI.fulfillWithValue(response.data.token)

    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data)
    }
})


export const registerUser = createAsyncThunk(
    "user/register",
    async(user,thunkAPI) =>{
    try{
        const request = await clientServer.post("/register",{
            username: user.username,
            password: user.password,
            email: user.email,
            name: user.name,
        })
        // Register ke baad auto-login nahi karna, isliye token save nahi kar rahe
        return thunkAPI.fulfillWithValue(request.data)
    }catch(err){
        return thunkAPI.rejectWithValue(err.response?.data.message)
    }
})


export const getAboutUser = createAsyncThunk(
    "user/getAllAboutUser", async(user,thunkAPI) =>{
        try{
            const response = await clientServer.get("/get_user_and_profile",{
                params:{
                    token: user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data)
        }catch(err){
            return thunkAPI.rejectWithValue(err.response?.data.message)
        }
    }
)





export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async(_, thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/get_all_users")
            return thunkAPI.fulfillWithValue(response.data)

        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data.message)
        }
    }
) 



export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",async(user,thunkAPI) =>{
        try{
            const response = await clientServer.post("/user/send_connection_request",{
                token: localStorage.getItem("token"),
                connectionId: user.connectionId
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response?.data.message);
        }
    }
)

export const getConnectionsRequest = createAsyncThunk(
    "user/getConnectionRequests",async(_,thunkAPI) =>{
        try{
            const response = await clientServer.get("/user/get_connections",{
                params:{
                    token: localStorage.getItem("token")
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response?.data.message);
        }
    }
)

export const getMyConnectionRequests = createAsyncThunk(
    "user/getMyConnectionRequests",
    async(_,thunkAPI) =>{
        try{
            const response = await clientServer.get("/user/get_connection_requests",{
                params:{
                    token: localStorage.getItem("token")
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch(error){
            return thunkAPI.rejectWithValue(error.response?.data.message);
        }
    }
)

export const AcceptConnection = createAsyncThunk(
    "user/acceptConnection",async(user,thunkAPI) =>{
        try{
            const response = await clientServer.post("/user/accept_connection_request",{
                token: localStorage.getItem("token"),
                requestId: user.connectionId,
                action_type: user.action
            });
            thunkAPI.dispatch(getConnectionsRequest({token:user.token}))
            thunkAPI.dispatch(getConnectionsRequest({token:user.token}))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response?.data.message);
        }
    }
)