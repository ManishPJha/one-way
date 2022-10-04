import express, { IRouter } from "express";

// Controllers
import {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getSingleEmployee
} from "../controllers/Employee.controller"

// router instance
const router: IRouter = express.Router();

router.route("/getAllEmployees").get(getAllEmployees)
router.route("/addEmployee").post(createEmployee)
router.route("/employee/:id")
    .get(getSingleEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)

export default router;