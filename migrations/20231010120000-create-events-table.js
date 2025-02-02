exports.up = function (db) {
  return db.createTable('events', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: { type: 'string', notNull: true },
    title: { type: 'string', notNull: true },
    description: { type: 'text' },
    start_date: { type: 'datetime', notNull: true },
    end_date: { type: 'datetime', notNull: true },
    type: { type: 'string' },
    status: { type: 'string' },
    location: { type: 'string' },
    theme_color: { type: 'string' }, // Add theme_color column
    created_at: {
      type: 'datetime',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'datetime',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = function (db) {
  return db.dropTable('events');
};
