import mongoose from "mongoose";
import bcrypt from "bcrypt";

export type UserDocument = mongoose.Document & {
    email: string;
    is_admin: Boolean;
    password: String;

    profile: {
        is_developer: Boolean;
        firstName: String;
        lastName: String;
        status: string;
    };

    resetPasswordExpires: string;
    resetPasswordToken: string;

    comparePassword: comparePasswordFunction;
};

const UserSchema = new mongoose.Schema({
    email: {
        lowercase: true,
        required: true,
        type: String,
        unique: true
    },

    is_admin: { type: Boolean},
    
    password: {
        required: true,
        type: String
    },

    profile: {
        is_developer: { type: Boolean},
        firstName: { type: String },
        lastName: { type: String },
        status: { type: String}
    },

    resetPasswordExpires: { type: Date },
    resetPasswordToken: { type: String },
    

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

UserSchema.methods.toJSON = function () {
    return {
      _id: this._id,
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      email: this.email,
      status: this.profile.status,
      is_developer: this.profile.is_developer,
    }
  }

  export const User = mongoose.model<UserDocument>("User", UserSchema);