import React from "react";
import "./newCategory.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "react-bootstrap";
export default function NewCategory() {
  const URL = "https://fpc-shop.azurewebsites.net/api/Category";
  const token = localStorage.getItem("tokenUser");
  const [data, setData] = useState([]);
  const [nameBrands, setNameBrands] = useState({});
  const [nameCate, setNameCate] = useState({});
  useEffect(() => {
    getAllCategories();
    getAllBrands();
  }, []);

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        "https://fpc-shop.azurewebsites.net/api/Category",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const nameCateMap = {};
      response.data.data.forEach((cate) => {
        nameCateMap[cate.parentId] = cate.name;
      });
      setNameCate(nameCateMap);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getAllBrands = async () => {
    try {
      const response = await axios.get(
        "https://fpc-shop.azurewebsites.net/api/Brand",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const nameBrandsMap = {};
      response.data.data.forEach((brand) => {
        nameBrandsMap[brand.id] = brand.name;
      });
      setNameBrands(nameBrandsMap);
    } catch (error) {
      console.log(error.message);
    }
  };
  const initialState = {
    name: "",
    parentId: "",
    brandId: "",
  };

  const error_init = {
    name_err: "",
    parentId_err: "",
    brandId_err: "",
  };
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState(initialState);
  const { name, parentId, brandId } = state;
  const [errors, setErrors] = useState(error_init);

  useEffect(() => {
    if (id) {
      getOneCategory(id);
    }
  }, [id]);

  const getOneCategory = async (id) => {
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
        console.error("Fetch Category data failed:", error);
      });
  };

  const updateCategory = async (categoryId, data) => {
    await axios
      .put(`${URL}/${categoryId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.request.status === 200) {
          toast.success(`Updated category successfully ~`);
          navigate("/category");
        }
      })
      .catch(function (error) {
        toast.error("Update category failed:", error);
        console.log(error);
      });
  };

  const addNewCategory = async (data) => {
    await axios
      .post(`${URL}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.request.status === 200) {
          toast.success("New Category has been added successfully ~");
          navigate("/category");
        } else {
          toast.error("New Category has been added failed ~");
        }
      })
      .catch(function (error) {
        toast.error("Add New Category failed:");
        console.error("Fetch Category data failed:", error);
      });
  };

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
    if (isNaN(parentId) || parseInt(parentId) < 1 || parentId === "") {
      errors.parentId_err = "ParentID is required";
      isValid = false;
    }
    if (isNaN(parentId) || parseInt(brandId) < 1 || brandId === "") {
      errors.brandId_err = "BrandID is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      if (id) updateCategory(id, state);
      else addNewCategory(state);
    } else {
      toast.error("Some info is invalid ~ Pls check again");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((state) => ({ ...state, [name]: value }));
  };
  return (
    <div className="container py-5 newCategory">
      <div className="form">
        <h2>{id ? "Edit Category" : "Create Category"}</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 contentCategory">
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
          <Row>
            <Col className="mb-3 contentCategory">
              <Form.Label htmlFor="parentId">Parent Name: </Form.Label>
              <Form.Control
                as="select"
                name="parentId"
                value={state.parentId}
                onChange={handleInputChange}
              >
                <option value="">Select Parent Name</option>
                {Object.entries(nameCate).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Control>
              {errors.pcId_err && (
                <span className="error">{errors.pcId_err}</span>
              )}
            </Col>
            <Col className="contentComponent">
              <Form.Label htmlFor="brandId">Brand Name : </Form.Label>
              <Form.Control
                as="select"
                name="brandId"
                value={state.brandId}
                onChange={handleInputChange}
              >
                <option value="">Select Brand Name</option>
                {Object.entries(nameBrands).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Control>
              {errors.pcId_err && (
                <span className="error">{errors.pcId_err}</span>
              )}
            </Col>
          </Row>
          <div className="form-button">
            <Button type="submit">{id ? "Update Category" : "Create"}</Button>
            <Link to="/category">
              <Button style={{ backgroundColor: "red" }}>Cancel</Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
