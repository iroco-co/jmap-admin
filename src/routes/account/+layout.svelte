<script lang="ts">
	import { Navigation, NavigationItemType, Color } from '@iroco/ui';
	import { _ } from 'svelte-i18n';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<Navigation
	navigationItems={[
		{
			hrefOrCallback: '/account',
			name: $_('sidebar.account'),
			type: NavigationItemType.ANCHOR
		},
		{
			hrefOrCallback: '/account/addressbooks',
			name: $_('sidebar.addressbooks'),
			type: NavigationItemType.ANCHOR
		},
		{
			hrefOrCallback: '/account/calendars',
			name: $_('sidebar.calendars'),
			type: NavigationItemType.ANCHOR
		},
		{
			hrefOrCallback: '/account/folders',
			name: $_('sidebar.folders'),
			type: NavigationItemType.ANCHOR
		},
		{
			hrefOrCallback: '/account/logout',
			name: $_('sidebar.logout'),
			type: NavigationItemType.FORM
		}
	]}
	type="sidebar"
	title={$_('account.title')}
	version={data?.version}
	color={Color.blue}
/>

<main class="main">
	<slot />
</main>

<style lang="scss">
	@use 'node_modules/@iroco/ui/dist/scss/colors';
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
