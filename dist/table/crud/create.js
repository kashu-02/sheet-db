"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataTypeChecker_1 = __importDefault(require("../../lib/dataTypeChecker"));
const dataTypeConverter_1 = __importDefault(require("../../lib/dataTypeConverter"));
exports.default = async (table, data, options) => {
    const rows = await table.findAll();
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    Object.keys(table.columns).every((column) => {
        if (table.columns[column].autoIncrement == true)
            return true;
        if (table.columns[column].autoIncrement == false && table.columns[column].allowNull == false && data[column] === undefined) {
            throw new Error(`Column ${column} is not defined`);
        }
        if (table.columns[column].allowNull == false && (0, dataTypeChecker_1.default)(data[column], table.columns[column].type) !== true) {
            throw new Error(`Column ${column} is not of type ${table.columns[column].type}`);
        }
        if (table.columns[column].allowNull == false && !data[column]) {
            throw new Error(`Column ${column} cannot be null`);
        }
        if (table.columns[column].unique == true) {
            const isExist = rows.filter((row) => {
                return row[column] === data[column];
            }).length;
            if (isExist)
                throw new Error(`Column ${column} must be unique`);
        }
        return true;
    });
    const insertData = Object.keys(table.columns).map((column) => {
        if (table.columns[column].autoIncrement == true) {
            let lastNumber = 0;
            rows.forEach((row) => {
                if (Number(row[column]) > lastNumber) {
                    lastNumber = Number(row[column]);
                }
            });
            data[column] = lastNumber + 1;
        }
        return (0, dataTypeConverter_1.default)(data[column], table.columns[column].type);
    });
    return table.database.doc.sheetsById[table.sheetId].addRow(insertData);
};
//# sourceMappingURL=create.js.map