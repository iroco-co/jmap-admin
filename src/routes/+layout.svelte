<script lang="ts">
	import { Navigation, NavigationItemType } from '@iroco/ui'
	import { _ } from 'svelte-i18n'
	import type { PageData } from './$types'
	export let data: PageData
</script>

<Navigation
	navigationItems={[
		{
			hrefOrCallback: '/app/account',
			name: $_('sidebar.account')
		},
		{
			hrefOrCallback: '/app/account/payment',
			name: $_('sidebar.payment')
		},
		{
			hrefOrCallback: '/app/account/aliases',
			name: $_('account.sidebar.aliases')
		},
		{
			hrefOrCallback: '/logout',
			name: $_('account.sidebar.logout'),
			type: NavigationItemType.FORM
		}
	]}
	type="sidebar"
	title={$_('account.title')}
	version={data?.version}
/>

<main class="main">
	<slot />
</main>

<style lang="scss">
	@use 'node_modules/@iroco/ui/scss/colors';
	:global html > body {
		background: colors.$nightBlue;
		.navigation,
		.nav__sidebar {
			background: colors.$darkBlue;
			border-bottom: 1px solid colors.$mediumGrey;
		}
		.nav__sidebar {
			height: 100%;
			border-right: 1px solid colors.$mediumGrey;
			&__item {
				a {
					font-size: 1.5em;
					color: colors.$beige;
				}
				button {
					font-size: 1.5em;
				}
			}
		}
	}
	.main {
		margin-top: 5em;
		:global section {
			padding-left: 2em;
			> h1 {
				margin-top: 0;
				padding-top: 1em;
			}
		}
	}
	@media all and (min-width: 768px) {
		.main {
			margin-top: 0;
			margin-left: 300px;
		}
	}
</style>
