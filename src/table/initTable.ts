import { GoogleSpreadsheetWorksheet, WorksheetGridRange } from "google-spreadsheet";

import { Database } from "../index";

interface Options {
  tableName: string;
  database: Database;
}

interface Attributes {
  [key: string]: {
    type: string;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    allowNull?: boolean;
    defaultValue?: any;
    unique?: boolean;
  };
}

export default async (attributes: Attributes, options: Options): Promise<string> => {
  const sheetId = await getOrCreateTable(attributes, options);
  await getOrCreateColumns(sheetId, attributes, options);
  return sheetId;
}

const getOrCreateTable = async(attributes: Attributes, options: Options) : Promise<string> => {
  await options.database.doc.loadInfo()
  await options.database.propertySheet.loadHeaderRow(2)
  const tables = await options.database.propertySheet.getRows()
  const table  = tables.find((table) => table.TableName === options.tableName)
  let sheetId : string
  if (table == undefined) {
    // Create table
    const addedSheet = await options.database.doc.addSheet({
      headerValues: Object.keys(attributes),
      title: options.tableName
    })
    sheetId = addedSheet.sheetId
    // and add to property sheet
    await options.database.propertySheet.addRow({
      TableName: options.tableName,
      SheetId: sheetId
    })
  } else {
    sheetId = <string>table.SheetId
  }
  return sheetId
};

const getOrCreateColumns = async (sheetId: string, attributes: Attributes, options: Options) => {
  const sheet = options.database.doc.sheetsById[sheetId]
  await options.database.doc.loadInfo()
  
  const rows = await (async () => {
    await sheet.loadCells({
      startRowIndex: 0, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: sheet.columnCount
    });
    const allColumns = [];
    for (let i = 0; i < sheet.columnCount; i++) {
      allColumns.push([sheet.getCell(0, i).value, sheet.getCell(1, i).value]);
    }
    return allColumns.filter((column) => column[0] !== null);
  })()
 
  // Check if all columns exist
  const columns = rows.map((row) => row[0])
  const columnsProperties = rows.map((row) => row[1])

  const isAllColumnsAndPropertiesExistAndSame = Object.keys(attributes).every((attribute) => {
    return columns.includes(attribute) && columnsProperties[columns.indexOf(attribute)] === JSON.stringify(attributes[attribute])
  })
  
  if (!isAllColumnsAndPropertiesExistAndSame) {
    const newColumns = Object.keys(attributes)
    await sheet.setHeaderRow(newColumns)
    
    const newColumnsProperties = newColumns.map((column) => JSON.stringify(attributes[column]))
    await sheet.addRow(newColumnsProperties, {
      raw: true,
      insert: true
    })
  }
}
