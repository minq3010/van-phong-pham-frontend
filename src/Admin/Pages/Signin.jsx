import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "react-query";
import { signin } from "../../Apis/Api.jsx";
import { message, Spin } from "antd";
import * as z from "zod";
import { useState } from "react";
const Signin = () => {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const schema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Must be a valid email "),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
  });
  const queryCline = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => signin(data),
    onSuccess: (user) => {
      queryCline.invalidateQueries(["user"], user.user);
      message.success("Thành công");
      localStorage.setItem("auth_token", JSON.stringify(user.token));
      localStorage.setItem("user", JSON.stringify(user.user));
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      message.error(error.response.data.message);
    },
  });
  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="container mt-[140px] mb-[50px]  w-full ">
      <h1
        style={{ textAlign: "center", marginBottom: 30 }}
        className="text-[29px]"
      >
        Login
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-user m-auto"
        style={{ boxShadow: "3px 4px 10px 0px #d3c5c5" }}
      >
        <div className="flex-column">
          <label>Email </label>
        </div>
        <div className="inputForm">
          <i className="fa fa-envelope" />
          <input
            type="email"
            disabled={isLoading}
            className={`input-user`} // Optional: add error class
            placeholder="Enter your Email"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"} // Accessibility enhancement
            aria-describedby="email-error" // Links to error message if present
          />
        </div>
        {errors.email?.message && (
          <p id="email-error" className="text-red-400">
            {errors.email.message}
          </p>
        )}

        <div className="flex-column">
          <label>Password </label>
        </div>
        <div className="inputForm">
          <i className="fa fa-lock" />
          <input
            disabled={isLoading}
            type={`${showPassword ? "text" : "password"}`}
            className="input-user"
            id="passwords"
            {...register("password")}
            placeholder="Enter your Password"
          />
          <div className="ii" onClick={() => setShowPassword(!showPassword)}>
            <i className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`} />
          </div>
        </div>
        {errors.password?.message && (
          <p id="password-error" className="text-red-400">
            {errors.password.message}
          </p>
        )}
        <div className="flex-row ">
          <div className="d-flex gap ">
            <input type="checkbox" />
            <label className="m-t-5">remember password </label>
          </div>
          <Link to={"/emailpassword"}>
            <span className="span">forgot password</span>
          </Link>
        </div>
        <button className="button-submit" type="submit">
          {isLoading && <Spin />} Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;
