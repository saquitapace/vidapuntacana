'use strict';

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  // First, let's clear all tables in reverse order of dependencies
  const clearTables = `
    SET FOREIGN_KEY_CHECKS = 0;
    TRUNCATE TABLE photos;
    TRUNCATE TABLE featured;
    TRUNCATE TABLE hours;
    TRUNCATE TABLE social_media;
    TRUNCATE TABLE listing_tags;
    TRUNCATE TABLE listing_category;
    TRUNCATE TABLE reviews;
    TRUNCATE TABLE listing;
    TRUNCATE TABLE tags;
    TRUNCATE TABLE category;
    SET FOREIGN_KEY_CHECKS = 1;
  `;

  // Insert categories
  const insertCategories = `
    INSERT INTO category (id, name) VALUES 
    (1, 'restaurant'),
    (2, 'club'),
    (3, 'gym'),
    (4, 'fitness');
  `;

  // Insert tags
  const insertTags = `
    INSERT INTO tags (id, name) VALUES 
    (1, 'beach'),
    (2, 'karaoke'),
    (3, 'live music'),
    (4, 'mexican'),
    (5, 'caribbean'),
    (6, 'outdoor'),
    (7, 'parking');
  `;

  // Insert listings
  const insertListings = `
    INSERT INTO listing (lid, address, phone, primary_category) VALUES 
    ('6792884465', 'MHMM+Q54, C. Aruba, Punta Cana 23000, Dominican Republic', '829-506-7548', 1),
    ('2306019475', 'MHMM+M75, Punta Cana 23000, Dominican Republic', '809-455-7314', 1),
    ('5177421073', 'Bohemios, Avenida Barcelo. Plaza Arbat. Frente a Barberia, Punta Cana 23000, Dominican Republic', '829-232-7838', 2),
    ('5376970386', 'C. Pedro Mir, Punta Cana 23000, Dominican Republic', '809-552-0376', 2),
    ('8803242779', 'Av. España, Punta Cana, Bavaro 23000, Dominican Republic', '849-517-1410', 3),
    ('1841636176', 'Av. España, Punta Cana 23000, Dominican Republic', '809-552-0920', 3),
    ('9119571168', 'Av. España, Punta Cana 23000, Dominican Republic', '678-858-0199', 2),
    ('9426455594', 'C. Pedro Mir, Punta Cana 23000, Dominican Republic', '809-959-1646', 1),
    ('7586470484', 'MHRG+VR9, C. Pedro Mir, Punta Cana 23000, Dominican Republic', '809-552-0646', 1),
    ('2094551872', 'Plaza Turquesa, Los Corales, Punta Cana 23000, Dominican Republic', '809-552-0394', 1),
    ('7343885304', 'MHP3+WR9, Av. España, Punta Cana 23000, Dominican Republic', '829-762-1200', 2),
    ('9544918078', 'plaza MOON GALLERY, Av. Barceló, Punta Cana 23000, Dominican Republic', '829-455-3875', 1),
    ('1393252614', 'Av. Alemania, Punta Cana 23000, Dominican Republic', '809-833-9704', '4'),
    ('6136555498', 'Plaza La Proa, Bavaro, Av. Alemania, Punta Cana 23000, Dominican Republic', '829-512-3815', 5),
    ('6789034523', 'plaza coral village, Av. Alemania esq, Punta Cana 23301, Dominican Republic', '849-460-1512', 1),
    ('9785643126', 'Next to El Dorado Casino Los Corales, Playa Turquesa, Across street, Punta Cana 23000, Dominican Republic', '849-492-9499', 1),
    ('6789098765', 'Plaza El Dorado Los Corales, Punta Cana 23000, Dominican Republic', NULL, 1),
    ('9675342187', 'Plaza Espanol', NULL, 2);
  `;

  // Insert listing categories (for listings with multiple categories)
  const insertListingCategories = `
    INSERT INTO listing_category (listing_id, category_id)
    SELECT l.id, c.id
    FROM listing l, category c
    WHERE (l.lid = '6792884465' AND c.id IN (1, 2))
       OR (l.lid = '2306019475' AND c.id IN (1, 2))
       OR (l.lid = '5177421073' AND c.id IN (1, 2))
       OR (l.lid = '5376970386' AND c.id IN (1, 2))
       OR (l.lid = '9426455594' AND c.id IN (1, 2))
       OR (l.lid = '6789034523' AND c.id IN (1, 2));
  `;

  // Insert social media
  const insertSocialMedia = `
    INSERT INTO social_media (lid, instagram) VALUES 
    ('8803242779', 'https://www.instagram.com/empirepuntacana/?hl=en');
  `;

  // Insert hours
  const insertHours = `
    INSERT INTO hours (lid, day, start_time, end_time) VALUES 
    ('2306019475', 1, '11:30', '02:00'),
    ('2306019475', 2, '11:30', '02:00'),
    ('2306019475', 3, '11:30', '02:00'),
    ('2306019475', 4, '11:30', '02:00'),
    ('2306019475', 5, '11:30', '02:00'),
    ('2306019475', 6, '11:30', '02:00'),
    ('2306019475', 7, '11:30', '02:00'),
    ('5376970386', 1, '15:00', '24:00'),
    ('5376970386', 2, '15:00', '24:00'),
    ('5376970386', 3, '15:00', '24:00'),
    ('5376970386', 4, '15:00', '24:00'),
    ('5376970386', 5, '15:00', '24:00'),
    ('5376970386', 6, '15:00', '24:00'),
    ('5376970386', 7, '15:00', '24:00');
  `;

  // Insert featured listings
  const insertFeatured = `
    INSERT INTO featured (lid, is_featured) VALUES 
    ('2306019475', true);
  `;

  // Insert photos (using profile images from the CSV as initial photos)
  const insertPhotos = `
    INSERT INTO photos (lid, url, description) VALUES 
    ('6792884465', 'https://lh3.googleusercontent.com/p/AF1QipP1mNXZxL3Gh0wbRnFURmKOFG5APBOe5zzya1a3=s1360-w1360-h1020', 'Profile Image'),
    ('2306019475', 'https://lh3.googleusercontent.com/p/AF1QipMcgI9PoZkB_waS7bsZvrF5Sq2qMG_2gY3GwYA4=s680-w680-h510', 'Profile Image'),
    ('5177421073', 'https://lh3.googleusercontent.com/p/AF1QipM-nAjWSq4HrEI0JdmNAZc4-a2Of26iStC3oB5T=s1360-w1360-h1020', 'Profile Image');
  `;

  // Execute all queries in sequence
  return db.runSql(clearTables)
    .then(() => db.runSql(insertCategories))
    .then(() => db.runSql(insertTags))
    .then(() => db.runSql(insertListings))
    .then(() => db.runSql(insertListingCategories))
    .then(() => db.runSql(insertSocialMedia))
    .then(() => db.runSql(insertHours))
    .then(() => db.runSql(insertFeatured))
    .then(() => db.runSql(insertPhotos));
};

exports.down = function(db) {
  const sql = `
    SET FOREIGN_KEY_CHECKS = 0;
    TRUNCATE TABLE photos;
    TRUNCATE TABLE featured;
    TRUNCATE TABLE hours;
    TRUNCATE TABLE social_media;
    TRUNCATE TABLE listing_tags;
    TRUNCATE TABLE listing_category;
    TRUNCATE TABLE reviews;
    TRUNCATE TABLE listing;
    TRUNCATE TABLE tags;
    TRUNCATE TABLE category;
    SET FOREIGN_KEY_CHECKS = 1;
  `;
  return db.runSql(sql);
};

exports._meta = {
  version: 1
}; 