import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
// define a generatePDF function that accepts a account list argument
const generatePDF = (title, fileName, tableColumn, tableRows)=> {
  // initialize jsPDF
  const doc = new jsPDF();

  // account title. and margin-top + margin-left
  doc.text(title, 14, 15);

  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  
  // we define the name of our PDF file.
  doc.save(fileName);
  //doc.save(`bank_account_list_${dateStr}.pdf`);
};

export default generatePDF;
