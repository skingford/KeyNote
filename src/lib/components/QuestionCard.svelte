<script lang="ts">
	import MarkdownView from './MarkdownView.svelte';
	import { untrack } from 'svelte';

	let {
		question,
		onReview = () => {}
	} = $props<{
		question: { id: number; title: string; content: string; answer: string; state: number; reps: number; };
		onReview?: (rating: number) => void;
	}>();

	// INTERNAL DATA
	let displayedQuestion = $state(question);
	
	// ANIMATION STATES
	let showAnswer = $state(false); // Base Leaf (Reveal/Hide Answer)
	let isNextFlipping = $state(false); // Transition Leaf (Move to Next)
	let resetTransitionLeaf = $state(false); // For instant reset without jump

	// Prop Sync
	$effect(() => {
		const newId = question.id;
		untrack(() => {
			if (newId !== displayedQuestion.id && !isNextFlipping) {
				displayedQuestion = question;
				showAnswer = false;
			}
		});
	});

	async function handleReview(rating: number) {
		if (isNextFlipping) return;
		
		// 1. START FLIP
		isNextFlipping = true;

		// 2. MID-POINT (Wait for sheet to be vertical)
		setTimeout(() => {
			onReview(rating);
			displayedQuestion = question;
			
			// Reset the 'Reveal Leaf' while hidden
			showAnswer = false;
			
			// 3. COMPLETE FLIP
			setTimeout(() => {
				isNextFlipping = false;
				// 4. INSTANT RESET (Hide the move back)
				resetTransitionLeaf = true;
				setTimeout(() => {
					resetTransitionLeaf = false;
				}, 50);
			}, 500);
		}, 500);
	}

	function handleReveal() {
		if (isNextFlipping) return;
		showAnswer = true;
	}

	let answerContent = $derived((displayedQuestion.answer ?? '').trim());
</script>

<div class="book-container w-full max-w-5xl h-[600px] mx-auto relative perspective py-4">
	
	<!-- STATIC SPREAD -->
	<div class="book-spread absolute inset-x-0 top-4 bottom-4 flex preserve-3d">
		<!-- Left Page -->
		<div class="book-page-left flex-1 bg-white dark:bg-[#2c2c30] rounded-l-2xl border-y border-l border-black/10 dark:border-white/10 shadow-[-15px_15px_45px_rgba(0,0,0,0.15)] p-10 flex flex-col relative overflow-hidden">
			<div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent/30 to-transparent"></div>
			<div class="flex justify-between items-start mb-8 text-[10px] font-mono text-secondary/40 uppercase tracking-widest">
				<span>Current Chapter</span>
				<div class="flex gap-3">
					<span class="text-accent/60 font-black">S{displayedQuestion.state}</span>
					<span class="opacity-20">|</span>
					<span>R{displayedQuestion.reps}</span>
				</div>
			</div>
			<h2 class="text-2xl md:text-3xl font-bold mb-8 tracking-tight leading-tight text-gray-900 dark:text-gray-100 font-serif">
				{displayedQuestion.title}
			</h2>
			<div class="grow overflow-y-auto no-scrollbar pr-4">
				{#if displayedQuestion.content && displayedQuestion.content.trim().length > 0}
					<div class="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
						<MarkdownView content={displayedQuestion.content} />
					</div>
				{/if}
			</div>
			<div class="absolute inset-0 bg-black/15 pointer-events-none transition-opacity duration-500 {showAnswer ? 'opacity-100' : 'opacity-0'}"></div>
		</div>

		<!-- Right Page -->
		<div class="book-page-right flex-1 bg-[#fefefe] dark:bg-[#252529] rounded-r-2xl border-y border-r border-black/10 dark:border-white/10 shadow-[15px_15px_45px_rgba(0,0,0,0.15)] p-10 flex flex-col relative">
			<div class="flex items-center gap-3 mb-6">
				<span class="w-2 h-2 rounded-full bg-success opacity-50 animate-pulse"></span>
				<h3 class="text-xs text-secondary/70 uppercase tracking-[0.3em] font-bold">参考解析</h3>
			</div>
			<div class="grow overflow-y-auto custom-scrollbar pr-6 -mr-10">
				<div class="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
					{#if answerContent.length > 0}
						<MarkdownView content={answerContent} />
					{:else}
						<p class="text-secondary/50 italic text-sm">此章节内容由于正在完善，暂不可见。</p>
					{/if}
				</div>
			</div>
			<!-- Controls Area -->
			<div class="mt-8 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col gap-6 z-20 pr-5 transition-all duration-500 {showAnswer ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}">
				<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{#each [1, 2, 3, 4] as rating}
						<button 
							onclick={() => handleReview(rating)} 
							class="group/btn flex flex-col items-center justify-center py-5 px-2 rounded-2xl transition-all duration-300 hover:-translate-y-2 active:scale-95 border-b-4 
								{rating === 1 ? 'bg-danger/5 text-danger border-danger/20 hover:bg-danger/10' : ''}
								{rating === 2 ? 'bg-warning/5 text-warning border-warning/20 hover:bg-warning/10' : ''}
								{rating === 3 ? 'bg-success/5 text-success border-success/20 hover:bg-success/10' : ''}
								{rating === 4 ? 'bg-info/5 text-info border-info/20 hover:bg-info/10' : ''}
							"
						>
							<span class="font-black text-sm mb-1">{['重来', '困难', '良好', '简单'][rating-1]}</span>
							<span class="text-[9px] opacity-40 font-mono tracking-tighter uppercase group-hover/btn:opacity-100 transition-opacity">{['Again', 'Hard', 'Good', 'Easy'][rating-1]}</span>
						</button>
					{/each}
				</div>
			</div>
			<div class="absolute inset-0 bg-black/10 pointer-events-none transition-opacity duration-500 {!showAnswer ? 'opacity-100' : 'opacity-0'}"></div>
		</div>
	</div>

	<!-- THE SYSTEM LEAVES (Always in DOM for smoothness) -->
	
	<!-- LEAF 1: Internal Reveal (Normal Study Flip) -->
	<div class="leaf leaf-reveal absolute w-1/2 h-[568px] right-0 top-[20px] origin-left preserve-3d z-[100] 
		{showAnswer ? 'is-flipped' : ''} {isNextFlipping ? 'invisible-jump' : ''}"
		style="transition: transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1);">
		
		<div class="leaf-side leaf-front bg-linear-to-br from-[#ffffff] to-[#f4f4f4] dark:from-[#35353a] dark:to-[#25252a] rounded-r-2xl border-y border-r border-black/10 dark:border-white/10 flex flex-col items-center justify-center p-12">
			<div class="flex flex-col items-center gap-10 transition-opacity duration-300 {!showAnswer && !isNextFlipping ? 'opacity-100' : 'opacity-0'}">
				<div class="w-16 h-16 rounded-full bg-accent/10 border-2 border-dashed border-accent/30 flex items-center justify-center animate-spin-extra-slow">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-accent/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
				</div>
				<button class="px-12 py-5 rounded-full bg-accent hover:bg-accent-hover text-white font-black shadow-2xl shadow-accent/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 group" onclick={handleReveal}>
					<span class="tracking-[0.2em]">REVEAL CONTENT</span>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform group-hover:translate-x-1.5 duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
				</button>
			</div>
		</div>

		<div class="leaf-side leaf-back bg-linear-to-bl from-white to-[#fdfdfd] dark:from-[#2c2c30] dark:to-[#1c1c20] rounded-l-2xl border-y border-l border-black/10 dark:border-white/10 flex flex-col p-12 shadow-inner">
			<div class="grow flex flex-col items-center justify-center opacity-30 gap-8 text-center grayscale">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <p class="text-[11px] uppercase tracking-[0.6em] font-bold text-accent">Review Processed</p>
			</div>
			<button class="mt-auto self-center text-[10px] uppercase font-bold tracking-[0.4em] text-secondary/40 hover:text-accent transition-all duration-300" onclick={() => showAnswer = false}>← RETURN</button>
		</div>
	</div>

	<!-- LEAF 2: THE TRANSITION SWEEP (Always in DOM) -->
	<!-- Higher Z-index, specifically for switching chapters. -->
	<div class="leaf leaf-sweep absolute w-1/2 h-[568px] right-0 top-[20px] origin-left preserve-3d z-[200] 
		{isNextFlipping ? 'is-active-flip' : ''} {resetTransitionLeaf ? 'no-transition' : ''}"
		style="transition: transform 1.0s cubic-bezier(0.645, 0.045, 0.355, 1);">
		
		<div class="leaf-side leaf-front bg-white dark:bg-[#323236] rounded-r-2xl border-y border-r border-black/10 shadow-[-20px_20px_60px_rgba(0,0,0,0.35)]">
			<div class="absolute inset-0 bg-linear-to-r from-black/5 via-transparent to-transparent"></div>
			<!-- Subtle loading or turn hint -->
			<div class="absolute inset-x-0 bottom-12 flex justify-center opacity-10">
				<p class="text-[10px] uppercase tracking-[1em] font-black italic">Next Page</p>
			</div>
		</div>

		<div class="leaf-side leaf-back bg-white dark:bg-[#1e1e22] rounded-l-2xl border-y border-l border-black/10 shadow-inner">
			<div class="absolute inset-0 bg-linear-to-l from-white/10 via-transparent to-transparent"></div>
		</div>
	</div>

	<!-- SPINE DETAIL -->
	<div class="absolute left-1/2 top-4 bottom-4 w-12 -ml-6 bg-linear-to-r from-black/25 via-black/50 to-black/25 z-[300] pointer-events-none opacity-60 mix-blend-multiply border-x border-white/5"></div>
</div>

<style>
	.perspective { perspective: 2500px; }
	.preserve-3d { transform-style: preserve-3d; }
	
	.leaf { transform-origin: left center; transform-style: preserve-3d; pointer-events: none; }
	.leaf * { pointer-events: auto; }
	
	.leaf-reveal.is-flipped { transform: rotateY(-180deg); }
	.leaf-reveal.invisible-jump { transition: none !important; }
	
	.leaf-sweep { transform: rotateY(0deg); opacity: 0; visibility: hidden; }
	.leaf-sweep.is-active-flip { 
		transform: rotateY(-180deg); 
		opacity: 1; 
		visibility: visible;
		/* Adding a slight 3D depth pop to avoid 'stiffness' */
		animation: depth-pop 1.0s ease-in-out forwards;
	}
	.leaf-sweep.no-transition { transition: none !important; opacity: 0 !important; visibility: hidden !important; }

	@keyframes depth-pop {
		0% { transform: rotateY(0deg) translateZ(0px); }
		50% { transform: rotateY(-90deg) translateZ(140px) scale(1.05); }
		100% { transform: rotateY(-180deg) translateZ(0px); }
	}
	
	.leaf-side { position: absolute; top: 0; left: 0; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
	.leaf-front { z-index: 2; transform: rotateY(0deg); }
	.leaf-back { z-index: 1; transform: rotateY(180deg); }

	.animate-spin-extra-slow { animation: spin 80s linear infinite; }
	@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
	
	.custom-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: rgba(122, 100, 84, 0.55) rgba(90, 80, 72, 0.12);
	}
	.custom-scrollbar::-webkit-scrollbar {
		width: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.06));
		border-radius: 999px;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: linear-gradient(to bottom, rgba(166, 138, 117, 0.78), rgba(133, 111, 95, 0.88));
		border-radius: 999px;
		border: 2px solid rgba(255, 255, 255, 0.12);
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(to bottom, rgba(186, 153, 129, 0.88), rgba(150, 123, 105, 0.95));
	}
	.no-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
	.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
</style>
