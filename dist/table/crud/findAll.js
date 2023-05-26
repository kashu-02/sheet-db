"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resultDataTypeConverter_1 = __importDefault(require("../../lib/resultDataTypeConverter"));
const include_1 = __importDefault(require("../../lib/include"));
exports.default = async (table, options) => {
    let data = await table.database.doc.sheetsById[table.sheetId].getRows();
    data.shift(); // Remove header row
    data.map((row) => {
        Object.keys(table.columns).map((column) => {
            row[column] = (0, resultDataTypeConverter_1.default)(row[column], table.columns[column].type);
        });
    });
    // Where
    Object.keys(options?.where || {}).map((column) => {
        data = data.filter((row) => {
            return row[column] === options?.where?.[column];
        });
    });
    const underscoreFilteredData = data.map((row) => {
        const result = {};
        Object.keys(row).map((column) => {
            if (!column.match(/^_.*$/g)) {
                result[column] = row[column];
            }
        });
        return result;
    });
    const nulldeleted = underscoreFilteredData.filter((row) => {
        if (!row?.createdAt) {
            return false;
        }
        else {
            if (!options?.paranoid && row?.deletedAt !== "") {
                return false;
            }
            else {
                return true;
            }
        }
    });
    if (options?.include && options.include.length > 0) {
        return (0, include_1.default)(table, nulldeleted, options.include);
    }
    return nulldeleted;
};
//# sourceMappingURL=findAll.js.map