import bcrypt from "bcrypt";
import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
    email: string;
    is_admin: boolean;
    password: string;

    profile: {
        first_name: string;
        is_developer: boolean;
        last_name: string;
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

        status: { type: String}
    },

    resetPasswordExpires: { type: Date },
    resetPasswordToken: { type: String },

}, { timestamps: true });

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

UserSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (genSaltErr, salt) => {
        if (genSaltErr) { return next(genSaltErr); }
        bcrypt.hash(user.password, salt, (hashErr: mongoose.Error, hash) => {
            if (hashErr) { return next(hashErr); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

UserSchema.methods.comparePassword = comparePassword;

UserSchema.methods.toJSON = function() {
    return {
      _id: this._id,
      email: this.email,
      first_name: this.profile.first_name,
      is_developer: this.profile.is_developer,
      last_name: this.profile.last_name,
      status: this.profile.status
    };
  };

export const User = mongoose.model<UserDocument>("User", UserSchema);
