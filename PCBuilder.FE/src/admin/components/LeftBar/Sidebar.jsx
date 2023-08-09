import SideBarItem from "./sidebar-item";

function Sidebar() {
  const menu = [
    { id: 1, label: "PC", icon: "fa-desktop", path: "/pc" },
    { id: 2, label: "Brand", icon: "fa-tag", path: "/brands" },

    { id: 3, label: "Order", icon: "fa-shopping-cart", path: "/orders" },
    { id: 4, label: "User", icon: "fa-user", path: "/users" },
    { id: 5, label: "Component", icon: "fa-cube", path: "/components" },
    { id: 6, label: "Category", icon: "fa-folder", path: "/category" },
  ];
  return <SideBarItem menu={menu} />;
}

export default Sidebar;
