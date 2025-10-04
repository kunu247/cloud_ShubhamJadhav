import React from 'react'
import { Link, Outlet, useNavigation } from 'react-router-dom'
import {Navbar, Header} from '../components'

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading"
  return (
    <>
      <Header />
      <Navbar />
      {isPageLoading ? (
        <h1>Loading</h1>
      ) : (
        <section >
          <Outlet />
        </section>
      )}
    </>
  )
}
// className=' pb-20'

export default HomeLayout