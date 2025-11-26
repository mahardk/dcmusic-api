export const up = (pgm) => {
  pgm.alterColumn('users', 'password', {
    type: 'VARCHAR(255)',
    notNull: true,
  });
};

export const down = (pgm) => {
  pgm.alterColumn('users', 'password', {
    type: 'VARCHAR(50)',
    notNull: true,
  });
};
