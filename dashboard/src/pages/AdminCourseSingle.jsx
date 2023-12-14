import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Navbar from "../components/Navbar"
import axios from "axios";
import '../components/css/style.css'
import './css/AdminCourse.css'
import '../components/css/Input.css'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { FileUploader } from "react-drag-drop-files";

function AdminCourseSingle() {

    const [singleCourse, setSingleCourse] = useState([])
    // console.log(singleCourse);
    const id = useParams()

    useEffect(() => {
        if (!localStorage.getItem('email') || localStorage.getItem('role') != 6) {
            window.location.replace('/')
        } else {
            fetch(`https://duyanh.codingfs.com/api/singleCourse?id=${id.id}`)
                .then((res) => res.json())
                .then((res) => {
                    console.log(res[0][0]);
                    setParseModule(JSON.parse(res[0][0].description))
                    setSingleCourse(res[0]);

                });
        }
    }, []);

    // ==================== Drag & Drop =============================
    // const fileTypes = ["JPG", "PNG", "GIF", "WEBP", "APNG", "AVIF", "SVG", 'jpg', 'png', 'gif', "WebP", 'webp', 'svg', 'apng', 'avif'];
    // const [file, setFile] = useState(null);
    // const [showImg, setShowImg] = useState(null);
    // const uploadFile = (file) => {
    //     setFile(file);
    //     var url = URL.createObjectURL(file);
    //     setShowImg(url)
    // };
    // ==================== Module =============================
    const [parseModule, setParseModule] = useState('');



    return (
        <div>
            <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
            <div className='d-flex' style={{ backgroundColor: 'rgb(240,247,255)' }}>
                <SideBar></SideBar>
                <div className='container mt-4' >
                    {singleCourse && singleCourse.map((item, index) =>
                        <div className="row" key={index}>
                            <div className="col-md">
                                <h4 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Thông tin</h4>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover table-bordered table-light align-middle" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                        <tbody className="table-group-divider">
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Ảnh</span>
                                                </td>
                                                <td>
                                                    <img src={"https://duyanh.codingfs.com/images/" + (item.image)} style={{ height: '120px' }} alt="" />
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Tên</span>
                                                </td>
                                                <td>
                                                    <span className=' fw-bold' >{item.name}</span>
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Trạng thái</span>
                                                </td>
                                                {item.status == 1 ?
                                                    <td><span className='text-success  fw-bold ' >Mở</span></td>
                                                    :
                                                    <td><span className='text-danger  fw-bold' >Khóa</span></td>
                                                }
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Thời gian / buổi</span>
                                                </td>
                                                <td>
                                                    <span className=' fw-bold' >{item.duration}</span>
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Giá</span>
                                                </td>
                                                <td>
                                                    <span className=' fw-bold' >{Intl.NumberFormat('en-US').format(item.price)} vnd</span>
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Giảm giá</span>
                                                </td>
                                                <td>
                                                    <span className=' fw-bold' >{item.discount}%</span>
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Khối lớp</span>
                                                </td>
                                                <td>
                                                    <span className=' fw-bold' >{item.grade}</span>
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Tóm tắt</span>
                                                </td>
                                                <td>
                                                    <span className=' fw-bold' >{item.summary}</span>
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Mô tả</span>
                                                </td>
                                                <td>
                                                    {parseModule && parseModule.map((item, index) =>
                                                        <div key={index}>
                                                            <p className='h4 text-dark' dangerouslySetInnerHTML={{ __html: item.moduleName }}></p>
                                                            <p dangerouslySetInnerHTML={{ __html: item.moduleDetail }}></p>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* <div className="col-md">
                                <h4 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Sửa</h4>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover table-bordered table-light align-middle" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                        <tbody className="table-group-divider">
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Ảnh</span>
                                                </td>
                                                <td>
                                                    <FileUploader multiple={false} handleChange={uploadFile} name="file" types={fileTypes} />
                                                    {showImg ?
                                                        <img src={showImg} style={{ height: '120px' }} alt="" />
                                                        :
                                                        <img src={"https://duyanh.codingfs.com/images/" + item.image} style={{ height: '120px' }} alt="" />
                                                    }
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Tên</span>
                                                </td>
                                                <td>
                                                    <input type="text" className='form-control' defaultValue={item.name} name="" id="" />
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Trạng thái</span>
                                                </td>
                                                {item.status == 1 ?
                                                    <td><span className='text-success pointer fw-bold ' >Mở</span></td>
                                                    :
                                                    <td><span className='text-danger pointer fw-bold' >Khóa</span></td>
                                                }
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Thời gian / buổi</span>
                                                </td>
                                                <td>
                                                    <input type="text" className='form-control' defaultValue={item.duration} name="" id="" />
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Giá</span>
                                                </td>
                                                <td>
                                                    <input type="number" className='form-control' defaultValue={item.price} name="" id="" />
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Giảm giá</span>
                                                </td>
                                                <td>
                                                    <input type="number" className='form-control' defaultValue={item.discount} name="" id="" />
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Khối lớp</span>
                                                </td>
                                                <td>
                                                    <select className='form-select' name="" id="" defaultValue={item.grade}>
                                                        <option value="Lớp 1">Lớp 1</option>
                                                        <option value="Lớp 2">Lớp 2</option>
                                                        <option value="Lớp 3">Lớp 3</option>
                                                        <option value="Lớp 4">Lớp 4</option>
                                                        <option value="Lớp 5">Lớp 5</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Tóm tắt</span>
                                                </td>
                                                <td>
                                                    <ReactQuill style={{ marginBottom: '20px' }} theme="bubble" value={item.summary} />
                                                </td>
                                            </tr>
                                            <tr className='align-middle'>
                                                <td>
                                                    <span className='fw-bold text-danger' >Mô tả</span>
                                                </td>
                                                <td>
                                                    <ReactQuill style={{ marginBottom: '20px' }} theme="snow" value={item.description} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className='btn btn-warning mb-4' style={{ width: '20%' }}>Sửa</button>
                                </div>
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminCourseSingle