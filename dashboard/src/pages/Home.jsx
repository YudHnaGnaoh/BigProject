import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import SignUp from "../components/SignUp"
import Footer from "../components/Footer"
import '../components/css/style.css'

function Home() {

  const [course, setCourse] = useState()

  useEffect(() => {
    fetch(`https://duyanh.codingfs.com/api/homePageCourse`)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setCourse(res)
      })
  }, [])

  const goToCourse = (id) => {
    window.location.href = `/Course/${id}`
  }

  return (
    <div>
      <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
      <div className="container">
        <h1 className='mt-5 fw-bold text-center' style={{ color: 'rgb(25,135,84)' }}>Các chương trình mới nhất</h1>
        <div className="row row-cols-2 row-cols-md-3 g-3 g-md-5 mt-3 my-5">
          {course && course.map((item, index) =>
            <div key={index} role='button' className="col" onClick={() => goToCourse(item.id)}>
              <div className='pb-3 mx-auto text-center' style={{ backgroundColor: 'rgb(240,247,255)', borderRadius: '30px', overflow: 'hidden' }}>
                <img src={"https://duyanh.codingfs.com/images/" + item.image} className='img-fluid' alt="" />
                <div className="p-3">
                  <div className='py-1 mb-2 mx-auto' style={{ borderRadius: '30px', backgroundColor: 'white', width: 'fit-content' }}><span className='p-3'>Bộ giáo dục</span></div>
                  <div className='title-course'>
                    <h4 className="fw-bold">{item.name}</h4>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <SignUp></SignUp>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Home