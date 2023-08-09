import { useState, useEffect } from "react";
import "./newUser.scss";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "react-bootstrap";
const NewUser = () => {
  const URL = "https://fpc-shop.azurewebsites.net/api/User";
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
    isActive: false,
    roleId: "",
  };

  const error_init = {
    fullname_err: "",
    email_err: "",
    password_err: "",
    roleId_err: "",
  };
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState(initialState);
  const {
    fullname,
    email,
    phone,
    country,
    gender,
    password,
    address,
    avatar,
    isActive,
    roleId,
  } = state;
  const [errors, setErrors] = useState(error_init);

  useEffect(() => {
    if (id) {
      getOneUser(id);
    }
  }, [id]);

  // Function to fetch and set the User data
  const getOneUser = async (id) => {
    await axios
      .get(
        `${URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        id
      )
      .then(function (response) {
        if (
          response.request.status === 200 ||
          response.request.status === 201
        ) {
          setState(response.data.data);
        }
      })
      .catch(function (error) {
        console.error("Fetch user data failed:", error);
      });
  };
  const updateUser = async (userId, data) => {
    await axios
      .put(`${URL}/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (
          response.request.status === 200 ||
          response.request.status === 201
        ) {
          toast.success(`Updated user successfully ~`);
          navigate("/users");
        }
      })
      .catch(function (error) {
        toast.error("Update user failed:", error);
        console.log(error);
      });
  };

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
          navigate("/users");
        } else {
          toast.error("Added new user failed ~");
        }
      })
      .catch(function (error) {
        toast.error("Add New User failed:");
        console.error("Fetch User data failed:", error);
      });
  };

  // validate
  const validateForm = () => {
    let isValid = true;
    let errors = { ...error_init };

    if (fullname.trim() === "" || fullname.length < 2) {
      errors.fullname_err = "Name is Required";
      if (fullname.length < 2) {
        errors.fullname_err = "Name must be more than 2 words";
      }
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
    if (
      isNaN(roleId) ||
      parseInt(roleId) < 1 ||
      parseInt(roleId) > 3 ||
      roleId === ""
    ) {
      errors.roleId_err = "RoleId = {1, 2, 3}";
      isValid = false;
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

    if (validateForm()) {
      if (id) updateUser(id, state);
      else addNewUser(state);
    } else {
      toast.error("Some info is invalid ~ Pls check again");
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    // For checkbox inputs, the value will be a string "true" or "false"
    // We convert it to a boolean value
    if (type === "checkbox") {
      setState((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setState((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  return (
    <div className="container py-5 newUser">
      <div className="form">
        <h2>{id ? "Edit User" : "Create User"}</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 contentUser">
            <Form.Label htmlFor="fullname">Full Name: </Form.Label>
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
            <Form.Label htmlFor="email">Email: </Form.Label>
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

          <Row>
            <Col className="mb-3 contentUser">
              <Form.Label htmlFor="phone">Phone: </Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={state.phone}
                onChange={handleInputChange}
              />
              {/* {errors.phone && <span className='error'>{errors.price_err}</span>} */}
            </Col>
            <Col md className="contentUser">
              <Form.Label htmlFor="country">Country: </Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={state.country}
                onChange={handleInputChange}
              />
              {/* {errors.discount_err && <span className='error'>{errors.discount_err}</span>} */}
            </Col>
          </Row>
          <Row>
            <Col md className="contentUser">
              <label htmlFor="gender">Gender: </label>
              <div>
                <div>
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    value="Male"
                    checked={state.gender === "Male"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="male">Male</label>

                  <input
                    type="radio"
                    name="gender"
                    id="female"
                    value="Female"
                    checked={state.gender === "Female"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="female">Female</label>
                </div>
              </div>
            </Col>
          </Row>

          <Form.Group className="mb-3 contentUser">
            <Form.Label htmlFor="password">Password: </Form.Label>
            <Form.Control
              type="text"
              name="password"
              value={state.password}
              onChange={handleInputChange}
            />
            {errors.password_err && (
              <span className="error">{errors.password_err}</span>
            )}
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
          <Row>
            <Col md className="contentUser" id="check">
              <div>
                <Form.Label htmlFor="isActive">Is Active?</Form.Label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={state.isActive}
                  onChange={handleInputChange}
                />
              </div>
            </Col>
          </Row>

          <Form.Group className="mb-3 contentUser">
            <Form.Label htmlFor="roleId">
              Role ID (1: Customer, 2: Admin, 3: Employee):{" "}
            </Form.Label>
            <Form.Control
              type="number"
              name="roleId"
              value={state.roleId}
              onChange={handleInputChange}
            />
            {errors.roleId_err && (
              <span className="error">{errors.roleId_err}</span>
            )}
          </Form.Group>
          <div className="form-button">
            <Button type="submit">{id ? "Update User" : "Create"}</Button>
            <Link to="/users">
              <Button style={{ backgroundColor: "red" }}>Cancel</Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default NewUser;
