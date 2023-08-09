import React from "react";
import "./newComponent.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "react-bootstrap";
export default function NewComponent() {
  const URL = "https://fpc-shop.azurewebsites.net/api/Component";
  const token = localStorage.getItem("tokenUser");
  const [data, setData] = useState([]);
  const [nameBrands, setNameBrands] = useState({});
  const [nameCate, setNameCates] = useState({});

  useEffect(() => {
    getOneComponent();
    getAllBrands();
    getAllCategories();
  }, []);

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
        nameCateMap[cate.id] = cate.name;
      });
      setNameCates(nameCateMap);
    } catch (error) {
      console.log(error.message);
    }
  };

  const initialState = {
    name: "",
    image: "",
    price: "",
    summary: "",
    description: "",
    brandId: "",
    categoryId: "",
  };

  const error_init = {
    name_err: "",
    price_err: "",
    brandId_err: "",
    categoryId_err: "",
  };
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState(initialState);
  const { name, image, price, summary, description, brandId, categoryId } =
    state;
  const [errors, setErrors] = useState(error_init);

  useEffect(() => {
    if (id) {
      getOneComponent(id);
    }
  }, [id]);

  // Function to fetch and set the component data
  const getOneComponent = async (id) => {
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
        setState(response.data.data);
      })
      .catch(function (error) {
        console.error("Fetch component data failed:", error);
      });
  };
  const updateComponent = async (id, data) => {
    await axios
      .put(`${URL}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.request.status === 200) {
          toast.success(`Updated component successfully ~`);
          navigate("/components");
        }
      })
      .catch(function (error) {
        toast.error("Update component failed");
        console.log(error);
      });
  };

  const addNewComponent = async (data) => {
    await axios
      .post(`${URL}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.request.status === 200) {
          toast.success("New component has been added successfully ~");
          navigate("/components");
        } else {
          toast.error("New component has been added failed ~");
        }
      })
      .catch(function (error) {
        toast.error("Add New component failed:");
        console.error("Fetch component data failed:", error);
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

    if (isNaN(price) || parseInt(price) < 0 || price === "") {
      errors.price_err = "Price must be a positive number and more than 0";
      isValid = false;
    }

    if (isNaN(brandId) || parseInt(brandId) < 0 || brandId === "") {
      errors.brandId_err = "BrandID is require more than 0";
      isValid = false;
    }

    if (isNaN(categoryId) || parseInt(categoryId) < 0 || categoryId === "") {
      errors.categoryId_err = "Category is require more than 0";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      if (id) updateComponent(id, state);
      else addNewComponent(state);
    } else {
      toast.error("Some info is invalid ~ Pls check again");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((state) => ({ ...state, [name]: value }));
  };
  return (
    <div className="container py-5 newComponent">
      <div className="form">
        <h2>{id ? "Edit Component" : "Create Component"}</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 contentComponent">
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
          <Form.Group className="mb-3 contentComponent">
            <Form.Label htmlFor="image">Image: </Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={state.image}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 contentComponent">
            <Form.Label htmlFor="price">Price: </Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={state.price}
              onChange={handleInputChange}
            />
            {errors.price_err && (
              <span className="error">{errors.price_err}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3 contentComponent" id="abc">
            <Form.Label htmlFor="summary">Sumary: </Form.Label>
            <Form.Control
              type="comment"
              rows={3}
              as="textarea"
              name="summary"
              value={state.summary}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 contentComponent" id="abc">
            <Form.Label htmlFor="description">Description: </Form.Label>
            <Form.Control
              type="comment"
              rows={3}
              as="textarea"
              name="description"
              value={state.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Row>
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
            <Col className="contentComponent">
              <Form.Label htmlFor="categoryId">Category ID: </Form.Label>
              <Form.Control
                as="select"
                name="categoryId"
                value={state.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Select Category Name</option>
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
          </Row>

          <div className="form-button">
            <Button type="submit">{id ? "Update Component" : "Create"}</Button>
            <Link to="/components">
              <Button style={{ backgroundColor: "red" }}>Cancel</Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
