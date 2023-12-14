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

    const [loading, setLoading] = useState(false)

    const [cate, setCate] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [course, setCourse] = useState('')

    useEffect(() => {
        fetch(`https://duyanh.codingfs.com/api/allCategory`)
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                setCate(res)
            })
    }, [])

    const sendInfo = () => {
        // console.log(name, email, phone, course);
        if (name == '' || email == '' || course == '' || phone == '') {
            Toast.fire({
                icon: "error",
                title: "Thiếu thông tin",
            });
        } else if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
            Toast.fire({
                icon: "error",
                title: "Sai fomat điện thoại",
            });
        } else {
            setLoading(true)
            axios.post(`https://duyanh.codingfs.com/api/signUp`, {
                name: name,
                phone: phone,
                email: email,
                category: course,
            })
                .then((res) => {
                    setLoading(false)
                    // console.log(res);
                    if (res.data.check == false) {
                        if (res.data.msg.name) {
                            Toast.fire({
                                icon: "error",
                                title: res.data.msg.name
                            });
                        } else if (res.data.msg.email) {
                            Toast.fire({
                                icon: "error",
                                title: res.data.msg.email
                            });
                        } else if (res.data.msg.category) {
                            Toast.fire({
                                icon: "error",
                                title: res.data.msg.category
                            });
                        } else if (res.data.msg) {
                            Toast.fire({
                                icon: "error",
                                title: res.data.msg
                            });
                        }
                    } else {
                        Toast.fire({
                            icon: "success",
                            title: "Vui lòng kiểm tra email của bạn",
                        });
                        setName('');
                        setPhone('');
                        setEmail('');
                        setCourse('')
                    }

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
                    {loading == true &&
                        <div className='text-center position-fixed w-100' style={{ zIndex: '100', top: '0', left: '0' }}>
                            <img className='' style={{ height: '50vh', marginTop: '25vh' }} src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!sw800" alt="" />
                        </div>
                    }
                    <div className=''>
                        <div className="text-center">
                            <h1 className='' style={{ color: 'rgb(7,55,92)', fontWeight: '600' }}>Đăng Ký <span style={{ color: 'rgb(33,155,103)' }}>Học Thử</span></h1>
                        </div>
                        <div className="">
                            <input className='form-control fw-bold my-3' style={{ height: '60px' }} type="text" placeholder='Họ tên *' onChange={(e) => setName(e.target.value)} value={name} />
                            <input className='form-control fw-bold my-3' style={{ height: '60px' }} type="number" placeholder='Số điện thoại *' onChange={(e) => setPhone(e.target.value)} value={phone} />
                            <input className='form-control fw-bold my-3' style={{ height: '60px' }} type="email" placeholder='Địa chỉ email *' onChange={(e) => setEmail(e.target.value)} value={email} />
                            <select className='form-control fw-bold my-3' style={{ height: '60px' }} name='' placeholder="Môn học quan tâm *" id="" onChange={(e) => setCourse(e.target.value)} value={course}>
                                <option value='' hidden>Môn học quan tâm *</option>
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