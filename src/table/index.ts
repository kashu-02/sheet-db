import { Database } from "../index";

import initTable from "./initTable";

import create from "./crud/create";
import findAll from "./crud/findAll";
import clear from "./crud/clear";
import update from "./crud/update";
import destroy from "./crud/destroy";

interface Options {
  tableName: string;
  database: Database;
}

interface AssociateOptions{
  foreignKey: string;
}

interface Attributes {
  [key: string]: {
    type: string;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    allowNull?: boolean;
    unique?: boolean;
    autoIncrementStart?: number;
    references?: {
      model: string;
      key: string;
    };
  };
}

interface AssociationElement {
  table: Table,
  options: AssociateOptions
}
interface Associations {
  belongsTo: AssociationElement[],
  hasOne: AssociationElement[],
  hasMany: AssociationElement[]
}

interface CreateOptions {
  include?: string[]
}

interface FindOptions {
  where?: {
    [key: string]: string | number | boolean
  },
  attributes?: {
    include?: string[],
    exclude?: string[]
  },
  paranoid?: boolean,
  include?: {
    model: Table,
    include?: FindOptions['include']
  }[]
}

type DataTypes = `STRING` | 'INTEGER' | 'BOOLEAN' | 'DATE' | 'FLOAT' | 'ARRAY' | 'JSON' | 'UUID'
interface Data {
  [key: string]: string | number | boolean | object
}

export { CreateOptions, FindOptions, Options, Attributes, Associations, AssociateOptions, DataTypes, Data }

export class Table {
  public database!: Database
  public sheetId = ""
  public tableName = ""
  public columns: Attributes = {}
  public associations: Associations = {
    belongsTo: [],
    hasOne: [],
    hasMany: []
  }
  
  public async init (attributes: Attributes, options: Options): Promise<Table> {
    this.database = options.database
    this.sheetId = await initTable(attributes, options);
    this.columns = attributes
    this.tableName = options.tableName
    return this;
  }
  
  public belongsTo(table: Table, options: AssociateOptions) {
    if(!table.columns[options.foreignKey]) throw new Error('No such column in table')
    this.associations.belongsTo.push({
      table: table,
      options: options
    })
  }

  public hasOne(table: Table, options: AssociateOptions) {
    if(!table.columns[options.foreignKey]) throw new Error('No such column in table')
    this.associations.hasOne.push({
      table: table,
      options: options
    })
  }
  public hasMany(table: Table, options: AssociateOptions) {
    if(!table.columns[options.foreignKey]) throw new Error('No such column in table')
    this.associations.hasMany.push({
      table: table,
      options: options
    })
  }

  public async create(data: Data, options?: CreateOptions) {
    return create(this, data, options)
  }

  public async findAll(options?: FindOptions) {
    return findAll(this, options)
  }

  public async clear(options?: FindOptions) {
    return clear(this, options)
  }

  public async update(data: Data, options: FindOptions) {
    return update(this, data, options)
  }

  public async destroy(options: FindOptions) {
    return destroy(this, options)
  }
}
