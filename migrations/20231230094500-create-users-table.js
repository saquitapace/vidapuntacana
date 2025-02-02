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
  return db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    clerk_id: { type: 'string', length: 255, notNull: true },
    first_name: { type: 'string', length: 100 },
    last_name: { type: 'string', length: 100 },
    email: { type: 'string', length: 255 },
    phone_number: { type: 'string', length: 20 },
    role: { 
      type: 'string', 
      length: 20, 
      notNull: true,
      defaultValue: 'user'
    },
    profile_completed: {
      type: 'boolean',
      notNull: true,
      defaultValue: false
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  });
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
