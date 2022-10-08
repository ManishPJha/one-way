import { prop, getModelForClass } from "@typegoose/typegoose";
import validator from "validator";

module Constants {
  export enum Qualifications {
    Btech = "B.Tech",
    Diploma = "Diploma",
    BE = "B.E",
    Other = "Other",
  }
}

export class Employee {
  @prop({ type: String, required: true })
  public name!: string;
  
  @prop({ type: String, required: true })
  public lastName!: string;

  @prop({ type: Date, required: true })
  public dob!: Date;

  @prop({
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter valid email address!"],
  })
  public email!: string;

  @prop({ type: String, required: true })
  public image!: string;

  @prop({
    type: String,
    required: [true, "Please select qualifications."],
    enum: Constants.Qualifications,
  })
  public qualifications!: Constants.Qualifications[];

  @prop({ type: Array, required: true })
  public residents!: Residents;

  @prop({ type: Boolean, required: true, default: false })
  public isSalaried!: boolean;

  @prop({ type: Boolean, required: true, default: false })
  public isIntern!: boolean;

  @prop({ type: Number, required: false })
  public trainingDuration!: number;

  @prop({ type: Number, required: false })
  public bondDuration!: number;
}

class Residents {
  @prop({
    type: Number,
    required: true,
    maxlength: [6, "maximum length for pincode is 6."],
  })
  public pincode!: number;

  @prop({ type: String, required: true })
  public address!: string;

  @prop({ type: String, required: false })
  public landmark!: string;

  @prop({ type: String, required: true })
  public city!: string;

  @prop({ type: String, required: true })
  public state!: string;
}

export const EmployeeModel = getModelForClass(Employee, {
  schemaOptions: {
    timestamps: true,
  },
});
