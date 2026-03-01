<script lang="ts">
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let { data, form } = $props();

	// State for the study session
	let cards = $state(data.cards);
	let currentIndex = $state(0);
	let completed = $state(0);
	
	let currentCard = $derived(cards[currentIndex]);
	let total = $derived(cards.length);
	let progress = $derived(total === 0 ? 100 : (completed / total) * 100);
	let isDone = $derived(completed >= total || total === 0);

	let currentTags = $derived($page.url.searchParams.get('tags'));

	// Action to submit the rating to server and advance
	let ratingForm: HTMLFormElement;
	let currentRating = $state(0);

	function handleRate(rating: number) {
		currentRating = rating;
		// Submit the form programmatically
		requestAnimationFrame(() => {
			ratingForm.requestSubmit();
		});
		
		// Advance local state optimistically
		completed++;
		if (completed < total) {
			currentIndex++;
		}
	}
</script>

<div class="study-page">
	<header>
		<div class="top-bar">
			<h1>背题</h1>
			<a href="/" class="back">返回首页</a>
		</div>

		{#if currentTags}
			<div class="filter-bar">
				<span>筛选标签: {currentTags}</span>
				<a href="/study" class="clear-filter">清除筛选</a>
			</div>
		{/if}

		{#if !isDone}
			<div class="progress-container">
				<div class="progress-text">{completed} / {total}</div>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progress}%"></div>
				</div>
			</div>
		{/if}
	</header>

	<main>
		{#if isDone}
			<div class="all-done">
				<h2>🎉 今日任务全部完成！</h2>
				<p>休息一下，或者去<a href="/questions">题库</a>看看。</p>
			</div>
		{:else if currentCard}
			<!-- Hidden form for SvelteKit action -->
			<form 
				method="POST" 
				action="?/rate" 
				use:enhance 
				bind:this={ratingForm} 
				style="display: none;"
			>
				<input type="hidden" name="cardId" value={currentCard.cardId} />
				<input type="hidden" name="rating" value={currentRating} />
			</form>

			<Flashcard 
				question={currentCard.content} 
				answer={currentCard.answer} 
				onRate={handleRate} 
			/>
		{/if}
	</main>
</div>

<style lang="scss">
	.study-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	header {
		margin-bottom: 2rem;

		.top-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 1rem;
			
			h1 {
				font-size: 1.5rem;
				margin: 0;
			}
			
			.back {
				color: var(--text-muted, #6c7086);
				text-decoration: none;
				&:hover { text-decoration: underline; }
			}
		}
	}

	.progress-container {
		.progress-text {
			font-size: 0.9rem;
			color: var(--text-muted, #6c7086);
			margin-bottom: 0.5rem;
			text-align: right;
		}

		.progress-bar {
			width: 100%;
			height: 8px;
			background: var(--surface-hover, #2a2a3e);
			border-radius: 4px;
			overflow: hidden;

			.progress-fill {
				height: 100%;
				background: var(--primary, #3b82f6);
				transition: width 0.3s ease;
			}
		}
	}

	.all-done {
		text-align: center;
		padding: 4rem 2rem;
		background: var(--surface, #1e1e2e);
		border-radius: var(--radius-lg, 16px);
		
		h2 {
			color: var(--success, #a6e3a1);
			margin-bottom: 1rem;
		}
		
		a {
			color: var(--primary, #3b82f6);
			text-decoration: none;
			&:hover { text-decoration: underline; }
		}
	}
</style>
