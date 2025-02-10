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
  return db.createTable('social_media', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    lid: {
      type: 'string',
      notNull: true,
      unique: true,
      foreignKey: {
        name: 'social_media_listing_lid_fk',
        table: 'listing',
        mapping: 'lid',
        rules: {
          onDelete: 'CASCADE',
        },
      },
    },
    trip_advisor: { type: 'string' },
    facebook: { type: 'string' },
    instagram: { type: 'string' },
    whatsapp: { type: 'string' },
    google: { type: 'string' },
    website: { type: 'string' },
    created_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = function (db) {
  return db.dropTable('social_media');
};

exports._meta = {
  version: 1,
};
