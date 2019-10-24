import { Document, Schema, Model, model} from "mongoose";
import { IUser } from "../Interface/user";
import bcrypt from "bcrypt";

export interface IUserModel extends IUser, Document {
  fullName(): string;
}

export var UserSchema: Schema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        firstName: { type: String },
        lastName: { type: String }
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
    },
    {
        timestamps: true,
    }
);

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre<IUser>('save', function (next) {
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword: string, cb: Function): void {
  if (this.password==='*') {cb(null,false);return;}
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}

UserSchema.methods.toJson = function () {
  return {
    _id: this._id,
    firstName: this.profile.firstName,
    lastName: this.profile.lastName,
    email: this.email,
    role: this.role,
    provider: this.provider
  }
}

export const User: Model<IUser> = model<IUserModel>("User", UserSchema);
