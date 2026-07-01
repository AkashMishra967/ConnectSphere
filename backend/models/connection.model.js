import mongoose, { connection } from "mongoose";

const connectionRequest = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    connectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status_accepted:{
        type:Boolean,
        default: null,
    }
})

const connectionRequest = mongoose.model("ConnectionRequest", connectionRequest);

export default connectionRequest;