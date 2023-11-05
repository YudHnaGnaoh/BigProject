import React from 'react'
import SideBar from '../components/SideBar'
import Navbar from "../components/Navbar"

function AdminProcess() {
  return (
    <div>
      <div style={{ position: 'sticky', top: '0', zIndex:'100' }}><Navbar></Navbar></div>
      <div className='d-flex' style={{ backgroundColor: 'rgb(240,247,255)' }}>
        <SideBar></SideBar>
        <div className='container mt-4' >

        </div>
      </div>
    </div>
  )
}

export default AdminProcess