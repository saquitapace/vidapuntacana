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
  return db.createTable('hours', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    lid: {
      type: 'string',
      notNull: true,
      foreignKey: {
        name: 'hours_listing_lid_fk',
        table: 'listing',
        mapping: 'lid',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
    day: { type: 'int', notNull: true },
    start_time: { type: 'time', notNull: true },
    end_time: { type: 'time', notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable('hours');
};

exports._meta = {
  version: 1,
}; 