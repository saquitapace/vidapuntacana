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
  return db.createTable('reviews', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    lid: {
      type: 'string',
      notNull: true,
      foreignKey: {
        name: 'reviews_listing_lid_fk',
        table: 'listing',
        mapping: 'lid',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
    user_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'reviews_user_id_fk',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
    rating: { type: 'int', notNull: true },
    comment: { type: 'text' },
    created_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    }
  });
};

exports.down = function (db) {
  return db.dropTable('reviews');
};

exports._meta = {
  version: 1,
}; 