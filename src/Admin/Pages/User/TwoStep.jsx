import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { resetpassword, verifytoken } from "../../../Apis/Api";
import { Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
const TwoStep = () => {
  const [checkToken, setcheckToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const schema = z.object({
    opt1: z
      .string()
      .min(1, "is required")
      .max(1, "Chỉ một chữ số")
      .regex(/^[0-9]$/, "Chỉ nhập số từ 0-9"),
    opt2: z
      .string()
      .min(1, "is required")
      .max(1, "Chỉ một chữ số")
      .regex(/^[0-9]$/, "Chỉ nhập số từ 0-9"),
    opt3: z
      .string()
      .min(1, "is required")
      .max(1, "Chỉ một chữ số")
      .regex(/^[0-9]$/, "Chỉ nhập số từ 0-9"),
    opt4: z
      .string()
      .min(1, "is required")
      .max(1, "Chỉ một chữ số")
      .regex(/^[0-9]$/, "Chỉ nhập số từ 0-9"),
  });
  const schema1 = z.object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    password_confirmation: z
      .string()
      .min(1, "ConfimPassword is required")
      .min(8, "ConfimPassword must be more than 8 characters")
      .max(32, "ConfimPassword must be less than 32 characters"),
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(checkToken ? schema1 : schema),
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => verifytoken(data),
    onSuccess: (data) => {
      message.success(data.message);
      setEmail(data.email);
      setcheckToken(data.success);
    },
    onError: (errors) => {
      message.success(errors.response.data.message);
    },
  });
  const { mutate: resetPassword, isLoading: isresetPassword } = useMutation({
    mutationFn: (data) => resetpassword(data),
    onSuccess: (data) => {
      message.success(data.message);
      navigate("/signin");
    },
    onError: (errors) => {
      message.success(errors.response.data.message);
    },
  });
  const onSubmit = (value) => {
    const otp = {
      otp: Object.values(value).join(""),
    };
    mutate(otp);
  };
  const onSubmitPassword = (value) => {
    const data = {
      email,
      password: value.password,
      password_confirmation: value.password_confirmation,
    };
    resetPassword(data);
  };
  return (
    <>
      {checkToken ? (
        <div className="m-t-200 container d-flex justify-content-center m-b-100">
          <form
            onSubmit={handleSubmit(onSubmitPassword)}
            className="d-flex flex-column  pos-relative"
            style={{
              boxShadow: "0 3px 10px 0 rgba(0,0,0,.14)",
              width: 500,
            }}
          >
            <div className="d-flex m-t-40 items-center justify-center">
              <a href="?act=sign-in">
                <div className="pos-absolute " style={{ top: 40, left: 20 }}>
                  <i className="fa fa-arrow-left " />
                </div>
              </a>
              <h4 className="m-b-50 text-[1.6rem] font-medium">
              Reset Password
              </h4>
            </div>
            <div className="px-4">
              <div className="flex-column mb-2">
                <label>Password </label>
              </div>
              <div className="inputForm">
                <i className="fa fa-lock" />
                <input
                  type={`${showPassword ? "text" : "password"}`}
                  className="input-user"
                  disabled={isLoading}
                  id="passwords"
                  {...register("password")}
                  placeholder="Enter your Password"
                />
                <div
                  className="ii"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"} `}
                  />
                </div>
              </div>
              {errors.password?.message && (
                <p id="password-error" className="text-red-400">
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-start flex-column my-2">
                <label>Confirm Password </label>
              </div>
              <div className="inputForm">
                <i className="fa fa-lock" />
                <input
                  type={`${showConfirmPassword ? "text" : "password"}`}
                  disabled={isLoading}
                  className={`input-user }`} // Optional: add error class
                  placeholder="Enter your Confirm Password"
                  {...register("password_confirmation")}
                  aria-invalid={errors.password_confirmation ? "true" : "false"} // Accessibility enhancement
                  aria-describedby="-error" // Links to error message if present
                />
                <div
                  className="ii"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={`fa ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}
                  />
                </div>
              </div>
              {errors.password_confirmation?.message && (
                <p id="-error" className="text-red-400">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>
            <button
              className="hov-btn4 rounded-md my-3 mx-auto"
              type="submit"
              style={{ width: "240px", height: 40 }}
            >
              {isresetPassword ? <Spin /> : ""} SUBMIT
            </button>
          </form>
        </div>
      ) : (
        <div className="auth-page-wrapper pt-5 mt-16">
          {/* auth page content */}
          <div className="auth-page-content">
            <div className="container">
              {/* end row */}
              <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 col-xl-5">
                  <div
                    className="card mt-4"
                    style={{ boxShadow: "0px 5px 10px 3px #cfcfcf;" }}
                  >
                    <div
                      className="card-body p-4 rounded-lg"
                      style={{ boxShadow: "0px 5px 10px 3px #cfcfcf" }}
                    >
                      <div className="mb-4">
                        <div className="avatar-lg mx-auto">
                          <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                            <i className="ri-mail-line" />
                          </div>
                        </div>
                      </div>
                      <div className="p-2 mt-4">
                        <div className="text-muted text-center mb-4 mx-lg-3">
                          <h4>Verify Your Email</h4>
                          <p>
                            Please enter the 4 digit code sent to{" "}
                            <span className="fw-semibold">example@abc.com</span>
                          </p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="row">
                            {[1, 2, 3, 4].map((digit) => (
                              <div className="col-3" key={digit}>
                                <div className="mb-3">
                                  <label
                                    htmlFor={`digit${digit}-input`}
                                    className="visually-hidden"
                                  >
                                    Digit {digit}
                                  </label>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className="form-control form-control-lg bg-light border-light text-center"
                                    {...register(`opt${digit}`)}
                                    onChange={(e) => {
                                      const val = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 1);
                                      e.target.value = val;
                                    }}
                                  />
                                  {errors[`opt${digit}`]?.message && (
                                    <p className="text-red-400">
                                      {errors[`opt${digit}`].message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3">
                            <button
                              type="submit"
                              className="btn btn-success w-100"
                            >
                              {isLoading ? <Spin /> : ""} Confirm
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/* end card body */}
                  </div>
                  {/* end card */}
                  <div className="mt-4 text-center">
                    <p className="mb-0">
                      Didn't receive a code ?{" "}
                      <a
                        href="auth-pass-reset-basic.html"
                        className="fw-semibold text-primary text-decoration-underline"
                      >
                        Resend
                      </a>{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TwoStep;
