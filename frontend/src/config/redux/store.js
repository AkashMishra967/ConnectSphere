import {configureStore, isAction} from "@reduxjs/toolkit"
import authReducer from "./reducer/authreducer";


// step for state management
// submit Action
// handle action in its reducer 
// register here => Redux

export const store = configureStore({
    reducer:{
        auth:authReducer
    }
})