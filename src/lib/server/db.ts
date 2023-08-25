import knex from 'knex';
import { env } from '$env/dynamic/private';
import { Repository } from '$lib/server/repository';

const ds = knex({
	client: env.PG_DRIVER ?? 'pgnative',
	connection: env.PG_CONNECTION_URL,
	searchPath: ['knex', 'public']
});

const repository = new Repository(ds);

export { repository };
