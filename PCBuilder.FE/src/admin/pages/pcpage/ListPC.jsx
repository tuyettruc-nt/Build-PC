import React, { useEffect, useState } from "react";
import "./listPC.scss";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Col, Row, Card } from "react-bootstrap";

const ListPC = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("tokenUser");
  useEffect(() => {
    getAllPc();
  }, []);

  const getAllPc = async () => {
    await axios
      .get(`https://fpc-shop.azurewebsites.net/api/PC/GetListByAdmin`, {
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
  const handleEditCellChange = (params) => {
    const { id, field, value } = params;
    data?.map((item) => (item.id === id ? { ...item, [field]: value } : item));
  };
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await axios
        .delete(
          `https://fpc-shop.azurewebsites.net/api/PC/${id}/DeletePCWithComponent`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          id
        )
        .then(function (response) {
          getAllPc();
          toast.success("Deleted Successfully ~");
        })
        .catch(function (error) {
          toast.error("Delete: Error!");
          console.log(error.message);
        });
    }
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <div className="layout">
      <h1 className="title"> PCs List </h1>
      <div className="Createbtn">
        <Link to="/addPc/">
          <button className="btn-create">Create PC</button>
        </Link>
      </div>
      <Row xs={1} md={4} className="g-4">
        {data &&
          data.map((info) => (
            <Col key={info.id}>
              <Card>
                <Card.Img variant="top" src={info.image} />
                <Card.Body>
                  <Card.Title>{info.name}</Card.Title>
                  <Card.Text>{formatNumberWithCommas(info.price)}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/editPc/${info.id}`}>
                    <Button
                      style={{
                        color: "#ffffff",
                        background: "#009393",
                        borderColor: "#009393",
                      }}
                      className="btn-footer"
                    >
                      <AiOutlineEdit /> Edit
                    </Button>
                  </Link>

                  <Button
                    className="btn-footer"
                    style={{
                      color: "#ffffff",
                      background: "#009393",
                      borderColor: "#009393",
                    }}
                    onClick={() => handleDeleteClick(info.id)}
                  >
                    <AiOutlineDelete /> Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default ListPC;
