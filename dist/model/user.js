"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.UserSchema = new Schema({
    created_date: {
        default: Date.now,
        type: Date
    },
    developer: { type: Boolean },
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
    status: { type: String }
});
//# sourceMappingURL=user.js.map