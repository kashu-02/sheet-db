"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataTypeConverter_1 = __importDefault(require("../../lib/dataTypeConverter"));
const dayjs_1 = __importDefault(require("dayjs"));
const clear_1 = __importDefault(require("./clear"));
const findOne_1 = __importDefault(require("./findOne"));
exports.default = async (table, data, findOptions) => {
    const find = await (0, findOne_1.default)(table, findOptions);
    if (!find)
        return null;
    await (0, clear_1.default)(table, findOptions);
    data.updatedAt = (0, dayjs_1.default)().toISOString();
    const idata = { ...find, ...data };
    const insertData = Object.keys(table.columns).map((column) => {
        return (0, dataTypeConverter_1.default)(idata[column], table.columns[column].type);
    });
    return table.database.doc.sheetsById[table.sheetId].addRow(insertData);
};
//# sourceMappingURL=update.js.map