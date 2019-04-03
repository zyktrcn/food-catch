module.exports = (sequelize, DataTypes) => {

  return sequelize.define('dish', {
    'name': DataTypes.STRING(45),
    'alias': DataTypes.STRING(45),
    'category': DataTypes.STRING(25),
    'difficulty': DataTypes.STRING(25),
    'time': DataTypes.STRING(25),
    'pic': DataTypes.STRING(250),
    'material': DataTypes.STRING(250),
    'coke_step': DataTypes.TEXT,
    'coke_pic': DataTypes.TEXT,
    'description': DataTypes.STRING(250),
    'related': DataTypes.TEXT,
    'tips': DataTypes.TEXT,
  })
}
