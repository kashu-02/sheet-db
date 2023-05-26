"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/restrict-template-expressions */
const dayjs_1 = __importDefault(require("dayjs"));
exports.default = (value, dataType) => {
    if (dataType === 'STRING') {
        if (typeof value === 'string')
            return true;
        return false;
    }
    if (dataType === 'INTEGER') {
        if (typeof value === 'number' && Number.isInteger(value))
            return true;
        return false;
    }
    if (dataType === 'BOOLEAN') {
        if (typeof value === 'boolean')
            return true;
        return false;
    }
    if (dataType === 'DATE') {
        if (typeof value === 'string' && (0, dayjs_1.default)(value).isValid())
            return true;
        return false;
    }
    if (dataType === 'FLOAT') {
        if (typeof value === 'number' && !Number.isInteger(value))
            return true;
        return false;
    }
    if (dataType === 'ARRAY') {
        if (Array.isArray(value))
            return true;
        return false;
    }
    if (dataType === 'JSON') {
        if (typeof value === 'string') {
            try {
                JSON.parse(value);
                return true;
            }
            catch (e) {
                return false;
            }
        }
        return false;
    }
    if (dataType === 'UUID') {
        if (typeof value === 'string' && value.match(/^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/g))
            return true;
        return false;
    }
    return false;
};
//# sourceMappingURL=dataTypeChecker.js.map