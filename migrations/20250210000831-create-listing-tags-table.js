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
  return db.createTable('listing_tags', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    listing_id: {
      type: 'string',
      notNull: true,
      foreignKey: {
        name: 'listing_tags_listing_id_fk',
        table: 'listing',
        mapping: 'lid',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
    tag_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'listing_tags_tag_id_fk',
        table: 'tags',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable('listing_tags');
};

exports._meta = {
  version: 1,
}; 