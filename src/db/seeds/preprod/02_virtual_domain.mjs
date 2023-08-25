export const seed = async (knex) => {
	await knex('virtual_domain').del();
	await knex('virtual_domain').insert([
		{
			id: 1,
			name: 'test.iroco.co',
			dkim_selector: 'dkim',
			dkim_private_key: process.env.PREPROD_DKIM_KEY,
			available: true
		},
		{
			id: 2,
			name: 'test.iroco.io',
			dkim_selector: 'dkim',
			dkim_private_key: 'private_test_iroco_io',
			available: false
		}
	]);
};
