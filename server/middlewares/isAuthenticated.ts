import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { OperatorModel } from "../db/models/Operator.model";

import { catchAsyncErrorHandler, ErrorHandler } from "../utils";

const isAuthenticated = catchAsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token)
      return next(
        new ErrorHandler("You need to login first!", 401)
      );

    const decode: any = JWT.verify(token, process.env.JWT_SECRET_KEY!);

    req.user = await OperatorModel.findById(decode?.id);

    next();
  }
);

const authorizeRoles = (...roles: Array<string>) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      return next(
        new ErrorHandler(
          "Your role " +
            req.user.role +
            " is not autherized to access this resource.",
          403
        )
      );
    next();
  };
};

export { isAuthenticated, authorizeRoles };
