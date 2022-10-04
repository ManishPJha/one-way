import mongoose from "mongoose"
import { localConfig } from "../config"

let connectionString : string = localConfig.DB_URI!;

const connectDatabase = () => {
    mongoose.connect(connectionString, (error) => {
        if(error) console.log("Database Connection Failed!");
        console.log("Database Connection Successfull.");
    })
}

export default connectDatabase;