import '@testing-library/jest-dom/extend-expect';
import { render, waitFor } from '@testing-library/svelte';
import { screen } from '@testing-library/dom';
import index from '../../../src/routes/+page.svelte';

import { addMessages, init } from 'svelte-i18n';

import en from '../../../src/lib/i18n/en.json';
import { Role } from '../../../src/domain';

addMessages('en', en);
init({ fallbackLocale: 'en', initialLocale: 'en' });
describe('Account information', () => {
	test('render page', async () => {
		render(index, {
			data: {
				email: 'foo@bar.com',
				role: Role.User,
				quota: { id: 'mail', used: 50, total: 200 }
			}
		});
		screen.getByText('Welcome');

		await waitFor(() => expect(screen.getByText('foo@bar.com')).toBeInTheDocument());
		screen.getByText('50 B/200 B (25%)');
	});
});
