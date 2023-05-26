"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const update_1 = __importDefault(require("./update"));
exports.default = async (table, findOptions) => {
    return (0, update_1.default)(table, { deletedAt: (0, dayjs_1.default)().toISOString() }, findOptions);
};
//# sourceMappingURL=destroy.js.map