import { Response } from "express";
import { OperatorModel } from "../db/models/Operator.model";
import { ErrorHandler } from "../utils/";

interface CookieProps {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
  sameSite?: any;
}

const sendToken = (operator: any, statusCode: number, res: Response) => {
  try {
    // create JWT Token
    const token = OperatorModel.getJWTToken(operator._id);

    // options for cookie
    const options: CookieProps =
      process.env.NODE_ENV === "DEVELOPMENT"
        ? {
            expires: new Date(
              Date.now() +
                Number(process.env.COOKIE_EXPIRES_TIME!) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
          }
        : {
            expires: new Date(
              Date.now() +
                Number(process.env.COOKIE_EXPIRES_TIME!) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true,
            sameSite: "none",
          };

    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      token,
      operator,
    });
  } catch (error: any) {
    new ErrorHandler(error.message, 500);
  }
};

export default sendToken;
