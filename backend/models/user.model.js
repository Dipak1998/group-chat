module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notNull:{
            msg:"Name is required."
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notNull:{
            msg:"Email is required."
          },
          isEmail:{
            msg:"Email should be valid format"
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notNull:{
            msg:"Password is required."
          }
        }
      },
      mobile_no: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notNull:{
            msg:"Mobile Number is required."
          },
          len:{
            args: [10,10],
            msg:"Mobile No should be 10 digit"
          }
        }
      },
      role_id:{
        type: Sequelize.INTEGER,
        default:2
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