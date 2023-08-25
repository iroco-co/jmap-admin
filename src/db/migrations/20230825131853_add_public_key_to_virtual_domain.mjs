export const up = async (knex) => {
  return knex.schema.table('virtual_domain', table => {
    table.text('dkim_public_key');
  })
};

export const down = async (knex) => {
  return knex.schema.table('virtual_domain', table => {
    table.dropColumn('dkim_public_key');
  })
};
