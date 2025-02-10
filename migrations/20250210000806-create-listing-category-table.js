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
  return db.createTable('listing_category', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    listing_id: {
      type: 'string',
      notNull: true,
      foreignKey: {
        name: 'listing_category_listing_id_fk',
        table: 'listing',
        mapping: 'lid',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
    category_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'listing_category_category_id_fk',
        table: 'category',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
  });
};

exports.down = function (db) {
  return db.removeForeignKey('listing_category', 'listing_category_listing_id_fk')
    .then(() => db.removeForeignKey('listing_category', 'listing_category_category_id_fk'))
    .then(() => db.dropTable('listing_category'));
};

exports._meta = {
  version: 1,
}; 