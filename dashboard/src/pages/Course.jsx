import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import SignUp from "../components/SignUp"
import Footer from "../components/Footer"
import '../components/css/style.css'
import { useParams } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios'
import Swal from 'sweetalert2'

function Course() {

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const [loading, setLoading] = useState(false)

    const [course, setCourse] = useState([])
    const [parse, setParse] = useState([])
    const [teacher, setTeacher] = useState([])
    const [schedule, setSchedule] = useState([])
    const [schedule_id, setSchedule_id] = useState('')
    const [time, setTime] = useState('')
    const id = useParams()

    useEffect(() => {
        fetch(`https://duyanh.codingfs.com/api/singleCourse?id=${id.id}`)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.check == false) {
                    window.location.replace('/')
                } else {
                    // console.log(res[0][0]);
                    // console.log(res[0][0].description);
                    setCourse(res[0][0]);
                    setParse(JSON.parse(res[0][0].description))
                    // console.log(res[1][0]);
                    if (res[1][0]) {
                        setSchedule_id(res[1][0].schedule_id);
                        setTeacher(res[1][0])
                        setSchedule(JSON.parse(res[1][0].time))
                    }
                }

            });
    }, []);

    const buyCourse = (() => {
        console.log(localStorage.getItem('email'));
        console.log(teacher.name);
        console.log(time);
        console.log(schedule_id);
        if (!localStorage.getItem('email')) {
            Toast.fire({
                icon: 'error',
                title: 'Vui lòng đăng nhập trước'
            })
        } else {
            setLoading(true)
            axios.post(`https://duyanh.codingfs.com/api/sendMail`, {
                email: localStorage.getItem('email'),
                teacher: teacher.name,
                time: time,
                schedule_id: schedule_id,
            })
                .then((res) => {
                    setLoading(false)
                    // console.log(res.data);
                    if (res.data.check == false) {
                        if (res.data.msg.email) {
                            Toast.fire({
                                icon: 'error',
                                title: res.data.msg.email
                            })
                        } else if (res.data.msg.teacher) {
                            Toast.fire({
                                icon: 'error',
                                title: res.data.msg.teacher
                            })
                        } else if (res.data.msg.time) {
                            Toast.fire({
                                icon: 'error',
                                title: res.data.msg.time
                            })
                        } else if (res.data.msg.schedule_id) {
                            Toast.fire({
                                icon: 'error',
                                title: res.data.msg.schedule_id
                            })
                        } else if (res.data.msg) {
                            Toast.fire({
                                icon: 'error',
                                title: res.data.msg
                            })
                        }
                    } else {
                        Toast.fire({
                            icon: 'success',
                            title: 'Đã mua gói học'
                        })
                    }
                })
        }
    })

    const goBack = (grade) => {
        window.location.href = `/Grade/${grade}`
    }

    return (
        <div>
            {loading == true &&
                <div className='text-center position-fixed w-100' style={{ zIndex: '100' }}>
                    <img className='' style={{ height: '50vh', marginTop: '25vh' }} src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!sw800" alt="" />
                </div>
            }
            <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
            <div className="container" style={{ maxWidth: '1200px' }}>
                {course &&
                    <div className="mb-5">
                        <div className="">
                            <button className='btn btn-success' onClick={() => goBack(course.grade)}>Các chương trình {course.grade}</button>
                            <h1 className='my-5 fw-bold text-center' style={{ color: 'rgb(25,135,84)' }}>{course.name}</h1>
                        </div>
                        {/* <div className="row">
                            <div className="col">
                                <div className="my-1 fw-bold h5">Giá :{Intl.NumberFormat('en-US').format(course.price)} đ</div>
                                <div className="my-1 mb-3 fw-bold h5">Giờ học :{course.duration}</div>
                            </div>
                            <div className="col">
                                <select className='float-end form-control' style={{ width: 'fit-content' }} name="Schedule" id="">
                                    <option value="Schedule here">Schedule here</option>
                                    <option value="Schedule here">Loooooooooooooooooong Schedule here</option>
                                </select>
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="col-md-7">
                                <div className="p-3 bg-success" style={{ borderRadius: '1rem 1rem 0 0', overflow: 'hidden' }}>
                                    <h4 className='fw-bold text-light'>Giáo trình {course.name}</h4>
                                </div>
                                <div className="p-3" style={{ backgroundColor: 'rgb(240,247,255)', borderRadius: '0 0 1rem 1rem', overflow: 'hidden' }}>
                                    {parse && parse.map((item, index) =>
                                        <Accordion key={index} defaultActiveKey="" flush style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                                            <Accordion.Item eventKey={index} className='my-1'>
                                                <Accordion.Header ><div dangerouslySetInnerHTML={{ __html: item.moduleName }}></div></Accordion.Header>
                                                <Accordion.Body >
                                                    <div dangerouslySetInnerHTML={{ __html: item.moduleDetail }}></div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    )}
                                </div>
                            </div>
                            <div className="col-md">
                                <div className="p-3 bg-success" style={{ borderRadius: '1rem 1rem 0 0', overflow: 'hidden' }}>
                                    <h4 className='fw-bold text-light'>Giáo viên</h4>
                                </div>
                                <div className="p-3" style={{ backgroundColor: 'rgb(240,247,255)', borderRadius: '0 0 1rem 1rem', overflow: 'hidden' }}>
                                    {teacher && teacher != '' ?
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img height={120} src="https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg" alt="" />
                                            </div>
                                            <div className="col-md">
                                                <h4 className='fw-bold text-success'>{teacher.name}</h4>
                                                <h5 className="fw-bold">Giá :{Intl.NumberFormat('en-US').format(course.price)} đ</h5>
                                                <div className="mb-3 fw-bold">Giờ học :{course.duration}</div>

                                                {schedule && schedule.map((item, index) =>
                                                    <div key={index} className='d-flex my-1'>
                                                        <input type="radio" name="radioBTN" onChange={() => setTime(item.time)} value="" />
                                                        <div className='ms-2 align-middle' dangerouslySetInnerHTML={{ __html: item.time }}></div>
                                                    </div>
                                                )}
                                            </div>
                                            <button className={'btn btn-success my-2 w-50 mx-auto'} onClick={() => buyCourse()}>Mua khóa học</button>
                                        </div>
                                        :
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img height={120} src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="" />
                                            </div>
                                            <div className="col-md">
                                                <h4 className='fw-bold text-success'>Chưa có giáo viên</h4>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <SignUp></SignUp>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Course