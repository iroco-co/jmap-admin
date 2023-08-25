export const seed = async (knex) => {
	await knex('user').del();
};
