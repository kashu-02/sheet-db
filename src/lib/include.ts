import { Table, FindOptions, AssociateOptions, } from "../table/index"

interface Result {
  [key: string]: string | number | boolean | object
}



const includeAndMerge = async (parent: Table, parentResult : Result[], includes: FindOptions['include']) => {
  if (!parent || !includes) throw new Error('No such column in table')
  const includeTables = await Promise.all(includes.map((include) => {
    if (include?.include) {
      return include.model?.findAll({
        include: include.include
      })
    } else {
      return include.model?.findAll()
    }
  })) 

  includes.forEach((include, index) => {
    const foreignKey = parent.associations.belongsTo.find((association) => {
      return association.table.sheetId === include.model?.sheetId
    })?.options.foreignKey

    if (!foreignKey) throw new Error('No such column in table')

    parentResult.forEach((parentRow) => {
      const includeResult = includeTables[index].find((includeRow) => {
        return parentRow[foreignKey] === includeRow[foreignKey]
      })
      if (!includeResult) throw new Error('No such column in table')
      parentRow[include.model?.tableName || ''] = includeResult
    }
    )
  })
    


  return parentResult



}


export default includeAndMerge