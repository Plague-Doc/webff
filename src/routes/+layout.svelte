<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import SiteFooter from '$lib/components/site-footer.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ffcore } from '$lib/utils/ffcore.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	onMount(async () => {
		if (!ffcore.ffmpeg) ffcore.load();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-center" richColors={true} />

<SiteHeader />

<main class="container mx-auto flex-1 p-4 pt-12">
	{@render children()}
</main>

<SiteFooter />
