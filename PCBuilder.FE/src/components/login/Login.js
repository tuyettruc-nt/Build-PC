import React, { useState } from "react";
import "./login.scss";
import { Button } from "react-bootstrap";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { loginUser, loginGoogle } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { NavLink } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      );
  };
  const handleLogin = (e) => {
    e.preventDefault();
    validateEmail(email);
    if (password.length < 1) setPasswordError("Enter password");
    else setPasswordError("");
    if (email.length < 1) setEmailError("Enter email");
    else {
      setEmailError("");
      const newUser = {
        email: email,
        password: password,
      };
      loginUser(newUser, dispatch, navigate);
    }
  };

  const handleShowHidePassword = (event) => {
    setIsShowPassword(!isShowPassword);
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Foget Password ?</Popover.Header>
      <Popover.Body>Relax and try remember your password.</Popover.Body>
    </Popover>
  );
  // login google
  const handleGoogleLoginSuccess = async (response) => {
    // Xử lý khi người dùng đăng nhập thành công bằng Google
    const idToken = response.credential;
    loginGoogle(idToken, dispatch, navigate);
  };

  const handleGoogleLoginFailure = (error) => {
    // Xử lý khi đăng nhập bằng Google thất bại
    console.log("Google login failure: ", error);
  };

  return (
    <div className="loginform">
      <div className="container">
        <form className="contentLogin row" onSubmit={handleLogin}>
          <div className="col-12 text-ceter text-login">Login</div>
          <div className="col-12 form-group input-login">
            <label>Email</label>
            <input
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-12" style={{ color: "red" }}>
            {" "}
            {emailError}
          </div>
          <div className="col-12 form-group input-login">
            <label>Password</label>
            <div className="custom-input-password">
              <input
                type={isShowPassword ? "text" : "password"}
                placeholder=""
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="form-control"
              />
              <span onClick={(event) => handleShowHidePassword(event)}>
                <i>{isShowPassword ? <BsEyeSlashFill /> : <BsEyeFill />}</i>
              </span>
            </div>
          </div>
          <div className="col-12" style={{ color: "red" }}>
            {" "}
            {passwordError}
          </div>
          <div className="col-12">
            <Button className="btn-login" type="submit">
              Login
            </Button>
          </div>
          <NavLink to="/signup">New to User? Sign Up</NavLink>

          <div className="col-12">
            <GoogleLogin
              clientId="888811245186-qcjo042285j46as9sf8s4u1mu59a697g.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={handleGoogleLoginSuccess}
              onFailure={handleGoogleLoginFailure}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
