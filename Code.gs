function doPost(e) {
  var file = SpreadsheetApp.openById("1vI9g773LFQSOxjOm4m51yCHlDkwoZXiX6Vi-waXi2Jo"); // ini ID sheet
  var sheet = file.getSheetByName("Sheet2"); // ini nama sheet

  var req = JSON.stringify(e).replace(/\\/g,"").replace("}\"","}").replace("\"{","{"); // jangan dirubah
  var reqJson = JSON.parse(req);// jangan dirubah
  var senderMessage = JSON.stringify(reqJson["postData"]["contents"]["senderMessage"]);// jangan dirubah
  var senderName = JSON.stringify(reqJson["postData"]["contents"]["senderName"]);// jangan dirubah

  var parsedMessage = senderMessage
                      .replace("Laporan permohonan tokenn","1#") // merubah text yang tidak diperlukan
                      .replace("nTanggal:","#") // merubah text yang tidak diperlukan
                      .replace("nPetugas:","#")
                      .replace("nNomor meter:","#") 
                      .replace("nKeterangan:","#")// merubah text yang tidak diperlukan
                      .split("#"); // string pemisah pesan
  var jumlah_pesan = parsedMessage.length; // menghitung jumlah pesan
  Logger.log(jumlah_pesan);
  var ulp = parsedMessage[1].trim(); // mengambil data isi pesan pertama
  var tanggal = parsedMessage[2].trim(); // mengambil data isi pesan pertama
  var pic = parsedMessage[3].trim(); // mengambil data isi pesan kedua
  var nomormeter = parsedMessage[4].trim();
  var keterangan = parsedMessage[5].trim().replace('"','');
  
  var pelapor = senderName.replace('"','').replace('"',''); // mengambil data pelapor

  if (jumlah_pesan == 6){ // validasi jumlah isi pesan
    sheet.insertRowAfter(1); //insert 1 baris disesuaikan dengan posisi header
    sheet.getRange(2,1).setValue(Utilities.formatDate(new Date(), "GMT+7:00", "dd-MMM-yyyy' 'HH:mm")); //memasukkan data tanggal pesan (optional)
    sheet.getRange(2,2).setValue(ulp);// memasukkan data tanggal laporan ke kolom kedua
    sheet.getRange(2,3).setValue(tanggal);// memasukkan data isi laporan ke kolom ketiga
    sheet.getRange(2,4).setValue(pic);// memasukkan data pelapor ke kolom ke empat
    sheet.getRange(2,5).setValue(nomormeter);// memasukkan data pelapor ke kolom ke lima
    sheet.getRange(2,6).setValue(keterangan);// memasukkan data pelapor ke kolom ke enam

    var response = { // membuat balasan pesan WA
      data: [
        {
          message: "Terima kasih " + pic + ". Laporan sudah diterima."
        }
      ]
    };
    return ContentService.createTextOutput(JSON.stringify(response));
  } else {
    var response = { // membuat balasan pesan WA jika format salah
      data: [
        {
          message: "Mohon maaf, " + pic + ". Laporan tidak terekap. \n" +
          "Mohon sesuaikan dengan format laporan yang sudah ada. Terima kasih."
        }
      ]
    };
    return ContentService.createTextOutput(JSON.stringify(response));
  }
  // return ContentService.createTextOutput(JSON.stringify(response)); // mengirimkan isi pesan balasan ke Auto Replay Chat bot
}
