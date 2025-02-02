'use strict';

let dbm;
let type;
let seed;

exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('contact_us', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    first_name: { type: 'string', length: 100 },
    last_name: { type: 'string', length: 100 },
    email: { type: 'string', length: 255 },
    message: { type: 'text' },
    phone_number: { type: 'string', length: 20 },
    subject: { type: 'string', length: 255 },
    created_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = function (db) {
  return db.dropTable('contact_us');
};

exports._meta = {
  version: 1,
};
