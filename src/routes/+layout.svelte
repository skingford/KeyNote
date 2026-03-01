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

<!-- We don't import app.scss here because svelte.config.js is already prepending it for SCSS variables 
     but we need to ensure the reset and global styles actually take effect in the browser. 
     Usually, an app.css or app.scss is imported in layout to apply globally. -->
<script module>
	// This ensures the global app.scss is loaded into the bundle
	import '../app.scss';
</script>

<div class="app-layout">
	<nav class="navbar">
		<div class="nav-content">
			<a href="/" class="brand" onclick={closeMenu}>KeyNote</a>
			
			<button class="menu-toggle" onclick={toggleMenu} aria-label="Toggle menu">
				{#if isMenuOpen}
					✕
				{:else}
					☰
				{/if}
			</button>

			<ul class="nav-links" class:open={isMenuOpen}>
				<li>
					<a href="/" class:active={$page.url.pathname === '/'} onclick={closeMenu}>
						首页
					</a>
				</li>
				<li>
					<a href="/study" class:active={$page.url.pathname === '/study'} onclick={closeMenu}>
						背题
					</a>
				</li>
				<li>
					<a href="/questions" class:active={$page.url.pathname === '/questions'} onclick={closeMenu}>
						题库
					</a>
				</li>
			</ul>
		</div>
	</nav>

	<main class="main-content">
		{@render children()}
	</main>
</div>

<style lang="scss">
	.app-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.navbar {
		background: var(--surface);
		border-bottom: 1px solid rgba(255,255,255,0.05);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.brand {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--primary);
		text-decoration: none;
		&:hover { text-decoration: none; }
	}

	.menu-toggle {
		display: none;
		background: none;
		border: none;
		color: var(--text);
		font-size: 1.5rem;
		cursor: pointer;

		@include mobile {
			display: block;
		}
	}

	.nav-links {
		list-style: none;
		display: flex;
		gap: 2rem;
		margin: 0;
		padding: 0;

		@include mobile {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background: var(--surface);
			flex-direction: column;
			gap: 0;
			border-bottom: 1px solid rgba(255,255,255,0.05);
			
			&.open {
				display: flex;
			}
		}

		li {
			@include mobile {
				width: 100%;
			}
		}

		a {
			color: var(--text-muted);
			font-weight: 500;
			padding: 0.5rem 0;
			display: block;
			
			@include mobile {
				padding: 1rem 2rem;
				border-top: 1px solid rgba(255,255,255,0.05);
			}

			&:hover, &.active {
				color: var(--primary);
				text-decoration: none;
			}
		}
	}

	.main-content {
		flex: 1;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;

		@include mobile {
			padding: 1rem;
		}
	}
</style>
