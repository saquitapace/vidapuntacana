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
  return db.createTable('featured', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    lid: {
      type: 'string',
      notNull: true,
      foreignKey: {
        name: 'featured_listing_lid_fk',
        table: 'listing',
        mapping: 'lid',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
    is_featured: { type: 'boolean', notNull: true, defaultValue: false },
  });
};

exports.down = function (db) {
  return db.dropTable('featured');
};

exports._meta = {
  version: 1,
}; 