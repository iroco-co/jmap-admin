export const up = async (knex) => {
	return knex.schema.raw(
		`CREATE UNIQUE INDEX "unique_virtual_domain_name" ON "virtual_domain" ("name")`
	);
};

export const down = async (knex) => {
	return knex.schema.raw(`DROP UNIQUE INDEX "unique_virtual_domain_name"`);
};
