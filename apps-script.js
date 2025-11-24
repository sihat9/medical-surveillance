// Google Apps Script untuk backend
// Simpan code ini dalam script.google.com

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE';

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index');
}

function loginUser(clinicName, password, role) {
  // Simple authentication - boleh enhance later
  const validClinics = {
    'klinik_abc': 'password123',
    'klinik_xyz': 'password456'
  };
  
  if (validClinics[clinicName] === password) {
    return { success: true, role: role };
  } else {
    return { success: false, error: 'Maklumat login tidak tepat' };
  }
}

function saveUSECHHData(formData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('USECHH_Data');
    const timestamp = new Date();
    
    const rowData = [
      timestamp,
      formData.nama,
      formData.ic,
      formData.jawatan,
      formData.syarikat,
      formData.jawapan1,
      formData.jawapan2,
      // Tambah lebih fields mengikut keperluan
      'DRAFT'
    ];
    
    sheet.appendRow(rowData);
    return { success: true, message: 'Data berjaya disimpan' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function saveSignature(workerId, signatureData) {
  try {
    // Convert base64 to image file
    const signatureBlob = Utilities.newBlob(Utilities.base64Decode(signatureData.split(',')[1]), 'image/png', `signature_${workerId}.png`);
    
    // Save to Drive
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const file = folder.createFile(signatureBlob);
    
    // Update Sheets dengan link signature
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('USECHH_Data');
    const dataRange = sheet.getDataRange();
    const data = dataRange.getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === workerId) { // IC column
        sheet.getRange(i + 1, 10).setValue(file.getUrl()); // Signature URL column
        break;
      }
    }
    
    return { success: true, fileUrl: file.getUrl() };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
