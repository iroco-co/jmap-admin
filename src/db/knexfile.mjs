import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}.local`, override: true });
function localDatabase(host, dbname, seedPath) {
	return {
		client: 'postgresql',
		connection: {
			host: host,
			database: dbname,
			user: 'iroco',
			password: 'iroco'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './migrations',
			loadExtensions: ['.js', '.mjs', '.cjs']
		},
		seeds: {
			directory: seedPath,
			loadExtensions: ['.js', '.mjs', '.cjs']
		}
	};
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
	test: localDatabase('postgresql', 'test', './seeds'),
	dev: localDatabase('postgresql', 'iroco', './seeds'),
	prod: localDatabase('localhost', 'iroco2', './seeds/prod'),
	preprod: localDatabase('localhost', 'iroco2', './seeds/preprod'),
	bench: localDatabase('localhost', 'iroco2', './seeds/bench')
};
/** ignored by knex */
export default config;
/** Named exports: or knex won't find them */
export const { client, connection, useNullAsDefault, migrations, seeds } = config;
