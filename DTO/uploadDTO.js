class UploadDTO {
    employeeCode;
    name;
    currentLevel;
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
    email;
    emailContent;
    month;

    constructor(row) {
        this.month = row.getCell(2).value;
        this.employeeCode = row.getCell(3).value;
        this.name = row.getCell(4).value;
        this.currentLevel = row.getCell(5).value;
        this.ngay_cong = row.getCell(6).value
        this.luong_dong_bhxh = row.getCell(7).value;
        this.thuong_theo_doanh_thu_hang_thang = row.getCell(8).value;
        this.ho_tro_tien_com_trua = row.getCell(9).value;
        this.ho_tro_dien_thoai = row.getCell(10).value;
        this.ho_tro_trang_phuc = row.getCell(11).value;
        this.thuong_le_tet = row.getCell(12).value;
        this.thuong_khac = row.getCell(13).value;
        this.cong_thu_nhap_luong = row.getCell(14).value.result ? row.getCell(14).value.result : row.getCell(14).value;
        this.thu_nhap_chiu_thue = row.getCell(15).value ? (row.getCell(15).value.result ? row.getCell(15).value.result : row.getCell(15).value) : null;
        this.nguoi_phu_thuoc = row.getCell(16).value;
        this.so_tien_giam_tru_ban_than = row.getCell(17).value;
        this.so_tien_giam_tru_gia_canh = row.getCell(18).value;
        this.tien_dong_bao_hiem = row.getCell(19).value ? (row.getCell(19).value.result ? row.getCell(19).value.result : row.getCell(19).value) : null;
        this.thu_nhap_tinh_thue = row.getCell(20).value ? (row.getCell(20).value.result ? row.getCell(20).value.result : 0) : null;
        this.thue_thu_nhap_ca_nhan = row.getCell(21).value ? (row.getCell(21).value.result ? row.getCell(21).value.result : 0) : null;
        this.tong_cac_khoan_giam_tru = row.getCell(22).value ? (row.getCell(22).value.result ? row.getCell(22).value.result : row.getCell(22).value) : null
        this.luong_net = row.getCell(23).value ? (row.getCell(23).value.result ? row.getCell(23).value.result : row.getCell(23).value) : this.cong_thu_nhap_luong;
        this.luong_gross = row.getCell(24).value ? (row.getCell(24).value.result ? row.getCell(24).value.result : row.getCell(24).value) : row.getCell(24).value;
        this.email = row.getCell(25).value ? (row.getCell(25).value.text ? row.getCell(25).value.text : row.getCell(25).value) : row.getCell(25).value;
        this.emailContent = row.getCell(26).value;
    }
}

module.exports.UploadDTO = UploadDTO;