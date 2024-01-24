import '@testing-library/jest-dom/extend-expect';

import {init} from 'svelte-i18n';

import {Account, createAccount, type Response} from "../../src/lib/jmap";

init({ fallbackLocale: 'en', initialLocale: 'en' });
describe('Create account', () => {
	test('list one create account', async () => {
		const response: Response<Account> = await createAccount("admin", "jwt", {accountId: "user/foo@bar.com"});
		expect(response.state).toEqual("200");
	});
});
