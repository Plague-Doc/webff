<script lang="ts">
	import { Button } from './ui/button';
</script>

<header class="sticky top-0 z-50 w-full">
	<nav class="flex h-14 items-center justify-between px-8">
		<div class="flex items-center gap-0.5">
			<Button variant="ghost" href="/" class="gap-0 text-lg font-bold">
				<span class="text-lg text-primary">FF</span>
				<span>Core</span>
			</Button>
			<Button variant="ghost" href="/quick">Quick Convert</Button>
			<Button variant="ghost" href="/web">Web Optimize</Button>
			<Button variant="ghost" href="/compress">Compress Video</Button>
		</div>

		<div class="flex items-center gap-4">
			<Button variant="ghost" href="/">IDK</Button>
		</div>
	</nav>
</header>
