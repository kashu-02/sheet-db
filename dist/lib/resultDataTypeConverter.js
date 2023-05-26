"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
exports.default = (value, dataType) => {
    if (dataType === 'STRING') {
        return String(value);
    }
    if (dataType === 'INTEGER' || dataType === 'FLOAT') {
        return Number(value);
    }
    if (dataType === 'BOOLEAN') {
        return value;
    }
    if (dataType === 'DATE') {
        if (!value)
            return "";
        return (0, dayjs_1.default)(value).toISOString();
    }
    if (dataType === 'ARRAY') {
        return value;
    }
    if (dataType === 'JSON') {
        return JSON.parse(value);
    }
    if (dataType === 'UUID') {
        return value;
    }
    throw new Error('Invalid data type');
};
//# sourceMappingURL=resultDataTypeConverter.js.map