function doPost(e) {
  var file = SpreadsheetApp.openById("1vI9g773LFQSOxjOm4m51yCHlDkwoZXiX6Vi-waXi2Jo"); // ini ID sheet
  var sheet = file.getSheetByName("laporan"); // ini nama sheet

  var req = JSON.stringify(e).replace(/\\/g,"").replace("}\"","}").replace("\"{","{"); // jangan dirubah
  var reqJson = JSON.parse(req);// jangan dirubah
  var senderMessage = JSON.stringify(reqJson["postData"]["contents"]["senderMessage"]);// jangan dirubah
  var senderName = JSON.stringify(reqJson["postData"]["contents"]["senderName"]);// jangan dirubah

  var parsedMessage = senderMessage
                      .replace("Laporann","1#") // merubah text yang tidak diperlukan
                      .replace("nTanggal:","#") // merubah text yang tidak diperlukan
                      .replace("nIsi Laporan:","#") // merubah text yang tidak diperlukan
                      .split("#"); // string pemisah pesan
  var jumlah_pesan = parsedMessage.length; // menghitung jumlah pesan
  var tanggal = parsedMessage[1].trim(); // mengambil data isi pesan pertama
  var laporan = parsedMessage[2].trim().replace('"',''); // mengambil data isi pesan kedua
  var pelapor = senderName.replace('"','').replace('"',''); // mengambil data pelapor

  if (jumlah_pesan == 3){ // validasi jumlah isi pesan
    sheet.insertRowAfter(1); //insert 1 baris
    sheet.getRange(2,1).setValue(Utilities.formatDate(new Date(), "GMT+7:00", "dd-MMM-yyyy' 'HH:mm")); //memasukkan data tanggal pesan
    sheet.getRange(2,2).setValue(tanggal);// memasukkan data tanggal laporan ke kolom kedua
    sheet.getRange(2,3).setValue(laporan);// memasukkan data isi laporan ke kolom ketiga
    sheet.getRange(2,4).setValue(pelapor);// memasukkan data pelapor ke kolom ke empat

    var response = { // membuat balasan pesan WA
      data: [
        {
          message: "Terima kasih " + pelapor + ". Laporan sudah diterima."
        }
      ]
    };
  } else {
    var response = { // membuat balasan pesan WA jika format salah
      data: [
        {
          message: "Mohon maaf, " + pelapor + ". Laporan tidak terekap. \n" +
          "Mohon sesuaikan dengan format laporan yang sudah ada. Terima kasih."
        }
      ]
    };
  }
  return ContentService.createTextOutput(JSON.stringify(response)); // mengirimkan isi pesan balasan ke Auto Replay Chat bot
}
