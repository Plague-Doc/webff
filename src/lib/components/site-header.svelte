<script lang="ts">
	import { SunMoon } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from './ui/button';
</script>

<header class="sticky top-0 z-50 w-full">
	<nav class="flex h-14 items-center justify-between px-8">
		<div class="flex items-center gap-0.5">
			<Button variant="ghost" href="/" class="gap-0 text-lg font-bold">
				<span>Web</span>
				<span class="text-primary">FF</span>
			</Button>
			<Button variant="ghost" href="/quick">Quick Convert</Button>
			<Button variant="ghost" disabled href="/web">Web Optimize</Button>
			<Button variant="ghost" disabled href="/compress">Compress Video</Button>
		</div>

		<div class="flex items-center">
			<Button variant="ghost" size="icon-lg" onclick={toggleMode}>
				<SunMoon class="size-6" />
			</Button>
		</div>
	</nav>
</header>
