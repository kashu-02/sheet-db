"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const initTable_1 = __importDefault(require("./initTable"));
const create_1 = __importDefault(require("./crud/create"));
const findAll_1 = __importDefault(require("./crud/findAll"));
const clear_1 = __importDefault(require("./crud/clear"));
const update_1 = __importDefault(require("./crud/update"));
const destroy_1 = __importDefault(require("./crud/destroy"));
class Table {
    constructor() {
        this.sheetId = "";
        this.tableName = "";
        this.columns = {};
        this.associations = {
            belongsTo: [],
            hasOne: [],
            hasMany: []
        };
    }
    async init(attributes, options) {
        this.database = options.database;
        this.sheetId = await (0, initTable_1.default)(attributes, options);
        this.columns = attributes;
        this.tableName = options.tableName;
        return this;
    }
    belongsTo(table, options) {
        if (!table.columns[options.foreignKey])
            throw new Error('No such column in table');
        this.associations.belongsTo.push({
            table: table,
            options: options
        });
    }
    hasOne(table, options) {
        if (!table.columns[options.foreignKey])
            throw new Error('No such column in table');
        this.associations.hasOne.push({
            table: table,
            options: options
        });
    }
    hasMany(table, options) {
        if (!table.columns[options.foreignKey])
            throw new Error('No such column in table');
        this.associations.hasMany.push({
            table: table,
            options: options
        });
    }
    async create(data, options) {
        return (0, create_1.default)(this, data, options);
    }
    async findAll(options) {
        return (0, findAll_1.default)(this, options);
    }
    async clear(options) {
        return (0, clear_1.default)(this, options);
    }
    async update(data, options) {
        return (0, update_1.default)(this, data, options);
    }
    async destroy(options) {
        return (0, destroy_1.default)(this, options);
    }
}
exports.Table = Table;
//# sourceMappingURL=index.js.map