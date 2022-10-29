import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import crypto from "crypto";
import { OperatorModel } from "../db/models/Operator.model";
import { catchAsyncErrorHandler, ErrorHandler } from "../utils";
import ApiFeature from "../utils/ApiFeatures";
import sendToken from "../utils/sendToken";
import sendEmail from "../utils/sendEmail";

//#region For Operator / Logged In Operator

interface OperatorTypes {
  email?: string;
  name?: string;
  lastName?: string;
  writes?: object;
  image?: object;
  password?: string;
  username?: string;
  role?: string;
}

// Login
const loginOperator = catchAsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("Please enter email & password", 400));

    const operator = await OperatorModel.findOne({
      email: email,
    }).select("+password");

    if (!operator)
      return next(new ErrorHandler("Invalid Email or Password", 401));

    // Checks if password is correct or not
    const isPasswordMatched = await OperatorModel.comparePasswords(
      email,
      password
    );

    if (!isPasswordMatched)
      return next(new ErrorHandler("Invalid Email or Password", 401));

    sendToken(operator, 200, res);
  }
);

// Logout
const logoutOperator = catchAsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    process.env.NODE_ENV === "DEVELOPMENT"
      ? res.cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
          // secure: true,
          // sameSite: "none",
        })
      : res.cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  }
);

// Profile
const getOperatorProfile = catchAsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const Operator = await OperatorModel.findById(req?.user?.id);

    res.status(200).json({
      success: true,
      data: Operator,
    });
  }
);

// Update Password
const updatePassword = catchAsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const Operator = await OperatorModel.findById(req?.user?.id).select(
      "+password"
    );

    const { oldPassword, newPassword } = req.body;

    // match password
    const isPasswordMatched = await OperatorModel.comparePasswords(
      Operator?.email!,
      oldPassword
    );

    if (!isPasswordMatched)
      return next(new ErrorHandler("Password does not match!", 401));

    if (Operator) {
      Operator.password = newPassword;
    }

    await Operator?.save();

    sendToken(Operator, 200, res);
  }
);

// Update Profile
const updateProfile = catchAsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { email, name, lastName, writes } = req.body;

    const newData: OperatorTypes = {
      email,
      name,
      lastName,
      writes,
    };

    // Update avatar
    if (req.body.image !== undefined) {
      const operator = await OperatorModel.findById(req.user.id);

      const image_id = operator?.image?.public_id;
      const res = await cloudinary.v2.uploader.destroy(image_id!);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      newData.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const new_Operator = await OperatorModel.findByIdAndUpdate(
      req.user.id,
      newData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
    });
  }
);

// Forgot Password
const forgotPassword = catchAsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Operator = await OperatorModel.findOne({ email: req.body.email });

    if (!Operator)
      return next(new ErrorHandler("No user found with this email.", 404));

    const resetPasswordToken = await OperatorModel.getPasswordResetToken(
      req.body.email
    );

    const restPasswordURL = `${req.protocol}://${req.get("host")}/api/${
      process.env.API_VERSION
    }/operator/reset/${resetPasswordToken}`;

    const message = `
      <!doctype html>
      <html lang="en-US">

      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Reset Password - Oneway</title>
          <meta name="description" content="Reset Password Email Template.">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
      </head>

      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="text-align:center;">
                                <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                  <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                                </a>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                  requested to reset your password</h1>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                  We cannot simply send you your old password. A unique link to reset your
                                                  password has been generated for you. To reset your password, click the
                                                  following link and follow the instructions.
                                              </p>
                                              <a href='${restPasswordURL}'
                                                  style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                  Password</a>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="text-align:center;">
                                  <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.oneway.com</strong></p>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
          <!--/100% body table-->
      </body>

      </html>
    `;

    try {
      await sendEmail({
        email: req.body.email,
        subject: "Oneway - Password Recovery",
        message: message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to: ${Operator.email}`,
      });
    } catch (error: any) {
      Operator.resetPasswordExpire = undefined!;
      Operator.resetPasswordToken = undefined!;

      await Operator.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Reset Password
const resetPassword = catchAsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;

    // Hash Token
    const resetToken = await crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    if (req.body.password !== req.body.confirmPassword)
      return next(
        new ErrorHandler("Password & confirm password are not matched!", 403)
      );

    const Operator = await OperatorModel.findOne({
      resetPasswordToken: resetToken,
    });

    if (!Operator)
      return next(
        new ErrorHandler(
          "Invalid request or password reset token has been expired!",
          400
        )
      );

    Operator.password = req.body.password;
    Operator.resetPasswordExpire = undefined!;
    Operator.resetPasswordToken = undefined!;

    await Operator.save({
      validateBeforeSave: false,
    });

    sendToken(Operator, 200, res);
  }
);

//#endregion

//#region For Admin

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

  const TotalCount = await OperatorModel.find().countDocuments();

  if (!(Operator.length > 0))
    return next(new ErrorHandler("No records found!", 404));

  res.status(200).json({
    success: true,
    data: Operator,
    total: TotalCount,
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

      const { username, email, password, ...rest }: OperatorTypes = req.body;

      const Operator = await OperatorModel.create({
        username,
        email,
        password,
        //   image: {
        //     public_id: result.public_id,
        //     url: result.secure_url,
        //   },
        ...rest,
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

// Update Operator
const updateOperator = catchAsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const isExistOperator = await OperatorModel.findById(id);

      if (!isExistOperator)
        return next(new ErrorHandler("User not found with this id " + id, 403));

      const { username, name, lastName, writes, email, role }: OperatorTypes =
        req.body;

      const Operator = await OperatorModel.findByIdAndUpdate(
        id,
        {
          username,
          name,
          lastName,
          writes,
          email,
          role,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(201).json({
        success: true,
        message: `Operator updated successfully with id ${Operator?._id!}`,
        data: Operator,
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

    // To remove an image from cloudinary platform
    const image_id = isOperatorExist?.image?.public_id;
    const res = await cloudinary.v2.uploader.destroy(image_id!);

    await OperatorModel.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: `${req.params.id} has been removed successfully.`,
    });
  } catch (error: any) {
    next(new ErrorHandler(`${error.message}`, 500));
  }
};

//#endregion

export {
  loginOperator,
  getAllOperators,
  getSingleOperator,
  createOperator,
  updateOperator,
  deleteOperator,
  getOperatorProfile,
  updatePassword,
  updateProfile,
  logoutOperator,
  forgotPassword,
  resetPassword,
};
