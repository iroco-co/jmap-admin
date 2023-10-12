import { request } from '../request';
import { createForm } from '../../src/lib/forms';
import { repository } from '../../src/lib/server/db';
import { actions } from '../../src/routes/account/users/+page.server';
import { Role } from '../../src/domain';

beforeAll(async () => {
	await repository.saveDomain({
		name: 'bar.com',
		dkim_selector: 'dkim',
		dkim_private_key: 'private',
		dkim_public_key: 'public',
		available: false
	});
});

afterEach(async () => {
	await repository.db('user').del();
});

afterAll(async () => {
	await repository.db('virtual_domain').del().where('name', 'bar.com');
});

test('create user', async () => {
	const response = await request(actions.default, {
		locals: { email: 'foo@bar.com' },
		body: createForm({
			user_email: 'qux@bar.com',
			user_password: 'password',
			user_role: 'User',
			user_password_code: 'code',
			user_first_name: 'Qux',
			user_last_name: 'Bar'
		})
	});
	expect(response).toEqual({ status: 0 });

	const actual_user = await repository.getFullUser('qux@bar.com');
	const actual_domain = await repository.getDomainById(actual_user.vdomain_id);
	expect(actual_user).toBeDefined();
	expect(actual_domain).toBeDefined();
	expect(actual_domain.name).toEqual('bar.com');
	expect(actual_user.email).toEqual('qux@bar.com');
	expect(actual_user.role).toEqual(Role.User);

	expect(actual_user.firstname).toEqual('Qux');
	expect(actual_user.lastname).toEqual('Bar');
	expect(actual_user.password).toBeDefined();
	expect(actual_user.password_code).toBeDefined();
});
