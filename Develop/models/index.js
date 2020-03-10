// this will reset the database (drop and reinstate the db)
'use strict';
//these are the dependencies for this script to run 
var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
// this is using a secure apssword that does not get uploaded to github
var env       = process.env.NODE_ENV || 'development';
// this will redirect to the followong file name from this script using the env eniviable for the passsword
var config    = require(__dirname + '/../config/config.json')[env];
//this is setting up a blank object whenever this script is initially ran
var db        = {};

//if the variable is in develop 
if (config.use_env_variable) {
  // this databe will be ran 
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  //else this my sql database will be ran using the config file to set up a new sql database 
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
//this will read all of the files in this directory
  .readdirSync(__dirname)
  //then filter throught them only keeping the scripts that are saved as .js files
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  // and finally uses these.js model to start the database with the correct fields 
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//this will then export the newley started databse to be used in all of the other code 
module.exports = db;
