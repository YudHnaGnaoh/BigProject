import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

function SIgnUp() {

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

    const [cate, setCate] = useState('')

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/allCategory`)
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                setCate(res)
            })
    }, [])

    const sendInfo = () => {
        if (!localStorage.getItem('email')) {
            Toast.fire({
                icon: "error",
                title: "Vui lòng đăng nhập hoặc đăng ký trước",
            });
        } else {
            axios.get(`http://127.0.0.1:8000/api/getUser?email=${localStorage.getItem('email')}`)
                .then((res) => {
                    // console.log(res.data);
                    // setUserName(res.data.name)
                    // setUserName(res.data.name)
                })
        }
    }

    return (
        <div>
            <div className="row">
                <div className="col-md">
                    <img className='d-block' style={{ height: '100%' }} src="https://cdn.marathon.edu.vn/uploads/SDpxrxgfVhsQQFQR4TH5opCO0XeF5QInsAQrnSBW.png" alt="" />
                </div>
                <div className="col-md p-3 rounded-4" style={{ backgroundColor: 'rgb(240,247,255)' }}>
                    <div className=''>
                        <div className="text-center">
                            <h1 className='' style={{ color: 'rgb(7,55,92)', fontWeight: '600' }}>Đăng Ký <span style={{ color: 'rgb(33,155,103)' }}>Học Thử</span></h1>
                        </div>
                        <div className="">
                            <input className='form-control fw-bold my-3' style={{ height: '60px' }} type="text" placeholder='Họ tên' />
                            <input className='form-control fw-bold my-3' style={{ height: '60px' }} type="text" placeholder='Số điện thoại' />
                            <input className='form-control fw-bold my-3' style={{ height: '60px' }} type="text" placeholder='Địa chỉ email' />
                            <select className='form-control fw-bold my-3' style={{ height: '60px' }} name='' placeholder="Môn học quan tâm" id="">
                                <option value="" hidden>Môn học quan tâm</option>
                                {cate && cate.map((item, index) =>
                                    < option key={index} value={item.name}>{item.name}</option>
                                )}
                            </select>
                        </div>
                        <button className='btn btn-success d-grid col-4 mx-auto' style={{ fontSize: '1.3rem', fontWeight: '600' }} onClick={() => sendInfo()}>Gửi</button>
                        {/* <input className='form-control' type="text" placeholder='Môn học quan tâm'/> */}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SIgnUp