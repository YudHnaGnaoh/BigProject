import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Navbar from "../components/Navbar"
import axios from "axios";
import '../components/css/style.css'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';


function AdminCate() {

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

  const [cate, setCate] = useState([])
  const [newCate, setNewCate] = useState('')
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [cateName, setCateName] = useState('');
  const [newCateName, setNewCateName] = useState('');
  const [cateId, setCateId] = useState('');

  // console.log(cateName,cateId);

  const education_id = useParams()
  // console.log(useParams());
  // console.log(education_id.id);

  useEffect(() => {
    if (!localStorage.getItem('email') || localStorage.getItem('role') != 6) {
      window.location.replace('/')
    } else {
      fetch(`http://127.0.0.1:8000/api/category?education_id=${education_id.id}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setCate(res);
        });
    }
  }, []);

  const addCate = (() => {
    if (newCate == '') {
      Toast.fire({
        icon: 'error',
        title: 'Điền tên chương trình'
      })
    }
    else {
      axios.post('http://127.0.0.1:8000/api/createCategory', {
        name: newCate,
        education_id: education_id.id,
      })
        .then((res) => {
          if (res.data.check == false) {
            if (res.data.msg.name) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.name
              })
            } else if (res.data.msg.education_id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.education_id
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
            setCate(res.data);
            Toast.fire({
              icon: 'success',
              title: 'Thêm chương trình'
            })
          }
        })
    }

  })

  const editCate = (() => {
    if (cateId == '') {
      Toast.fire({
        icon: 'error',
        title: 'Thiếu ID chương trình'
      })
    }
    else if (newCateName == '') {
      Toast.fire({
        icon: 'error',
        title: 'Điền tên chương trình'
      })
    }
    else if (newCateName == cateName) {
      Toast.fire({
        icon: 'warning',
        title: 'Tên vẫn thế'
      })
    }
    else {
      axios.post('http://127.0.0.1:8000/api/editCategory', {
        id: cateId,
        name: newCateName,
        education_id: education_id.id,
      })
        .then((res) => {
          if (res.data.check == false) {
            if (res.data.msg.name) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.name
              })
            }
            else if (res.data.msg.id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.id
              })
            }
          }
          else {
            // console.log(res.data);
            setCate(res.data);
            Toast.fire({
              icon: 'success',
              title: 'Sửa thành công'
            })
            setCateId('')
            setNewCateName('')
            setCateName('')
            handleClose()
          }
        })
    }

  })

  const switchCate = (id) => {
    // console.log(id);
    axios
      .post('http://127.0.0.1:8000/api/switchCategory', {
        id: id,
        education_id: education_id.id,
      })
      .then((res) => {
        // console.log(res.data);
        setCate(res.data);
      });
  };

  const deleteCate = (id) => {
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
          .post('http://127.0.0.1:8000/api/deleteCategory', {
            id: id,
            education_id: education_id.id,
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
              setCate(res.data);
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
    window.location.href = `/AdminCourse/${id}`
  }

  return (
    <div>
      {/* ============================================= Modal Start ============================================================ */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa chương trình</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Tên chương trình</label>
            <input type="text"
              className="form-control" defaultValue={cateName} data-id={cateId} onChange={(e) => setNewCateName(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => [editCate()]}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ============================================= Modal Ende ============================================================ */}

      <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
      <div className='d-flex' style={{ backgroundColor: 'rgb(240,247,255)' }}>
        <SideBar></SideBar>
        <div className='container mt-4' >
          <h3 style={{ fontWeight: 'bold' }}>Chương trình</h3>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-light align-middle" style={{ borderRadius: '10px', overflow: 'hidden' }}>
              <thead >
                <tr className='align-middle'>
                  <th>Tên</th>
                  <th>Trạng thái</th>
                  <th>Chi tiết</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {cate && cate.map((item, index) =>
                  < tr key={index}>
                    <td>
                      <span className='pointer fw-bold' onClick={() => detail(item.id)}>{item.name}</span>
                    </td>
                    {item.status == 1 ?
                      <td><span className='text-success pointer fw-bold ' onClick={() => switchCate(item.id)}>Mở</span></td>
                      :
                      <td><span className='text-danger pointer fw-bold' onClick={() => switchCate(item.id)}>Khóa</span></td>
                    }
                    <td>
                      <button className='btn btn-warning w-100' onClick={() => [setCateName(item.name), setNewCateName(item.name), setCateId(item.id), handleShow()]}>Sửa</button>
                    </td>
                    <td>
                      <button className='btn btn-danger w-100' onClick={() => deleteCate(item.id)}>Xóa</button>
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2}><input className='form-control' type="text" placeholder='Thêm chương trình' onChange={(e) => setNewCate(e.target.value)} /></td>
                  <td colSpan={2}><button className='btn btn-success w-100' onClick={() => addCate()}>Thêm</button></td>
                </tr>
              </tbody>
              <tfoot>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCate