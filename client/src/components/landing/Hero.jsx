import React from 'react'
import image from "./hero-banner.png"

import "./style.css"
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Service from './Service'

const Hero = () => {
  return (
    <>
      <section className="section " style={{backgroundImage: `url(${image})`,height : "648px"}} >
   
     <div className="w-[32rem] text-black pt-44 pl-24">
       <h2 className="font-light text-5xl">
         New Summer 
       </h2>
       <h1 className='font-dark tracking-wider text-5xl pt-4 pb-6'>
        <strong>Shoes Collection</strong>
        </h1>
       <p className="hero-text">
         Competently expedite alternative benefits whereas leading-edge catalysts for change. Globally leverage
         existing an
         expanded array of leadership.
       </p>
       <Link to= '/products' className="btn btn-primary mt-4">
         <span>Shop Now</span>
         <FaArrowRight />
       </Link>
     </div>
   </section>
   {/* CRA */}


    {/* IMAGES */}

    
   </>

 
  )
}

export default Hero