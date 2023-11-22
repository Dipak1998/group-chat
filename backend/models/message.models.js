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
        type: Sequelize.INTEGER,
        default:0
      },
      like_user_id: {
        type: Sequelize.JSON,
        default:[]
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