import "./OrderDetail.scss";
import { Row, Col, Button } from "react-bootstrap";
import { BsArrowLeft, BsFillPersonFill, BsTelephone } from "react-icons/bs";
import { BiMap } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import pc from "../assets/image/PC1.png";
const OrderDetail = () => {
  const navigate = useNavigate();
  const handleDetail = () => {
    navigate("/history");
  };
  return (
    <div className="order">
      <div className="container my-5 py-5">
        <div>
          <div className="header">
            <Button onClick={() => handleDetail()}>
              <BsArrowLeft />
            </Button>
            <h1>Order detail</h1>
          </div>
        </div>
        <Row>
          <Col className="mb-3">
            <img src={pc} alt="" />
            <div className="content">
              <p style={{ fontSize: "27px" }}>
                <strong></strong>
              </p>
              <i></i>
              <p style={{ color: "red", fontSize: "20px" }}>
                <strong> VND</strong>
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Information line</h2>
            <div className="info">
              <div>
                <p>Total product cost: </p>
                <p>Total discount: </p>
                <p>Paid: </p>
              </div>
              <div>
                <p>VND</p>
                <p>VND</p>
                <p>VND</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Customer information</h2>
            <div className="custom">
              <p>
                <BsFillPersonFill />{" "}
              </p>
              <p>
                <BsTelephone />{" "}
              </p>
              <p>
                <BiMap />{" "}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default OrderDetail;
