// ** React Imports
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
// ** Utils
import { isUserLoggedIn } from "@utils";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/forgot-password-v2.svg";
import illustrationsDark from "@src/assets/images/pages/forgot-password-v2-dark.svg";

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import crm from '@src/assets/images/logo/crm1.png'

import "@styles/react/pages/page-authentication.scss";
import { useState } from "react";
import { forgotPassword } from "../../../redux/forgotPassword";
const defaultValues = {
  email: "",
};
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  // ** Hooks
  const { skin } = useSkin();
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(forgotPassword(data?.email));
      if (forgotPassword.fulfilled.match(resultAction)) {
        setMessage("Password reset link sent successfully");
      } else {
        setError(resultAction.payload?.message || "Failed to send reset link.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  // if (!isUserLoggedIn()) {
  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
        <img src={crm} alt='logo' height={100} width={100} />
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Forgot Password? 🔒
            </CardTitle>
            <CardText className="mb-2">
              Enter your email and we'll send you instructions to reset your
              password
            </CardText>
            <Form
              className="auth-forgot-password-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Controller
                  type="email"
                  id="email"
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="email"
                      placeholder="john@example.com"
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </div>

              <Button color="primary" block type="submit">
                Send reset link
              </Button>
            </Form>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="rotate-rtl me-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
  // } else {
  //   return <Navigate to='/' />
  // }
};

export default ForgotPassword;
