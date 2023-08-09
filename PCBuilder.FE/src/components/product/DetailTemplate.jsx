import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import "./product.css";

// import Col from 'react-bootstrap/Col';
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function DetailTemplate() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch(`
      https://localhost:7262/api/PC/${id}`);
      const responseData = await response.json();
      setProduct(responseData.data);
      setLoading(false);
    };
    getProducts();
  }, []);

  const detail = product.detail || "";
  const detailChunks = detail.split(". ");

  const Loading = () => {
    return (
      <>
        <div className="col-md-6">
          <Skeleton height={400} />
        </div>
        <div className="col-md-6">
          <Skeleton height={50} width={300} />
          <Skeleton height={75} />
          <Skeleton height={25} width={150} />
          <Skeleton height={50} />
          <Skeleton height={150} />
          <Skeleton height={50} width={100} />
          <Skeleton height={50} width={100} />
        </div>
      </>
    );
  };
  const descriptionLines = 5;

  const ShowProduct = () => {
    return (
      <>
        <div className="col-md-6 pt-4">
          <img
            src={product.image}
            alt={product.name}
            height="400px"
            width="400px"
            className="card-image"
          />
        </div>
        <div className="col-md-6 pt-4">
          <h4 className="text-uppercase text-black-50">{product.category}</h4>
          <h1 className="display-5">{product.name}</h1>
          <p>{product.summary}</p>
          <p className="leada fw-bolder">
            Rating 4.9
            <i className="fa fa-star"></i>
          </p>
          <h3 className="display-6 fw-bold my-4 price">
            {product.price && typeof product.price === "number" ? (
              <p>
                {product.price.toLocaleString("vi-VN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                <span className="small-currency">₫</span>
              </p>
            ) : (
              <p>Price not available</p>
            )}
          </h3>
          <div>
            <p className="lead-type">
              {detailChunks.map((chunk, index) => (
                <p key={index} className="lead">
                  {chunk.trim()}
                </p>
              ))}
            </p>
            <NavLink to="/payment">
              <Button type="submit">Buy Now</Button>
            </NavLink>
          </div>
        </div>
      </>
    );
  };
  return (
    <div>
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
      </div>
    </div>
  );
}
