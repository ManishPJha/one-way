import express, { IRouter } from "express";
import { uploadProductStaticsFile } from "../middlewares/uploadAsyncFIleMiddleware"

// Controllers
import {
  getAllOperators,
  getSingleOperator,
  createOperator,
  deleteOperator,
} from "../controllers/Operator.controller";

// router instance
const router: IRouter = express.Router();

router.route("/getAllOperators").get(getAllOperators);
router.route("/addOperator").post(createOperator);
router
  .route("/:id")
  .get(getSingleOperator)
  //   .put(updateEmployee)
  .delete(deleteOperator);

export default router;
