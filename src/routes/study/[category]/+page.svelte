<script lang="ts">
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	// Maintain state with runes
	let currentIndex = $state(0);
	let navDirection = $state(1);
	
	let totalQuestions = $derived(data.questions.length);
	let currentQuestion = $derived(data.questions[currentIndex]);
	let isFinished = $derived(currentIndex >= totalQuestions && totalQuestions > 0);
	let progressPercent = $derived(
		totalQuestions === 0 ? 0 : Math.min(100, ((currentIndex + 1) / totalQuestions) * 100)
	);
	let canGoPrev = $derived(totalQuestions > 0 && currentIndex > 0 && !isFinished);
	let canGoNext = $derived(totalQuestions > 0 && currentIndex < totalQuestions - 1 && !isFinished);

	function handleReview(rating: number) {
		if (!currentQuestion) return;
		const reviewedQuestionId = currentQuestion.id;

		// Optimistically move to next question first to keep page-turn smooth
		navDirection = 1;
		currentIndex++;

		// Send review in background; do not block UI transition
		fetch('/api/review', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: reviewedQuestionId, rating })
		}).catch(() => {
			// Ignore transient network failures in UI flow; next refresh will reconcile schedule
		});
	}

	function goToIndex(index: number) {
		if (index < 0 || index >= totalQuestions) return;
		navDirection = index > currentIndex ? 1 : -1;
		currentIndex = index;
	}

	function goPrevQuestion() {
		if (!canGoPrev) return;
		navDirection = -1;
		currentIndex--;
	}

	function goNextQuestion() {
		if (!canGoNext) return;
		navDirection = 1;
		currentIndex++;
	}

	function handleStudyHotkeys(event: KeyboardEvent) {
		if (isFinished || totalQuestions === 0) return;
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goPrevQuestion();
		}
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			goNextQuestion();
		}
	}

	function handleRestartRound() {
		currentIndex = 0;
	}

	async function handleRefreshPlan() {
		currentIndex = 0;
		await invalidateAll(); // refresh data from server
	}

	function pageTurnIn(node: Element, params: { direction: number }) {
		const d = params.direction ?? 1;
		return {
			duration: 1000,
			easing: quintOut,
			css: (t: number, u: number) => `
				transform: translate3d(${u * d * 40}px, 0, ${-u * 300}px) rotateY(${u * d * -20}deg);
				opacity: ${t};
				filter: brightness(${0.5 + t * 0.5}) blur(${u * 1}px);
			`
		};
	}

	function pageTurnOut(node: Element, params: { direction: number }) {
		const d = params.direction ?? 1;
		return {
			duration: 800,
			easing: quintOut,
			css: (t: number, u: number) => `
				transform: translate3d(${u * d * -40}px, 0, ${-u * 300}px) rotateY(${u * d * 20}deg);
				opacity: ${t};
				filter: brightness(${0.5 + t * 0.5}) blur(${u * 1}px);
			`
		};
	}
</script>

<svelte:window onkeydown={handleStudyHotkeys} />

<div class="w-full max-w-7xl mx-auto py-4 sm:py-8 flex flex-col items-center min-h-[70vh]">
	
	<div class="w-full flex justify-between items-center mb-6 px-4 md:px-8">
		<a href="/" class="text-secondary hover:text-primary transition-colors flex items-center gap-2 font-medium bg-black/5 dark:bg-white/5 px-4 py-2 rounded-lg">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
			返回书架 (题库)
		</a>
		<div class="px-5 py-2 glass rounded-full text-sm font-bold border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center gap-3">
			<span class="text-accent">{data.category}</span>
			{#if totalQuestions > 0 && !isFinished}
				<span class="w-1 h-1 rounded-full bg-white/20"></span>
				<span class="text-secondary tracking-widest">{currentIndex + 1} / {totalQuestions}</span>
			{/if}
		</div>
	</div>

	<!-- Progress bar -->
	{#if totalQuestions > 0}
		<div class="w-full max-w-6xl mx-auto h-1.5 bg-black/10 dark:bg-white/10 mb-8 rounded-full overflow-hidden shadow-inner flex relative">
			<div 
				class="h-full bg-linear-to-r from-accent to-[#ffb74d] transition-all duration-700 ease-out absolute top-0 left-0 bottom-0" 
				style="width: {isFinished ? 100 : progressPercent}%"
			></div>
		</div>
	{/if}

	<!-- Book Navigation/Controls above the book -->
	{#if totalQuestions > 0 && !isFinished}
		<div class="w-full max-w-6xl mx-auto mb-6 px-4 sm:px-0">
			<div class="glass rounded-xl border border-white/10 p-2 sm:p-3 flex justify-between items-center gap-3 shadow-sm bg-base/40 backdrop-blur-md">
				<div class="text-xs sm:text-sm text-secondary/70 italic flex items-center gap-2 px-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
					提示：可使用键盘 <kbd class="font-mono bg-black/10 dark:bg-white/10 px-1.5 rounded">←</kbd> <kbd class="font-mono bg-black/10 dark:bg-white/10 px-1.5 rounded">→</kbd> 左右翻页
				</div>
				<div class="flex items-center gap-2">
					<button
						class="px-4 py-2 rounded-lg bg-surface border border-white/10 text-secondary hover:text-primary hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 hover:-translate-x-0.5"
						onclick={goPrevQuestion}
						disabled={!canGoPrev}
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
						上一页
					</button>
					<button
						class="px-4 py-2 rounded-lg bg-surface border border-white/10 text-secondary hover:text-primary hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 hover:translate-x-0.5"
						onclick={goNextQuestion}
						disabled={!canGoNext}
					>
						下一页
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
					</button>
				</div>
			</div>
		</div>
	{/if}

	<div class="w-full grow flex items-start justify-center relative px-4 sm:px-0 pt-2 sm:pt-4">
		{#if totalQuestions === 0}
			<div class="text-center p-10 md:p-14 glass rounded-3xl border border-white/5 max-w-lg w-full shadow-2xl bg-base" in:scale={{ duration: 400, start: 0.9 }}>
				<div class="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(102,187,106,0.2)]">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
				</div>
				<h2 class="text-3xl font-extrabold mb-3 tracking-tight">已完成所有复习</h2>
				<p class="text-secondary mb-8 text-lg">太棒了！该分类下暂无需要复习的题目。您的架构知识库正在不断巩固中。</p>
				<a href="/" class="px-8 py-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors font-bold border border-white/10 shadow-lg text-primary inline-block">合上书本，回到首页</a>
			</div>
		{:else if isFinished}
			<div class="text-center p-10 md:p-14 glass rounded-3xl border border-white/5 max-w-lg w-full shadow-2xl bg-base" in:scale={{ duration: 400, start: 0.9 }}>
				<div class="text-7xl mb-6">🎉</div>
				<h2 class="text-3xl font-extrabold mb-3 tracking-tight">本章阅读结束</h2>
				<p class="text-secondary mb-8 text-lg">您已完成这 <span class="text-primary font-bold">{totalQuestions}</span> 道架构题的复习，稍后再来看看其他题目吧。</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a href="/" class="px-6 py-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors font-bold border border-white/10 text-primary w-full sm:w-auto">回书架页</a>
					<button onclick={handleRestartRound} class="px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-base transition-colors font-bold shadow-lg shadow-accent/20 cursor-pointer text-base-content w-full sm:w-auto">
						重头开始本轮
					</button>
					<button onclick={handleRefreshPlan} class="px-8 py-4 rounded-xl bg-surface hover:bg-surface-hover text-base transition-colors font-bold border border-white/10 cursor-pointer w-full sm:w-auto">
						刷新复习计划
					</button>
				</div>
			</div>
		{:else}
			<div class="w-full flex justify-center">
				<QuestionCard question={currentQuestion} onReview={handleReview} />
			</div>
		{/if}
	</div>
</div>
