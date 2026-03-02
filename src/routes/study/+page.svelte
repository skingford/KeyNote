<script lang="ts">
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ArrowLeft, CheckCircle2, ListFilter, RefreshCw, X } from 'lucide-svelte';

	let { data } = $props();

	let cards = $derived.by(() => data.cards);
	let currentIndex = $state(0);
	let completed = $state(0);

	let currentCard = $derived(cards[currentIndex]);
	let total = $derived(cards.length);
	let progress = $derived(total === 0 ? 100 : (completed / total) * 100);
	let isDone = $derived(completed >= total || total === 0);
	let remaining = $derived(Math.max(total - completed, 0));

	let currentTags = $derived($page.url.searchParams.get('tags'));
	let activeTags = $derived.by(() => {
		return currentTags
			? currentTags
					.split(',')
					.map((tag) => tag.trim())
					.filter(Boolean)
			: [];
	});
	const todayLabel = new Intl.DateTimeFormat('zh-CN', {
		month: 'numeric',
		day: 'numeric',
		weekday: 'short'
	}).format(new Date());

	let ratingForm: HTMLFormElement | undefined = $state();
	let currentRating = $state(0);
	let animatingOut = $state(false);

	function handleRate(rating: number) {
		if (!ratingForm) return;

		currentRating = rating;
		requestAnimationFrame(() => {
			ratingForm?.requestSubmit();
		});

		animatingOut = true;

		setTimeout(() => {
			completed++;
			if (completed < total) {
				currentIndex++;
			}
			animatingOut = false;
		}, 220);
	}
</script>

<svelte:head>
	<title>专注背题 - KeyNote</title>
</svelte:head>

<div class="study-stage focus-typography mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-4xl flex-col gap-6">
	<header class="soft-panel rounded-3xl p-5 sm:p-7" in:fly={{ duration: 260, y: -8, easing: cubicOut }}>
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div class="space-y-2">
				<p class="text-xs font-semibold tracking-[0.2em] text-secondary">{todayLabel}</p>
				<h1 class="text-2xl font-semibold tracking-wide text-white sm:text-3xl">专注背题模式</h1>
				<p class="max-w-xl text-sm text-secondary sm:text-base">
					一次只处理一道题，降低切换成本，让记忆路径更稳定。
				</p>
			</div>

			<a
				href={resolve('/')}
				class="rounded-full border border-white/10 bg-surface px-4 py-2 text-sm font-medium text-secondary transition hover:bg-surface-hover hover:text-white"
			>
				<span class="inline-flex items-center gap-2">
					<ArrowLeft size={16} />
					返回总览
				</span>
			</a>
		</div>

		{#if activeTags.length > 0}
			<div
				class="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-surface p-3 text-sm text-secondary"
				in:fade={{ duration: 200 }}
			>
				<span class="inline-flex items-center gap-1.5 text-white">
					<ListFilter size={15} />
					过滤标签
				</span>
				{#each activeTags as tag (tag)}
					<span class="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent">
						#{tag}
					</span>
				{/each}
				<a
					href={resolve('/study')}
					class="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-xs text-secondary transition hover:border-danger/60 hover:text-danger"
				>
					<X size={13} />
					清除
				</a>
			</div>
		{/if}

		{#if !isDone}
			<div class="mt-5 rounded-2xl border border-white/10 bg-base/60 p-4">
				<div class="grid grid-cols-3 gap-3 text-center text-sm">
					<div class="rounded-xl bg-surface py-2.5">
						<p class="text-secondary">已完成</p>
						<p class="mt-1 text-lg font-semibold text-white">{completed}</p>
					</div>
					<div class="rounded-xl bg-surface py-2.5">
						<p class="text-secondary">待学习</p>
						<p class="mt-1 text-lg font-semibold text-white">{remaining}</p>
					</div>
					<div class="rounded-xl bg-surface py-2.5">
						<p class="text-secondary">总进度</p>
						<p class="mt-1 text-lg font-semibold text-accent">{Math.round(progress)}%</p>
					</div>
				</div>
				<div class="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
					<div
						class="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-500"
						style="width: {progress}%"
					></div>
				</div>
			</div>
		{/if}
	</header>

	<main class="relative flex flex-1 flex-col">
		{#if isDone}
			<div
				class="soft-panel m-auto flex w-full max-w-xl flex-col items-center rounded-3xl p-10 text-center"
				in:fade={{ duration: 260 }}
			>
				<div class="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-success/40 bg-success/15 text-success">
					<CheckCircle2 size={40} />
				</div>
				<h2 class="text-2xl font-semibold text-white">本轮学习完成</h2>
				<p class="mt-3 max-w-md leading-7 text-secondary">
					今天计划中的卡片已处理完毕。可以去题库补充，或稍后再刷新检查新到期内容。
				</p>
				<div class="mt-8 flex w-full flex-col gap-3 sm:flex-row">
					<a
						href={resolve('/questions')}
						class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface px-5 py-3 text-sm font-semibold text-white transition hover:bg-surface-hover"
					>
						<ListFilter size={18} />
						去题库复盘
					</a>
					<button
						onclick={() => window.location.reload()}
						class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-secondary transition hover:bg-surface hover:text-white"
					>
						<RefreshCw size={18} />
						刷新检查
					</button>
				</div>
			</div>
		{:else if currentCard}
			<form
				method="POST"
				action="?/rate"
				use:enhance
				bind:this={ratingForm}
				class="hidden"
			>
				<input type="hidden" name="cardId" value={currentCard.cardId} />
				<input type="hidden" name="rating" value={currentRating} />
			</form>

			{#key currentCard.cardId}
				<div
					class="transition-all duration-300"
					class:opacity-0={animatingOut}
					class:translate-y-2={animatingOut}
					in:fly|local={{ y: 14, duration: 220, easing: cubicOut }}
					out:fade|local={{ duration: 140 }}
				>
					<Flashcard 
						question={currentCard.content} 
						answer={currentCard.answer} 
						onRate={handleRate}
						category={currentCard.category}
						tags={currentCard.tags}
					/>
				</div>
			{/key}
		{/if}
	</main>
</div>

<style>
	.focus-typography {
		font-family: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Avenir Next", sans-serif;
	}

	.study-stage {
		position: relative;
		isolation: isolate;
	}

	.study-stage::before {
		content: '';
		position: absolute;
		inset: -10% -14%;
		z-index: -1;
		background:
			radial-gradient(560px 360px at 10% 5%, rgba(255, 138, 101, 0.14), transparent 70%),
			radial-gradient(540px 320px at 86% 4%, rgba(255, 138, 101, 0.08), transparent 72%),
			radial-gradient(600px 400px at 50% 108%, rgba(255, 255, 255, 0.04), transparent 74%);
		filter: blur(4px);
		pointer-events: none;
	}

	.soft-panel {
		border: 1px solid rgba(255, 255, 255, 0.12);
		background:
			linear-gradient(140deg, rgba(45, 45, 45, 0.88), rgba(30, 30, 30, 0.92)),
			radial-gradient(120% 140% at 0% 0%, rgba(255, 138, 101, 0.06), transparent 60%);
		box-shadow: 0 18px 56px rgba(2, 7, 16, 0.35);
		backdrop-filter: blur(14px);
	}
</style>
