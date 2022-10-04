import express, { Express } from "express";
import bodyParser from "body-parser";

// routes
import EmployeeRoute from "./routes/Employee.routes"

require("dotenv").config({
    path: "server/config/config.env"
});

const app: Express = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiVersion = `/api/${process.env.API_VERSION}`;

app.use(apiVersion.concat("/employee"), EmployeeRoute);

export default app;