module.exports = (sequelize, DataTypes) => {

  return sequelize.define('food', {
    'name': DataTypes.STRING(45),
    'pic': DataTypes.STRING(250),
    'category': DataTypes.STRING(25),
    'team': DataTypes.STRING(25),
    'alias': DataTypes.STRING(45),
    'kw': DataTypes.DOUBLE,
    'people': DataTypes.STRING(125),
    'icon': DataTypes.STRING(125),
    'description': DataTypes.STRING(250),
    'nutrition': DataTypes.TEXT,
    'effect': DataTypes.STRING(250),
    'selection': DataTypes.STRING(250),
    'saveway': DataTypes.STRING(250),
    'phase': DataTypes.TEXT,
    'match': DataTypes.STRING(500),
    'dishes': DataTypes.STRING(500),
  })
}
