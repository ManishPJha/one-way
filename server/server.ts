import _app from "./app"
import { localConfig, prodConfig } from "./config"
import _ from "lodash";
import connectDatabase from "./db/connection";
import errorMiddleware from "./middlewares/error";

let config = _.merge(localConfig, prodConfig)

process.on('uncaughtException', (error: Error) => {
    console.log("ERROR :"+ error.stack);
    console.log("server is going to down due to uncaught promise exception.");
    process.exit(1);
})

connectDatabase();

// Middleware
_app.use(errorMiddleware)

const server = _app.listen(config.PORT, () => {
    console.log(`server is running on PORT: ${config.PORT} and NODE_ENV: ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (error: Error) => {
    console.log("ERROR :"+ error.stack);
    server.close(() => {
        process.exit(1);
    });
    console.log("server is going to down due to unhandled promise rejection.");
})