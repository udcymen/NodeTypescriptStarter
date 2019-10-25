import mongoose from "mongoose";
import bcrypt from "bcrypt";

export type UserDocument = mongoose.Document & {
    developer: Boolean;
    email: string;
    password: String;

    profile: {
        firstName: String,
        lastName: String
    };

    resetPasswordExpires: string;
    resetPasswordToken: string;

    status: string

    comparePassword: comparePasswordFunction;
};

const UserSchema = new mongoose.Schema({
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

}, { timestamps: true });

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

UserSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

UserSchema.methods.comparePassword = comparePassword;

UserSchema.methods.toJson = function () {
    return {
      _id: this._id,
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      email: this.email,
      status: this.status,
      developer: this.developer
    }
  }

  export const User = mongoose.model<UserDocument>("User", UserSchema);