<script lang="ts">
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

	let { data } = $props();
	let allQuestions = $state(data.questions);

	let selectedCategory = $state<string | null>(null);
	let selectedTags = $state<Set<string>>(new Set());

	let expandedId = $state<number | null>(null);

	// Extract unique categories and tags
	let categories = $derived([...new Set(allQuestions.map(q => q.category))]);
	let allTags = $derived(() => {
		const tags = new Set<string>();
		allQuestions.forEach(q => {
			try {
				const qTags = JSON.parse(q.tags || '[]');
				qTags.forEach((t: string) => tags.add(t));
			} catch (e) {}
		});
		return [...tags];
	});

	let filteredQuestions = $derived(allQuestions.filter(q => {
		if (selectedCategory && q.category !== selectedCategory) return false;
		
		if (selectedTags.size > 0) {
			try {
				const qTags = JSON.parse(q.tags || '[]');
				const hasAllTags = [...selectedTags].every(t => qTags.includes(t));
				if (!hasAllTags) return false;
			} catch (e) {
				return false;
			}
		}
		
		return true;
	}));

	function toggleTag(tag: string) {
		const newTags = new Set(selectedTags);
		if (newTags.has(tag)) {
			newTags.delete(tag);
		} else {
			newTags.add(tag);
		}
		selectedTags = newTags;
	}

	function toggleExpand(id: number) {
		if (expandedId === id) {
			expandedId = null;
		} else {
			expandedId = id;
		}
	}
</script>

<div class="questions-page">
	<header>
		<div class="top-bar">
			<h1>题库</h1>
			<a href="/" class="back">返回首页</a>
		</div>
	</header>

	<aside class="filters">
		<div class="filter-group">
			<h3>分类</h3>
			<div class="chips">
				<button 
					class="chip" 
					class:active={selectedCategory === null} 
					onclick={() => selectedCategory = null}
				>全部</button>
				{#each categories as cat}
					<button 
						class="chip" 
						class:active={selectedCategory === cat} 
						onclick={() => selectedCategory = cat}
					>{cat.toUpperCase()}</button>
				{/each}
			</div>
		</div>

		<div class="filter-group">
			<h3>标签 (多选)</h3>
			<div class="chips">
				{#each allTags() as tag}
					<button 
						class="chip" 
						class:active={selectedTags.has(tag)} 
						onclick={() => toggleTag(tag)}
					>{tag}</button>
				{/each}
			</div>
		</div>
	</aside>

	<main class="list">
		<div class="list-header">
			共 {filteredQuestions.length} 题
		</div>

		{#each filteredQuestions as q (q.id)}
			<div class="question-card" class:expanded={expandedId === q.id}>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="q-header" onclick={() => toggleExpand(q.id)}>
					<div class="q-title">
						<span class="difficulty difficulty-{q.difficulty}">L{q.difficulty}</span>
						{q.title}
					</div>
					<div class="q-meta">
						<span class="cat-badge">{q.category}</span>
						{#each JSON.parse(q.tags || '[]') as tag}
							<span class="tag-badge">#{tag}</span>
						{/each}
					</div>
				</div>
				
				{#if expandedId === q.id}
					<div class="q-content">
						<h4>问题</h4>
						<MarkdownRenderer content={q.content} />
						<hr />
						<h4>答案</h4>
						<MarkdownRenderer content={q.answer} />
					</div>
				{/if}
			</div>
		{:else}
			<div class="empty">没有找到匹配的题目</div>
		{/each}
	</main>
</div>

<style lang="scss">
	.questions-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem 1rem;
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 2rem;
		align-items: start;

		@include mobile {
			grid-template-columns: 1fr;
		}
	}

	header {
		grid-column: 1 / -1;

		.top-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			h1 {
				font-size: 2rem;
				margin: 0;
			}
			
			.back {
				color: var(--text-muted, #6c7086);
				text-decoration: none;
				&:hover { text-decoration: underline; }
			}
		}
	}

	.filters {
		background: var(--surface, #1e1e2e);
		padding: 1.5rem;
		border-radius: var(--radius-md, 8px);
		position: sticky;
		top: 2rem;

		.filter-group {
			margin-bottom: 2rem;

			h3 {
				font-size: 0.9rem;
				color: var(--text-muted, #6c7086);
				margin-bottom: 1rem;
				text-transform: uppercase;
			}

			.chips {
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;

				.chip {
					background: var(--surface-hover, #2a2a3e);
					border: 1px solid transparent;
					color: var(--text, #cdd6f4);
					padding: 0.4rem 0.8rem;
					border-radius: 99px;
					font-size: 0.85rem;
					cursor: pointer;
					transition: all 0.2s;

					&:hover {
						background: rgba(59, 130, 246, 0.2);
					}

					&.active {
						background: var(--primary, #3b82f6);
						color: white;
					}
				}
			}
		}
	}

	.list {
		.list-header {
			margin-bottom: 1rem;
			color: var(--text-muted, #6c7086);
			font-size: 0.9rem;
		}

		.question-card {
			background: var(--surface, #1e1e2e);
			border-radius: var(--radius-md, 8px);
			margin-bottom: 1rem;
			overflow: hidden;
			transition: background 0.2s;

			&:hover {
				background: var(--surface-hover, #2a2a3e);
			}

			&.expanded {
				background: var(--surface-hover, #2a2a3e);
			}

			.q-header {
				padding: 1.5rem;
				cursor: pointer;
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 1rem;

				@include mobile {
					flex-direction: column;
					align-items: flex-start;
				}

				.q-title {
					font-weight: bold;
					font-size: 1.1rem;
					display: flex;
					align-items: center;
					gap: 0.5rem;

					.difficulty {
						font-size: 0.7rem;
						padding: 0.2rem 0.4rem;
						border-radius: 4px;
						color: #111;

						&-1 { background: var(--success, #a6e3a1); }
						&-2 { background: var(--warning, #f9e2af); }
						&-3 { background: var(--danger, #f38ba8); }
					}
				}

				.q-meta {
					display: flex;
					gap: 0.5rem;
					flex-wrap: wrap;

					.cat-badge {
						background: rgba(255,255,255,0.1);
						padding: 0.2rem 0.5rem;
						border-radius: 4px;
						font-size: 0.8rem;
						text-transform: uppercase;
					}

					.tag-badge {
						color: var(--primary, #3b82f6);
						font-size: 0.8rem;
					}
				}
			}

			.q-content {
				padding: 0 1.5rem 1.5rem;
				border-top: 1px solid rgba(255,255,255,0.05);
				margin-top: 1rem;

				h4 {
					color: var(--text-muted, #6c7086);
					font-size: 0.9rem;
					margin: 1.5rem 0 0.5rem;
				}

				hr {
					border: none;
					border-top: 1px dashed rgba(255,255,255,0.1);
					margin: 2rem 0;
				}
			}
		}

		.empty {
			text-align: center;
			padding: 4rem;
			color: var(--text-muted, #6c7086);
		}
	}
</style>
