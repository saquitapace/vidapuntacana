'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('listing', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    lid: { type: 'string', notNull: true, unique: true },
    address: { type: 'string', notNull: true },
    phone: { type: 'string', notNull: true },
    primary_category: { type: 'int' },
  });
};

exports.down = function (db) {
  return db.dropTable('listing');
};

exports._meta = {
  version: 1,
}; 