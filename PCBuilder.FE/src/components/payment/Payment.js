import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";
import pc from "../assets/image/payment.png";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [validated, setValidated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  console.log(location.search);
  const productName = searchParams.get("name");
  const productPrice = searchParams.get("price");
  const [payment, setPayment] = useState();
  const [paymentTime, setPaymentTime] = useState();
  const productId = searchParams.get("pcId");

  const userId = localStorage.getItem("idUser");
  const [info, setInfo] = useState({});
  useEffect(() => {
    const data = localStorage.getItem("currentUser");
    console.log("data: ", data);
    if (data) {
      try {
        // Chuyển đổi chuỗi JSON thành object và gán vào biến info
        const parsedData = JSON.parse(data);
        setInfo(parsedData);
      } catch (error) {
        console.error("Error parsing data from Local Storage:", error);
      }
    } else {
      console.log("Not found currentUser in Local Storage");
    }
  }, []);

  const randomCode = Math.floor(1000 + Math.random() * 9000);

  const handleDeleteClick = async (productId) => {
    if (window.confirm("Are you sure you want to cancel this transaction?")) {
      try {
        await axios.delete(
          `https://fpc-shop.azurewebsites.net/api/PC/${productId}/DeletePCWithComponent`
        );
      } catch (error) {
        console.error("DELETE error:", error);
        toast.error("Failed to cancel transaction");
      } finally {
        navigate("/home");
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "radio") {
      setPayment(checked ? value : "");
    } else {
      setPayment(value);
    }
  };

  const handleInputPaymentTime = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "radio") {
      setPaymentTime(checked ? value : "");
    } else {
      setPaymentTime(value);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    navigate("/home");
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || !payment || !paymentTime) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      try {
        const currentDate = new Date().toISOString();
        const paymentData = {
          orderDate: currentDate,
          pcId: productId,
          userId: userId,
          amount: parseFloat(productPrice),
          statusId: "Pending",
          paymentDTO: {
            name: productName,
            code: randomCode,
            amount: parseFloat(productPrice),
            paymentMode: payment,
            paymentTime: paymentTime,
          },
        };
        console.log("Payment:", paymentData);

        await axios.post(
          "https://fpc-shop.azurewebsites.net/api/Order/CreateOrderWithPayment",
          paymentData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setShowPopup(true);

        // toast.success("Payment and Order created successfully");
      } catch (error) {
        console.error("Error", error);
        toast.error("Payment not created");
      }
    }
  };

  return (
    <div className="hero1">
      <div className="container py-5">
        <div className="row">
          <div className="col-sm-8">
            <div className="py-3">
              <h1 className="title">Biling Detail</h1>
              <hr />
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Col>
                <Form.FloatingLabel
                  controlId="validationCustom02"
                  label="Full Name"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    type="text"
                    placeholder="Nguyễn Văn A"
                    defaultValue={info?.fullname}
                  />
                </Form.FloatingLabel>
                <Form.FloatingLabel
                  controlId="validationCustom03"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    type="email"
                    placeholder="name@example.com"
                    defaultValue={info?.email}
                  />
                </Form.FloatingLabel>
                <Form.FloatingLabel
                  controlId="validationCustom04"
                  label="Address"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    type="text"
                    placeholder="ABC-NewYork"
                    defaultValue={info?.address}
                  />
                </Form.FloatingLabel>
                <Form.FloatingLabel
                  controlId="validationCustom05"
                  label="Phone Number"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    type="number"
                    placeholder="0123456789"
                    defaultValue={info?.phone}
                  />
                </Form.FloatingLabel>
              </Col>
              <hr />
              <Col>
                <Form.Check
                  className="mb-3"
                  label="Shipping address is the same as my billing address"
                />
                <Form.Check
                  className="mb-3"
                  label="Save this information for next time"
                />
              </Col>
              <hr />
              <div className="py-3">
                <h3 className="title">Payment Method</h3>
              </div>
              <Col>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="Credit Card"
                      name="paymentMethod"
                      onChange={handleInputChange}
                      required
                    />
                    Credit Card
                  </label>
                  <label style={{ marginLeft: "100px" }}>
                    <input
                      type="radio"
                      value="PayPal"
                      name="paymentMethod"
                      onChange={handleInputChange}
                      required
                    />
                    PayPal
                  </label>
                  <label style={{ marginLeft: "100px" }}>
                    <input
                      type="radio"
                      value="Debit Card"
                      name="paymentMethod"
                      onChange={handleInputChange}
                      required
                    />
                    Debit Card
                  </label>
                  <label style={{ marginLeft: "100px" }}>
                    <input
                      type="radio"
                      value="Bank Transfer"
                      name="paymentMethod"
                      onChange={handleInputChange}
                      required
                    />
                    Bank Transfer
                  </label>
                </div>
              </Col>
              <hr />
              <div className="py-3">
                <h3 className="title">Payment Time</h3>
              </div>
              <Col>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="Immediate"
                      name="paymentTime"
                      onChange={handleInputPaymentTime}
                      required
                    />
                    Immediate
                  </label>
                  <label style={{ marginLeft: "100px" }}>
                    <input
                      type="radio"
                      value="Installments"
                      name="paymentTime"
                      onChange={handleInputPaymentTime}
                      required
                    />
                    Installments
                  </label>
                  <label style={{ marginLeft: "100px" }}>
                    <input
                      type="radio"
                      value="Deferred"
                      name="paymentTime"
                      onChange={handleInputPaymentTime}
                      required
                    />
                    Deferred
                  </label>
                </div>
              </Col>
            </Form>
            <Popup
              open={showPopup}
              onClose={() => setShowPopup(false)}
              closeOnDocumentClick
              style={{ borderColor: "black" }}
            >
              <div
                className="popup-content"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#009393",
                  borderRadius: "10px",
                  textAlign: "center",
                  border: "1px solid black",
                }}
              >
                <i className="fa fa-check" style={{ fontSize: "100px" }}></i>
                <h3 style={{ alignContent: "center" }}>Payment Successful</h3>
                <p>Your payment and order have been created successfully!</p>
                <Button
                  style={{
                    color: "#ffffff",
                    background: "#009393",
                    borderColor: "#00abc6",
                  }}
                  onClick={() => handleClose()}
                >
                  Close
                </Button>
              </div>
            </Popup>
          </div>
          <div className="col-sm 4">
            <div className="py-3">
              <h1 className="title">Summary</h1>
              <hr />
            </div>
            <Col className="md-3">
              <div className="d-flex align-items-center mb-3">
                <img
                  style={{ width: 100, height: 100 }}
                  src={pc}
                  alt="Product"
                />
                <div className="ms-3">
                  <p style={{ fontWeight: 600 }}>{productName}</p>
                </div>
              </div>
            </Col>
            <hr />
            <p style={{ fontWeight: 600 }}>
              Total:{" "}
              {parseFloat(productPrice).toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
            <Button
              style={{
                marginLeft: "195px",
                color: "#ffffff",
                background: "#ED3324",
                fontSize: "20px",
                fontWeight: "bold",
                borderColor: "#ffffff",
              }}
              type="submit"
              onClick={handleDeleteClick.bind(null, productId)}
            >
              Cancel
            </Button>
            <Button
              style={{
                marginLeft: "20px",
                color: "#ffffff",
                background: "#009bb3",
                fontSize: "20px",
                fontWeight: "bold",
                borderColor: "#ffffff",
              }}
              type="submit"
              onClick={handleSubmit}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
