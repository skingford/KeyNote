<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import MarkdownRenderer from './MarkdownRenderer.svelte';

	let { question, answer, onRate } = $props<{
		question: string;
		answer: string;
		onRate: (rating: number) => void;
	}>();

	let flipped = $state(false);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			if (!flipped) flipped = true;
		}

		if (flipped) {
			if (event.key === '1') onRate(0); // Again
			if (event.key === '2') onRate(3); // Hard
			if (event.key === '3') onRate(4); // Good
			if (event.key === '4') onRate(5); // Easy
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		// Cannot use window.removeEventListener directly if SSR, but we are inside onMount
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
		}
	});

	// Reset flip state when question changes
	$effect(() => {
		let _q = question;
		flipped = false;
	});
</script>

<div class="flashcard" class:flipped onclick={() => { if (!flipped) flipped = true; }}>
	<div class="inner">
		<div class="front">
			<MarkdownRenderer content={question} />
			{#if !flipped}
				<div class="hint">点击或按空格翻转</div>
			{/if}
		</div>
		<div class="back">
			<MarkdownRenderer content={answer} />
		</div>
	</div>
</div>

{#if flipped}
	<div class="ratings">
		<button class="again" onclick={() => onRate(0)}>Again (1)</button>
		<button class="hard" onclick={() => onRate(3)}>Hard (2)</button>
		<button class="good" onclick={() => onRate(4)}>Good (3)</button>
		<button class="easy" onclick={() => onRate(5)}>Easy (4)</button>
	</div>
{/if}

<style lang="scss">
	.flashcard {
		perspective: 1000px;
		width: 100%;
		cursor: pointer;

		&.flipped {
			cursor: default;
			.inner {
				transform: rotateY(180deg);
			}
		}

		.inner {
			position: relative;
			width: 100%;
			transition: transform 0.6s;
			transform-style: preserve-3d;
			/* Using grid allows the container to grow to the height of the tallest child */
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr;
		}

		.front, .back {
			grid-area: 1 / 1; /* Both occupy the same grid cell */
			backface-visibility: hidden;
			background: var(--surface, #1e1e2e);
			padding: 2rem;
			border-radius: var(--radius-lg, 16px);
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: column;
			min-height: 400px;
		}

		.back {
			transform: rotateY(180deg);
			overflow-y: auto;
		}

		.hint {
			margin-top: auto;
			text-align: center;
			color: var(--text-muted, #6c7086);
			font-size: 0.9rem;
		}
	}

	.ratings {
		display: flex;
		justify-content: space-around;
		margin-top: 2rem;
		gap: 1rem;

		button {
			flex: 1;
			padding: 1rem;
			border: none;
			border-radius: var(--radius-md, 8px);
			font-weight: bold;
			cursor: pointer;
			color: #111;
			transition: opacity 0.2s;

			&:hover {
				opacity: 0.8;
			}

			&.again { background: var(--danger, #f38ba8); }
			&.hard { background: var(--warning, #f9e2af); }
			&.good { background: var(--success, #a6e3a1); }
			&.easy { background: var(--primary, #3b82f6); color: white; }
		}
	}
</style>
