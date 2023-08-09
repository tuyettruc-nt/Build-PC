import React from "react";
import "./home.css";
import image from "../assets/image/pc-home.png";
import Product from "../product/Products";

export default function Home() {
  return (
    <div className="hero">
      <div className="home-content">
        <h3 className="animated-text">Welcome to FPC</h3>
        <h1 className="animated-text">Simplicity Is A Point Of Arrival</h1>
        <p className="animated-text">Designed by You, Built by Us</p>
        <img src={image} alt="image" className="feature-image" />
      </div>
      <div className="product-text">
        <Product />
      </div>
    </div>
  );
}
