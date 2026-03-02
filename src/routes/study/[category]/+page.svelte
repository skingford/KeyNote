<script lang="ts">
	import { slide, scale } from 'svelte/transition';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	// Maintain state with runes
	let currentIndex = $state(0);
	
	let totalQuestions = $derived(data.questions.length);
	let currentQuestion = $derived(data.questions[currentIndex]);
	let isFinished = $derived(currentIndex >= totalQuestions && totalQuestions > 0);

	async function handleReview(level: number) {
		if (!currentQuestion) return;

		// Post response
		await fetch('/api/review', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: currentQuestion.id, level })
		});

		// Move next
		currentIndex++;
	}

	function handleRestart() {
		currentIndex = 0;
		invalidateAll(); // refresh data from server
	}
</script>

<div class="w-full max-w-4xl mx-auto py-4 sm:py-8 flex flex-col items-center min-h-[70vh]">
	
	<div class="w-full flex justify-between items-center mb-8 px-2 sm:px-0">
		<a href="/" class="text-secondary hover:text-primary transition-colors flex items-center gap-2 font-medium">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
			返回题库
		</a>
		<div class="px-5 py-2 glass rounded-full text-sm font-bold border border-white/10 shadow-sm flex items-center gap-3">
			<span class="text-accent">{data.category}</span>
			{#if totalQuestions > 0 && !isFinished}
				<span class="w-1 h-1 rounded-full bg-white/20"></span>
				<span class="text-secondary tracking-widest">{currentIndex + 1} / {totalQuestions}</span>
			{/if}
		</div>
	</div>

	<!-- Progress bar -->
	{#if totalQuestions > 0}
		<div class="w-full h-1.5 bg-surface-hover mb-8 rounded-full overflow-hidden shadow-inner flex relative">
			<div 
				class="h-full bg-gradient-to-r from-accent to-[#ffb74d] transition-all duration-700 ease-out absolute top-0 left-0 bottom-0" 
				style="width: {isFinished ? 100 : (currentIndex / totalQuestions) * 100}%"
			></div>
		</div>
	{/if}

	<div class="w-full flex-grow flex items-center justify-center relative px-2 sm:px-0">
		{#if totalQuestions === 0}
			<div class="text-center p-10 md:p-14 glass rounded-3xl border border-white/5 max-w-lg w-full shadow-2xl" in:scale={{ duration: 400, start: 0.9 }}>
				<div class="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(102,187,106,0.2)]">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
				</div>
				<h2 class="text-3xl font-extrabold mb-3 tracking-tight">已完成所有复习</h2>
				<p class="text-secondary mb-8 text-lg">太棒了！该分类下暂无需要复习的题目。您的架构知识库正在不断巩固中。</p>
				<a href="/" class="px-8 py-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors font-bold border border-white/10 shadow-lg text-primary inline-block">回到首页</a>
			</div>
		{:else if isFinished}
			<div class="text-center p-10 md:p-14 glass rounded-3xl border border-white/5 max-w-lg w-full shadow-2xl" in:scale={{ duration: 400, start: 0.9 }}>
				<div class="text-7xl mb-6">🎉</div>
				<h2 class="text-3xl font-extrabold mb-3 tracking-tight">本轮复习结束</h2>
				<p class="text-secondary mb-8 text-lg">您已完成这 <span class="text-primary font-bold">{totalQuestions}</span> 道架构题的复习，稍后再来看看其他题目吧。</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a href="/" class="px-6 py-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors font-bold border border-white/10 text-primary w-full sm:w-auto">回首页</a>
					<button onclick={handleRestart} class="px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-base transition-colors font-bold shadow-lg shadow-accent/20 cursor-pointer text-base-content w-full sm:w-auto">
						继续下一轮
					</button>
				</div>
			</div>
		{:else}
			{#key currentQuestion.id}
				<div class="w-full absolute" in:slide={{ duration: 400, axis: 'x' }}>
					<QuestionCard question={currentQuestion} onReview={handleReview} />
				</div>
			{/key}
		{/if}
	</div>
</div>
