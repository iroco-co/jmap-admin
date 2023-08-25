export const up = async (knex) => {
	return knex.schema.createTable('event', function (table) {
		table.increments('id')
		table.integer('type').notNullable()
		table.timestamp('ts').defaultTo(knex.fn.now()).notNullable()
		table.string('user_id').notNullable()
	})
}

export const down = async (knex) => {
	return knex.schema.dropTable('event')
}
