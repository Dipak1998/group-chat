module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notNull:{
            msg:"Message is required."
          }
        }
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate:{
          notNull:{
            msg:"Group is required."
          }
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate:{
          notNull:{
            msg:"Sender is required."
          }
        }
      },
      likes: {
        type: Sequelize.INTEGER
      },
      like_user_id: {
        type: Sequelize.JSON,
        validate:{
          isJSON:{
            msg:"va;lue should be valid json."
          }
        }
      },
      status:{
        type: Sequelize.INTEGER
      }
    }, {
      freezeTableName: true,
      timestamps:true
  });
    return Message;
  };