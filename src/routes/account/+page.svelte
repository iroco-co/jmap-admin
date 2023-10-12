<script lang="ts">
	/* eslint svelte/no-at-html-tags: "off" */
	import { _, number } from 'svelte-i18n'
	import { envelope } from 'svelte-awesome/icons'
	import { Alert, Color } from '@iroco/ui'

	import type { PageData } from './$types'
	import Icon from 'svelte-awesome'
	import { PUBLIC_TRIAL_PERIOD_DAYS } from '$env/static/public'
	import { DateTime } from 'luxon'
	import { Role, FormStatus } from "../../domain";
	import { humanSize } from "$lib/strings";

	let temporaryAlertOpen = true

	function getRoleColor(role: Role) {
		if (role == Role.Temporary) return Color.red
		else if (role == Role.Trial) return Color.yellow
		else if (role == Role.User) return Color.green
		else if (role == Role.Admin) return Color.blue
		else if (role == Role.SuperAdmin) return Color.beige
	}
	export let data: PageData
	const roleColor = getRoleColor(data.user.role)
	const daysLeft =
		Number(PUBLIC_TRIAL_PERIOD_DAYS) +
		Math.round(DateTime.fromJSDate(data.user.creation_date).diffNow('days').days)
</script>

<section class="account">
	<h1>{$_('account.home.title')}</h1>
	<div class="account__user">
		{#if data.user.role === Role.Temporary && temporaryAlertOpen}
			<Alert
				type="flash"
				callback={() => {
					temporaryAlertOpen = false
				}}
			>
				<h3>{$_('account.home.activate.title')}</h3>
				{@html $_('account.home.activate.text')}
			</Alert>
		{/if}
		<p class="account__user__username">
			<span>{data.user.firstname}</span> <span>{data.user.lastname}</span>
		</p>
		<p class="account__user__email">
			{$_('account.home.your_email')} <span>{data.user.email}</span>
			<span title={$_(`account.home.role.${data.user.role.toString()}`)}
				><Icon data={envelope} style="color: {roleColor}" /></span
			>
		</p>
		{#if data.user.role === Role.Trial || data.user.role === Role.Temporary}
			<p>{$_('account.home.daysleft', { values: { daysLeft } })}</p>
		{/if}
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
