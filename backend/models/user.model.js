module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      mobile_no: {
        type: Sequelize.STRING
      },
      role_id:{
        type: Sequelize.INTEGER
      },
      status:{
        type: Sequelize.INTEGER
      }
    }, {
      freezeTableName: true,
      timestamps:false
  });
    return User;
  };