import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// routes
import EmployeeRoute from "./routes/Employee.routes"
import OperatorRoute from "./routes/Operator.routes"

require("dotenv").config({
    path: "server/config/config.env"
});

const app: Express = express();

app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

const apiVersion = `/api/${process.env.API_VERSION}`;

app.use(apiVersion.concat("/employee"), EmployeeRoute);
app.use(apiVersion.concat("/operator"), OperatorRoute);

export default app;