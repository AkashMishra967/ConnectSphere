const {createSlice} = require("@reduxjs/toolkit")
const { loginUser, registerUser, getAboutUser, getAllUsers } = require("../../action/authAction")

const initialState ={
    user:undefined,
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message: "",
    isTokenThere:false,
    profileFetched: false,
    connection:[],
    connectionRequest:[],
    all_users:[],
    all_profiles_fetched:false
}





const authslice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset:() =>initialState,
        handleLoginUser:(state) =>{
            state.message = "hello"
        },
        emptyMessage: (state) =>{
            state.message = " "
        },
        setTokenIsThere: (state) =>{
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) =>{
            state.isTokenThere = false
        }
    },

    extraReducers: (builders) =>{
        builders.addCase(loginUser.pending,(state) =>{
            state.isLoading = true
            state.message = "knocking the door..."
        })

        .addCase(loginUser.fulfilled,(state,action) =>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Login is Successfull"
        })
.addCase(loginUser.rejected,(state,action) =>{
    state.isLoading = false;
    state.isError = true;
    state.message = action.payload?.message || "Something went wrong"
})
.addCase(registerUser.pending,(state) =>{
state.isLoading = true
state.message = "Register you..."
})
.addCase(registerUser.fulfilled,(state,action) =>{
    state.isLoading = false;
    state.isError = false;
    state.isSuccess = true;
    // loggedIn intentionally set nahi kiya - register ke baad auto-login nahi karna
    state.message = "Registration successful! Please login."
})
.addCase(registerUser.rejected,(state,action) =>{
state.isLoading = false;
state.isError = true;
state.message = action.payload?.message || "Something went wrong"
})


.addCase(getAboutUser.fulfilled,(state,action) =>{
    state.isLoading = false;
    state.isError = false;
    state.profileFetched = true;
    state.user = action.payload
    
})
.addCase(getAllUsers.fulfilled,(state,action) =>{
    state.isLoading = false;
    state.isError = false;
    state.all_profiles_fetched = true;   
    state.all_users = action.payload.profile  
})


    }
})








export const {reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authslice.actions;

export default authslice.reducer