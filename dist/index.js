"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const google_spreadsheet_1 = require("google-spreadsheet");
const table_1 = require("./table");
class Database {
    constructor(spreadsheetId) {
        this.tables = {};
        this.spreadsheetId = spreadsheetId;
        this.doc = new google_spreadsheet_1.GoogleSpreadsheet(spreadsheetId);
    }
    async init(creds) {
        await this.doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key.split(String.raw `\n`).join("\n"),
        });
        // Database initialization
        await this.doc.loadInfo();
        const propertiesSheet = this.propertySheet = this.doc.sheetsByIndex[0];
        await propertiesSheet.loadCells({
            startRowIndex: 0,
            startColumnIndex: 0,
            endRowIndex: 1,
            endColumnIndex: 1
        });
        if (propertiesSheet.getCell(0, 0).value !== 'This sheet is used by Sheets-SQL. Do not modify any values.') {
            propertiesSheet.getCell(0, 0).value = 'This sheet is used by Sheets-SQL. Do not modify any values.';
            await Promise.all([
                propertiesSheet.saveUpdatedCells(),
                propertiesSheet.updateProperties({
                    title: 'Properties'
                }),
                propertiesSheet.setHeaderRow([
                    'TableName',
                    'SheetId'
                ], 2)
            ]);
        }
    }
    async getSheetTitle() {
        await this.doc.loadInfo();
        return this.doc.title;
    }
    async define(tableName, attributes, options = {
        tableName,
        database: this
    }) {
        const table = new class extends table_1.Table {
        };
        await table.init(attributes, options);
        this.tables[tableName] = table;
        return table;
    }
}
exports.Database = Database;
//# sourceMappingURL=index.js.map