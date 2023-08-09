import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import "./Customize.scss";

// import Col from 'react-bootstrap/Col';

import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function DetailCustomize() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  // useEffect(() => {
  //   const getProducts = async () => {
  //     setLoading(true);
  //     const response = await fetch(`
  //     https://fakestoreapi.com/products?fbclid=IwAR1YHbn0JC-X1bwdexd9rH09-Oc5JZIDlt3VVcgy9q917OzNyWxktCdaem8/${id}`);
  //     const responseData = await response.json();
  //     setProduct(responseData.data);
  //     setLoading(false);

  //   };
  //   getProducts();
  // }, []);

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
  const descriptionLines = 6;

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
          <p
            className="lead"
            style={{
              maxHeight: `${descriptionLines * 2}em`,
              overflow: "auto",
            }}
          >
            {product.description}
          </p>
          <NavLink to="/payment">
            <Button type="submit">Buy Now</Button>
          </NavLink>
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
