module.exports = (sequelize, DataTypes) => {

  return sequelize.define('save', {
    'user_id': DataTypes.INTEGER,
    'food_id': DataTypes.INTEGER,
    'num': DataTypes.INTEGER,
    'in_time': DataTypes.DOUBLE,
    'last_time': DataTypes.DOUBLE,
  })
}
