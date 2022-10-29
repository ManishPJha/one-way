import { prop, getModelForClass } from "@typegoose/typegoose";
import validator from "validator";

module Constants {
  export enum Qualifications {
    Btech = "B.Tech/M.Tech",
    BBA = "BBA/MBA",
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

  @prop({ type: Array, required: true })
  public image!: ImageFields;

  @prop({
    type: String,
    required: [true, "Please select qualifications."],
    enum: Constants.Qualifications,
  })
  public qualifications!: Constants.Qualifications[];

  @prop({ type: Object, required: true })
  public residents!: Residents;

  @prop({ type: Boolean, required: true, default: false })
  public isSalaried!: boolean;

  @prop({ type: Boolean, required: true, default: false })
  public isIntern!: boolean;

  @prop({ type: Date, required: false })
  public trainingDuration!: Date;

  @prop({ type: Date, required: false })
  public bondDuration!: Date;
}

class ImageFields {
  @prop({
    type: String,
    required: true
  })
  public_id!: string

  @prop({
    type: String,
    required: true
  })
  url!: string
}

class Residents {
  @prop({
    type: Number,
    required: true,
    maxlength: [10, "maximum length for pincode is 10."],
  })
  public pincode!: number;

  @prop({ type: String, required: true })
  public address!: string;

  @prop({ type: String, required: true })
  public country!: string;

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
