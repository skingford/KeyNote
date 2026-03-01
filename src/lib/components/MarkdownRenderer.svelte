<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { codeToHtml } from 'shiki';
	import mermaid from 'mermaid';

	let { content }: { content: string } = $props();
	
	let htmlContent = $state('');
	let container: HTMLElement;

	// We'll parse async because shiki is async
	async function renderMarkdown(text: string) {
		const tokens = marked.lexer(text);
		
		for (const token of tokens) {
			if (token.type === 'code') {
				if (token.lang === 'mermaid') {
					// We'll just render it as a div with mermaid class
					token.type = 'html';
					token.text = `<div class="mermaid">${token.text}</div>`;
				} else {
					try {
						const lang = token.lang || 'text';
						const html = await codeToHtml(token.text, {
							lang,
							theme: 'vitesse-dark'
						});
						token.type = 'html';
						token.text = html;
					} catch (e) {
						console.error("Shiki error:", e);
					}
				}
			}
		}

		htmlContent = marked.parser(tokens);
	}

	$effect(() => {
		if (content) {
			renderMarkdown(content).then(() => {
				if (container) {
					mermaid.initialize({ startOnLoad: false, theme: 'dark' });
					mermaid.run({ nodes: container.querySelectorAll('.mermaid') }).catch(() => {});
				}
			});
		}
	});

	onMount(() => {
		mermaid.initialize({ startOnLoad: false, theme: 'dark' });
	});
</script>

<div class="markdown-body" bind:this={container}>
	{@html htmlContent}
</div>

<style lang="scss">
	.markdown-body {
		font-family: inherit;
		line-height: 1.6;

		:global(pre) {
			background: #1e1e2e;
			padding: 1rem;
			border-radius: 8px;
			overflow-x: auto;
		}

		:global(code) {
			font-family: 'Fira Code', monospace;
			font-size: 0.9em;
		}

		:global(.mermaid) {
			display: flex;
			justify-content: center;
			background: white;
			padding: 1rem;
			border-radius: 8px;
			margin: 1rem 0;
		}
	}
</style>
