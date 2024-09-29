import * as yup from "yup";

export const userSchema = yup.object({
  fullname: yup.string().min(3).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup.string().min(8).required(),
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  // password: yup.string().min(8).required(),
});