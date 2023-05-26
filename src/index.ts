import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, WorksheetGridRange } from "google-spreadsheet";

import { Table } from "./table";

interface creds {
  client_email: string;
  private_key: string;
}

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
    unique?: boolean;
    references?: {
      model: string;
      key: string;
    };
  };
}

interface Tables {
  [key: string] : Table 
}


export class Database {
  public spreadsheetId: string;
  public doc: GoogleSpreadsheet;
  public tables: Tables = {};
  public propertySheet!: GoogleSpreadsheetWorksheet;

  constructor(spreadsheetId: string) {
    this.spreadsheetId = spreadsheetId;
    this.doc = new GoogleSpreadsheet(spreadsheetId);
  }
  public async init(creds: creds) {
    await this.doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key.split(String.raw`\n`).join("\n"),
    });

    // Database initialization
    await this.doc.loadInfo()
    const propertiesSheet = this.propertySheet = this.doc.sheetsByIndex[0]
    await propertiesSheet.loadCells(<WorksheetGridRange>{
      startRowIndex: 0,
      startColumnIndex: 0,
      endRowIndex: 1,
      endColumnIndex: 1
    })
    if (propertiesSheet.getCell(0, 0).value !== 'This sheet is used by Sheets-SQL. Do not modify any values.') {
      propertiesSheet.getCell(0, 0).value = 'This sheet is used by Sheets-SQL. Do not modify any values.'
      await Promise.all([
        propertiesSheet.saveUpdatedCells(),
        propertiesSheet.updateProperties({
          title: 'Properties'
        }),
        propertiesSheet.setHeaderRow([
          'TableName',
          'SheetId'
        ],2)
      ])
    }
  }

  public async getSheetTitle(): Promise<string> {
    await this.doc.loadInfo();
    return this.doc.title;
  }

  public async define(
    tableName: string,
    attributes: Attributes,
    options: Options = {
      tableName,
      database: this
    }
  ) {
    const table = new class extends Table {};
    await table.init(attributes, options);
    this.tables[tableName] = table;
    return table;
  }
}
