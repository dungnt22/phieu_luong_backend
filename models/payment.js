const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('./accounts');
require('./employees');


const payment = new schema({
    month: {
        type: String
    },
    ngay_cong: {
        type: Number
    },
    luong_dong_bhxh: {
        type: Number
    },
    thuong_theo_doanh_thu_hang_thang: {
        type: Number
    },
    ho_tro_tien_com_trua: {
        type: Number
    },
    ho_tro_dien_thoai: {
        type: Number
    },
    ho_tro_trang_phuc: {
        type: Number
    },
    thuong_le_tet: {
        type: Number
    },
    thuong_khac: {
        type: Number
    },
    cong_thu_nhap_luong: {
        type: Number
    },
    thu_nhap_chiu_thue: {
        type: Number
    },
    nguoi_phu_thuoc: {
        type: Number
    },
    so_tien_giam_tru_ban_than: {
        type: Number
    }, 
    so_tien_giam_tru_gia_canh: {
        type: Number
    },
    tien_dong_bao_hiem: {
        type: Number
    },
    thu_nhap_tinh_thue: {
        type: Number
    },
    thue_thu_nhap_ca_nhan: {
        type: Number
    }, 
    thu_nhap_tinh_thue: {
        type: Number
    },
    tong_cac_khoan_giam_tru: {
        type: Number
    },
    luong_net: {
        type: Number
    },
    luong_gross: {
        type: Number
    },
    sendDate: {
        type: Date,
        default: null
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    },
    employeeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    },
    status: {
        type: Number,
        min: 0,
        max: 3,
        default: 0
    }
});

var Payment = mongoose.model('payment', payment);

module.exports = Payment;