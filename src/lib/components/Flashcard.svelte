<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import MarkdownRenderer from './MarkdownRenderer.svelte';
	import { RotateCw, CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-svelte';

	let { question, answer, onRate, category, tags, difficulty } = $props<{
		question: string;
		answer: string;
		onRate: (rating: number) => void;
		category?: string;
		tags?: string;
		difficulty?: number;
	}>();

	let flipped = $state(false);

	let parsedTags = $derived(() => {
		try {
			return tags ? JSON.parse(tags) : [];
		} catch {
			return [];
		}
	});

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

<div class="relative w-full h-full flex flex-col items-center">
	<!-- Flashcard Container -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div 
		class="relative w-full min-h-[500px] perspective-1000 cursor-pointer group"
		class:cursor-default={flipped}
		onclick={() => { if (!flipped) flipped = true; }}
	>
		<!-- Inner Flip Container -->
		<div 
			class="w-full h-full min-h-[500px] transition-transform duration-700 ease-out transform-gpu transform-style-3d relative grid [grid-template-areas:'stack']"
			style={flipped ? 'transform: rotateY(180deg);' : ''}
		>
			<!-- FRONT (Question) -->
			<div class="[grid-area:stack] w-full h-full backface-hidden bg-surface border border-white/5 rounded-2xl p-8 flex flex-col shadow-xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
				
				<!-- Meta Header -->
				<div class="flex justify-between items-start mb-6">
					<div class="flex gap-2 items-center flex-wrap">
						{#if category}
							<span class="px-2.5 py-1 bg-white/5 text-secondary text-xs font-semibold uppercase tracking-wider rounded-md border border-white/10">
								{category}
							</span>
						{/if}
						{#each parsedTags() as tag}
							<span class="text-accent text-xs font-mono">#{tag}</span>
						{/each}
					</div>
					{#if difficulty}
						<div class="flex items-center gap-1">
							{#each Array(3) as _, i}
								<div class="w-1.5 h-1.5 rounded-full {i < difficulty ? 'bg-warning shadow-[0_0_5px_rgba(255,202,40,0.5)]' : 'bg-white/10'}"></div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Question Content -->
				<div class="flex-1 flex flex-col">
					<div class="prose prose-invert max-w-none text-white prose-p:leading-relaxed prose-pre:bg-base prose-pre:border prose-pre:border-white/5">
						<MarkdownRenderer content={question} />
					</div>
				</div>

				<!-- Hint Footer -->
				{#if !flipped}
					<div class="mt-8 flex flex-col items-center justify-center text-secondary/60 animate-pulse-slow">
						<RotateCw size={24} class="mb-2 opacity-50" />
						<span class="text-sm font-medium tracking-wide">CLICK OR PRESS SPACE</span>
					</div>
				{/if}
			</div>

			<!-- BACK (Answer) -->
			<div 
				class="[grid-area:stack] w-full h-full backface-hidden bg-surface-hover border border-white/10 rounded-2xl p-8 flex flex-col shadow-2xl"
				style="transform: rotateY(180deg);"
			>
				<div class="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
					<div class="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center">
						<CheckCircle2 size={18} />
					</div>
					<h3 class="text-lg font-bold text-white tracking-tight">Answer</h3>
				</div>

				<div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
					<div class="prose prose-invert max-w-none text-white prose-p:leading-relaxed prose-pre:bg-base prose-pre:border prose-pre:border-white/5">
						<MarkdownRenderer content={answer} />
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Rating Buttons (Appear below card when flipped) -->
	<div 
		class="w-full max-w-2xl mt-8 grid grid-cols-4 gap-3 md:gap-4 transition-all duration-500 transform-gpu"
		class:opacity-0={!flipped}
		class:translate-y-4={!flipped}
		class:pointer-events-none={!flipped}
	>
		<button 
			class="group relative flex flex-col items-center p-3 md:p-4 bg-surface border border-white/5 rounded-xl hover:bg-danger/10 hover:border-danger/30 transition-all focus:outline-none focus:ring-2 focus:ring-danger/50 active:scale-95"
			onclick={() => onRate(0)}
		>
			<div class="absolute inset-0 bg-danger/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
			<XCircle size={20} class="text-danger mb-2 group-hover:-translate-y-1 transition-transform" />
			<span class="font-bold text-danger">Again</span>
			<span class="text-[10px] text-danger/60 font-mono mt-1 px-1.5 py-0.5 bg-danger/10 rounded">Press 1</span>
		</button>

		<button 
			class="group relative flex flex-col items-center p-3 md:p-4 bg-surface border border-white/5 rounded-xl hover:bg-warning/10 hover:border-warning/30 transition-all focus:outline-none focus:ring-2 focus:ring-warning/50 active:scale-95"
			onclick={() => onRate(3)}
		>
			<div class="absolute inset-0 bg-warning/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
			<AlertCircle size={20} class="text-warning mb-2 group-hover:-translate-y-1 transition-transform" />
			<span class="font-bold text-warning">Hard</span>
			<span class="text-[10px] text-warning/60 font-mono mt-1 px-1.5 py-0.5 bg-warning/10 rounded">Press 2</span>
		</button>

		<button 
			class="group relative flex flex-col items-center p-3 md:p-4 bg-surface border border-white/5 rounded-xl hover:bg-success/10 hover:border-success/30 transition-all focus:outline-none focus:ring-2 focus:ring-success/50 active:scale-95"
			onclick={() => onRate(4)}
		>
			<div class="absolute inset-0 bg-success/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
			<CheckCircle2 size={20} class="text-success mb-2 group-hover:-translate-y-1 transition-transform" />
			<span class="font-bold text-success">Good</span>
			<span class="text-[10px] text-success/60 font-mono mt-1 px-1.5 py-0.5 bg-success/10 rounded">Press 3</span>
		</button>

		<button 
			class="group relative flex flex-col items-center p-3 md:p-4 bg-surface border border-white/5 rounded-xl hover:bg-accent/10 hover:border-accent/30 transition-all focus:outline-none focus:ring-2 focus:ring-accent/50 active:scale-95"
			onclick={() => onRate(5)}
		>
			<div class="absolute inset-0 bg-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
			<HelpCircle size={20} class="text-accent mb-2 group-hover:-translate-y-1 transition-transform" />
			<span class="font-bold text-accent">Easy</span>
			<span class="text-[10px] text-accent/60 font-mono mt-1 px-1.5 py-0.5 bg-accent/10 rounded">Press 4</span>
		</button>
	</div>
</div>

<style>
	/* Add utility classes that tailwind might not have natively without plugins */
	.perspective-1000 {
		perspective: 1000px;
	}
	.transform-style-3d {
		transform-style: preserve-3d;
	}
	.backface-hidden {
		backface-visibility: hidden;
	}
	
	.animate-pulse-slow {
		animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.2);
	}
</style>
