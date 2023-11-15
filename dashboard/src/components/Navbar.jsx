import React, { useEffect, useState } from 'react'
import './css/Navbar.css'
import './css/Input.css'
import Swal from "sweetalert2";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Navbar() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });
    // ========================== Navbar info ===============================
    const [edu, setEdu] = useState([])
    const [cate, setCate] = useState([])
    const [course, setCourse] = useState([])
    // ========================== Modal ===============================
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // ========================== Email login ===============================
    const [student, setStudent] = useState(true)
    const [inputEmail, setInputEmail] = useState('')

    const emailLoginTeacher = (() => {
        if (!inputEmail && inputEmail != '' && inputEmail != null) {
            Toast.fire({
                icon: "error",
                title: 'Thiếu Email',
            });
        } else if (!inputEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            Toast.fire({
                icon: "error",
                title: 'Email không phù hợp',
            });
        } else {
            axios.post(`http://127.0.0.1:8000/api/loginTeacher?email=${inputEmail}`)
                .then((res) => {
                    if (res.data.check == false) {
                        if (res.data.msg.email) {
                            Toast.fire({
                                icon: "error",
                                title: res.data.msg.email,
                            });
                        } else {
                            Toast.fire({
                                icon: "error",
                                title: res.data.msg,
                            });
                        }
                    } else {
                        localStorage.setItem('email', inputEmail)
                        localStorage.setItem('role', res.data.role_id)
                        localStorage.setItem('name', res.data.name)
                        handleClose()
                    }
                })
        }
    })

    const emailLoginStudent = (() => {
        if (!inputEmail && inputEmail != '' && inputEmail != null) {
            Toast.fire({
                icon: "error",
                title: 'Thiếu Email',
            });
        } else if (!inputEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            Toast.fire({
                icon: "error",
                title: 'Email không phù hợp',
            });
        } else {
            axios.post(`http://127.0.0.1:8000/api/loginStudent?email=${inputEmail}`)
                .then((res) => {
                    if (res.data.check == false) {
                        if (res.data.msg.email) {
                            Toast.fire({
                                icon: "error",
                                title: res.data.msg.email,
                            });
                        } else {
                            Toast.fire({
                                icon: "error",
                                title: res.data.msg,
                            });
                        }
                    } else {
                        localStorage.setItem('email', inputEmail)
                        localStorage.setItem('role', 'student')
                        localStorage.setItem('name', res.data.name)
                        handleClose()
                    }
                })
        }
    })
    // ========================== Google login ===============================
    const loginT = useGoogleLogin({
        onSuccess: codeResponse => setUserT(codeResponse),
        onError: () => console.log('Login Failed'),
    });
    const loginS = useGoogleLogin({
        onSuccess: codeResponse => setUserS(codeResponse),
        onError: () => console.log('Login Failed'),
    });
    const Logout = (() => {
        localStorage.removeItem('email')
        localStorage.removeItem('role')
        localStorage.removeItem('name')
        // axios.post(`http://127.0.0.1:8000/api/logout`)
        //     .then((res) => {
        //         console.log(res);
        //     })
        window.location.replace('/')
    })
    const [userT, setUserT] = useState([])
    const [userS, setUserS] = useState([])

    useEffect(() => {
        if (userT && userT.length != 0) {
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userT.access_token}`, {})
                .then((res) => {
                    axios.post(`http://127.0.0.1:8000/api/loginTeacher?email=${res.data.email}`)
                        .then((res) => {
                            if (res.data.check == false) {
                                if (res.data.msg.email) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.data.msg.email,
                                    });
                                } else {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.data.msg,
                                    });
                                }
                            } else {
                                localStorage.setItem('email', res.data.email)
                                localStorage.setItem('role', res.data.role_id)
                                localStorage.setItem('name', res.data.name)
                                handleClose()
                            }
                        })
                    // axios.post(`http://127.0.0.1:8000/api/login?email=${res.data.email}`)
                    //     .then((res) => {
                    //         console.log(res);
                    //     })
                    // window.location.reload()
                })
        }
    }, [userT])

    useEffect(() => {
        if (userS && userS.length != 0) {
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userS.access_token}`, {})
                .then((res) => {
                    axios.post(`http://127.0.0.1:8000/api/loginStudent?email=${res.data.email}`)
                        .then((res) => {
                            if (res.data.check == false) {
                                if (res.data.msg.email) {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.data.msg.email,
                                    });
                                } else {
                                    Toast.fire({
                                        icon: "error",
                                        title: res.data.msg,
                                    });
                                }
                            } else {
                                localStorage.setItem('email', res.data.email)
                                localStorage.setItem('role', 'student')
                                localStorage.setItem('name', res.data.name)
                                handleClose()
                            }
                        })
                    // axios.post(`http://127.0.0.1:8000/api/login?email=${res.data.email}`)
                    //     .then((res) => {
                    //         console.log(res);
                    //     })
                    // window.location.reload()
                })
        }
    }, [userS])

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/education2`)
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                setEdu(res);
            });
        fetch(`http://127.0.0.1:8000/api/allCategory2`)
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                setCate(res);
            });
        fetch(`http://127.0.0.1:8000/api/allCourse2`)
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                setCourse(res);
            });
    }, []);

    const goToCourse = (grade) => {
        window.location.href = `/Grade/${grade}`
    }

    return (
        <>
            {/* ============================================= Modal Start ============================================================ */}
            <Modal show={show} onHide={handleClose} size="md" centered style={{ textAlign: 'center' }}>
                <Modal.Header closeButton className='border-0'>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Chào mừng bạn đến với</h5>
                    <h1 style={{ color: 'rgb(25,135,84)', fontWeight: '500' }}>Marathon Education !</h1>
                    <br></br>

                    <input className='form-control' type="email" placeholder='Nhập Email' onChange={(e) => setInputEmail(e.target.value)} />
                    {student == true ?
                        <button className='btn btn-warning float-start mt-2' onClick={() => setStudent(false)}>Học sinh</button>
                        :
                        <button className='btn btn-danger float-start mt-2' onClick={() => setStudent(true)}>Giáo viên hoặc Admin</button>
                    }
                </Modal.Body>
                <Modal.Footer className='border-0 justify-content-center'>
                    {student == true ?
                        <div>
                            <Button className='btn btn-success form-control mb-2' style={{ fontWeight: '500' }} onClick={() => emailLoginStudent()}>Đăng nhập</Button>
                            <a className="btn btn-lg btn-google" href="#" onClick={() => loginS()}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35" height="35" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                </svg>
                            </a>
                        </div>
                        :
                        <div>
                            <Button className='btn btn-success form-control mb-2' style={{ fontWeight: '500' }} onClick={() => emailLoginTeacher()}>Đăng nhập</Button>
                            <a className="btn btn-lg btn-google" href="#" onClick={() => loginT()}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35" height="35" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                </svg>
                            </a>
                        </div>
                    }
                </Modal.Footer>
            </Modal>
            {/* ============================================= Modal Ende ============================================================ */}

            <nav className="navbar navbar-expand-lg navbar-light bg-white p-2" style={{ boxShadow: 'lightgray 2px 2px 2px 2px' }}>
                <div className="container-fluid" style={{ fontWeight: '500' }}>
                    <a className="navbar-brand" href="/">
                        <img src="https://marathon.edu.vn/images/logo-3.png" style={{ height: '40px' }} alt="" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">

                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Khóa học
                                </a>

                                <ul className="dropdown-menu dropdown-content" aria-labelledby="navbarDropdownMenuLink">
                                    {edu && edu != '' && edu.map((item, index) =>
                                        <li key={index} className='dropend'>
                                            <a className="dropdown-item dropdown-toggle" data-bs-toggle="dropend" aria-expanded="false" href="#">{item.name}</a>

                                            <ul className='dropdown-menu dropend-content'>
                                                {cate && cate != '' && cate.map((item2, index2) =>
                                                    <div key={index2}>
                                                        {item2.education_id == item.id ?
                                                            <li className='dropend-2'>
                                                                <a className="dropdown-item dropdown-toggle" data-bs-toggle="dropend" aria-expanded="false" href="#">{item2.name}</a>
                                                                <ul className='dropdown-menu dropend-content-2'>
                                                                    {course && course != '' && course.map((item3, index3) =>
                                                                        <div key={index3}>
                                                                            {item3.id == item2.id ?
                                                                                <li><a className='dropdown-item' href="#" onClick={() => goToCourse(item3.grade)}>{item3.grade}</a></li>
                                                                                :
                                                                                null
                                                                            }
                                                                        </div>
                                                                    )}

                                                                </ul>
                                                            </li>
                                                            :
                                                            null
                                                        }
                                                    </div>
                                                )}
                                            </ul>
                                        </li>
                                    )}
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Giáo viên
                                </a>
                                <ul className="dropdown-menu dropdown-content" aria-labelledby="navbarDropdownMenuLink">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Ngân hàng đề thi
                                </a>
                                <ul className="dropdown-menu dropdown-content" aria-labelledby="navbarDropdownMenuLink">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Hỏi đáp AI</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Bản tin Marathon</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Video</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Cộng tác viên</a>
                            </li>

                        </ul>
                        <div className='d-flex ms-auto'>
                            {localStorage.getItem('email') && localStorage.getItem('email') != '' && localStorage.getItem('email') != null ?
                                <div className='d-flex'>
                                    <button className='btn btn-outline-success me-2' style={{ fontWeight: '600' }}>Góc học tập</button>
                                    <img className="img-fluid nav-link dropdown-toggle rounded-circle" role="button" data-bs-toggle="dropdown" aria-expanded="false" src="https://marathon.edu.vn/_next/image?url=%2Fimages%2Favatar.png&w=1920&q=75" style={{ height: '40px' }} alt="Avatar" />
                                    <ul className="dropdown-menu bubble" style={{ right: '0', left: 'unset' }} aria-labelledby="navbarDropdownMenuLink">
                                        <li><span className="dropdown-item" href="#">Xin chào!</span></li>
                                        <li><span className="dropdown-item" style={{ color: 'rgb(25,135,84)', fontSize: '20px', fontWeight: '600' }} href="#">{localStorage.getItem('name')}</span></li>
                                        {localStorage.getItem('role') == 6 &&
                                            <li><a className="dropdown-item" style={{ color: 'red', fontSize: '16px', fontWeight: '600' }} href="/AdminUser">Trang của Admin</a></li>
                                        }
                                        {localStorage.getItem('role') == 32 &&
                                            <li><a className="dropdown-item" style={{ color: 'orange', fontSize: '16px', fontWeight: '600' }} href="/ScheduleTeacher">Lịch lớp của giáo viên</a></li>
                                        }
                                        {localStorage.getItem('role') != 6 && localStorage.getItem('role') != 32 &&
                                            <li><a className="dropdown-item" style={{ color: 'blue', fontSize: '16px', fontWeight: '600' }} href="/ScheduleStudent">Lịch học của học sinh</a></li>
                                        }
                                        <hr />
                                        <li><a className="dropdown-item" href="#" onClick={() => Logout()}>Đăng xuất</a></li>
                                    </ul>
                                </div>
                                :
                                < button className='btn btn-success me-2' style={{ fontWeight: '600' }} onClick={() => handleShow()}>Đăng nhập</button>
                            }
                        </div>
                    </div>

                </div>
            </nav >
        </>
    )
}

export default Navbar