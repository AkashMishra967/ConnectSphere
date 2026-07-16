const {createSlice} = require("@reduxjs/toolkit")
const { loginUser, registerUser } = require("../../action/authAction")

const initialState ={
    user:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message: "",
    profileFetched: false,
    connection:[],
    connectionRequest:[]
}


const authslice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset:() =>initialState,
        handleLoginUser:(state) =>{
            state.message = "hello"
        }
    },
    extraReducers: (builders) =>{
        builders.addCase(loginUser.pending,(state) =>{
            state.isLoading = true
            state.message = "knocking the door..."
        })

        addCase(loginUser.fulfilled,(state,action) =>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Login is Successfull"
        })
.addCase(loginUser.rejected,(state,action) =>{
    state.isLoading = false;
    state.isError = true;
    state.message = action.payload
})
.addCase(registerUser.pending,(state) =>{
state.isLoading = true
state.message = "Register you..."
})
.addCase(registerUser.fulfilled,(state,action) =>{
    state.isLoading = false,
    state.isError = false,
    state.isSuccess = false,
    state.loggedIn = true;
    state.message = "Register is Successfull"
})
.addCase(registerUser.rejected,(state,action) =>{
state.isLoading = false;
state.isError = true;
state.message = action.payload
})
    }
})

export default authslice.reducer