import { FindOptions, Table, Data } from "../index"
import dataTypeConverter from "../../lib/dataTypeConverter"
import dayjs from "dayjs"
import clear from "./clear"
import create from "./create"
import findOne from "./findOne"


export default async (table: Table, data: Data, findOptions: FindOptions) => {
  const find = await findOne(table, findOptions)
  if(!find) return null
  await clear(table, findOptions)
  data.updatedAt = dayjs().toISOString()
  const idata = { ...find, ...data }
  const insertData = Object.keys(table.columns).map((column) => {
    return dataTypeConverter(idata[column], table.columns[column].type)
  })
  return table.database.doc.sheetsById[table.sheetId].addRow(insertData)
  
}