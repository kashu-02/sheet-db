"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findAll_1 = __importDefault(require("./findAll"));
exports.default = async (table, options) => {
    const results = await (0, findAll_1.default)(table, options);
    return results[0];
};
//# sourceMappingURL=findOne.js.map