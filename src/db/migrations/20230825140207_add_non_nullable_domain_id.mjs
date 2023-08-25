export const up = async (knex) => {
	return knex.schema.raw(`alter table "user" alter column vdomain_id set not null;`);
};

export const down = async (knex) => {
	return knex.schema.raw(`alter table "user" alter column vdomain_id set null;`);
};
