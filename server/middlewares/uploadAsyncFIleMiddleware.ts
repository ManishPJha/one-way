import { Request, Response, NextFunction } from "express";
import { catchAsyncErrorHandler } from "../utils";
import multer from "multer";
import path from "path";

let storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

let upload = multer({
  storage: storage,
  fileFilter: (req: any, file: any, cb: any) => {
    checkFileType(file, cb);
  },
});

function checkFileType(file: any, cb: any) {
  const fileType = /jpeg|jpg|png|gif/;
  //   const fileType = /pdf/;
  const extName = fileType.test(path.extname(file.originalname).toLowerCase());

  if (extName) {
    return cb(null, true);
  } else {
    cb("Error: file type not supported.");
  }
}

export const uploadProductStaticsFile = upload.single("image");
