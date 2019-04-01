const db = require('./db').dbConnect()

// 模型文档：https://www.yuque.com/oh-bear/elephant-fridge/models

const User = db.import('./user')
const Food = db.import('./food')
const Dish = db.import('./dish')
const Record = db.import('./record')
const Save = db.import('./save')

Record.hasMany(User, { foreignKey: 'user_id' })
Record.hasMany(Dish, { foreignKey: 'dish_id' })

Save.hasMany(User, { foreignKey: 'user_id' })
Save.hasMany(Food, { foreignKey: 'food_id' })

User.belongsTo(Record)
Dish.belongsTo(Record)
User.belongsTo(Save)
Food.belongsTo(Save)

db.sync()

module.exports = {
  User,
  Food,
  Dish,
  Record,
  Save,
}
