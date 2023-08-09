import "./newPc.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  const [selectedComponentType, setSelectedComponentType] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState([]);
  const [components, setComponents] = useState([]);

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
    cpu,
    mainboard,
    vga,
    psu,
    ram,
    ssd,
    hdd,
  } = state;
  const [errors, setErrors] = useState(error_init);

  useEffect(() => {
    if (id) {
      getOnePc(id);
    }
  }, [id]);

  useEffect(() => {
    fetchAvailableComponents();
  }, []);

  const handleComponentTypeChange = (event) => {
    const selectedType = event.target.value.trim();
    setSelectedComponentType(selectedType);

    console.log("selectedType:", selectedType);
    console.log("components:", components); // Check the components data

    const filtered = components.filter(
      (component) => component.name === selectedType
    );

    console.log("filtered:", filtered);

    setFilteredComponents(filtered);
  };

  const fetchAvailableComponents = async () => {
    try {
      const response = await axios.get(
        "https://fpc-shop.azurewebsites.net/api/Component"
      );
      console.log(response.data);
      setComponents(response.data.data);
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

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
  const addSelectedComponent = (componentId, componentsData) => {
    console.log("componentId:", componentId);
    const component = components.find((c) => c.id === componentId);
    console.log("filtered:", component);

    if (component) {
      componentsData = [...componentsData, component];
    }

    return componentsData;
  };
  const addNewPc = async (data) => {
    const componentIds = [];

    // Add the selected component IDs to the componentIds array
    componentIds.push(data.cpu);
    componentIds.push(data.mainboard);
    componentIds.push(data.vga);
    componentIds.push(data.psu);
    componentIds.push(data.ram);
    componentIds.push(data.ssd);
    componentIds.push(data.hdd);

    // Filter out any invalid IDs (0 or empty values)
    const filteredComponentIds = componentIds.filter((id) => id !== 0);

    // Set the components array in the data object to the filtered component IDs
    data.components = filteredComponentIds;

    console.log("component data", data.components);
    await axios
      .post(
        `https://fpc-shop.azurewebsites.net/api/PC/CreatePCAndAddComponentsToPCByAdmin`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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
          <Form.Group className="mb-3 contentPc" id="abc">
            <Form.Label htmlFor="cpu">CPU: </Form.Label>
            <Form.Control
              as="select"
              name="cpu"
              value={state.cpu}
              onChange={handleInputChange}
            >
              <option value="">Select CPU</option>
              {/* Check if components is not empty before using filter */}
              {components.length > 0 &&
                components
                  .filter((component) => component.name.includes("CPU"))
                  .map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name}
                    </option>
                  ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3 contentPc" id="abc">
            <Form.Label htmlFor="mainboard">Mainboard: </Form.Label>
            <Form.Control
              as="select"
              name="mainboard"
              value={state.mainboard}
              onChange={handleInputChange}
            >
              <option value="">Select Mainboard</option>
              {components.length > 0 &&
                components
                  .filter((component) => component.name.includes("Mainboard"))
                  .map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name}
                    </option>
                  ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3 contentPc" id="abc">
            <Form.Label htmlFor="vga">VGA: </Form.Label>
            <Form.Control
              as="select"
              name="vga"
              value={state.vga}
              onChange={handleInputChange}
            >
              <option value="">Select VGA</option>
              {components.length > 0 &&
                components
                  .filter((component) => component.name.includes("VGA"))
                  .map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name}
                    </option>
                  ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3 contentPc" id="abc">
            <Form.Label htmlFor="psu">PSU: </Form.Label>
            <Form.Control
              as="select"
              name="psu"
              value={state.psu}
              onChange={handleInputChange}
            >
              <option value="">Select PSU</option>
              {components.length > 0 &&
                components
                  .filter((component) => component.name.includes("PSU"))
                  .map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name}
                    </option>
                  ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3 contentPc" id="abc">
            <Form.Label htmlFor="ram">RAM: </Form.Label>
            <Form.Control
              as="select"
              name="ram"
              value={state.ram}
              onChange={handleInputChange}
            >
              <option value="">Select Ram</option>
              {components.length > 0 &&
                components
                  .filter((component) => component.name.includes("Ram"))
                  .map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name}
                    </option>
                  ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3 contentPc" id="abc">
            <Form.Label htmlFor="ssd">SSD: </Form.Label>
            <Form.Control
              as="select"
              name="ssd"
              value={state.ssd}
              onChange={handleInputChange}
            >
              <option value="">Select SSD</option>
              {components.length > 0 &&
                components
                  .filter((component) => component.name.includes("SSD"))
                  .map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name}
                    </option>
                  ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3 contentPc" id="abc">
            <Form.Label htmlFor="hdd">HDD: </Form.Label>
            <Form.Control
              as="select"
              name="hdd"
              value={state.hdd}
              onChange={handleInputChange}
            >
              <option value="">Select HDD</option>
              {components.length > 0 &&
                components
                  .filter((component) => component.name.includes("HDD"))
                  .map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name}
                    </option>
                  ))}
            </Form.Control>
          </Form.Group>

          <div className="form-button">
            <Button type="submit">{id ? "Update PC" : "Create"}</Button>
            <Link to="/pc">
              <Button style={{ backgroundColor: "red" }}>Cancel</Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
