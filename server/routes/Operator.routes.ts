import express, { IRouter } from "express";
import { uploadProductStaticsFile } from "../middlewares/uploadAsyncFIleMiddleware";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/isAuthenticated";

// Controllers
import {
  getAllOperators,
  getSingleOperator,
  createOperator,
  updateOperator,
  deleteOperator,
  loginOperator,
  getOperatorProfile,
  updatePassword,
  updateProfile,
  logoutOperator,
  forgotPassword,
  resetPassword,
} from "../controllers/Operator.controller";

// router instance
const router: IRouter = express.Router();

// public routes
router.route("/login").post(loginOperator);
router.route("/logout").get(logoutOperator);
router.route("/forgot").post(forgotPassword);
router.route("/reset/:token").post(resetPassword);
router
  .route("/me")
  .get(isAuthenticated, getOperatorProfile)
  .put(isAuthenticated, updateProfile);
router.route("/updatePassword").put(isAuthenticated, updatePassword);

// admin routes
router
  .route("/getAllOperators")
  .get(isAuthenticated, authorizeRoles("admin"), getAllOperators);
router
  .route("/addOperator")
  .post(isAuthenticated, authorizeRoles("admin"), createOperator);
router
  .route("/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getSingleOperator)
  .put(isAuthenticated, authorizeRoles("admin"), updateOperator)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteOperator);

export default router;
