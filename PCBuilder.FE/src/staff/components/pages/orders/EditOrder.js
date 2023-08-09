import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Col, Form, Row, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import "./AddOrder.scss";
export default function NewOrder() {
  const URL = "https://fpc-shop.azurewebsites.net/api/Order";
  const [data, setData] = useState([]);
  const token = localStorage.getItem("tokenUser");
  const [pcNames, setPcNames] = useState({});
  const [userNames, setUserNames] = useState({});
  useEffect(() => {
    getAllPc();
    getAllOrders();
    getAllUser();
  }, []);

  const getAllPc = async () => {
    try {
      const response = await axios.get(
        "https://fpc-shop.azurewebsites.net/api/PC/GetListByAdmin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const pcNamesMap = {};
      response.data.data.forEach((pc) => {
        pcNamesMap[pc.id] = pc.name;
      });
      setPcNames(pcNamesMap);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getAllUser = async () => {
    try {
      const response = await axios.get(
        "https://fpc-shop.azurewebsites.net/api/User",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userNamesMap = {};
      response.data.data.forEach((user) => {
        userNamesMap[user.id] = user.fullname;
      });
      setUserNames(userNamesMap);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllOrders = async () => {
    await axios
      .get(`${URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setData(response.data.data);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const convertToDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const initialState = {
    orderDate: getCurrentDate(),
    pcId: "",
    userId: "",
    amount: "",
    statusId: "",
    paymentId: "",
  };

  const error_init = {
    pcId_err: "",
    userId_err: "",
    amount_err: "",
    paymentId_err: "",
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const { pcId, userId, amount, paymentId } = state;
  const [errors, setErrors] = useState(error_init);
  const [selectedStatus, setSelectedStatus] = useState(
    state.statusId || "Status"
  );

  useEffect(() => {
    if (id) {
      getOneOrder(id);
    }
  }, [id]);

  const getOneOrder = async (id) => {
    await axios
      .get(`${URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        const orderData = response.data.data;
        orderData.orderDate = convertToDate(orderData.orderDate);
        setState(orderData);
      })
      .catch(function (error) {
        console.error("Fetch order data failed:", error);
      });
  };

  const handleStatusSelect = (status) => {
    setState((prevState) => ({ ...prevState, statusId: status }));
    setSelectedStatus(status);
  };

  const validateForm = () => {
    let isValid = true;
    let errors = { ...error_init };

    if (isNaN(amount) || parseInt(amount) < 0 || amount === "") {
      errors.amount_err = "Amount is required and must be more than 0";
      isValid = false;
    }

    if (isNaN(pcId) || parseInt(pcId) < 0 || pcId === "") {
      errors.pcId_err = "Pc ID is required and must be more than 0";
      isValid = false;
    }

    if (isNaN(userId) || parseInt(userId) < 0 || userId === "") {
      errors.userId_err = "User ID is required and must be more than 0";
      isValid = false;
    }

    if (isNaN(paymentId) || parseInt(paymentId) < 0 || paymentId === "") {
      errors.paymentId_err = "Payment ID is required and must be more than 0";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      if (id) updateOrder(id, state);
    } else {
      toast.error("Some info is invalid. Please check again.");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((state) => ({ ...state, [name]: value }));
  };

  const updateOrder = async (id, data) => {
    await axios
      .put(`${URL}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        toast.success(`Updated order successfully ~`);
        navigate("/orderslist");
      })
      .catch(function (error) {
        toast.error("Update order failed");
        console.log(error);
      });
  };

  return (
    <div className="container py-5 newOrder">
      <div className="form">
        <h2>{id ? "Edit Order" : "Create Order"}</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col className="mb-3 contentOrder">
              <Form.Label htmlFor="orderDate">Order Date: </Form.Label>
              <Form.Control
                type="date"
                name="orderDate"
                value={state.orderDate}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-3 contentOrder">
              <Form.Label htmlFor="amount">Price: </Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={state.amount}
                onChange={handleInputChange}
              />
              {errors.amount_err && (
                <span className="error">{errors.amount_err}</span>
              )}
            </Col>
            <Col className="mb-3 contentOrder">
              <Form.Label htmlFor="status">Status: </Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {selectedStatus}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleStatusSelect("Pending")}>
                    Pending
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleStatusSelect("Processing")}
                  >
                    Processing
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleStatusSelect("Successful")}
                  >
                    Successful
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusSelect("Failed")}>
                    Failed
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusSelect("Cancel")}>
                    Cancel
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          <Row>
            <Col className="contentOrder">
              <Form.Label htmlFor="pcId">PC Name: </Form.Label>
              <Form.Control
                as="select"
                name="pcId"
                value={state.pcId}
                onChange={handleInputChange}
              >
                <option value="">Select PC Name</option>
                {Object.entries(pcNames).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Control>
              {errors.pcId_err && (
                <span className="error">{errors.pcId_err}</span>
              )}
            </Col>
            <Col className="contentOrder">
              <Form.Label htmlFor="userId">User Full Name: </Form.Label>
              <Form.Control
                as="select"
                name="userId"
                value={state.userId}
                onChange={handleInputChange}
              >
                <option value="">Select User Full Name</option>
                {Object.entries(userNames).map(([id, fullName]) => (
                  <option key={id} value={id}>
                    {fullName}
                  </option>
                ))}
              </Form.Control>
              {errors.userId_err && (
                <span className="error">{errors.userId_err}</span>
              )}
            </Col>
            <Col className="contentOrder">
              <Form.Label htmlFor="paymentId">Payment ID: </Form.Label>
              <Form.Control
                type="number"
                name="paymentId"
                value={state.paymentId}
                onChange={handleInputChange}
              />
              {errors.paymentId_err && (
                <span className="error">{errors.paymentId_err}</span>
              )}
            </Col>
          </Row>

          <div className="form-button">
            <Button type="submit">{id ? "Update Order" : "Create"}</Button>
            <Link to="/orderslist">
              <Button style={{ backgroundColor: "red" }}>Cancel</Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
