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


function AdminCourse() {

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

  // ==================== Edit course =============================
  const [course, setCourse] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDuration, setCourseDuration] = useState('')
  const [coursePrice, setCoursePrice] = useState('')
  const [courseDiscount, setCourseDiscount] = useState('')
  const [courseGrade, setCourseGrade] = useState('')
  const [courseSummary, setCourseSummary] = useState('')
  const [courseImg, setCourseImg] = useState('')

  // ==================== Create course =============================

  const [createCourseName, setCreateCourseName] = useState('')
  const [createCourseDuration, setCreateCourseDuration] = useState('')
  const [createCoursePrice, setCreateCoursePrice] = useState('')
  const [createCourseDiscount, setCreateCourseDiscount] = useState('')
  const [createCourseGrade, setCreateCourseGrade] = useState('')
  const [createCourseSummary, setCreateCourseSummary] = useState('')

  // ==================== Change view =============================
  const [view, setView] = useState(true);

  // ==================== Quill =============================
  // const [ReactQuillValue1, setReactQuillValue1] = useState([])

  // ==================== Drag & Drop =============================
  const fileTypes = ["JPG", "PNG", "GIF", "WEBP", "APNG", "AVIF", "SVG", 'jpg', 'png', 'gif', "WebP", 'webp', 'svg', 'apng', 'avif'];
  const [file, setFile] = useState(null);
  const [showImg, setShowImg] = useState(null);
  const uploadFile = (file) => {
    setFile(file);
    var url = URL.createObjectURL(file);
    setShowImg(url)
    // console.log(url);
    // console.log(file);
  };

  // ==================== Module =============================
  const [moduleList, setModuleList] = useState([{ moduleName: '', moduleDetail: '' }])
  // const [parseModule, setParseModule] = useState('');

  const runParse = (i) => {
    setModuleList(JSON.parse(i))
  }

  const addModule = () => {
    setModuleList([...moduleList, { moduleName: '', moduleDetail: '' }])
    // console.log(moduleList);
  }

  const addModulName = ((value, index) => {
    const MName = [...moduleList]
    MName[index].moduleName = value
    // console.log(MName);
  })

  const addModulDetail = ((value, index) => {
    const MDetail = [...moduleList]
    MDetail[index].moduleDetail = value
    // console.log(MDetail);
  })

  const deleteModule = (index) => {
    // console.log(index);
    const updateModuleList = [...moduleList]
    updateModuleList.splice(index, 1)
    setModuleList(updateModuleList)
    // console.log(updateModuleList);
  }


  const cate_id = useParams()
  // console.log(useParams());
  // console.log(cate_id.id);

  useEffect(() => {
    if (!localStorage.getItem('email') || localStorage.getItem('role') != 6) {
      window.location.replace('/')
    } else {
      fetch(`http://127.0.0.1:8000/api/course?cate_id=${cate_id.id}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setCourse(res);
        });
    }
  }, []);

  const changeView1 = (() => {
    setView(true)
  })

  const changeView2 = (() => {
    setView(false)
  })

  const createCourse = (() => {
    const description = JSON.stringify(moduleList)
    if (createCourseName == '' || createCoursePrice == '' || createCourseDiscount == '' ||
      createCourseDuration == '' || createCourseGrade == '' || createCourseSummary == '' ||
      description == '' || file == null) {
      Toast.fire({
        icon: 'error',
        title: 'Thiếu thông tin'
      })
    } else if (createCoursePrice < 0) {
      Toast.fire({
        icon: 'error',
        title: 'Giá nhỏ nhất = 0'
      })
    } else if (createCourseDiscount < 0) {
      Toast.fire({
        icon: 'error',
        title: 'Giảm giá ít nhất = 0'
      })
    } else if (createCourseDiscount > 100) {
      Toast.fire({
        icon: 'error',
        title: 'Giảm giá nhiều nhất = 100'
      })
    }
    else {
      const formData = new FormData()
      formData.append('file', file);
      formData.append('name', createCourseName);
      formData.append('price', createCoursePrice);
      formData.append('discount', createCourseDiscount);
      formData.append('duration', createCourseDuration);
      formData.append('grade', createCourseGrade);
      formData.append('summary', createCourseSummary);
      formData.append('description', description);
      formData.append('cate_id', cate_id.id);

      axios.post('http://127.0.0.1:8000/api/createCourse',
        formData,
        { headers: { 'content-Type': 'multipart/form-data' } })
        .then((res) => {
          // console.log(res);
          if (res.data.check == false) {
            // console.log(res);
            if (res.data.msg.name) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.name
              })
            } else if (res.data.msg.duration) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.duration
              })
            } else if (res.data.msg.price) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.price
              })
            } else if (res.data.msg.discount) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.discount
              })
            } else if (res.data.msg.grade) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.grade
              })
            } else if (res.data.msg.summary) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.summary
              })
            } else if (res.data.msg.description) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.description
              })
            } else if (res.data.msg.cate_id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.cate_id
              })
            } else if (res.data.msg) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg
              })
            }
          }
          else {
            // console.log(res.data);
            setCourse(res.data);
            Toast.fire({
              icon: 'success',
              title: 'Đã thêm lớp'
            })
          }
        })
    }

  })

  const editCourse = (() => {
    const description = JSON.stringify(moduleList)
    console.log(courseId, courseName, coursePrice, courseDiscount, courseDuration, courseGrade, courseSummary);
    console.log(file);
    console.log(description);
    if (courseId == '' || courseName == '' || coursePrice == '' || courseDiscount == '' ||
      courseDuration == '' || courseGrade == '' || courseSummary == '' ||
      description == '') {
      Toast.fire({
        icon: 'error',
        title: 'Thiếu thông tin'
      })
    } else if (coursePrice < 0) {
      Toast.fire({
        icon: 'error',
        title: 'Giá nhỏ nhất = 0'
      })
    } else if (courseDiscount < 0) {
      Toast.fire({
        icon: 'error',
        title: 'Giảm giá ít nhất = 0'
      })
    } else if (courseDiscount > 100) {
      Toast.fire({
        icon: 'error',
        title: 'Giảm giá nhiều nhất = 100'
      })
    }
    else {
      const formData = new FormData()
      formData.append('id', courseId)
      formData.append('file', file);
      formData.append('name', courseName);
      formData.append('price', coursePrice);
      formData.append('discount', courseDiscount);
      formData.append('duration', courseDuration);
      formData.append('grade', courseGrade);
      formData.append('summary', courseSummary);
      formData.append('description', description);
      formData.append('cate_id', cate_id.id);

      axios.post('http://127.0.0.1:8000/api/editCourse',
        formData,
        { headers: { 'content-Type': 'multipart/form-data' } })
        .then((res) => {
          // console.log(res);
          if (res.data.check == false) {
            console.log(res);
            if (res.data.msg.id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.id
              })
            } else if (res.data.msg.name) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.name
              })
            } else if (res.data.msg.duration) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.duration
              })
            } else if (res.data.msg.price) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.price
              })
            } else if (res.data.msg.discount) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.discount
              })
            } else if (res.data.msg.grade) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.grade
              })
            } else if (res.data.msg.summary) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.summary
              })
            } else if (res.data.msg.description) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.description
              })
            } else if (res.data.msg.cate_id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.cate_id
              })
            } else if (res.data.msg) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg
              })
            }
          }
          else {
            // console.log(res.data);
            setCourse(res.data);
            Toast.fire({
              icon: 'success',
              title: 'Sửa thành công'
            })
          }
        })
    }

  })

  const switchCourse = (id) => {
    // console.log(id);
    axios
      .post('http://127.0.0.1:8000/api/switchCourse', {
        id: id,
        cate_id: cate_id.id,
      })
      .then((res) => {
        // console.log(res.data);
        setCourse(res.data);
      });
  };

  const deleteCourse = (id) => {
    Swal.fire({
      title: "Bạn có muốn xóa không?",
      text: "Xóa xong mất luôn đó!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa luôn!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post('http://127.0.0.1:8000/api/deleteCourse', {
            id: id,
            cate_id: cate_id.id,
          })
          .then((res) => {
            // console.log(res.data);
            if (res.data.check == false) {
              if (res.data.msg.id) {
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg.id
                })
              }
              else if (res.data.msg) {
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg
                })
              }
            }
            else {
              // console.log(res.data);
              setCourse(res.data);
              Toast.fire({
                icon: "success",
                title: "Xóa thành công",
              });
            }
          });
      }
    });
  }

  const detail = (id) => {
    window.location.href = `/AdminCourseSingle/${id}`
  }

  return (
    <div>
      {/* ============================================= Modal Start ============================================================ */}
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><h3 style={{ fontWeight: 'bold', marginLeft: '12px' }}>Sửa lớp</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container mt-1">
            <div className="row mb-3">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Tên</h5>
                <input className='form-control' type="text" defaultValue={courseName} onChange={(e) => setCourseName(e.target.value)} />
              </div>
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Thời lượng</h5>
                <input className='form-control' type="text" defaultValue={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Giá</h5>
                <input className='form-control' type="number" defaultValue={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} />
              </div>
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Giảm giá</h5>
                <input className='form-control' type="number" defaultValue={courseDiscount} onChange={(e) => setCourseDiscount(e.target.value)} />
              </div>
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Khối lớp</h5>
                <select className='form-select' name="" id="" defaultValue={courseGrade} onChange={(e) => setCourseGrade(e.target.value)}>
                  <option value="Lớp 1">Lớp 1</option>
                  <option value="Lớp 2">Lớp 2</option>
                  <option value="Lớp 3">Lớp 3</option>
                  <option value="Lớp 4">Lớp 4</option>
                  <option value="Lớp 5">Lớp 5</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Ảnh</h5>
                <FileUploader multiple={false} handleChange={uploadFile} defaultValue='' name="file" types={fileTypes} />
                {showImg ?
                  <img src={showImg} style={{ height: '120px' }} alt="" />
                  :
                  <img src={"http://127.0.0.1:8000/images/" + courseImg} style={{ height: '120px' }} alt="" />
                }
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Tóm tắt</h5>
                <input type='text' className='form-control' defaultValue={courseSummary} onChange={(e) => setCourseSummary(e.target.value)} />
              </div>
            </div>
            <div className="row">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Module</h5>
                {moduleList && moduleList != '' && moduleList.map((item, index) =>
                  <div key={index} className='mb-3'>
                    <h6>Tên</h6>
                    <ReactQuill style={{ marginBottom: '20px' }} theme="snow" value={item.moduleName} onChange={(value) => addModulName(value, index)} />
                    <h6>Nội dung</h6>
                    <ReactQuill style={{ marginBottom: '20px' }} theme="snow" value={item.moduleDetail} onChange={(value) => addModulDetail(value, index)} />
                    <button className='btn btn-danger mb-3' onClick={() => deleteModule(index)}>Xóa Module</button>
                  </div>
                )}
                <button className='btn btn-success' onClick={addModule}>Thêm Module</button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => [editCourse()]}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ============================================= Modal Ende ============================================================ */}
      <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
      <div className='d-flex' style={{ backgroundColor: 'rgb(240,247,255)' }}>
        <SideBar></SideBar>
        {view == true &&
          <div className='container mt-4' >
            <button className='btn btn-success mb-3' onClick={() => changeView2()}>Thêm lớp</button>
            <h3 style={{ fontWeight: 'bold' }}>Lớp</h3>
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered table-light align-middle" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <thead >
                  <tr className='align-middle'>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Lớp</th>
                    <th>Trạng thái</th>
                    <th>Sửa</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {course && course.map((item, index) =>
                    < tr key={index}>
                      <td align="center">
                        <img src={"http://127.0.0.1:8000/images/" + (item.image)} style={{ height: '120px' }} alt="" />
                      </td>
                      <td>
                        <span className='pointer fw-bold' onClick={() => detail(item.id)}>{item.name}</span>
                      </td>
                      <td>
                        <span className='pointer fw-bold' >{item.grade}</span>
                      </td>
                      {item.status == 1 ?
                        <td><span className='text-success pointer fw-bold ' onClick={() => switchCourse(item.id)}>Mở</span></td>
                        :
                        <td><span className='text-danger pointer fw-bold' onClick={() => switchCourse(item.id)}>Khóa</span></td>
                      }
                      <td>
                        <button className='btn btn-warning w-100' onClick={() => [setCourseId(item.id), setCourseName(item.name), setCourseId(item.id), setCourseDuration(item.duration),
                        setCoursePrice(item.price), setCourseDiscount(item.discount), setCourseGrade(item.grade), setCourseSummary(item.summary),
                        setCourseImg(item.image), runParse(item.description), handleShow()]}>Sửa</button>
                      </td>
                      <td>
                        <button className='btn btn-danger w-100' onClick={() => deleteCourse(item.id)}>Xóa</button>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                </tfoot>
              </table>
            </div>
          </div>
        }
        {view == false &&
          <div className="container mt-4">
            <button className='btn btn-warning mb-3' onClick={() => changeView1()}>Hủy</button>
            <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Thêm lớp</h3>
            <div className="row mb-3">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Tên</h5>
                <input className='form-control' type="text" onChange={(e) => setCreateCourseName(e.target.value)} />
              </div>
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Thời lượng</h5>
                <input className='form-control' type="text" onChange={(e) => setCreateCourseDuration(e.target.value)} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Giá</h5>
                <input className='form-control' type="number" onChange={(e) => setCreateCoursePrice(e.target.value)} />
              </div>
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Giảm giá</h5>
                <input className='form-control' type="number" onChange={(e) => setCreateCourseDiscount(e.target.value)} />
              </div>
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Khối lớp</h5>
                <select className='form-select' name="" id="" defaultValue={'Lớp 1'} onChange={(e) => setCreateCourseGrade(e.target.value)}>
                  <option value="Lớp 1">Lớp 1</option>
                  <option value="Lớp 2">Lớp 2</option>
                  <option value="Lớp 3">Lớp 3</option>
                  <option value="Lớp 4">Lớp 4</option>
                  <option value="Lớp 5">Lớp 5</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Ảnh</h5>
                <FileUploader multiple={false} handleChange={uploadFile} name="file" types={fileTypes} />
                {showImg &&
                  <img src={showImg} style={{ height: '120px' }} alt="" />
                }
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Tóm tắt</h5>
                <input type='text' className='form-control' onChange={(e) => setCreateCourseSummary(e.target.value)} />
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-md">
                <h5 style={{ color: 'red' }}>Module</h5>
                {moduleList.map((item, index) => (
                  <div key={index} className='mb-3'>
                    <h6>Tên</h6>
                    <ReactQuill style={{ marginBottom: '20px' }} theme="snow" value={item.moduleName} onChange={(value) => addModulName(value, index)} />
                    <h6>Nội dung</h6>
                    <ReactQuill style={{ marginBottom: '20px' }} theme="snow" value={item.moduleDetail} onChange={(value) => addModulDetail(value, index)} />
                    <button className='btn btn-danger mb-3' onClick={() => deleteModule(index)}>Xóa Module</button>
                  </div>
                ))}
                <button className='btn btn-success' onClick={addModule}>Thêm Module</button>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-md">
                <button className='btn btn-success w-100' onClick={createCourse}>Thêm Lớp</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default AdminCourse