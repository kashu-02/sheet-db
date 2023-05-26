"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const includeAndMerge = async (parent, parentResult, includes) => {
    if (!parent || !includes)
        throw new Error('No such column in table');
    const includeTables = await Promise.all(includes.map((include) => {
        if (include?.include) {
            return include.model?.findAll({
                include: include.include
            });
        }
        else {
            return include.model?.findAll();
        }
    }));
    includes.forEach((include, index) => {
        const foreignKey = parent.associations.belongsTo.find((association) => {
            return association.table.sheetId === include.model?.sheetId;
        })?.options.foreignKey;
        if (!foreignKey)
            throw new Error('No such column in table');
        parentResult.forEach((parentRow) => {
            const includeResult = includeTables[index].find((includeRow) => {
                return parentRow[foreignKey] === includeRow[foreignKey];
            });
            if (!includeResult)
                throw new Error('No such column in table');
            parentRow[include.model?.tableName || ''] = includeResult;
        });
    });
    return parentResult;
};
exports.default = includeAndMerge;
//# sourceMappingURL=include.js.map