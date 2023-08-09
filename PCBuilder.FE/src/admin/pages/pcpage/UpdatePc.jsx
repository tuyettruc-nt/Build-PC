import "./newPc.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function NewPc() {
  const URL = "https://fpc-shop.azurewebsites.net/api/PC";
  const token = localStorage.getItem("tokenUser");
  const initialState = {
    name: "",
    summary: "",
    detail: "",
    description: "",
    price: "",
    discount: "",
    templateId: "",
    isPublic: false,
    designBy: "",
    image: "",
    isTemplate: false,
  };

  const error_init = {
    name_err: "",
    price_err: "",
    discount_err: "",
    templateId_err: "",
    isPublic_err: false,
    designBy_err: "",
    image_err: "",
    isTemplate: false,
  };
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState(initialState);
  const {
    name,
    summary,
    detail,
    description,
    price,
    discount,
    templateId,
    isPublic,
    designBy,
    image,
  } = state;
  const [errors, setErrors] = useState(error_init);

  useEffect(() => {
    if (id) {
      getOnePc(id);
    }
  }, [id]);

  // Function to fetch and set the PC data
  const getOnePc = async (id) => {
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
        console.error("Fetch PC data failed:", error);
      });
  };

  const updatePc = async (pcId, data) => {
    await axios
      .put(`${URL}/${pcId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.request.status === 200) {
          toast.success(`Updated Pc successfully ~`);
          navigate("/pc");
        }
      })
      .catch(function (error) {
        toast.error("Update Pc failed:", error);
        console.log(error);
      });
  };

  const addNewPc = async (data) => {
    await axios
      .post(`${URL}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.request.status === 200) {
          toast.success("New Pc has been added successfully ~");
          navigate("/pc");
        } else {
          toast.error("New Pc has been added failed ~");
        }
      })
      .catch(function (error) {
        toast.error("Add New Pc failed:");
        console.error("Fetch PC data failed:", error);
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

    if (isNaN(discount) || parseInt(discount) < 0 || discount === "") {
      errors.discount_err =
        "Discount must be a positive number and more than 0";
      isValid = false;
    }

    if (parseInt(designBy) < 0 || parseInt(designBy) > 4 || designBy === "") {
      errors.designBy_err = "Design by = {1, 2, 3}";
      isValid = false;
    }

    if (
      isNaN(templateId) ||
      parseInt(templateId) > 1 ||
      parseInt(templateId) < 0 ||
      templateId === ""
    ) {
      errors.templateId_err = "Template Id must be 0 or 1 (0: False, 1: True)";
      isValid = false;
    }

    if (image.trim() === "") {
      errors.image_err = "Image is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      if (id) updatePc(id, state);
      else addNewPc(state);
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
    // setState((state) => ({ ...state, [name]: value }));
  };
  return (
    <div className="container py-5 newPc">
      <div className="form">
        <h2>{id ? "Edit Pc" : "Create Pc"}</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 contentPc">
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
          <Form.Group className="mb-3 contentPc" id="abc">
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
          <Form.Group className="mb-3 contentPc" id="abc">
            <Form.Label htmlFor="detail">Detail: </Form.Label>
            <Form.Control
              type="comment"
              rows={3}
              as="textarea"
              name="detail"
              value={state.detail}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 contentPc" id="abc">
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
            <Col className="mb-3 contentPc">
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
            </Col>
            <Col className="mb-3 contentPc">
              <Form.Label htmlFor="discount">Discount: </Form.Label>
              <Form.Control
                type="number"
                name="discount"
                value={state.discount}
                onChange={handleInputChange}
              />
              {errors.discount_err && (
                <span className="error">{errors.discount_err}</span>
              )}
            </Col>
            <Col className="contentPc">
              <Form.Label htmlFor="templateId">Template ID : </Form.Label>
              <Form.Control
                type="number"
                name="templateId"
                value={state.templateId}
                onChange={handleInputChange}
              />
              {errors.templateId_err && (
                <span className="error">{errors.templateId_err}</span>
              )}
            </Col>
            <Col md className="contentPc">
              <Form.Label htmlFor="desigBy">Design by: </Form.Label>
              <Form.Control
                type="number"
                name="designBy"
                value={state.designBy}
                onChange={handleInputChange}
              />
              {errors.designBy_err && (
                <span className="error">{errors.designBy_err}</span>
              )}
            </Col>
          </Row>
          <Row>
            <Col className="contentPc" id="check">
              <Form.Label htmlFor="isPublic">Is Public?</Form.Label>
              <input
                type="checkbox"
                name="isPublic"
                checked={state.isPublic}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="contentPc" id="check">
              <Form.Label htmlFor="isTemplate">Is Template?</Form.Label>
              <input
                type="checkbox"
                name="isTemplate"
                checked={state.isTemplate}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row></Row>
          <Form.Group className="mb-3 contentPc">
            <Form.Label htmlFor="image">Image: </Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={state.image}
              onChange={handleInputChange}
            />
            {errors.image_err && (
              <span className="error">{errors.image_err}</span>
            )}
          </Form.Group>
          <div className="form-button">
            <Button type="submit">{id ? "Update Pc" : "Create Pc"}</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
