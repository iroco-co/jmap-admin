<script lang="ts">
	/* eslint svelte/no-at-html-tags: "off" */
	import { _, number } from 'svelte-i18n';
	import { envelope } from 'svelte-awesome/icons';
	import { Color } from '@iroco/ui';

	import type { PageData } from './$types';
	import Icon from 'svelte-awesome';
	import { Role, FormStatus } from '../../domain';
	import { humanSize } from '$lib/strings';

	function getRoleColor(role: Role) {
		if (role == Role.Temporary) return Color.red;
		else if (role == Role.Trial) return Color.yellow;
		else if (role == Role.User) return Color.green;
		else if (role == Role.Admin) return Color.blue;
		else if (role == Role.SuperAdmin) return Color.beige;
	}
	export let data: PageData;
	const roleColor = getRoleColor(data.role);
</script>

<section class="account">
	<h1>{$_('account.home.title')}</h1>
	<div class="account__user">
		<p class="account__user__email">
			{$_('account.home.your_email')} <span>{data.email}</span>
			<span title={$_(`account.home.role.${data.role.toString()}`)}
				><Icon data={envelope} style="color: {roleColor}" /></span
			>
		</p>
	</div>
	{#if data.jmapStatus === FormStatus.Error}
		<p class="error">{$_(data.key)}</p>
	{:else}
		<div class="account__quota">
			{$_('account.home.quota')}
			<span
				>{humanSize(data.quota.used, $_('common.sizeStr'))}/{humanSize(
					data.quota.total,
					$_('common.sizeStr')
				)}
				({$number(data.quota.used / data.quota.total, { style: 'percent' })})</span
			>
		</div>
	{/if}
	<p>
		{@html $_('account.home.unsubscribe')}
	</p>
</section>

<style lang="scss">
	@use 'node_modules/@iroco/ui/dist/scss/colors';
	.account {
		span {
			font-weight: bold;
			font-size: medium;
		}
		&__user {
			&__username {
				color: colors.$green;
			}
		}
	}
</style>
