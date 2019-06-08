/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_minicursos', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    palestrante: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    inicio: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    fim: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    vagas: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    predio: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    sala: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    obs: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    tableName: 'tbl_minicursos'
  });
};
