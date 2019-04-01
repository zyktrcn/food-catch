module.exports = (sequelize, DataTypes) => {

  return sequelize.define('record', {
    'user_id': DataTypes.INTEGER,
    'dish_id': DataTypes.INTEGER,
    'num': DataTypes.INTEGER,
    'cook_time': DataTypes.DOUBLE,
  })
}
