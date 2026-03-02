<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<script module>
	import '../app.css';
</script>

<div class="min-h-screen flex flex-col bg-base text-primary font-sans selection:bg-accent/30">
	<nav class="sticky top-0 z-50 glass border-b border-white/10 transition-all duration-300">
		<div class="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
			<a href="/" class="text-xl font-bold tracking-tight text-white hover:text-accent transition-colors" onclick={closeMenu}>
				Key<span class="text-accent">Note</span>
			</a>
			
			<button class="md:hidden text-secondary hover:text-white transition-colors" onclick={toggleMenu} aria-label="Toggle menu">
				{#if isMenuOpen}
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
				{/if}
			</button>

			<ul class="
				{isMenuOpen ? 'flex' : 'hidden'} 
				absolute top-full left-0 right-0 glass flex-col p-4 gap-4 border-b border-white/10
				md:static md:flex md:flex-row md:p-0 md:bg-transparent md:border-none md:gap-8 md:backdrop-blur-none
			">
				<li>
					<a href="/" 
					   class="block text-sm font-medium transition-colors hover:text-white {$page.url.pathname === '/' ? 'text-white' : 'text-secondary'}" 
					   onclick={closeMenu}>
						Overview
					</a>
				</li>
				<li>
					<a href="/study" 
					   class="block text-sm font-medium transition-colors hover:text-white {$page.url.pathname === '/study' ? 'text-white' : 'text-secondary'}" 
					   onclick={closeMenu}>
						Study
					</a>
				</li>
				<li>
					<a href="/questions" 
					   class="block text-sm font-medium transition-colors hover:text-white {$page.url.pathname === '/questions' ? 'text-white' : 'text-secondary'}" 
					   onclick={closeMenu}>
						Library
					</a>
				</li>
			</ul>
		</div>
	</nav>

	<main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
		{@render children()}
	</main>
</div>
