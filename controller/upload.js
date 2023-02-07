var multer = require('multer');
var fs = require('fs');
var Excel = require('exceljs');
var convertToPdf = require('../convertToPdf');
var { UploadDTO } = require('../DTO/uploadDTO');
var V = require('max-validator');
var randomstring = require('randomstring');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/data');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (!(/\.xlsx$/).test(file.originalname)) {
        return cb(new Error('Định dạng file không chính xác. Chỉ upload file .xlsx'), false);
    }
    cb(null, true);
}

const uploadFile = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('fileInput');

var validationSchema = {
    employeeCode: 'alpha_numeric|nullable',
    name: 'required|string',
    currentLevel: 'required|string',
    ngay_cong: 'nullable',
    luong_dong_bhxh: 'required',
    thuong_theo_doanh_thu_hang_thang: 'nullable',
    ho_tro_tien_com_trua: 'nullable',
    ho_tro_dien_thoai: 'nullable',
    ho_tro_trang_phuc: 'nullable',
    thuong_le_tet: 'nullable',
    thuong_khac: 'nullable',
    cong_thu_nhap_luong: 'required',
    thu_nhap_chiu_thue: 'nullable',
    nguoi_phu_thuoc: 'nullable',
    so_tien_giam_tru_ban_than: 'nullable',
    so_tien_giam_tru_gia_canh: 'nullable',
    tien_dong_bao_hiem: 'nullable',
    thu_nhap_tinh_thue: 'nullable',
    thue_thu_nhap_ca_nhan: 'nullable',
    tong_cac_khoan_giam_tru: 'nullable',
    luong_net: 'nullable',
    luong_gross: 'required',
    email: 'required|email',
    month: 'required|string',
}

exports.uploadFile = function(req, res, next) {
    let dataOutput = [];
    let errorsOutput = []; 

    uploadFile(req, res, async (err) => {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({
                message: err.message,
                error: err.message,
                data: null
            });
        }
        if (!req.file) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({
                message: 'Upload file không thành công',
                error: null,
                data: null
            });
        }
        const workbook = new Excel.Workbook();
        try {
            const content = await workbook.xlsx.readFile(req.file.path);
            content.eachSheet((ws, sheetId) => {
                const rows = ws.getRows(10, ws.rowCount - 10 + 1) ?? [];
                rows.map((row) => {
                    // console.log(row.getCell(25));
                    console.log(row.getCell(25).value);
                    if (row.getCell(4).value === null) return;
                    const item = new UploadDTO(row);
                    const filePass = randomstring.generate({
                        length: 10,
                        charset: 'alphabetic'
                    })
                    item.filePass = filePass;

                    var result = V.validate(item, validationSchema);
                    if (result.hasError) {
                        errorsOutput.push(result.errors);
                    } else {
                        dataOutput.push(item)
                    }
                })
            })

            if (errorsOutput.length > 0) {
                fs.rm(req.file.path, {
                    force: true,
                    maxRetries: 2,
                    retryDelay: 500
                }, (err) => {
                    if (err) throw err
                });
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({
                    message: 'Upload file không thành công. Trường dữ liệu không hợp lệ.',
                    error: errorsOutput,
                    data: null
                });
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({
                    message: 'OK', 
                    error: null,
                    data: dataOutput
                });
            }
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({
                message: error.message,
                error: error.message,
                data: null
            })
        }
    })
};

exports.preview = async function(req, res, next) {
    const { employee } = req.body;
    await convertToPdf.convertAsync(employee);
    fs.readFile('public/pdfs/' + employee.name + '.pdf', (err, data) => {
        if (err) {
            next(err)
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/pdf');
            res.send(data);
        }
    })
};