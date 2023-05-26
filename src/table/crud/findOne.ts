import { FindOptions, Table } from "../index"

import findAll from './findAll';

export default async (table: Table, options?: FindOptions) => {
  const results = await findAll(table, options);
  return results[0];
}