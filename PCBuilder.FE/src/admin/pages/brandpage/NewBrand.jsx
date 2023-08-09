import React from "react";
import "./newBrand.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Form, Row } from "react-bootstrap";
export default function NewBrand() {
  const URL = "https://fpc-shop.azurewebsites.net/api/Brand";
  const token = localStorage.getItem("tokenUser");
  const initialState = {
    name: "",
    logo: "",
    origin: "",
    status: false,
  };

  const error_init = {
    name_err: "",
    logo_err: "",
    origin_err: "",
    status_err: false,
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const { name, logo, origin, status } = state;
  const [errors, setErrors] = useState(error_init);

  useEffect(() => {
    if (id) {
      getOneBrand(id);
    }
  }, [id]);

  // Function to fetch and set the Brand data
  const getOneBrand = async (id) => {
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
        if (response.request.status === 200) {
          setState(response.data.data);
        }
      })
      .catch(function (error) {
        console.error("Fetch Brand data failed:", error);
      });
  };

  const updateBrand = async (brandId, data) => {
    await axios
      .put(`${URL}/${brandId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.request.status === 200) {
          toast.success(`Updated Brand successfully ~`);
          navigate("/brands");
        }
      })
      .catch(function (error) {
        toast.error("Update Brand failed:", error);
        console.log(error);
      });
  };

  const addNewBrand = async (data) => {
    await axios
      .post(`${URL}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.request.status === 200) {
          toast.success("New Brand has been added successfully ~");
          navigate("/brands");
        } else {
          toast.error("New Brand has been added failed ~");
        }
      })
      .catch(function (error) {
        toast.error("Add new brand failed:");
        console.error("Fetch brand data failed:", error);
      });
  };

  // validate
  const validateForm = () => {
    let isValid = true;
    let errors = { ...error_init };

    if (name.trim() === "" || name.length < 2) {
      errors.name_err = "Name is Required";
      if (name.length < 2) {
        errors.name_err = "Name must be more than 2 words";
      }
      isValid = false;
    }

    if (origin.trim() === "") {
      errors.origin_err = "Origin is required";
      isValid = false;
    }

    if (logo.trim() === "") {
      errors.logo_err = "Logo is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      if (id) updateBrand(id, state);
      else addNewBrand(state);
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
    <div className="container py-5 newBrand">
      <div className="form">
        <h2>{id ? "Edit Brand" : "Create Brand"}</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 contentBrand">
            <Form.Label htmlFor="name">Name: </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={state.name}
              onChange={handleInputChange}
            />
            {errors.name_err && (
              <span className="error">{errors.name_err}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3 contentBrand">
            <Form.Label htmlFor="origin">Origin: </Form.Label>
            <Form.Control
              type="text"
              name="origin"
              value={state.origin}
              onChange={handleInputChange}
            />
            {errors.origin_err && (
              <span className="error">{errors.origin_err}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3 contentBrand">
            <Form.Label htmlFor="logo">Logo: </Form.Label>
            <Form.Control
              type="text"
              id="file"
              name="logo"
              value={state.logo}
              onChange={handleInputChange}
            />
            {errors.logo_err && (
              <span className="error">{errors.logo_err}</span>
            )}
          </Form.Group>
          <Row>
            <Form.Group className="mb-3 contentBrand" id="check">
              <div>
                <label htmlFor="status">Status (active or not):</label>
                <input
                  type="checkbox"
                  name="status"
                  checked={state.isPublic}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>
          </Row>

          <div className="form-button">
            <Button type="submit">{id ? "Update Brand" : "Create"}</Button>
            <Link to="/brands">
              <Button style={{ backgroundColor: "red" }}>Cancel</Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
