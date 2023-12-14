import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import SignUp from "../components/SignUp"
import Footer from "../components/Footer"
import '../components/css/style.css'
import { useParams } from 'react-router-dom';

function Grade() {

    const [course, setCourse] = useState([])
    const grade = useParams()
    // console.log(grade.grade);
    // console.log(course);

    useEffect(() => {
        fetch(`https://duyanh.codingfs.com/api/sameGradeCourse?grade=${grade.grade}`)
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                setCourse(res);
            });
    }, []);

    const goToCourse = (id) => {
        window.location.href = `/Course/${id}`
    }

    return (
        <div>
            <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
            <div className="container" >
                <h1 className='mt-5 fw-bold text-center' style={{ color: 'rgb(25,135,84)' }}>Các chương trình {grade.grade}</h1>
                <div className="row mt-5 my-3">
                    {course && course.map((item, index) =>
                        <div key={index} className="col-md">
                            <div className='pb-3 mb-5 mx-auto text-center pointer' style={{ backgroundColor: 'rgb(240,247,255)', borderRadius: '30px', overflow: 'hidden', minHeight: '400px', width: '350px' }} onClick={() => goToCourse(item.id)}>
                                <img src={"https://duyanh.codingfs.com/images/" + item.image} style={{ width: '100%' }} alt="" />
                                <div className="p-3">
                                    <div className='py-1 mb-2 mx-auto' style={{ borderRadius: '30px', backgroundColor: 'white', width: 'fit-content' }}><span className='p-3'>Bộ giáo dục</span></div>
                                    <h4 className="fw-bold">{item.name}</h4>
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

export default Grade