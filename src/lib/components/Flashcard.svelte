<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import MarkdownRenderer from './MarkdownRenderer.svelte';

	let { question, answer, onRate, category, tags } = $props<{
		question: string;
		answer: string;
		onRate: (rating: number) => void;
		category?: string;
		tags?: string | null;
	}>();

	let revealed = $state(false);
	let answerRegion: HTMLElement | undefined = $state();

	let parsedTags = $derived.by(() => {
		try {
			return tags ? JSON.parse(tags) : [];
		} catch {
			return [];
		}
	});

	function revealAnswer() {
		if (revealed) return;
		revealed = true;

		requestAnimationFrame(() => {
			answerRegion?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		const target = event.target as HTMLElement | null;
		if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
			return;
		}

		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			if (!revealed) revealAnswer();
		}

		if (!revealed) return;

		if (event.key === '1') onRate(0);
		if (event.key === '2') onRate(3);
		if (event.key === '3') onRate(4);
		if (event.key === '4') onRate(5);
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
		}
	});

</script>

<div class="w-full flex flex-col gap-5">
	<section class="rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(45,45,45,0.94),rgba(30,30,30,0.94))] p-6 sm:p-8 shadow-[0_18px_55px_rgba(5,10,20,0.35)]">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div class="flex flex-wrap items-center gap-2">
				{#if category}
					<span class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-white uppercase">
						{category}
					</span>
				{/if}
				{#each parsedTags as tag (tag)}
					<span class="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent">
						#{tag}
					</span>
				{/each}
			</div>

		</div>

		<div class="mt-6 border-t border-white/8 pt-6">
			<p class="mb-3 text-xs font-semibold tracking-[0.22em] text-secondary">题目</p>
			<div class="prose prose-invert max-w-none text-white prose-p:leading-8 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/30 prose-code:text-accent">
				<MarkdownRenderer content={question} />
			</div>
		</div>

		{#if !revealed}
			<div class="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
				<p class="text-sm text-secondary">先独立思考，再展开答案</p>
				<button
					class="rounded-xl border border-accent/40 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
					onclick={revealAnswer}
				>
					显示答案 <span class="ml-1 font-mono text-xs text-accent/80">Space</span>
				</button>
			</div>
		{/if}
	</section>

	{#if revealed}
		<section
			bind:this={answerRegion}
			class="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(61,61,61,0.9),rgba(45,45,45,0.9))] p-6 sm:p-8 shadow-[0_14px_40px_rgba(4,8,16,0.25)]"
			in:fly={{ duration: 220, easing: cubicOut, y: 8 }}
		>
			<p class="mb-3 text-xs font-semibold tracking-[0.22em] text-secondary">答案与解释</p>
			<div class="prose prose-invert max-w-none text-white prose-p:leading-8 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/30 prose-code:text-accent">
				<MarkdownRenderer content={answer} />
			</div>
		</section>

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4" in:fade={{ duration: 220, delay: 60 }}>
			<button class="rate-btn rate-btn-again" onclick={() => onRate(0)}>
				<span class="text-base font-semibold">再看</span>
				<span class="rate-key">1</span>
			</button>
			<button class="rate-btn rate-btn-hard" onclick={() => onRate(3)}>
				<span class="text-base font-semibold">较难</span>
				<span class="rate-key">2</span>
			</button>
			<button class="rate-btn rate-btn-good" onclick={() => onRate(4)}>
				<span class="text-base font-semibold">掌握</span>
				<span class="rate-key">3</span>
			</button>
			<button class="rate-btn rate-btn-easy" onclick={() => onRate(5)}>
				<span class="text-base font-semibold">轻松</span>
				<span class="rate-key">4</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.rate-btn {
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 1rem;
		padding: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: rgba(9, 14, 22, 0.55);
		color: rgba(241, 245, 249, 0.96);
		transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
	}

	.rate-btn:hover {
		transform: translateY(-1px);
	}

	.rate-btn:focus-visible {
		outline: none;
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
	}

	.rate-key {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.25);
		color: rgba(226, 232, 240, 0.95);
	}

	.rate-btn-again:hover {
		border-color: rgba(248, 113, 113, 0.7);
		background: rgba(248, 113, 113, 0.14);
	}

	.rate-btn-hard:hover {
		border-color: rgba(251, 191, 36, 0.75);
		background: rgba(251, 191, 36, 0.14);
	}

	.rate-btn-good:hover {
		border-color: rgba(74, 222, 128, 0.75);
		background: rgba(74, 222, 128, 0.14);
	}

	.rate-btn-easy:hover {
		border-color: rgba(255, 138, 101, 0.75);
		background: rgba(255, 138, 101, 0.14);
	}
</style>
