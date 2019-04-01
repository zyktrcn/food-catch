module.exports = (sequelize, DataTypes) => {

  return sequelize.define('user', {
    'openid': DataTypes.STRING(100),
    'name': DataTypes.STRING(45),
    'sex': DataTypes.INTEGER,
    'face': DataTypes.STRING(250),
  })
}
