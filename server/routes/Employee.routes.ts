import express, { IRouter } from "express";
import multer from "multer";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/isAuthenticated";

// Controllers
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getSingleEmployee,
} from "../controllers/Employee.controller";

// router instance
const router: IRouter = express.Router();

// multer instance
const upload = multer();

router
  .route("/getAllEmployees")
  .get(isAuthenticated, authorizeRoles("admin"), getAllEmployees);
router
  .route("/addEmployee")
  .post(isAuthenticated, authorizeRoles("admin"), upload.none(), createEmployee);
router
  .route("/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getSingleEmployee)
  .put(isAuthenticated, authorizeRoles("admin"), updateEmployee)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteEmployee);

export default router;
