// File name: Navbar
// File name with extension: Navbar.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\navbar\Navbar.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\navbar

import { useEffect, useState } from "react";
import { BsCart3, BsMoonFill, BsSunFill } from "react-icons/bs";
import { FaBarsStaggered } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import NavLinks from "./NavLinks";
import { useGlobalContext } from "../../context";
import logo from "./footcap-high-resolution-logo-white-transparent.png";

const Navbar = () => {
  const { cart } = useGlobalContext();
  const numItemsInCart = cart.length;

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <nav className="bg-base-200">
      <div className="navbar align-element">
        <div className="navbar-start">
          <NavLink to="/" className="hidden lg:flex btn text-3xl items-center">
            <img src={logo} width="150px" alt="Logo" />
          </NavLink>

          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <FaBarsStaggered className="h-6 w-6" />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <NavLinks />
            </ul>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal">
            <NavLinks />
          </ul>
        </div>

        <div className="navbar-end flex items-center gap-2">
          {/* 🌗 Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle btn-md"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <BsMoonFill className="h-5 w-5" />
            ) : (
              <BsSunFill className="h-5 w-5" />
            )}
          </button>

          {/* 🛒 Cart Button */}
          <NavLink to="/cart" className="btn btn-ghost btn-circle btn-md ml-1">
            <div className="indicator">
              <BsCart3 className="h-6 w-6" />
              <span className="badge badge-sm badge-primary indicator-item">
                {numItemsInCart}
              </span>
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
