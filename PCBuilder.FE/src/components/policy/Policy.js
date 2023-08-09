import policy from "../assets/image/policy.png";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import "./Policy.scss";
const Policy = () => {
  return (
    <div className="hero">
      <div className="container py-5 policy">
        <h1>Warranty and return policy</h1>
        <div className="warranty">
          <img src={policy} alt="" />
        </div>
        <Col>
          <h3>1. Free warranty conditions</h3>
          <p>
            {" "}
            - The product is still in the warranty period (from the date printed
            on the coupon), with the stamp intact, with no signs of replacement
            or disassembly.
          </p>
          <p>
            {" "}
            - Not subject to external influences such as: Impact deforms,
            cracks, electric shock causes fire and explosion, dampness, rust,
            damage to components.
          </p>
          <p>
            {" "}
            - There is no sign of dismantling, repairing or replacing components
            not provided by FPC.
          </p>
        </Col>
        <Col>
          <h3>2. What warranty will the company help customers with?</h3>
          <p>
            To ensure your computer is operating at its best, the staff of FPC
            is always dedicated to care and support.
          </p>
          <p>
            {" "}
            - Free installation of software or copy data at the request of
            customers.
          </p>
          <p>
            {" "}
            - Support to fix on the spot with errors that can be handled
            quickly.
          </p>
          <p>
            {" "}
            - For errors that cannot be handled on the spot, the staff will
            bring the machine back to FPC for inspection and at the same time
            will send another machine to replace it so that the customer can use
            it during the machine maintenance period.
          </p>
          <p>
            {" "}
            - Hardware errors such as: CPU Chip, hard drive,... FPC will repair
            or replace it for free.{" "}
          </p>
          <p>
            {" "}
            - When customers need to fix software errors (related to the
            operating system), technicians will handle and quote service prices
            when they arise.
          </p>
        </Col>
        <Col>
          <h3>3. Regulations on warranty period</h3>
          <Table>
            <thead>
              <tr>
                <th>Accessory</th>
                <th>Warranty period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>CPU</th>
                <th>36 months</th>
              </tr>
              <tr>
                <th>Ram</th>
                <th>36 months</th>
              </tr>
              <tr>
                <th>GPU</th>
                <th>36 months</th>
              </tr>
              <tr>
                <th>SSD</th>
                <th>24 months</th>
              </tr>
              <tr>
                <th>HDD</th>
                <th>24 months</th>
              </tr>
              <tr>
                <th>CPU Heatsink</th>
                <th>24 months</th>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          <h3>4. Time to receive warranty</h3>
          <p>From Monday to Saturday</p>
          <p>Morning 9 am - 11:30 am and pm 13:30 pm - 5:00 pm</p>
        </Col>
        <Col>
          <h3>5. Address of machine warranty</h3>
          <p>Head office: FPT University, Long Thanh My, Thu Duc City</p>
        </Col>
      </div>
    </div>
  );
};
export default Policy;
