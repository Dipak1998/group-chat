const dbConfig = require('../config/db.config');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
//importing models
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.chat_group = require("./chat_group.models")(sequelize, Sequelize);
db.message = require("../models/message.models")(sequelize, Sequelize);

/* releated tables */
db.role.hasMany(db.user, { foreignKey: 'role_id' });
db.user.belongsTo(db.role, { foreignKey: 'role_id' });

// Correct the association for chat_group and user
db.user.hasMany(db.chat_group, { foreignKey: 'user_id' });
db.chat_group.belongsTo(db.user, { foreignKey: 'user_id'});

db.user.hasMany(db.message, { foreignKey: 'user_id' });
db.message.belongsTo(db.user, { foreignKey: 'user_id'});



module.exports = db;