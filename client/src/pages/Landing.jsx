import React from 'react'
import {Cra, Footer, Hero, LandingImages, SectionTitle, Service} from '../components'
import Featured from '../components/landing/Featured'

const Landing = () => {
  return (
    <>
    <Hero />
    <div className='mx-auto max-w-7xl px-8 pt-12'>
    <SectionTitle text ={"Featured Products"} className="mx-auto max-w-7xl px-8"/>
    <Featured />
    </div>
    <Service />   
    <Cra />
    <LandingImages />
    <Footer />
    
    </>
  )
}

export default Landing