import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/LeftBar/Sidebar";
import sidebar_menu from "./constants/sidebar-menu";

import "./App.css";
import Brands from "./pages/brandpage/Brands";
import NewBrand from "./pages/brandpage/NewBrand";
import Orders from "./pages/orderpage/Orders";
import NewOrder from "./pages/orderpage/NewOrder";
import PC from "./pages/pcpage/ListPC";
import NewPC from "./pages/pcpage/NewPc";
import User from "./pages/userpage/Users";
import NewUser from "./pages/userpage/NewUser";
import Component from "./pages/componentpage/Components";
import NewComponent from "./pages/componentpage/NewComponent";
import Category from "./pages/categorypage/Categories";
import NewCategory from "./pages/categorypage/NewCategory";
function App() {
  return (
    <Router>
      <div className="dashboard-container">
        <Sidebar menu={sidebar_menu} />

        <div className="dashboard-body">
          <Routes>
            <Route exact path="/brands" element={<Brands />} />
            <Route exact path="/orders" element={<Orders />} />
            <Route exact path="/newOrder" element={<NewOrder />} />
            <Route exact path="/newBrand" element={<NewBrand />} />
            <Route exact path="/newPc" element={<NewPC />} />
            <Route exact path="/" element={<PC />} />
            <Route exact path="/newUser" element={<NewUser />} />
            <Route exact path="/users" element={<User />} />
            <Route exact path="/newComponent" element={<NewComponent />} />
            <Route exact path="/components" element={<Component />} />
            <Route exact path="/newCategory" element={<NewCategory />} />
            <Route exact path="/category" element={<Category />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
