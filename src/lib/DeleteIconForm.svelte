<script lang="ts">
	import { Button, IconTrashCan } from '@iroco/ui';
	import { enhance } from '$app/forms';
	export let action = '';
	export let name: string;
	export let row;
</script>

<form method="POST" action={`?/${action}`} use:enhance>
	<input type="hidden" {name} value={row.email} />
	<Button size="small" kind="danger" type="submit">
		<IconTrashCan stroke={'white'} width="20px" height="20px" />
	</Button>
</form>
