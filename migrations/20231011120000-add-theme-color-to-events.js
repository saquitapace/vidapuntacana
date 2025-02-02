exports.up = function (db, callback) {
  // First check if column exists
  db.runSql(
    `SELECT COUNT(*) as count 
     FROM information_schema.columns 
     WHERE table_name = 'events' 
     AND column_name = 'theme_color'`,
    function (err, result) {
      if (err) {
        return callback(err);
      }
      console.log('result', result);
      if (result[0]?.count === 0) {
        db.addColumn('events', 'theme_color', { type: 'string' }, callback);
      } else {
        callback();
      }
    }
  );
};

exports.down = function (db, callback) {
  db.removeColumn('events', 'theme_color', callback);
};
