<script lang="ts">
	import { marked } from 'marked';
	import Prism from 'prismjs';
	import mermaid from 'mermaid';
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

	async function runGoCode(code: string, outputDiv: HTMLElement) {
		outputDiv.innerHTML = '<span class="text-secondary animate-pulse">Running...</span>';
		outputDiv.style.display = 'block';
		try {
			const res = await fetch('https://go.dev/_/compile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({ version: '2', body: code })
			});
			const data = await res.json();
			if (data.Errors) {
				outputDiv.innerHTML = `<span class="text-danger">${data.Errors}</span>`;
			} else {
				const out = data.Events ? data.Events.map((e: any) => e.Message).join('') : 'Program exited.';
				outputDiv.innerHTML = `<span class="text-success font-mono whitespace-pre-wrap">${out || 'Success'}</span>`;
			}
		} catch (e: any) {
			outputDiv.innerHTML = `<span class="text-danger">Failed to connect to Go Playground: ${e.message}</span>`;
		}
	}

	$effect(() => {
		// Re-run prism whenever htmlContent changes
		if (container && htmlContent) {
			// small delay to let DOM update
			setTimeout(async () => {
				Prism.highlightAllUnder(container);

				// Add Go Playground Sandbox
				const goBlocks = container.querySelectorAll('pre > code.language-go');
				goBlocks.forEach((codeEl) => {
					const pre = codeEl.parentElement;
					if (!pre || pre.classList.contains('has-sandbox')) return;
					pre.classList.add('has-sandbox', 'relative', 'group');
					
					const runBtn = document.createElement('button');
					runBtn.className = 'absolute top-2 right-2 px-3 py-1 bg-surface-hover hover:bg-success/20 hover:text-success border border-white/10 rounded text-xs font-mono text-secondary transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1 cursor-pointer';
					runBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 3 14 9-14 9V3z"/></svg> Run`;
					
					const outputDiv = document.createElement('div');
					outputDiv.className = 'mt-2 p-3 bg-base border border-white/5 rounded-lg text-sm hidden';
					
					runBtn.onclick = () => runGoCode(codeEl.textContent || '', outputDiv);
					
					pre.appendChild(runBtn);
					pre.insertAdjacentElement('afterend', outputDiv);
				});

				// Initialize and render Mermaid diagrams
				mermaid.initialize({ startOnLoad: false, theme: 'dark', background: 'transparent' });
				const mermaidElements = container.querySelectorAll('.language-mermaid');
				for (let i = 0; i < mermaidElements.length; i++) {
					const el = mermaidElements[i];
					const pre = el.parentElement;
					if (pre && pre.tagName === 'PRE') {
						const code = el.textContent || '';
						try {
							const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
							const { svg } = await mermaid.render(id, code);
							
							const containerDiv = document.createElement('div');
							containerDiv.className = 'mermaid-container relative my-6 p-4 rounded-xl bg-surface/50 border border-white/10 cursor-pointer overflow-hidden group transition-all hover:border-white/20';
							containerDiv.innerHTML = `
								<div class="absolute top-2 right-2 text-xs font-mono text-secondary opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
									<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
									点击显示/隐藏关键节点
								</div>
								${svg}
							`;
							
							// Toggle reveal class on click
							containerDiv.onclick = () => {
								containerDiv.classList.toggle('revealed');
							};
							
							pre.replaceWith(containerDiv);
						} catch (e) {
							console.error('Mermaid render error:', e);
						}
					}
				}
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

	/* Mermaid Masking Feature */
	:global(.mermaid-container) {
		/* Center the SVG */
		display: flex;
		justify-content: center;
	}
	:global(.mermaid-container svg) {
		max-width: 100%;
		height: auto;
	}
	
	/* Blur out text in nodes to force recall */
	:global(.mermaid-container .node .label) {
		filter: blur(4px);
		opacity: 0.5;
		transition: all 0.3s ease;
	}
	:global(.mermaid-container .edgeLabel) {
		filter: blur(3px);
		opacity: 0.3;
		transition: all 0.3s ease;
	}

	/* Remove blur on click or hover */
	:global(.mermaid-container.revealed .node .label),
	:global(.mermaid-container.revealed .edgeLabel) {
		filter: blur(0);
		opacity: 1;
	}
</style>
