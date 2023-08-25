export const seed = async (knex) => {
	await knex('subscription').del();
	await knex('subscription').insert([
		{
			id: 1,
			name: 'standard',
			amount: 360,
			currency: 'EUR',
			locale: 'fr-FR',
			period: 0,
			quantity: '5368709120',
			available: true
		}
	]);
};
