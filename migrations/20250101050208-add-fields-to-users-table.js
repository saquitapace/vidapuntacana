'use strict';

let dbm;
let type;
let seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.addColumn('users', 'artist_type', { type: 'string', length: 100 })
    .then(() => db.addColumn('users', 'business_info', { type: 'string', length: 255 }))
    .then(() => db.addColumn('users', 'business_link', { type: 'string', length: 255 }))
    .then(() => db.addColumn('users', 'business_email', { type: 'string', length: 255 }))
    .then(() => db.addColumn('users', 'interests', { type: 'json' }));
};

exports.down = function(db) {
  return db.removeColumn('users', 'interests')
    .then(() => db.removeColumn('users', 'business_email'))
    .then(() => db.removeColumn('users', 'business_link'))
    .then(() => db.removeColumn('users', 'business_info'))
    .then(() => db.removeColumn('users', 'artist_type'));
};

exports._meta = {
  "version": 1
};
