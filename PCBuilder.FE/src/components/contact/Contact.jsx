import React from "react";
import contactus from "../assets/image/contactus.png";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";
import Button from "react-bootstrap/Button";

const Contact = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  return (
    <div>
      <div className="hero">
        <div className="container py-5">
          <Row>
            <div className="col-12 text-center py-4 my-4">
              <h1>Have Some Question?</h1>
              <hr />
            </div>
          </Row>
          <Row>
            <Col md>
              <img
                src={contactus}
                alt="Contact Us"
                height="100%"
                width="100%"
              />
            </Col>
            <Col md>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.FloatingLabel
                  controlId="validationCustom01"
                  label="Full name"
                  className="mb-3"
                >
                  <Form.Control required type="text" placeholder="Full name" />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.FloatingLabel>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Comments"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ height: "200px" }}
                  />
                </FloatingLabel>
                <Button type="submit">Send Message</Button>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Contact;
