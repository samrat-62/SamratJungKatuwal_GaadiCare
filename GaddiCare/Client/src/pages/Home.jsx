import ClientFooter from '@/components/ClientFooter'
import ClientNavbar from '@/components/ClientNavbar'
import React from 'react'
import { Outlet } from 'react-router'

const Home = () => {
  return (
    <div>
    <ClientNavbar/>
      <Outlet />
    <ClientFooter/>
    </div>
  )
}

export default Home
