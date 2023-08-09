import Navbar from "../components/navbar/Navbar";
import Home from "../components/home/Home";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// page of user and guest
import Products from "../components/product/Products";
import Product from "../components/product/Product";
import DetailTemplate from "../components/product/DetailTemplate";
import About from "../components/about/About";
import Contact from "../components/contact/Contact";
import Login from "../components/login/Login";
import SignUp from "../components/signup/SignUp";
import Payment from "../components/payment/Payment";
import DetailCustomize from "../components/customize/DetailCustomize";
import Policy from "../components/policy/Policy";
import Profile from "../components/profile/Profile";
import History from "../components/purchaseHistory/PurchaseHistory";
import OrderDetail from "../components/detail/OrderDetail";
import { useSelector } from "react-redux";

//page of admin
import Sidebar from "../admin/components/LeftBar/Sidebar";

import Brands from "../admin/pages/brandpage/Brands";
import NewBrand from "../admin/pages/brandpage/NewBrand";
import Orders from "../admin/pages/orderpage/Orders";

import PC from "../admin/pages/pcpage/ListPC";
import NewPC from "../admin/pages/pcpage/NewPc";
import UpdatePc from "../admin/pages/pcpage/UpdatePc";
import User from "../admin/pages/userpage/Users";
import NewUser from "../admin/pages/userpage/NewUser";
import Component from "../admin/pages/componentpage/Components";
import NewComponent from "../admin/pages/componentpage/NewComponent";
import Category from "../admin/pages/categorypage/Categories";
import NewCategory from "../admin/pages/categorypage/NewCategory";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// page of employee
import SideNavBar from "../staff/components/sidebar/SideNavBar";
import OrderList from "../staff/components/pages/orders/ManageOrder";
import NewOrder from "../staff/components/pages/orders/FormAddOrder";
import EditOrder from "../staff/components/pages/orders/EditOrder";
const Layout = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  if (user && user.role === "Admin") {
    return (
      <>
        <ToastContainer position="top-center" autoClose={1000} />
        {/* <Col sm={2} style={{margin: '0px'}}> */}
        <Sidebar />
        {/* </Col> */}
        {/* <Col sm={10}> */}
        <Col md={{ span: 11, offset: 1 }}>
          <Routes>
            <Route path="/brands" element={<Brands />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/addBrand" element={<NewBrand />} />
            <Route path="/editBrand/:id" element={<NewBrand />} />
            <Route path="/addPc" element={<NewPC />} />
            <Route path="/editPc/:id" element={<UpdatePc />} />
            <Route path="/pc" element={<PC />} />
            <Route path="/addUser" element={<NewUser />} />
            <Route path="/editUser/:id" element={<NewUser />} />
            <Route path="/users" element={<User />} />
            <Route path="/addComponent" element={<NewComponent />} />
            <Route path="/editComponent/:id" element={<NewComponent />} />
            <Route path="/components" element={<Component />} />
            <Route path="/addCategory" element={<NewCategory />} />
            <Route path="/editCategory/:id" element={<NewCategory />} />
            <Route path="/category" element={<Category />} />
            <Route
              path="*"
              element={<div> Not Found or You do not have permission.</div>}
            />
          </Routes>
        </Col>
      </>
    );
  }
  if (user && user.role === "Employee") {
    return (
      <>
        <SideNavBar />
        <ToastContainer position="top-center" autoClose={1000} />
        <Col md={{ span: 11, offset: 1 }}>
          <Routes>
            <Route path="/orderslist" element={<OrderList />} />
            <Route path="/addOrder" element={<NewOrder />} />
            <Route path="/editOrder/:id" element={<EditOrder />} />
            <Route path="/addComponent" element={<NewComponent />} />
            <Route path="/editComponent/:id" element={<NewComponent />} />
            <Route path="/components" element={<Component />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orderdetail" element={<OrderDetail />} />
          </Routes>
        </Col>
      </>
    );
  } else {
    return (
      <>
        <Navbar />
        <ToastContainer position="top-center" autoClose={1000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/PCDetail/:id" element={<Product />} />
          <Route path="/PC/:id" element={<DetailTemplate />} />
          <Route
            path="/customize-pc-detail/:id"
            element={<DetailCustomize />}
          />
          <Route path="/payment" element={<Payment />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/orderdetail" element={<OrderDetail />} />
        </Routes>
      </>
    );
  }
};

export default Layout;
