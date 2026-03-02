<script lang="ts">
	import { marked } from 'marked';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-go';
	import 'prismjs/components/prism-sql';
	import 'prismjs/components/prism-bash';
	import 'prismjs/components/prism-json';
	import 'prismjs/themes/prism-tomorrow.css';

	let { content } = $props<{ content: string }>();

	let htmlContent = $derived.by(() => {
		try {
			return marked.parse(content || '') as string;
		} catch (e) {
			return content || '';
		}
	});

	let container: HTMLElement;

	$effect(() => {
		// Re-run prism whenever htmlContent changes
		if (container && htmlContent) {
			// small delay to let DOM update
			setTimeout(() => {
				Prism.highlightAllUnder(container);
			}, 0);
		}
	});
</script>

<div bind:this={container} class="prose prose-invert max-w-none 
	prose-pre:bg-[#1d1f21] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-lg
	prose-a:text-accent hover:prose-a:text-accent-hover
	prose-blockquote:border-l-accent prose-blockquote:bg-surface-hover/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:font-normal prose-blockquote:not-italic
	prose-table:w-full prose-table:my-6 prose-table:border-collapse prose-th:border-b-2 prose-th:border-surface-hover prose-td:border-b prose-td:border-surface-hover prose-tr:transition-colors hover:prose-tr:bg-surface-hover/20">
	{@html htmlContent}
</div>

<style>
	/* Specific tweaks for architecture comparison tables */
	:global(.prose table) {
		font-size: 0.9em;
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}
	:global(.prose th) {
		background-color: var(--color-surface-hover);
		padding: 0.75rem 1rem;
		text-align: left;
	}
	:global(.prose td) {
		padding: 0.75rem 1rem;
	}
	/* Overrides for PrismJs tomorrow night theme to blend better */
	:global(pre[class*="language-"]) {
		margin: 1.5em 0;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
	}
	:global(code[class*="language-"]), :global(pre[class*="language-"]) {
		font-family: var(--font-mono);
		font-size: 0.9em;
	}
</style>
