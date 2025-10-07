// File name: Cra
// File name with extension: Cra.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\landing\Cra.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\landing

import React from "react";
import { Link } from "react-router-dom";
import cta1 from "./cta-1.jpg";
import cta2 from "./cta-2.jpg";
import { FaArrowRight } from "react-icons/fa6";

const Cra = () => {
  return (
    <section className="section  mb-20">
      <div className="container">
        <ul className="flex w-full justify-center gap-x-8 py-12 flex-wrap gap-y-3">
          <li>
            <div
              className="pt-12 pl-10"
              style={{
                backgroundImage: `url(${cta1})`,
                height: "273px",
                width: "612px",
                backgroundRepeat: "no-repeat"
              }}
            >
              <p className="text-lg">Adidas Shoes</p>

              <h3 className=" py-4  font-bold tracking-wider text-4xl">
                The Summer Sale
                <br /> Off 50%
              </h3>

              <Link
                to={"/products"}
                className="btn btn-link text-white text-lg font-light"
                style={{ paddingLeft: "0px" }}
              >
                <span>Shop Now</span>

                <FaArrowRight />
              </Link>
            </div>
          </li>

          <li>
            <div
              className="pt-12 pl-10"
              style={{
                backgroundImage: `url(${cta2})`,
                height: "273px",
                width: "612px",
                backgroundRepeat: "no-repeat"
              }}
            >
              <p className="text-lg">Nike Shoes</p>

              <h3 className=" py-4  font-bold tracking-wider text-4xl">
                Makes Yourself <br /> Keep Sporty{" "}
              </h3>

              <Link
                to={"/products"}
                className="btn btn-link text-white text-lg font-light"
                style={{ paddingLeft: "0px" }}
              >
                <span>Shop Now</span>

                <FaArrowRight />
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Cra;
