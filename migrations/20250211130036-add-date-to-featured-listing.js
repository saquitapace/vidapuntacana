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
    db.addColumn('featured', 'start_date', {
      type: 'datetime',
      notNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    }),
    db.addColumn('featured', 'end_date', {
      type: 'datetime',
      notNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    })
  ]);
};

exports.down = function (db) {
  return Promise.all([
    db.removeColumn('featured', 'start_date'),
    db.removeColumn('featured', 'end_date')
  ]);
};

exports._meta = {
  version: 1,
}; 