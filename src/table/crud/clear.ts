import { FindOptions, Table } from "../index"

import resultDataTypeConverter from "../../lib/resultDataTypeConverter"

interface Result {
  [key: string]: string | number | boolean | object
}

export { Result }

export default async (table: Table, options?: FindOptions) => {
  const data = await table.database.doc.sheetsById[table.sheetId].getRows()
  data.shift() // Remove header row
  data.map((row) => {
    Object.keys(table.columns).map((column) => {
      row[column] = resultDataTypeConverter(row[column], table.columns[column].type)
    })
  })

  // search and get index
    let index = -1
    Object.keys(options?.where || {}).map((column) => {
      data.forEach((row, i) => {
        if (row[column] === options?.where?.[column]) {
          index = i
        }
      })
    })

    if (index === -1) {
      return;
    }

    await table.database.doc.sheetsById[table.sheetId].clearRows({
      start: index + 3,
      end: index + 3
    })

  return true
}