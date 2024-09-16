import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    // description:{
    //     type:String,
    //     required:true,
    // },
    frequency:{
        type:String,
        required:true,
        enum: ['Daily', 'Weekly', 'Monthly'],
    },
    streak:{
        type:Number,
        default:0,
    },
    points:{
        type:Number,
        default:0,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    lastCompleted:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
        
    
}) 

const Habit = mongoose.model("Habit",habitSchema);
export default Habit;
