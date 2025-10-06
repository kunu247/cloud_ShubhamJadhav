// File name: NavLinks
// File name with extension: NavLinks.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\navbar\NavLinks.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\navbar

import { NavLink } from "react-router-dom";
import { useGlobalContext } from "../../context";
// import { useDispatch, useSelector } from 'react-redux'

const links = [
  { id: 1, url: "/", text: "home" },
  { id: 3, url: "products", text: "products" },
  { id: 4, url: "cart", text: "cart" },
  { id: 6, url: "orders", text: "orders" },
  { id: 5, url: "admin", text: "admin panel" }
];

const NavLinks = () => {
  const { customer } = useGlobalContext();

  return (
    <>
      {links.map((link) => {
        const { id, url, text } = link;
        if ((url === "admin" || url === "orders") && !customer) return null;
        if (url === "admin" && customer.role === "user") return null;
        return (
          <li key={id}>
            <NavLink to={`${url}`} className="capitalize">
              {text}
            </NavLink>
          </li>
        );
      })}
    </>
  );
};

export default NavLinks;
