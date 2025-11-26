export const up = (pgm) => {
  pgm.alterColumn('albums', 'name', {
    type: 'VARCHAR(255)',
    notNull: true,
  });

  pgm.alterColumn('songs', 'title', {
    type: 'VARCHAR(255)',
    notNull: true,
  });

  pgm.alterColumn('songs', 'genre', {
    type: 'VARCHAR(100)',
    notNull: true,
  });

  pgm.alterColumn('songs', 'performer', {
    type: 'VARCHAR(255)',
    notNull: true,
  });

};

export const down = (pgm) => {
  pgm.alterColumn('albums', 'name', {
    type: 'TEXT',
    notNull: true,
  });

  pgm.alterColumn('songs', 'title', {
    type: 'TEXT',
    notNull: true,
  });

  pgm.alterColumn('songs', 'genre', {
    type: 'TEXT',
    notNull: true,
  });

  pgm.alterColumn('songs', 'performer', {
    type: 'TEXT',
    notNull: true,
  });

};
