import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Navbar from "../components/Navbar"
import axios from "axios";
import '../components/css/style.css'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



function AdminEdu() {

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

  const [edu, setEdu] = useState([])
  const [newEdu, setNewEdu] = useState('')
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [eduName, setEduName] = useState('');
  const [newEduName, setNewEduName] = useState('');
  const [eduId, setEduId] = useState('');

  console.log(eduName, eduId);

  useEffect(() => {
    if (!localStorage.getItem('email') || localStorage.getItem('role') != 6) {
      window.location.replace('/')
    } else {
      fetch("https://duyanh.codingfs.com/api/education")
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setEdu(res)
        })
    }
  }, [])

  const addEdu = (() => {
    if (newEdu == '') {
      Toast.fire({
        icon: 'error',
        title: 'Điền tên khóa học'
      })
    }
    else {
      axios.post('https://duyanh.codingfs.com/api/createEducation', {
        name: newEdu,
      })
        .then((res) => {
          if (res.data.check == false) {
            if (res.data.msg.name) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.name
              })
            }
          }
          else {
            // console.log(res.data);
            setEdu(res.data);
            Toast.fire({
              icon: 'success',
              title: 'Thêm khóa học'
            })
            setNewEdu('')
          }
        })
    }

  })

  const editEdu = (() => {
    if (eduId == '') {
      Toast.fire({
        icon: 'error',
        title: 'Thiếu ID khóa học'
      })
    }
    else if (newEduName == '') {
      Toast.fire({
        icon: 'error',
        title: 'Điền tên khóa học'
      })
    }
    else if (newEduName == eduName) {
      Toast.fire({
        icon: 'warning',
        title: 'Tên vẫn thế'
      })
    }
    else {
      axios.post('https://duyanh.codingfs.com/api/editEducation', {
        id: eduId,
        name: newEduName,
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
            setEdu(res.data);
            Toast.fire({
              icon: 'success',
              title: 'Sửa thành công'
            })
            setEduId('')
            setNewEduName('')
            setEduName('')
            handleClose()
          }
        })
    }

  })

  const switchEdu = (id) => {
    // console.log(id);
    axios
      .post('https://duyanh.codingfs.com/api/switchEducation', {
        id: id,
      })
      .then((res) => {
        // console.log(res.data);
        setEdu(res.data);
      });
  };

  const deleteEdu = (id) => {
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
          .post('https://duyanh.codingfs.com/api/deleteEducation', {
            id: id,
          })
          .then((res) => {
            console.log(res.data);
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
              setEdu(res.data);
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
    window.location.href = `/AdminCategory/${id}`
  }

  return (
    <div>
      {/* ============================================= Modal Start ============================================================ */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa khóa học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Tên khóa học</label>
            <input type="text"
              className="form-control" defaultValue={eduName} data-id={eduId} onChange={(e) => setNewEduName(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => [editEdu()]}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ============================================= Modal Ende ============================================================ */}

      <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
      <div className="d-flex" style={{ backgroundColor: "rgb(240,247,255)" }}>
        <SideBar></SideBar>
        <div className="container mt-4">
          <h3 style={{ fontWeight: 'bold' }}>Khóa học</h3>
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
                {edu && edu != null && edu.map((item, index) =>
                  < tr key={index}>
                    <td>
                      <span className='pointer fw-bold' onClick={() => detail(item.id)}>{item.name}</span>
                    </td>
                    {item.status == 1 ?
                      <td><span className='text-success pointer fw-bold ' onClick={() => switchEdu(item.id)}>Mở</span></td>
                      :
                      <td><span className='text-danger pointer fw-bold' onClick={() => switchEdu(item.id)}>Khóa</span></td>
                    }
                    <td>
                      <button className='btn btn-warning w-100' onClick={() => [setEduName(item.name), setNewEduName(item.name), setEduId(item.id), handleShow()]}>Sửa</button>
                    </td>
                    <td>
                      <button className='btn btn-danger w-100' onClick={() => deleteEdu(item.id)}>Xóa</button>
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2}><input className='form-control' type="text" placeholder='Thêm khóa học' onChange={(e) => setNewEdu(e.target.value)} value={newEdu} /></td>
                  <td colSpan={2}><button className='btn btn-success w-100' onClick={() => addEdu()}>Thêm</button></td>
                </tr>
              </tbody>
              <tfoot>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEdu;
