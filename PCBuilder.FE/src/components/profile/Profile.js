import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./Profile.scss";
const Profile = () => {
  const URL = "https://fpc-shop.azurewebsites.net/api/User";
  const [userData, setUserData] = useState({
    fullname: "",
    gender: "",
    phone: "",
    address: "",
    country: "",
    avatar: "",
  });
  const navigate = useNavigate();
  const id = localStorage.getItem("idUser");
  const token = localStorage.getItem("tokenUser");
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
            Authorize: `Bearer ${token}`,
          },
        },
        id
      )
      .then(function (response) {
        if (
          response.request.status === 200 ||
          response.request.status === 201
        ) {
          setUserData(response.data.data);
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
          Authorize: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (
          response.request.status === 200 ||
          response.request.status === 201
        ) {
          toast.success(`Updated user successfully ~`);
          navigate("/profile");
        }
      })
      .catch(function (error) {
        toast.error("Update user failed:", error);
        console.log(error);
      });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    updateUser(userData.id, userData);
  };

  return (
    <div className="container py-5">
      <Row>
        <div className="col-lg-10 profile">
          <Col className="avatar">
            <img src={userData.avatar} alt="avatar" />
          </Col>
          <Form onSubmit={handleSubmit}>
            <h1>General information</h1>
            <Col md>
              <Form.FloatingLabel
                controlId="validationCustom01"
                label="Full name"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Full name"
                  value={userData.fullname}
                  onChange={(event) =>
                    setUserData({ ...userData, fullname: event.target.value })
                  }
                />
              </Form.FloatingLabel>
            </Col>
            <Col md>
              <Form.FloatingLabel
                controlId="validationCustom03"
                label="Gender"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Male/Female"
                  value={userData.gender}
                  onChange={(event) =>
                    setUserData({ ...userData, gender: event.target.value })
                  }
                />
              </Form.FloatingLabel>
            </Col>

            <Col md>
              <Form.FloatingLabel
                controlId="validationCustom04"
                label="Phone Number"
                className="mb-3"
              >
                <Form.Control
                  require
                  type="number"
                  placeholder="0123456789"
                  value={userData.phone}
                  onChange={(event) =>
                    setUserData({ ...userData, phone: event.target.value })
                  }
                />
              </Form.FloatingLabel>
            </Col>

            <Col md>
              <Form.FloatingLabel
                controlId="validationCustom05"
                label="Address"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={userData.address}
                  onChange={(event) =>
                    setUserData({ ...userData, address: event.target.value })
                  }
                />
              </Form.FloatingLabel>
            </Col>
            <Col md>
              <Form.FloatingLabel
                controlId="validationCustom06"
                label="Country"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Country"
                  value={userData.country}
                  onChange={(event) =>
                    setUserData({ ...userData, country: event.target.value })
                  }
                />
              </Form.FloatingLabel>
            </Col>
            <Button className="btn" type="submit">
              Update Information
            </Button>
          </Form>
        </div>
      </Row>
    </div>
  );
};
export default Profile;
