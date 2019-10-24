import mongoose = require('mongoose');

export interface IUser extends mongoose.Document{
    email?: string;
    password?: string;
    profile?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
  }