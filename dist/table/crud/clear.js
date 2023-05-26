"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resultDataTypeConverter_1 = __importDefault(require("../../lib/resultDataTypeConverter"));
exports.default = async (table, options) => {
    const data = await table.database.doc.sheetsById[table.sheetId].getRows();
    data.shift(); // Remove header row
    data.map((row) => {
        Object.keys(table.columns).map((column) => {
            row[column] = (0, resultDataTypeConverter_1.default)(row[column], table.columns[column].type);
        });
    });
    // search and get index
    let index = -1;
    Object.keys(options?.where || {}).map((column) => {
        data.forEach((row, i) => {
            if (row[column] === options?.where?.[column]) {
                index = i;
            }
        });
    });
    if (index === -1) {
        return;
    }
    await table.database.doc.sheetsById[table.sheetId].clearRows({
        start: index + 3,
        end: index + 3
    });
    return true;
};
//# sourceMappingURL=clear.js.map