<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { PageState } from '$lib/utils/utils';

	let { pageState, open, target = $bindable() }: { pageState: PageState; open: boolean; target: string } = $props();
</script>

<!--
	<Select.Root type="single" bind:value={target}>
		<Select.Trigger class="w-48">Select format</Select.Trigger>
		<Select.Content>
			{#each getFormats(files) as format}
			<Select.Item value={format.label} />
			{/each}
		</Select.Content>
	</Select.Root>
-->

<Dialog.Root {open}>
	<Dialog.Content onOpenAutoFocus={(e) => e.preventDefault()}>
		<Dialog.Header>
			<Dialog.Title>Select format</Dialog.Title>
			<Dialog.Description>Select the format you want your media files to be converted into.</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
