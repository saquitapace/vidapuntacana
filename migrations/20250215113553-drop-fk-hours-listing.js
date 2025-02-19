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
  return db.removeForeignKey('hours', 'hours_listing_lid_fk');
};

exports.down = function (db) {
  return db.addForeignKey('hours', 'listing', 'hours_listing_lid_fk',
    {
      'lid': 'lid'
    },
    {
      onDelete: 'CASCADE'
    }
  );
};

exports._meta = {
  version: 1
};