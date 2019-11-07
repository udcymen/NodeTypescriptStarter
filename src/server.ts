import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import config from "./config/config";

import {UserRouter} from "./router/user";

class Application {
    public app: express.Application;
    public port: number;

    constructor() {
        this.app = express();
        this.port = + config.port;
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.initCors();
        this.mongoSetup();
    }
    // Starts the server on the port specified in the environment or on port 3000 if none specified.
    public start(): void {
        this.buildRoutes();
        this.app.listen(this.port, () => console.log("Server listening on port " + this.port + "!"));
    }

    // sets up to allow cross-origin support from any host.  You can change the options to limit who can access the api.
    // This is not a good security measure as it can easily be bypassed,
    // but should be setup correctly anyway.  Without this, angular would not be able to access the api it it is on
    // another server.
    public initCors(): void {
        this.app.use(function(req: express.Request, res: express.Response, next: any) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
    }
    // setup routes for the express server
    public buildRoutes(): void {
        this.app.use("/account", new UserRouter().getRouter());
    }

    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose
        .connect(
            config.database,
            {
                useCreateIndex: true,
                useFindAndModify: false,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        .then(() => console.log("MongoDB connected..."))
        .catch((err) => console.log(err));
    }
}
new Application().start();
