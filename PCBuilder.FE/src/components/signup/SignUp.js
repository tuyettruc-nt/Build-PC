import React, { useState } from "react";
import "./signup.scss";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "react-bootstrap";
const SignUp = () => {
  const URL = 'https://fpc-shop.azurewebsites.net/api/Authenticate/signup'
  const token = localStorage.getItem("tokenUser");
  const initialState = {
    fullname: "",
    email: "",
    phone: "",
    country: "",
    gender: "",
    password: "",
    address: "",
    avatar: "",
    isActive: true,
    roleId: 1,
  };

  const error_init = {
    fullname_err: "",
    email_err: "",
    password_err: "",
  };
  const [state, setState] = useState(initialState);
  const { fullname, email, phone, country,  gender, password, address, avatar} = state;
  const [errors, setErrors] = useState(error_init);
  
  const navigate = useNavigate();
  const addNewUser = async (data) => {
    await axios
      .post(`${URL}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        console.log(response.request.status);
        if (
          response.request.status === 200 ||
          response.request.status === 201
        ) {
          toast.success("New User has been added successfully ~");
          navigate("/login");
        } else {
          toast.error("Added new user failed ~");
        }
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
        // console.error("Fetch User data failed:", error);
      });
  };
  // validate
  const validateForm = () => {
    let isValid = true;
    let errors = { ...error_init };

    if (fullname.trim() === "") {
      errors.fullname_err = "Name is Required";
      isValid = false;
    }

    if (email.trim() === "") {
      errors.email_err = "Email is required";
      isValid = false;
    } else if (
      !email
        .toLowerCase()
        .match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
    ) {
      errors.email_err = "It is not email. Email like name@email.com";
    }

    if (password.trim() === "") {
      errors.password_err = "Password is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('state: ',state);
    if (validateForm()) {
      addNewUser(state);
    } else {
      toast.error("Some info is invalid ~ Pls check again");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "gender") {
      setState((state) => ({ ...state, gender: value }));
    } else {
      setState((state) => ({ ...state, [name]: value }));
    }
  };
  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleShowHidePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="container py-5 signup">
      <div className="form">
        <h2>Sign Up</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 contentUser">
            <Form.Label htmlFor="fullname">Full Name(*): </Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={state.fullname}
              onChange={handleInputChange}
            />
            {errors.fullname_err && (
              <span className="error">{errors.fullname_err}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3 contentUser">
            <Form.Label htmlFor="email">Email(*): </Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={state.email}
              onChange={handleInputChange}
            />
            {errors.email_err && (
              <span className="error">{errors.email_err}</span>
            )}
          </Form.Group>
              <Form.Group className="mb-3 contentUser">
                <Form.Label htmlFor="password">Password(*): </Form.Label>
                <div className="custom-input-password">
                  <input
                    type={isShowPassword ? "text" : "password"}
                    placeholder=""
                    value={password}
                    onChange={handleInputChange} // Use the handleInputChange function
                    className="form-control"
                    name="password" 
                  />
                  <span onClick={handleShowHidePassword}>
                    <i>{isShowPassword ? <BsEyeSlashFill /> : <BsEyeFill />}</i>
                  </span>
                </div>
              </Form.Group>
            {errors.password_err && (
              <span className="error">{errors.password_err}</span>
            )}
            <Form.Group className="mb-3 contentUser">
              <Form.Label htmlFor="phone">Phone: </Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={state.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 contentUser">
              <Form.Label htmlFor="country">Country: </Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={state.country}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 contentUser">
                <Form.Label htmlFor="gender">Gender: </Form.Label>
                <select
                  value={gender} 
                  onChange={handleInputChange}
                  className="form-control"
                  name="gender" 
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Form.Group>

              
          <Form.Group className="mb-3 contentUser">
            <Form.Label htmlFor="address">Address: </Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={state.address}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 contentUser">
            <Form.Label htmlFor="avatar">Avatar: </Form.Label>
            <Form.Control
              type="text"
              name="avatar"
              value={state.avatar}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="form-button">
            <Button type="submit">Sign Up</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
