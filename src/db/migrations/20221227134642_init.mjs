export const up = async (knex) => {
	return knex.schema
		.createTable('virtual_domain', function (table) {
			table.increments('id')
			table.string('name', 64).notNullable()
			table.string('dkim_selector', 16)
			table.text('dkim_private_key')
			table.boolean('available').defaultTo(false)
		})
		.createTable('user', function (table) {
			table.string('email', 255).notNullable().primary()
			table.string('firstname', 255)
			table.string('lastname', 255)
			table.string('password', 255)
			table.string('password_code', 255)
			table.integer('vdomain_id').references('virtual_domain.id')
			table.tinyint('role').defaultTo(1)
			table.datetime('creation_date').notNullable().defaultTo(knex.fn.now())
		})
		.createTable('virtual_alias', function (table) {
			table.increments('id')
			table.integer('domain_id').references('virtual_domain.id')
			table.string('source', 255)
			table.string('destination', 255).references('user.email')
		})
		.createTable('mandate', function (table) {
			table.string('id', 16).notNullable().primary()
			table.string('user_email', 255).notNullable().references('user.email')
			table.datetime('creation_date').notNullable().defaultTo(knex.fn.now())
		})
}

export const down = async (knex) => {
	return knex.schema
		.dropTable('virtual_alias')
		.dropTable('mandate')
		.dropTable('user')
		.dropTable('virtual_domain')
}
