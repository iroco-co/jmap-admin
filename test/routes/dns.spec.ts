import { render } from '@testing-library/svelte';
import { screen } from '@testing-library/dom';
import dns from '../../src/routes/account/dns/+page.svelte';
import { addMessages, init } from 'svelte-i18n';

import en from '../../src/lib/i18n/en.json';

addMessages('en', en);
init({ fallbackLocale: 'en', initialLocale: 'en' });

test('render dns page', () => {
	render(dns, { data: { dkim_public_key: 'public_key' } });
	screen.getByText('DNS Zone configuration');
	// screen.getByText('dkim._domainkey         IN TXT    ( "h=sha256;k=rsa;p=public_key;t=s; )')
});
