<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import MarkdownView from './MarkdownView.svelte';

	let {
		question,
		onReview = () => {}
	} = $props<{
		question: { id: number; title: string; content: string; answer: string; level: number };
		onReview?: (level: number) => void;
	}>();

	let showAnswer = $state(false);

	function handleReview(level: number) {
		onReview(level);
	}

	// Reset showAnswer when question changes
	$effect(() => {
		question.id;
		showAnswer = false;
	});
</script>

<div class="w-full max-w-4xl glass rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex flex-col transition-all duration-300 mx-auto">
	<!-- Question Front -->
	<div class="p-6 md:p-10 relative bg-gradient-to-br from-surface to-base">
		<div class="absolute top-6 right-6 px-3 py-1 text-xs font-mono rounded bg-surface-hover text-secondary border border-white/5 uppercase tracking-wider">
			LVL {question.level}
		</div>
		<h2 class="text-2xl md:text-3xl font-bold mb-6 tracking-tight leading-tight pr-16">{question.title}</h2>
		
		{#if question.content && question.content.trim().length > 0}
			<div class="mt-4 text-base opacity-90">
				<MarkdownView content={question.content} />
			</div>
		{/if}
	</div>

	<!-- Action / Answer reveal button -->
	{#if !showAnswer}
		<button
			class="w-full py-5 bg-surface hover:bg-surface-hover text-accent hover:text-accent-hover font-medium transition-colors border-t border-white/5 flex justify-center items-center gap-3 cursor-pointer outline-none focus:bg-surface-hover group"
			onclick={() => (showAnswer = true)}
			in:fade={{ duration: 150 }}
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform group-hover:translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
			<span class="tracking-wide">遮挡自测：点击显示答案</span>
		</button>
	{/if}

	<!-- Answer Back -->
	{#if showAnswer}
		<div class="border-t border-white/10 bg-surface/40 p-6 md:p-10" transition:slide={{ duration: 400, axis: 'y', easing: (t) => t * t * (2.4 - 1.4 * t) }}> <!-- basic ease-out -->
			<div class="opacity-0 animate-[fade-in_0.4s_ease-out_0.2s_forwards]">
				<h3 class="text-sm text-secondary uppercase tracking-widest font-bold mb-5 flex items-center gap-3">
					<span class="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_rgba(102,187,106,0.6)] animate-pulse"></span>
					参考答案
				</h3>
				<div class="bg-base/50 p-6 md:p-8 rounded-xl border border-white/5">
					<MarkdownView content={question.answer} />
				</div>
			</div>
		</div>

		<!-- Review Actions -->
		<div class="flex flex-col sm:flex-row bg-surface-hover/80 p-3 sm:p-5 gap-3 border-t border-white/5" transition:slide={{ duration: 300, axis: 'y' }}>
			<button
				onclick={() => handleReview(0)}
				class="py-3 px-4 rounded-xl bg-surface hover:bg-danger/20 hover:text-danger hover:border-danger/30 border border-transparent text-secondary transition-all font-medium text-sm md:text-base cursor-pointer flex-1 flex flex-col items-center justify-center gap-1 group"
			>
				<span class="text-white group-hover:text-danger transition-colors">生疏</span>
				<span class="text-xs opacity-60">12小时后复习</span>
			</button>
			<button
				onclick={() => handleReview(1)}
				class="py-3 px-4 rounded-xl bg-surface hover:bg-warning/20 hover:text-warning hover:border-warning/30 border border-transparent text-secondary transition-all font-medium text-sm md:text-base cursor-pointer flex-1 flex flex-col items-center justify-center gap-1 group"
			>
				<span class="text-white group-hover:text-warning transition-colors">模糊</span>
				<span class="text-xs opacity-60">3天后复习</span>
			</button>
			<button
				onclick={() => handleReview(2)}
				class="py-3 px-4 rounded-xl bg-surface hover:bg-success/20 hover:text-success hover:border-success/30 border border-transparent text-secondary transition-all font-medium text-sm md:text-base cursor-pointer flex-1 flex flex-col items-center justify-center gap-1 group"
			>
				<span class="text-white group-hover:text-success transition-colors">掌握</span>
				<span class="text-xs opacity-60">7天后复习</span>
			</button>
		</div>
	{/if}
</div>

<style>
	@keyframes fade-in {
		from { opacity: 0; transform: translateY(15px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
