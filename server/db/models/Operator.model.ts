import { prop, getModelForClass } from "@typegoose/typegoose"

export class Operator {

    @prop({ type: String, required: [true, 'Username is required.'] })
    public username!: string

    @prop({ type: String, required: [true, 'Password is required.'] })
    public password!: string

    @prop({ type: String, required: false })
    public writes!: writesType

    // @prop({ type: String, required: true })
    // public confirmPassword!: string
}

class writesType {
    @prop({ type: String, required: false, default: false })
    public isAdmin!: boolean 

    @prop({ type: String, required: false, default: false })
    public isManageEvents!: boolean

    @prop({ type: String, required: false, default: false })
    public isManageTasks!: boolean
}

export const OperatorModel = getModelForClass(Operator, {
    schemaOptions: {
        timestamps: true
    }
});