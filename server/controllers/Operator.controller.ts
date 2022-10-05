import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import cloudinary from "cloudinary";
import { OperatorModel } from "../db/models/Operator.model";
import { catchAsyncErrorHandler, ErrorHandler } from "../utils";
import ApiFeature from "../utils/ApiFeatures";

// Get Operators
const getAllOperators = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let limit: number = 10;

  const ApiFeatures: any = new ApiFeature(OperatorModel.find(), req.query)
    .sort(-1)
    .search("email")
    .filter()
    .pagination(limit);

  const Operator = await ApiFeatures.query;

  if (!(Operator.length > 0))
    return next(new ErrorHandler("No records found!", 404));

  res.status(200).json({
    success: true,
    data: Operator,
  });
};

// Get Single Operator
const getSingleOperator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Operator = await OperatorModel.findById(req.params.id);

    if (!Operator)
      return next(new ErrorHandler("No record found with this id!", 404));

    res.status(200).json({
      success: true,
      data: Operator,
    });
  } catch (error: any) {
    next(new ErrorHandler(`${error.message}`, 500));
  }
};

// Add Operator
const createOperator = catchAsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const result = await cloudinary.v2.uploader.upload(req.body.image, {
      //   folder: "avatars",
      //   width: 150,
      //   crop: "scale",
      // });

      const { username, email, password } = req.body;

      const Operator = await OperatorModel.create({
        username,
        email,
        password,
        //   image: {
        //     public_id: result.public_id,
        //     url: result.secure_url,
        //   },
      });

      res.status(201).json({
        success: true,
        message: `Operator added successfully with id ${Operator._id}`,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 404));
    }
  }
);

// Remove Operator
const deleteOperator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isOperatorExist = await OperatorModel.findById(req.params.id);

    if (!isOperatorExist)
      return next(new ErrorHandler("No record found with this id!", 404));

    await OperatorModel.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: `${req.params.id} has been removed successfully.`,
    });
  } catch (error: any) {
    next(new ErrorHandler(`${error.message}`, 500));
  }
};

export { getAllOperators, getSingleOperator, createOperator, deleteOperator };
