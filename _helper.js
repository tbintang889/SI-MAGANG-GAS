function getSheetPaginated(sheetName, offset, limit) {
  var sheet = typeof getSheet === 'function' ? getSheet(sheetName) : null;
  if (!sheet) return [];
  var pageOffset = Number(offset || 0);
  var pageLimit = Number(limit || 20);
  if (pageLimit <= 0) pageLimit = 20;
  var lastRow = sheet.getLastRow();
  var startRow = pageOffset + 2;
  var maxRows = Math.max(0, lastRow - startRow + 1);
  var numRows = Math.min(pageLimit, maxRows);
  if (numRows <= 0) return [];
  return sheet.getRange(startRow, 1, numRows, sheet.getLastColumn()).getValues();
}

