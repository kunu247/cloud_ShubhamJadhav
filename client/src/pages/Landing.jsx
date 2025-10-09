// File name: Landing
// File name with extension: Landing.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\Landing.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { Cra, Footer, Hero, LandingImages, Service } from "../components";
import Featured from "../components/landing/Featured";

const Landing = () => {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl px-8 pt-12">
        <Featured />
      </div>
      <Service />
      <Cra />
      <LandingImages />
      <Footer />
    </>
  );
};

export default Landing;
