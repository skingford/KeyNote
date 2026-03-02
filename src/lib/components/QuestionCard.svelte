<script lang="ts">
	import MarkdownView from './MarkdownView.svelte';

	let {
		question,
		onReview = () => {}
	} = $props<{
		question: { id: number; title: string; content: string; answer: string; state: number; reps: number; };
		onReview?: (rating: number) => void;
	}>();

	let showAnswer = $state(false);
	let answerContent = $derived((question.answer ?? '').trim());

	function handleReview(rating: number) {
		onReview(rating);
	}
</script>

<div class="book-wrapper w-full max-w-4xl h-[550px] mx-auto relative preserve-3d perspective">
	
	<!-- Book Background Spread -->
	<!-- Left Base Page (Pastel Pink) -->
	<div class="book-page-box absolute w-1/2 h-full right-0 origin-left preserve-3d rotate-left-base z-0">
		<div class="book-page page-front bg-[#fcdede] dark:bg-[#4a2e35] rounded-l-2xl border border-black/10 dark:border-white/10 p-8 flex flex-col items-center justify-center overflow-hidden">
			<!-- Cute graphic or prompt -->
			<div class="opacity-50 flex flex-col items-center gap-4 text-primary">
				<div class="text-7xl font-serif font-black italic mb-2 brightness-90">?</div>
				<p class="font-medium tracking-[0.2em] uppercase text-sm font-sans">Thinking Mode</p>
			</div>
		</div>
	</div>

	<!-- Right Base Page (Pastel Mint/Teal - Answer Page) -->
	<div class="book-page-box absolute w-1/2 h-full right-0 origin-left preserve-3d z-0">
		<div class="book-page page-front bg-[#c1ede4] dark:bg-[#20403c] rounded-r-2xl border y border-r border-black/10 dark:border-white/10 p-6 md:p-8 flex flex-col">
			<h3 class="text-xs text-secondary/80 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
				<span class="w-2 h-2 rounded-full bg-success opacity-80 animate-pulse"></span>
				参考答案 (Answer)
			</h3>
			
			<div class="grow overflow-y-auto pr-2 custom-scrollbar">
				<div class="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
					{#if answerContent.length > 0}
						<MarkdownView content={answerContent} />
					{:else}
						<p class="text-secondary/70 italic text-sm">该题暂未配置答案内容。</p>
					{/if}
				</div>
			</div>

			<!-- Review Actions -->
			<div class="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-3 z-20">
				<div class="text-[11px] text-center text-secondary/70 mb-1 font-bold tracking-wider uppercase">评估掌握程度，并进入下一题</div>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
					<button onclick={() => handleReview(1)} class="review-btn flex flex-col items-center justify-center p-2 rounded-xl bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 transition-all hover:scale-[1.03]">
						<span class="font-bold text-sm">重来</span><span class="text-[9px] opacity-70">Again</span>
					</button>
					<button onclick={() => handleReview(2)} class="review-btn flex flex-col items-center justify-center p-2 rounded-xl bg-warning/10 hover:bg-warning/20 text-warning border border-warning/20 transition-all hover:scale-[1.03]">
						<span class="font-bold text-sm">困难</span><span class="text-[9px] opacity-70">Hard</span>
					</button>
					<button onclick={() => handleReview(3)} class="review-btn flex flex-col items-center justify-center p-2 rounded-xl bg-success/10 hover:bg-success/20 text-success border border-success/20 transition-all hover:scale-[1.03]">
						<span class="font-bold text-sm">良好</span><span class="text-[9px] opacity-70">Good</span>
					</button>
					<button onclick={() => handleReview(4)} class="review-btn flex flex-col items-center justify-center p-2 rounded-xl bg-info/10 hover:bg-info/20 text-info border border-info/20 transition-all hover:scale-[1.03]">
						<span class="font-bold text-sm">简单</span><span class="text-[9px] opacity-70">Easy</span>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 翻动的书叶 (Flipping Leaf) -->
	<div class="book-page-box absolute w-1/2 h-full right-0 origin-left preserve-3d transition-transform duration-[800ms] ease-in-out z-10 {showAnswer ? 'is-flipped' : ''}">
		
		<!-- 叶片正面: 题目 (Front of the leaf: Question) -->
		<div class="book-page page-front bg-[#ffffff] dark:bg-[#2c2c30] rounded-r-2xl border-y border-r border-black/10 dark:border-white/10 shadow-[8px_5px_20px_rgba(0,0,0,0.08)] p-6 md:p-8 flex flex-col">
			<div class="flex justify-between items-start mb-6">
				<div class="px-2.5 py-1 text-[10px] font-mono rounded bg-black/5 dark:bg-white/10 text-secondary uppercase tracking-wider">
					Study Card
				</div>
				<div class="text-[10px] font-mono text-secondary/60 uppercase tracking-widest flex gap-2">
					<span class="text-primary/70 font-semibold">S{question.state}</span>
					<span>•</span>
					<span>R{question.reps}</span>
				</div>
			</div>

			<h2 class="text-xl md:text-2xl font-bold mb-6 tracking-tight leading-snug text-gray-900 dark:text-gray-100 font-serif">
				{question.title}
			</h2>
			
			<div class="grow overflow-y-auto pr-2 custom-scrollbar">
				{#if question.content && question.content.trim().length > 0}
					<div class="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
						<MarkdownView content={question.content} />
					</div>
				{/if}
			</div>

			<div class="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex justify-center">
				<button
					class="px-8 py-3.5 rounded-full bg-[#111] dark:bg-white text-white dark:text-black font-bold shadow-lg transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center gap-3 group"
					onclick={() => (showAnswer = true)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
					翻书查看答案
				</button>
			</div>
		</div>

		<!-- 叶片背面 (Back of the leaf) -->
		<div class="book-page page-back bg-[#fcfaf2] dark:bg-[#25252a] rounded-l-2xl border-y border-l border-black/10 dark:border-white/10 shadow-[-8px_5px_20px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center justify-center gap-6">
			<div class="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-secondary opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18"/><path d="M18 3v18"/><path d="M6 3h12"/><path d="M6 21h12"/><path d="M9 12h6"/></svg>
			</div>
			<div class="opacity-40 text-center font-serif text-secondary max-w-xs">
				<p class="text-xs uppercase tracking-[0.2em] mb-3 font-sans opacity-70">Question Details</p>
				<h3 class="text-lg italic line-clamp-4 leading-relaxed">"{question.title}"</h3>
			</div>
			
			<button class="mt-8 px-5 py-2 rounded-full border border-black/20 dark:border-white/20 text-secondary hover:bg-black/5 dark:hover:bg-white/5 text-xs tracking-wider uppercase transition font-semibold" onclick={() => showAnswer = false}>
				← 翻转回题目
			</button>
		</div>
	</div>

	<!-- Book Spine Highlight/Shadow -->
	<div class="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-linear-to-r from-transparent via-black/15 dark:via-black/40 to-transparent pointer-events-none z-20 mix-blend-multiply border-x border-black/5 dark:border-white/5"></div>
</div>

<style>
	.perspective {
		perspective: 2500px;
	}
	.preserve-3d {
		transform-style: preserve-3d;
	}
	.origin-left {
		transform-origin: left center;
	}
	
	.book-page-box {
		/* Apply smooth flip exactly as in requested HTML */
		transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
	}
	.book-page-box.is-flipped {
		transform: rotateY(-180deg);
	}
	
	/* Static Left Page */
	.rotate-left-base {
		transform: rotateY(-180deg);
	}

	.book-page {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}
	
	.page-front {
		transform: rotateY(0deg);
	}
	.page-back {
		transform: rotateY(180deg);
	}

	/* Scrollbar rules */
	.custom-scrollbar::-webkit-scrollbar {
		width: 5px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(150, 150, 150, 0.3);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(150, 150, 150, 0.5);
	}
</style>
