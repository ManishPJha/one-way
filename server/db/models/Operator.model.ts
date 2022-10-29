import {
  prop,
  getModelForClass,
  pre,
  DocumentType,
  ReturnModelType,
} from "@typegoose/typegoose";
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
  @prop({ type: String, required: [true, "Name is required."] })
  public name!: string;

  @prop({ type: String, required: [true, "Surname is required."] })
  public lastName!: string;

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
    this: ReturnModelType<typeof Operator>,
    email: string,
    enteredPassword: string
  ) {
    const operator = await this.findOne({ email }).select({ password: 1 });

    return await bcrypt.compare(enteredPassword, operator?.password!);
  }

  public static getJWTToken(id: mongoose.Types.ObjectId) {
    if (id) {
      return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: process.env.JWT_EXPIRE_TIME!,
      });
    }
  }

  public static async getPasswordResetToken(
    this: ReturnModelType<typeof Operator>,
    email: string
  ) {
    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    const operator = await this.findOne({ email: email });

    if (operator) {
      // hash password reset token
      operator.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // token expiry time
      operator.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);
      operator?.save({ validateBeforeSave: false });
    }

    return resetToken;
  }

  @prop({
    type: String,
    required: false,
    enum: Constants.Roles,
    default: Constants.Roles["user"],
  })
  public role!: Constants.Roles[];

  @prop({ type: Object, required: false })
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
