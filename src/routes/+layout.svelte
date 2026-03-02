<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	let { children } = $props();

	let pathname = $derived(page.url.pathname);

	function navClass(href: string) {
		const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
		return isActive
			? 'text-sm text-primary bg-surface-hover px-4 py-2 rounded-md font-medium shadow-sm border border-white/10 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-colors [-webkit-tap-highlight-color:transparent]'
			: 'text-sm text-secondary hover:text-primary hover:bg-surface/60 px-4 py-2 rounded-md font-medium border border-transparent outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 transition-colors [-webkit-tap-highlight-color:transparent]';
	}
</script>

<div class="min-h-[100dvh] bg-base text-primary flex flex-col font-sans">
	<header class="glass sticky top-0 z-50 p-4 shrink-0 flex items-center justify-between border-b border-white/5 shadow-sm">
		<a href="/" class="text-xl font-bold tracking-tight inline-flex items-center gap-2 hover:text-accent transition-colors">
			<span class="text-accent text-2xl leading-none">▲</span>
			<span class="text-gradient">Go+架构</span>
		</a>
		<nav class="flex gap-4 items-center">
			<a href="/" class={navClass('/')}>Dashboard</a>
			<a href="/import" class={navClass('/import')}>Import</a>
			<a href="/categories" class={navClass('/categories')}>Categories</a>
		</nav>
	</header>
	<main class="flex-grow flex flex-col items-center p-4 sm:p-8 max-w-5xl mx-auto w-full">
		{@render children()}
	</main>
</div>
