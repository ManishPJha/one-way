import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes
import EmployeeRoute from "./routes/Employee.routes";
import OperatorRoute from "./routes/Operator.routes";

require("dotenv").config({
  path: "server/config/config.env",
});

const app: Express = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    // allowedHeaders: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());

const apiVersion = `/api/${process.env.API_VERSION}`;

app.use(apiVersion.concat("/employee"), EmployeeRoute);
app.use(apiVersion.concat("/operator"), OperatorRoute);

export default app;
