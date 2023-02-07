var Excel = require('exceljs');
var hummusRecipe = require('hummus-recipe');
const { Workbook, PdfSaveOptions } = require('aspose.cells');

exports.convertAsync = async function(data) {
    try {
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile('public/template/mau_phieu_luong_3.xlsx')
        await workbook.xlsx.writeFile('public/template/' + data.name + '.xlsx')
        await workbook.xlsx.readFile('public/template/' + data.name + '.xlsx')

        let worksheet = workbook.getWorksheet('Sheet1');

        // console.log(typeof data.month);
        // let month = data.month.toUpperCase();
        let title = 'phiếu lương ' + data.month;
        console.log(typeof title);
        worksheet.getRow(1).getCell(4).value = title.toUpperCase();
        worksheet.getRow(2).getCell(5).value = data.name;
        worksheet.getRow(2).getCell(8).value = data.currentLevel;
        worksheet.getRow(31).getCell(1).value = data.name;

        let colB = worksheet.getColumn('B');
        let colI = worksheet.getColumn('I');
        let colJ = worksheet.getColumn('J');

        let bao_hiem_y_te = data.luong_dong_bhxh * 0.015;
        let bao_hiem_xa_hoi = data.luong_dong_bhxh * 0.08;
        let bao_hiem_thu_nhap = data.luong_dong_bhxh * 0.01;
        let tro_cap = data.ho_tro_tien_com_trua + data.ho_tro_dien_thoai + data.ho_tro_trang_phuc;
        // let tong_thu_nhap = data.luong_dong_bhxh + data.thuong_le_tet + tro_cap + data.thuong_theo_doanh_thu_hang_thang + data.thuong_khac;
        let luong_toi_thieu_vung = 4680000;
        let thu_nhap_tinh_thue_NET = 0;
        let tong_chi_phi_luong = data.luong_gross + data.luong_dong_bhxh * 0.2;

        colB.values = [,,,,, data.cong_thu_nhap_luong, data.luong_dong_bhxh, data.thuong_le_tet, tro_cap, data.thuong_theo_doanh_thu_hang_thang, data.thuong_khac,,, data.luong_dong_bhxh, data.luong_dong_bhxh];
        colJ.values = [,,,,data.nguoi_phu_thuoc,data.so_tien_giam_tru_ban_than,data.so_tien_giam_tru_gia_canh,,,,,,,, luong_toi_thieu_vung];
        colI.values = [,,,,,,,,,,,,,,,,,,,, data.cong_thu_nhap_luong, bao_hiem_xa_hoi, bao_hiem_y_te, bao_hiem_thu_nhap, thu_nhap_tinh_thue_NET,
            data.so_tien_giam_tru_ban_than, data.so_tien_giam_tru_gia_canh, data.thu_nhap_tinh_thue,
            data.thue_thu_nhap_ca_nhan, tro_cap,,
            data.luong_gross, data.luong_gross, tong_chi_phi_luong];

        await workbook.xlsx.writeFile('public/template/' + data.name + '.xlsx')
                
        console.log("Save to excel file successfully");

        const wb = Workbook('public/template/' + data.name + '.xlsx');
        const pdfOptions = PdfSaveOptions()
        pdfOptions.setOnePagePerSheet(true);
        
        await wb.save('public/pdfs/' + data.name + '.pdf', pdfOptions);
            
        const fileOutput = 'public/pdfs/' + data.name + '_Encrypt.pdf';
        const pdfDoc = new hummusRecipe('public/pdfs/' + data.name + '.pdf', fileOutput);
        pdfDoc.encrypt({
            userPassword: data.filePass,
            ownerPassword: data.filePass
        }).endPDF();
    } catch (error) {
        console.log(error)
    }
           
};