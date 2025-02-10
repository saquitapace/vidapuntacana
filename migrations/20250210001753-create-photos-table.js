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
  return db.createTable('photos', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    lid: {
      type: 'string',
      notNull: true,
      foreignKey: {
        name: 'photos_listing_lid_fk',
        table: 'listing',
        mapping: 'lid',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
    url: { type: 'string', notNull: true },
    description: { type: 'string' },
  });
};

exports.down = function (db) {
  return db.dropTable('photos');
};

exports._meta = {
  version: 1,
};
