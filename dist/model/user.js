"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        lowercase: true,
        required: true,
        type: String,
        unique: true
    },
    is_admin: {
        required: true,
        type: Boolean
    },
    password: {
        required: true,
        type: String
    },
    profile: {
        first_name: {
            required: true,
            type: String
        },
        is_developer: {
            required: true,
            type: Boolean
        },
        last_name: {
            required: true,
            type: String
        },
        status: { type: String }
    },
    resetPasswordExpires: { type: Date },
    resetPasswordToken: { type: String },
}, { timestamps: true });
UserSchema.pre("save", function save(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt_1.default.genSalt(10, (genSaltErr, salt) => {
        if (genSaltErr) {
            return next(genSaltErr);
        }
        bcrypt_1.default.hash(user.password, salt, (hashErr, hash) => {
            if (hashErr) {
                return next(hashErr);
            }
            user.password = hash;
            next();
        });
    });
});
const comparePassword = function (candidatePassword, cb) {
    bcrypt_1.default.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};
UserSchema.methods.comparePassword = comparePassword;
UserSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        first_name: this.profile.first_name,
        is_developer: this.profile.is_developer,
        last_name: this.profile.last_name,
        status: this.profile.status
    };
};
exports.User = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=user.js.map