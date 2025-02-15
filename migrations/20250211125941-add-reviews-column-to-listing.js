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
  return Promise.all([
    db.addColumn('listing', 'google_review_count', {
      type: 'int',
      defaultValue: 0
    }),
    db.addColumn('listing', 'google_ratings', {
      type: 'decimal',
      precision: 3,
      scale: 2,
      defaultValue: 0
    }),
    db.addColumn('listing', 'price', {
      type: 'decimal',
      precision: 10,
      scale: 2,
      defaultValue: null
    })
  ]);
};

exports.down = function (db) {
  return Promise.all([
    db.removeColumn('listing', 'google_review_count'),
    db.removeColumn('listing', 'google_ratings'),
    db.removeColumn('listing', 'price')
  ]);
};

exports._meta = {
  version: 1,
}; 