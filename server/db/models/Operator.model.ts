import { prop, getModelForClass, pre } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as mongoose from "mongoose";
import crypto from "crypto";
import validator from "validator";

module Constants {
  export enum Roles {
    admin = "admin",
    user = "user",
  }
}

@pre<Operator>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
})
export class Operator {
  // Decorators
  @prop({ type: String, required: [true, "Username is required."] })
  public username!: string;

  @prop({ type: String, required: [true, "Password is required."] })
  public password!: any;

  @prop({
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter valid email address!"],
  })
  public email!: string;

  public static async comparePasswords(
    this: Operator,
    enteredPassword: string
  ) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  public static async getJWTToken(this: Operator, id: string) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: process.env.JWT_EXPIRE_TIME!,
    });
  }

  public static async getPasswordResetToken(this: Operator) {
    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash password reset token
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // token expiry time
    this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);

    return resetToken;
  }

  @prop({
    type: String,
    required: false,
    enum: Constants.Roles,
    default: Constants.Roles["user"],
  })
  public role!: Constants.Roles[];

  @prop({ type: String, required: false })
  public writes!: writesTypes;

  @prop({ type: Object, required: false })
  public image!: imageTypes;

  @prop({ type: String, required: false })
  public resetPasswordToken!: string;

  @prop({ type: Date, required: false })
  public resetPasswordExpire!: Date;
}

class writesTypes {
  @prop({ type: String, required: false, default: false })
  public isManageEvents!: boolean;

  @prop({ type: String, required: false, default: false })
  public isManageTasks!: boolean;
}

class imageTypes {
  @prop({ type: String, required: false })
  public public_id!: string;

  @prop({ type: String, required: false })
  public url!: string;
}

export const OperatorModel = getModelForClass(Operator, {
  schemaOptions: {
    timestamps: true,
  },
});
