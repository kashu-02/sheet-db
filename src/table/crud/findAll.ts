import { FindOptions, Table, Data } from "../index"

import resultDataTypeConverter from "../../lib/resultDataTypeConverter"
import include from "../../lib/include"

interface Result {
  [key: string]: string | number | boolean | object
}

export { Result }

export default async (table: Table, options?: FindOptions) => {
  let data = await table.database.doc.sheetsById[table.sheetId].getRows()
  data.shift() // Remove header row
  data.map((row) => {
    Object.keys(table.columns).map((column) => {
      row[column] = resultDataTypeConverter(row[column], table.columns[column].type)
    })
  })
  
  // Where
  Object.keys(options?.where || {}).map((column) => {
    data = data.filter((row) => {
      return row[column] === options?.where?.[column]
    })
  })

  const underscoreFilteredData = data.map((row) => {
    const result: Result = {}
    Object.keys(row).map((column) => {
      if (!column.match(/^_.*$/g)) {
        result[column] = <Result>row[column]
      }
    })

    return result
  })

  const nulldeleted = underscoreFilteredData.filter((row) => {
    if (!row?.createdAt) {
      return false
    } else {
      if (!options?.paranoid && row?.deletedAt !== "") {
        return false
      }
      else {
        return true
      }
    }
  })


  if (options?.include && options.include.length > 0) {
    return include(table, nulldeleted, options.include)
  }
    

  return nulldeleted
}