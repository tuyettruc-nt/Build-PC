import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import "../customize/Customize.scss";
import Row from "react-bootstrap/Row";
import ItemsModal from "../modal/ItemsModal";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Popup from "reactjs-popup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomizePC() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [componentType, setComponentType] = useState([]);
  const [selectedComponentType, setSelectedComponentType] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [originalComponents, setOriginalComponents] = useState([]);
  const [toastProps, setToastProps] = useState({});
  const [initialPrice, setInitialPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ramQuantity, setRamQuantity] = useState(1);
  const [hddQuantity, setHddQuantity] = useState(1);
  const [ssdQuantity, setSsdQuantity] = useState(1);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch(
        `https://localhost:7262/api/PC/PCWithComponent/${id}`
      );
      const responseData = await response.json();
      const pcData = responseData.data;
      setProduct(pcData);

      setOriginalComponents(pcData.components);
      setLoading(false);

      const initalPcPrice = calTotalPrice(pcData.components);
      setInitialPrice(initalPcPrice);
    };

    getProducts();
  }, []);

  useEffect(() => {
    if (product.components) {
      const defaultSelectedComponents = product.components.map((component) => ({
        id: component.id,
        name: component.name,
      }));
      setSelectedComponents(defaultSelectedComponents);
    }
  }, [product.components]);

  useEffect(() => {
    if (
      selectedComponentType &&
      selectedComponentType !== "" &&
      product.components
    ) {
      const filtered = product.components.filter((component) =>
        component.name.includes(selectedComponentType)
      );
      setFilteredComponents(filtered);
    } else {
      setFilteredComponents([]);
    }
  }, [selectedComponentType, product.components]);

  const calTotalPrice = (components) => {
    let totalPrice = 0;
    components.forEach((component) => {
      if (component.price && typeof component.price === "number") {
        totalPrice += component.price;
      }
    });
    return totalPrice;
  };

  const handleComponentSelect = async (componentType, component) => {
    const updatedSelectedComponents = selectedComponents.map(
      (selectedComponent) => {
        if (selectedComponent.name === componentType) {
          return component;
        }
        return selectedComponent;
      }
    );

    const selectedComponentWithType = {
      type: componentType,
      component: component,
    };

    try {
      // Gửi yêu cầu API để cập nhật danh sách ban đầu
      const temporarySelectedComponent = updatedSelectedComponents.map(
        (component) => component.id
      );
      await axios.post(
        `https://localhost:7262/api/PC/ CreatePCWithComponentsFromTemplate?templateId=${id}`,
        temporarySelectedComponent,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Components updated successfully");

      // Cập nhật danh sách sản phẩm đã chọn trong React state
      setSelectedComponents(updatedSelectedComponents);
      setShowModal(false);
      setSelectedComponentType(null);
      toast.success(
        "Components updated successfully",
        selectedComponentWithType
      );
      setToastProps({
        data: selectedComponentWithType,
      });
      const newUpdatedPrice = calTotalPrice(selectedComponents);
      setTotalPrice(newUpdatedPrice);
    } catch (error) {
      console.error("Error updating components:", error.response);
      console.error("Error updating components:", error.response.data);
    }
  };

  const openComponentModal = (component, componentType) => {
    console.log("Selected Component Type:", componentType);
    console.log("Selected Component:", component);
    setSelectedComponentType(componentType);
    setSelectedComponent(component);
    setShowModal(true);
  };

  const Loading = () => {
    return (
      <>
        <div className="col-md-5">
          <Skeleton height={400} />
        </div>
        <div className="col-md-7">
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

  const detail = product.detail || "";
  const detailChunks = detail.split(". ");

  const ShowProduct = () => {
    // const isComponentsComplete = selectedComponents.length === 7;
    return (
      <>
        <div className="col-md-6 pt-4 image-main">
          <img
            src={product.image}
            alt={product.name}
            height="400px"
            width="400px"
          />
        </div>
        <div className="col-md-6 pt-4">
          <h4 className="text-uppercase text-black-50">{product.category}</h4>
          <h1 className="display-5">{product.name}</h1>
          <p>{product.summary}</p>
          <p className="rate fw-bolder">
            Rating 4.9
            <i className="fa fa-star"></i>
          </p>
          <h3 className="display-6 fw-bold my-4 price-text">
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
          <p className="lead-type">
            {detailChunks.map((chunk, index) => (
              <p key={index} className="lead">
                {chunk.trim()} {/* Remove extra whitespace */}
              </p>
            ))}
          </p>
        </div>
        <div className="container py-5 fluid customize">
          <Row>
            <div className="title">
              <h1>SELECT YOUR COMPONENTS</h1>
            </div>
          </Row>

          <div className="box-table">
            {product.components && product.components.length > 0 ? (
              <table className="ae-table">
                <tbody>
                  {product.components.map((component, index) => (
                    <tr key={index}>
                      <td className="category-name">
                        {index === 0
                          ? "1. CPU"
                          : index === 1
                          ? "2. Main"
                          : index === 2
                          ? "3. VGA"
                          : index === 3
                          ? "4. PSU"
                          : index === 4
                          ? "5. Ram"
                          : index === 5
                          ? "6. SSD"
                          : index === 6
                          ? "7.HDD"
                          : ""}
                      </td>
                      <td style={{ width: "30%" }}>
                        <div className="item-drive">
                          <div className="contain-item-drive">
                            <div className="flex image-category">
                              {component.name.includes("CPU") && (
                                <img
                                  src={component.image}
                                  alt="CPU"
                                  style={{ marginLeft: "-90px" }}
                                />
                              )}
                              {component.name.includes("Mainboard") && (
                                <img src={component.image} alt="Mainboard" />
                              )}
                              {component.name.includes("VGA") && (
                                <img src={component.image} alt="VGA" />
                              )}
                              {component.name.includes("PSU") && (
                                <img src={component.image} alt="PSU" />
                              )}
                              {component.name.includes("Ram") && (
                                <img src={component.image} alt="Ram" />
                              )}
                              {component.name.includes("SSD") && (
                                <img src={component.image} alt="SSD" />
                              )}
                              {component.name.includes("HDD") && (
                                <img src={component.image} alt="HDD" />
                              )}
                              {component.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="component-price">
                        <div className="price-wrapper">
                          {component.name.includes("Ram") ||
                          component.name.includes("HDD") ||
                          component.name.includes("SSD") ? (
                            <div className="d-flex d-flex-center box-price">
                              <span className="d-price fw-bold">
                                {component.price &&
                                typeof component.price === "number" ? (
                                  <p>
                                    {component.price.toLocaleString("vi-VN", {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    })}
                                  </p>
                                ) : (
                                  <p>Price not available</p>
                                )}
                              </span>
                              <span className="price-separator">x</span>
                              {component.name.includes("Ram") && (
                                <input
                                  className="count-p"
                                  type="number"
                                  min="1"
                                  max="50"
                                  value={ramQuantity}
                                  onChange={(e) => {
                                    setRamQuantity(e.target.value);
                                    e.preventDefault();
                                  }}
                                />
                              )}
                              {component.name.includes("HDD") && (
                                <input
                                  className="count-p"
                                  type="number"
                                  min="1"
                                  max="50"
                                  value={hddQuantity}
                                  onChange={(e) => {
                                    setHddQuantity(e.target.value);
                                  }}
                                />
                              )}
                              {component.name.includes("SSD") && (
                                <input
                                  className="count-p"
                                  type="number"
                                  min="1"
                                  max="50"
                                  value={ssdQuantity}
                                  onChange={(e) => {
                                    setSsdQuantity(e.target.value);
                                  }}
                                />
                              )}
                              <span className="price-separator">=</span>
                              <span className="sum-price">
                                {component.price &&
                                typeof component.price === "number"
                                  ? (
                                      component.price *
                                      (component.name.includes("Ram")
                                        ? ramQuantity
                                        : component.name.includes("HDD")
                                        ? hddQuantity
                                        : ssdQuantity)
                                    ).toLocaleString("vi-VN", {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    })
                                  : "Price not available"}
                              </span>
                            </div>
                          ) : (
                            <span className="d-price fw-bold">
                              {component.price &&
                              typeof component.price === "number" ? (
                                <p>
                                  {component.price.toLocaleString("vi-VN", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  })}
                                </p>
                              ) : (
                                <p>Price not available</p>
                              )}
                            </span>
                          )}

                          <div className="btn-select ml-auto">
                            <Button
                              onClick={() =>
                                openComponentModal(component, componentType)
                              }
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No components available</p>
            )}
          </div>
          <div className="initalPrice">Initial Price: {initialPrice}</div>
          <div className="updatePrice">Updated Price: {totalPrice}</div>
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
        <div className="row">
          {loading ? <Loading /> : <ShowProduct />}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            closeOnClick
            pauseOnHover
            closeButton={false}
            className="toast-container"
            toastClassName="toast-success"
          />
          {showModal && (
            <ItemsModal
              closeModel={() => setShowModal(false)}
              handleComponentSelect={handleComponentSelect}
              selectedComponents={selectedComponents}
              selectedLocation={selectedComponentType}
              componentType={componentType}
              component={selectedComponent}
              filteredComponents={filteredComponents}
            />
          )}
        </div>
      </div>
    </div>
  );
}
