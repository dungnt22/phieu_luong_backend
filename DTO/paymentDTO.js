class PaymentDTO {
    month;
    ngay_cong;
    luong_dong_bhxh;
    thuong_theo_doanh_thu_hang_thang;
    ho_tro_tien_com_trua;
    ho_tro_dien_thoai;
    ho_tro_trang_phuc;
    thuong_le_tet;
    thuong_khac;
    cong_thu_nhap_luong;
    thu_nhap_chiu_thue;
    nguoi_phu_thuoc;
    so_tien_giam_tru_ban_than;
    so_tien_giam_tru_gia_canh;
    tien_dong_bao_hiem;
    thu_nhap_tinh_thue;
    thue_thu_nhap_ca_nhan;
    tong_cac_khoan_giam_tru;
    luong_net;
    luong_gross;
    status;

    constructor(data) {
        this.month = data.month;
        this.ngay_cong = data.ngay_cong;
        this.luong_dong_bhxh = data.luong_dong_bhxh;
        this.thuong_theo_doanh_thu_hang_thang = data.thuong_theo_doanh_thu_hang_thang;
        this.ho_tro_tien_com_trua = data.ho_tro_tien_com_trua;
        this.ho_tro_dien_thoai = data.ho_tro_dien_thoai;
        this.ho_tro_trang_phuc = data.ho_tro_trang_phuc;
        this.thuong_le_tet = data.thuong_le_tet;
        this.thuong_khac = data.thuong_khac;
        this.cong_thu_nhap_luong = data.cong_thu_nhap_luong;
        this.thu_nhap_chiu_thue = data.thu_nhap_chiu_thue;
        this.nguoi_phu_thuoc = data.nguoi_phu_thuoc;
        this.so_tien_giam_tru_ban_than = data.so_tien_giam_tru_ban_than;
        this.so_tien_giam_tru_gia_canh = data.so_tien_giam_tru_gia_canh;
        this.tien_dong_bao_hiem = data.tien_dong_bao_hiem;
        this.thu_nhap_tinh_thue = data.thu_nhap_tinh_thue;
        this.thue_thu_nhap_ca_nhan = data.thue_thu_nhap_ca_nhan;
        this.tong_cac_khoan_giam_tru = data.tong_cac_khoan_giam_tru;
        this.luong_net = data.luong_net;
        this.luong_gross = data.luong_gross;
        this.status = data.status;
    }
}

module.exports.PaymentDTO = PaymentDTO;
