'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.renameColumn('listing', 'google_ratings', 'google_rating');
};

exports.down = function(db) {
  return db.renameColumn('listing', 'google_rating', 'google_ratings');
};

exports._meta = {
  version: 1
};