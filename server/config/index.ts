require("dotenv").config({
    path: "server/config/config.env"
});

import localConfig from "./config.local"
import prodConfig from "./config.prod"

export {
    localConfig,
    prodConfig
}