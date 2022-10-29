import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";

// Model
import { EmployeeModel } from "../db/models/Employee.model";

// ErrorHandlers
import { catchAsyncErrorHandler, ErrorHandler } from "../utils/index";

import ApiFeature from "../utils/ApiFeatures";

const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const Employee = await EmployeeModel.find();
  let limit: number = 10;

  const ApiFeatures: any = new ApiFeature(EmployeeModel.find(), req.query)
    .sort(-1)
    .search("name")
    .filter()
    .pagination(limit);

  const Employee = await ApiFeatures.query;

  if (!(Employee.length > 0))
    return next(new ErrorHandler("No records found!", 404));

  res.status(200).json({
    success: true,
    data: Employee,
  });
};

const getSingleEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Employee = await EmployeeModel.findById(req.params.id);

    if (!Employee)
      return next(new ErrorHandler("No record found with this id!", 404));

    res.status(200).json({
      success: true,
      data: Employee,
    });
  } catch (error: any) {
    next(new ErrorHandler(`${error.message}`, 500));
  }
};

const createEmployee = catchAsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let images = [];

    if (typeof req.body.image === "string") {
      images.push(req.body.image);
    } else {
      images = req.body.image;
    }

    let imageLinks = [];

    for (let image of images) {
      const uploader = await cloudinary.v2.uploader.upload(image, {
        folder: "employees",
      });
      imageLinks.push({
        public_id: uploader.public_id,
        url: uploader.secure_url,
      });
    }

    req.body.image = imageLinks;

    const Employee = await EmployeeModel.create(req.body);

    res.status(201).json({
      success: true,
      data: Employee,
      message: `Employee added successfully with id ${Employee._id}`,
    });
  }
);

const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isEmployeeExist = await EmployeeModel.findById(req.params.id);

    if (!isEmployeeExist)
      return next(new ErrorHandler("No record found with this id!", 404));

    const Employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      success: true,
      data: Employee,
      message: `Employee id ${req.params.id} is updated successfully.`,
    });
  } catch (error: any) {
    next(new ErrorHandler(`${error.message}`, 500));
  }
};

const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isEmployeeExist = await EmployeeModel.findById(req.params.id);

    if (!isEmployeeExist)
      return next(new ErrorHandler("No record found with this id!", 404));

    await EmployeeModel.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: `${req.params.id} has been removed successfully.`,
    });
  } catch (error: any) {
    next(new ErrorHandler(`${error.message}`, 500));
  }
};

export {
  getAllEmployees,
  getSingleEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
