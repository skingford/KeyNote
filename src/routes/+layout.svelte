<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-[100dvh] bg-base text-primary flex flex-col font-sans">
	<header class="glass sticky top-0 z-50 p-4 shrink-0 flex items-center justify-between border-b border-white/5 shadow-sm">
		<a href="/" class="text-xl font-bold tracking-tight inline-flex items-center gap-2 hover:text-accent transition-colors">
			<span class="text-accent text-2xl leading-none">▲</span>
			<span class="text-gradient">Go+架构</span>
		</a>
		<nav class="flex gap-4 items-center">
			<a href="/" class="text-sm text-secondary hover:text-primary transition font-medium">Dashboard</a>
			<a href="/import" class="text-sm text-primary hover:text-accent transition bg-surface-hover px-4 py-2 rounded-md font-medium shadow-sm border border-white/5">Import</a>
		</nav>
	</header>
	<main class="flex-grow flex flex-col items-center p-4 sm:p-8 max-w-5xl mx-auto w-full">
		{@render children()}
	</main>
</div>
