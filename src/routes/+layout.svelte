<script lang="ts">
	import '../app.scss';
	import { Navigation, NavigationItemType, Color } from '@iroco/ui';
	import { _ } from 'svelte-i18n';
	import { base } from '$app/paths';
	import { version } from '$app/environment';
</script>

<Navigation
	navigationItems={[
		{
			hrefOrCallback: `${base}/`,
			name: $_('sidebar.account'),
			type: NavigationItemType.ANCHOR
		},
		{
			hrefOrCallback: `${base}/addressbooks`,
			name: $_('sidebar.addressbooks'),
			type: NavigationItemType.ANCHOR
		},
		{
			hrefOrCallback: `${base}/calendars`,
			name: $_('sidebar.calendars'),
			type: NavigationItemType.ANCHOR
		},
		{
			hrefOrCallback: `${base}/folders`,
			name: $_('sidebar.folders'),
			type: NavigationItemType.ANCHOR
		}
	]}
	type="sidebar"
	title={$_('account.title')}
	{version}
	color={Color.blue}
/>

<main class="main">
	<slot />
</main>

<style lang="scss">
	@use '../../node_modules/@iroco/ui/dist/scss/colors';
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
