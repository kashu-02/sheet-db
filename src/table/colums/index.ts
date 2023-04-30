import { Database } from "../index";

import initTable from "./initTable";

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

export class Table {
  public static sheetId = ""

  static async init (attributes: Attributes, options: Options): Promise<Table> {
    console.log("init");
    const sheetId = await initTable(attributes, options);
    this.sheetId = sheetId
    return this;
  }
}
