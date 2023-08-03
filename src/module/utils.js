import moment from "moment";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
export const getDateRange = (optionSelected) => {
  const currentDate = new Date();
  let fromDate = null,
    toDate = null;
  if (optionSelected === "LW") {
    fromDate = getFormattedDate(
      new Date(new Date().setDate(new Date().getDate() - 7))
    );
    toDate = getFormattedDate(
      new Date(new Date().setDate(new Date().getDate()))
    );
  } else if (optionSelected === "PM") {
    fromDate = getFormattedDate(
      new Date(currentDate.getFullYear(), new Date().getMonth() - 1, 1)
    );
    toDate = getFormattedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    );
  } else if (optionSelected === "PY") {
    fromDate = getFormattedDate(new Date(currentDate.getFullYear() - 1, 0, 1));
    toDate = getFormattedDate(new Date(currentDate.getFullYear() - 1, 11, 31));
  } else if (optionSelected === "LM") {
    fromDate = getFormattedDate(
      new Date(new Date().setDate(new Date().getDate() - 30))
    );
    toDate = getFormattedDate(
      new Date(new Date().setDate(new Date().getDate()))
    );
  } else if (optionSelected === "PQ") {
    const quarter = Math.floor(new Date().getMonth() / 3);
    const quarterStartDate = new Date(
      new Date().getFullYear(),
      quarter * 3 - 3,
      1
    );
    fromDate = getFormattedDate(quarterStartDate);
    toDate = getFormattedDate(
      new Date(
        quarterStartDate.getFullYear(),
        quarterStartDate.getMonth() + 3,
        0
      )
    );
  } 
  return { fromDate, toDate };
};

export const getFormattedDate = (dateVal) => {
  if (dateVal) {
    return moment(dateVal).format("YYYY-MM-DD");
  }
  return null;
};

export const getPaymentFileData = (dataTypeMappingId, paramsList, fileData) => {
  const tableColumns = [],
    tableRows = [],
    tableColFields = [];
  dataTypeMappingId.forEach((paramId) => {
    const columnName = paramsList.filter(
      (item) => item.parameterId === paramId
    )[0];
    tableColumns.push(columnName.parameterName);
    tableColFields.push({
      columnName: columnName.columnName,
      parameterName: columnName.parameterName,
    });
  });
  fileData.forEach((item) => {
    const obj = {};
    tableColFields.forEach((field) => {
      obj[field.parameterName] = item[getCurrentFieldNames(field.columnName)];
    });
    tableRows.push(obj);
  });
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  const fileName = `payment_report_${dateStr}.xlsx`;
  const ws = XLSX.utils.json_to_sheet(tableRows);
  const wb = {
    Sheets: { "Payment Report": ws },
    SheetNames: ["Payment Report"],
  };
  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName);
};

const getCurrentFieldNames = (paramField) => {
  switch (paramField) {
    case "fileId":
      return "fileID";
    default:
      return paramField;
  }
};
