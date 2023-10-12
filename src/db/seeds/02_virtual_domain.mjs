export const seed = async (knex) => {
	await knex('virtual_domain').del();
	await knex('virtual_domain').insert([
		{
			id: 1,
			name: 'iroco.fr',
			dkim_selector: 'dkim',
			dkim_private_key: 'private_iroco_fr',
			available: false
		},
		{
			id: 2,
			name: 'iroco.co',
			dkim_selector: 'dkim',
			dkim_private_key: 'private_iroco_co',
			available: true
		},
		{
			id: 3,
			name: 'iroco.io',
			dkim_selector: 'dkim',
			dkim_private_key: 'private_iroco_io',
			available: true
		}
	]);
	await knex.raw("SELECT setval('virtual_domain_id_seq', (SELECT MAX(id) from virtual_domain))");
};
