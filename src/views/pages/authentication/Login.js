// ** React Imports
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";

// ** Third Party Components
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Facebook,
  Twitter,
  Mail,
  GitHub,
  HelpCircle,
  Coffee,
  X,
} from "react-feather";

// ** Actions
import { handleLogin } from "@store/authentication";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import Avatar from "@components/avatar";
import InputPasswordToggle from "@components/input-password-toggle";

// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  UncontrolledTooltip,
  Spinner,
  Toast,
  ToastBody,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import {
  fetchsingUserData,
} from "../../../redux/authentication";
import crm from "@src/assets/images/logo/crm1.png";
import { getAllRoles } from "../../../redux/rolesPermissions";

const ToastContent = ({ t, name, role }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{name}</h6>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>
          You have successfully logged in as an {name} user to CRM. Now you can
          start to explore. Enjoy!
        </span>
      </div>
    </div>
  );
};

const defaultValues = {
  password: "",
  loginEmail: "",
};

const Login = () => {
  // ** Hooks
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const ability = useContext(AbilityContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const [error, setError] = useState(null);
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const data = useSelector((state) => state.authentication);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      try {
        setIsLoading(true);
        const resultAction = await dispatch(
          fetchsingUserData({
            emailAddress: data.loginEmail,
            password: data.password,
          })
        );
        if (fetchsingUserData.fulfilled.match(resultAction)) {
          setMessage("Login successfully");
        } else {
          setError(resultAction.payload.message || "Invalid Email.");
        }

        if (fetchsingUserData.fulfilled.match(resultAction)) {
          const responseData = resultAction.payload;
          const userData = {
            ...responseData.user,
            accessToken: responseData.accessToken,
            refreshToken: responseData.refreshToken,
          };

          dispatch(handleLogin(userData));

          navigate(getHomeRouteForLoggedInUser("admin"));

          toast((t) => (
            <ToastContent
              t={t}
              role={"admin"}
              name={userData.fullName || userData.username || "User"}
            />
          ));
        }
        dispatch(getAllRoles())
      } catch (err) {
        console.error("Unexpected error during login:", err);
        setError("loginEmail", {
          type: "manual",
          message: "Something went wrong. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
            message: "This field is required",
          });
        }
      }
    }
  };

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img src={crm} alt="logo" height={100} width={120} />
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
              Welcome to CRM! 👋
            </CardTitle>
            <Alert color="primary">
              <HelpCircle
                id="login-tip"
                className="position-absolute"
                size={18}
                style={{ top: "10px", right: "10px" }}
              />
              <UncontrolledTooltip target="login-tip" placement="left">
                This is just for ACL demo purpose.
              </UncontrolledTooltip>
            </Alert>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Controller
                  id="loginEmail"
                  name="loginEmail"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="email"
                      placeholder="john@example.com"
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
                {errors.loginEmail && (
                  <FormFeedback>{errors.loginEmail.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                  }}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </div>
              <div className="form-check mb-1">
                <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div>
              <Button type="submit" color="primary" block disabled={isLoading}>
                {isLoading ? <Spinner animation="border" /> : "Sign in"}
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span className="me-25">New on our platform?</span>
              <Link to="/register">
                <span>Create an account</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
