import Sequelize from 'sequelize'
import databaseConfig from '../config/database'
import User from '../app/models/User'
import Product from '../app/models/Product'
import Category from '../app/models/Category'
import mongoose from 'mongoose'
// import Order from '../app/schemas/Order'

const models = [User, Product, Category]

class Database {
  constructor() {
    this.init()
    this.mongo()

  }

  init() {
    this.connection = new Sequelize(databaseConfig)
    models.map((model) => model.init(this.connection)).
    map((model) => model.associate && model.associate(this.connection.models))
  }

  mongo(){
    this.mongoConnection = mongoose.connect('mongodb://localhost:27017/code-burger')
  }

}

export default new Database()
