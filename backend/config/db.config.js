const dotenv = require('dotenv');
dotenv.config({path:'./dev.env'})

const dbName = process.env.DB_NAME 
const dbHost = process.env.DB_HOST
const dbUserName = process.env.DB_USER 
const dbPassword = process.env.PASSWORD 

module.exports = {
    HOST: dbHost,

    USER: dbUserName,

    PASSWORD: dbPassword,

    DB: dbName,

    dialect: "mysql",
    dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true
    },
    timezone: '+05:30' ,//for writing to database

    pool: {

    max: 5,

    min: 0,

    acquire: 30000,

    idle: 10000

    }

}

// console.log(dbName, dbHost,dbUserName,dbPassword )