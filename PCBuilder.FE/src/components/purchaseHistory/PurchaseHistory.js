import { Row, Table } from "react-bootstrap";
import order from "../assets/image/order.png";
import "./PurchaseHistory.scss";
import axios from "axios";
import { useEffect, useState } from "react";
const History = () => {
  const URL = "https://fpc-shop.azurewebsites.net/api/Order/byUserId";
  const token = localStorage.getItem("tokenUser");
  const id = localStorage.getItem("idUser");
  const [data, setData] = useState([]);
  useEffect(() => {
    getOrder(id);
  }, []);

  const getOrder = async (id) => {
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
        if (
          response.request.status === 200 ||
          response.request.status === 201
        ) {
          setData(response.data.data);
        }
      })
      .catch(function (error) {
        console.error("Fetch user data failed:", error);
      });
  };
  const statusColors = {
    Successful: "green",
    Cancel: "red",
    Processing: "blue",
    Pending: "orange",
  };
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  function formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
    const year = dateObj.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  return (
    <div className="container py-5 history">
      <div className="container">
        <Row>
          <h1>ORDER MANAGEMENT</h1>
        </Row>
        <Row>
          <img src={order} alt="" />
          <p>
            <span></span>
          </p>
        </Row>
        <Table striped hover>
          <thead>
            <tr>
              <th></th>
              <th>Product</th>
              <th>OrderDate</th>
              <th>Payment Method</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((info) => (
                <tr key={info.id}>
                  <td>
                    <img src={info.pcDTO.image} alt="" />
                  </td>
                  <td>
                    <strong>{info.paymentDTO.name}</strong>
                  </td>
                  <td>{formatDate(info.orderDate)}</td>
                  <td>{info.paymentDTO.paymentMode}</td>
                  <td style={{ color: "red" }}>
                    {formatNumberWithCommas(info.paymentDTO.amount)} VND
                  </td>
                  <td style={{ color: statusColors[info.statusId] }}>
                    {info.statusId}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
export default History;
