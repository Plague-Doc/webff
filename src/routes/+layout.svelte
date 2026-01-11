<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import SiteFooter from '$lib/components/site-footer.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ffcore } from '$lib/utils/ffcore.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	onMount(async () => {
		if (!ffcore.ffmpeg) ffcore.load();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href="/fonts/inter-italic.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<ModeWatcher />

<Toaster position="top-center" richColors={true} />

<SiteHeader />

<main class="container mx-auto flex-1 p-4 pt-12">
	{@render children()}
</main>

<SiteFooter />
