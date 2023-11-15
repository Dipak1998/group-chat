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
// db.role.hasMany(db.user,{ foreignKey: 'role' });
// db.user.belongsTo(db.role,{ foreignKey: 'id' });




module.exports = db;