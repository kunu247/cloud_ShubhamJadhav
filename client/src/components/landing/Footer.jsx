// File name: Footer
// File name with extension: Footer.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\landing\Footer.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\landing

import React from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaTwitter
} from "react-icons/fa6";
import { IoChevronForward } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="">
      <div className="footer-top section ">
        <div className="container px-24">
          <div className="footer-brand flex justify-between pt-14 ">
            <a href="#" className="logo">
              <img
                src="images\footcap.png"
                width="400"
                height="200"
                alt="Footcap logo"
              />
            </a>

            <ul className="social-list grid place-items-center grid-cols-4">
              <li>
                <a href="#" className="social-link">
                  <FaFacebook />
                </a>
              </li>

              <li>
                <a href="#" className="social-link">
                  <FaTwitter />
                </a>
              </li>

              <li>
                <a href="#" className="social-link">
                  <FaPinterest />
                </a>
              </li>

              <li>
                <a href="#" className="social-link">
                  <FaLinkedin />
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-link-box">
            <ul className="footer-list">
              <li>
                <p className="footer-list-title">Contact Us</p>
              </li>

              <li>
                <address className="footer-link">
                  <ion-icon name="location"></ion-icon>

                  <span className="footer-link-text">
                    E-566 Electronic City , Bengaluru
                  </span>
                </address>
              </li>

              <li>
                <a href="tel:+919876548932" className="footer-link">
                  <ion-icon name="call"></ion-icon>

                  <span className="footer-link-text">+919876548932</span>
                </a>
              </li>

              <li>
                <a href="mailto:footcap@help.com" className="footer-link">
                  <ion-icon name="mail"></ion-icon>

                  <span className="footer-link-text">footcap@help.com</span>
                </a>
              </li>
            </ul>

            <ul className="footer-list">
              <li>
                <p className="footer-list-title">My Account</p>
              </li>

              <li>
                <Link to="/orders" className="footer-link">
                  <IoChevronForward />

                  <span className="footer-link-text">My Account</span>
                </Link>
              </li>

              <li>
                <Link to="/cart" className="footer-link">
                  <IoChevronForward />

                  <span className="footer-link-text">View Cart</span>
                </Link>
              </li>

              <li>
                <a href="#" className="footer-link">
                  <IoChevronForward />

                  <span className="footer-link-text">Wishlist</span>
                </a>
              </li>

              <li>
                <a href="#" className="footer-link">
                  <IoChevronForward />

                  <span className="footer-link-text">Compare</span>
                </a>
              </li>

              <li>
                <Link to="/products" className="footer-link">
                  <IoChevronForward />

                  <span className="footer-link-text">New Products</span>
                </Link>
              </li>
            </ul>

            <div className="footer-list">
              <p className="footer-list-title">Opening Time</p>

              <table className="footer-table">
                <tbody>
                  <tr className="table-row">
                    <th className="table-head" scope="row">
                      Mon - Tue:
                    </th>

                    <td className="table-data">8AM - 10PM</td>
                  </tr>

                  <tr className="table-row">
                    <th className="table-head" scope="row">
                      Wed:
                    </th>

                    <td className="table-data">8AM - 7PM</td>
                  </tr>

                  <tr className="table-row">
                    <th className="table-head" scope="row">
                      Fri:
                    </th>

                    <td className="table-data">7AM - 12PM</td>
                  </tr>

                  <tr className="table-row">
                    <th className="table-head" scope="row">
                      Sat:
                    </th>

                    <td className="table-data">9AM - 8PM</td>
                  </tr>

                  <tr className="table-row">
                    <th className="table-head" scope="row">
                      Sun:
                    </th>

                    <td className="table-data">Closed</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="footer-list">
              <p className="footer-list-title">Newsletter</p>

              <p className="newsletter-text">
                Authoritatively morph 24/7 potentialities with error-free
                partnerships.
              </p>

              <form action="" className="newsletter-form">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="newsletter-input"
                />

                <button type="submit" className=" btn-primary1">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; 2024{" "}
            <a href="#" className="copyright-link">
              Shrey & Kishor
            </a>
            . All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
