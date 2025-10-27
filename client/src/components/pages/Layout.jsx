import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../../assets/assets'
import Loading from '../Loading'
import './Layout.css'
import Sidebar from '../Sidebar'


const Layout = () => {
  const user = dummyUserData

  return user ? (
    <div className='layout-container'>
      <Sidebar/>

      <div className='layout-content'>
        <Outlet />
      </div>

    
    </div>
  ) : (
    <Loading />
  )
}

export default Layout
