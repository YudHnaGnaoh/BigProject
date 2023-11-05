import React from 'react'
import './css/Footer.css'

function Footer() {
    return (
        <div className='mt-4'>
            <div style={{ backgroundColor: 'rgb(240,247,255)', height: '150px', borderRadius: '100% 100% 0 0' }}></div>
            <div style={{ fontSize: '16px', backgroundColor: 'rgb(240,247,255)', height: '650px', position: 'relative', display: 'flex' }}>
                <div className='container mx-auto' style={{ position: 'absolute', top: '-70px', maxWidth:'1400px' }}>
                    <div className="row gx-0">
                        <div className="col-md mx-3">
                            <img className='my-2' src="https://marathon.edu.vn/images/logo-3.png" alt="" style={{ height: '45px' }} />
                            <p className='my-2'>
                                Khi có thắc mắc hoặc khiếu nại
                                về chất lượng dịch vụ, vui lòng liên hệ:
                                <span className='my-3 d-block' ><b>Hotline:</b> (028) 7300 3033</span>
                                <span className='my-3 d-block' ><b>Email:</b> learnwithus@marathon.edu.vn</span>
                                Công ty TNHH Marathon Education
                                Giấy CNĐKDN số: 0316952502,
                                ngày cấp 18/8/2021 bởi Sở Kế hoạch
                                và Đầu tư Thành Phố Hồ Chí Minh
                            </p>
                            <img className='my-2' src="https://marathon.edu.vn/images/sale-noti-logo.png" alt="" style={{ height: '45px' }} />
                            <br />
                            <img className='my-2' src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=1cd831b8-4938-46f0-bebb-20ef1f180bdb" alt="" />
                        </div>
                        <div className="col-md mx-3">
                            <h5 className='mb-4 d-block fw-bold'>Về Website</h5>
                            <a className='mb-2 d-block' href="#">Giới thiệu</a>
                            <a className='mb-2 d-block' href="#">Phòng truyền thống</a>
                            <a className='mb-2 d-block' href="#">Học sinh tiêu biểu</a>
                            <a className='mb-2 d-block' href="#">Bản tin Marathon</a>
                            <a className='mb-2 d-block' href="#">Tài liệu học tập</a>
                            <a className='mb-2 d-block' href="#">Liên hệ</a>
                            <a className='mb-2 d-block' href="#">Tuyển dụng</a>
                            <a className='mb-2 d-block' href="#">Đăng ký CTV</a>
                        </div>
                        <div className="col-md mx-3">
                            <h5 className='mb-4 d-block fw-bold'>Chính Sách & Hỗ Trợ</h5>
                            <a className='mb-2 d-block' href="#">Quy chế hoạt động</a>
                            <a className='mb-2 d-block' href="#">Chính sách & quy định chung</a>
                            <a className='mb-2 d-block' href="#">Chính sách bảo mật</a>
                            <a className='mb-2 d-block' href="#">Điều khoản sử dụng</a>
                            <a className='mb-2 d-block' href="#">Giải đáp thắc mắcp</a>
                        </div>
                        <div className="col-md mx-3">
                            <h5 className='mb-4 d-block fw-bold'>Chương Trình Học Tiêu Biểu</h5>
                            <a className='mb-2 d-block' href="#">Gia sư trực tuyến</a>
                            <a className='mb-2 d-block' href="#">Học toán online lớp 9</a>
                            <a className='mb-2 d-block' href="#">Học toán online lớp 8</a>
                            <a className='mb-2 d-block' href="#">Học toán online lớp 7</a>
                            <a className='mb-2 d-block' href="#">Học toán online lớp 6</a>
                            <a className='mb-2 d-block' href="#">Học online lớp 6</a>
                            <a className='mb-2 d-block' href="#">Học online lớp 7</a>
                            <a className='mb-2 d-block' href="#">Học online lớp 8</a>
                        </div>
                    </div>
                    <div className="row mt-3" >
                        <div className="col mx-3">
                            <hr />
                            <div><b>Văn phòng đại diện:</b> Tầng 9, Tòa nhà Lim Tower 3, 29A Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh</div><br />
                            <div><b>Trụ sở chính HCM:</b> Tầng 1 - 3, Tòa nhà Yoko Building, 677/6 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh</div><br />
                            <div><b>Trụ sở chính HN:</b> Tầng 5, Tòa nhà Vinapaco, 142 Phố Đội Cấn, Phường Đội Cấn, Quận Ba Đình, Hà Nội</div>
                            <hr />
                            <div>© 2023 Marathon Education. Đã Đăng Ký Bản Quyền</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer