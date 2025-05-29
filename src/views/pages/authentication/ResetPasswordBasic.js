import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "react-feather";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";

import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Button,
  FormFeedback,
  Spinner,
  Toast,
  ToastBody,
} from "reactstrap";

import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { resetPassword } from "../../../redux/authentication";
import crm from "@src/assets/images/logo/crm1.png";
import InputPasswordToggle from "@components/input-password-toggle";
import { useWatch } from "react-hook-form";

const defaultValues = {
  password: "",
  confirmPassword: "",
};
const ResetPasswordBasic = () => {
  const [message, setMessage] = useState("");
  console.log("message", message)
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });

  const passwordValue = useWatch({ control, name: "password" });

  useEffect(() => {
    if (errors.confirmPassword) {
      trigger("confirmPassword");
    }
  }, [passwordValue]);

  const onSubmit = async (data) => {
    const { password, confirmPassword } = data;
    setMessage("");
    setError("");
    setIsLoading(true);
    try {
      const resultAction = await dispatch(
        resetPassword({ id, password, confirmPassword })
      );

      if (resetPassword.fulfilled.match(resultAction)) {
        setMessage(resultAction.payload.message || "Password reset successful.");
      } else {
        setError(resultAction.payload.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Unexpected error occurred");
    } finally { 
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          <CardBody>
            <Link
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
            >
              <img src={crm} alt="logo" height={100} width={100} />
            </Link>
            <CardTitle tag="h4" className="mb-1">
              {(error || message) && (
                <Toast>
                  <ToastBody className="p-0">
                    <div
                      className={`alert ${error ? "alert-danger" : "alert-success"
                        } py-2 px-4 w-100 fs-6`}
                      role="alert"
                    >
                      {error || message}
                    </div>
                  </ToastBody>
                </Toast>
              )}
              Reset Password 🔒
            </CardTitle>
            <CardText className="mb-2">
              Your new password must be different from previously used passwords
            </CardText>
            <Form
              className="auth-reset-password-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="new-password">
                  New Password
                </Label>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                  }}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      id="new-password"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="confirm-password">
                  Confirm Password
                </Label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      id="new-confirm-password"
                      invalid={errors.confirmPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <FormFeedback>{errors.confirmPassword.message}</FormFeedback>
                )}
              </div>
              <Button color="primary" block type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" />
                ) : (
                  "Set New Password"
                )}
              </Button>
            </Form>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="rotate-rtl me-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordBasic;
