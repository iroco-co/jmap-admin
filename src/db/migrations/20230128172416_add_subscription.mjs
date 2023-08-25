export const up = async (knex) => {
	return knex.schema.createTable('subscription', function (table) {
		table.increments('id');
		table.string('name', 64);
		table.integer('amount').notNullable();
		table.string('currency', 3).notNullable();
		table.string('locale', 5).notNullable();
		table.smallint('period').notNullable();
		table.bigint('quantity').notNullable();
		table.boolean('available').defaultTo(true);
	});
};

export const down = async (knex) => {
	return knex.schema.dropTable('subscription');
};
