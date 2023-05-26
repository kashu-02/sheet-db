import { FindOptions, Table, Data } from "../index"
import dayjs from "dayjs"
import update from "./update"


export default async (table: Table, findOptions: FindOptions) => {
  return update(table, { deletedAt: dayjs().toISOString() }, findOptions)
}