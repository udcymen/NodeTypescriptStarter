import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    created_date: {
        default: Date.now,
        type: Date
    },
    developer: { type: Boolean},
    email: {
        lowercase: true,
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    profile: {
        firstName: { type: String },
        lastName: { type: String }
    },
    resetPasswordExpires: { type: Date },
    resetPasswordToken: { type: String },
    status: { type: String}
});
