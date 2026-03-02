<script lang="ts">
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { fade, slide, scale } from 'svelte/transition';
	import { backOut, cubicOut, quintOut } from 'svelte/easing';
	import { Brain, CheckCircle2, ListFilter, ArrowLeft, RefreshCw, X, Flame } from 'lucide-svelte';

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
	
	let animatingOut = $state(false);

	function handleRate(rating: number) {
		currentRating = rating;
		// Submit the form programmatically
		requestAnimationFrame(() => {
			ratingForm.requestSubmit();
		});
		
		animatingOut = true;
		
		setTimeout(() => {
			// Advance local state optimistically
			completed++;
			if (completed < total) {
				currentIndex++;
			}
			animatingOut = false;
		}, 300); // match animation duration
	}
</script>

<svelte:head>
	<title>Study - KeyNote</title>
</svelte:head>

<div class="max-w-3xl mx-auto flex flex-col gap-8 h-full min-h-[calc(100vh-10rem)]">
	<header class="flex flex-col gap-6 animate-in slide-in-from-top-4 duration-500">
		<div class="flex flex-wrap justify-between items-center gap-4">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-accent/10 text-accent rounded-lg border border-accent/20">
					<Brain size={24} />
				</div>
				<div>
					<h1 class="text-2xl font-bold text-white tracking-tight">Active Recall</h1>
					<p class="text-sm text-secondary">Mastering {total} concept{total === 1 ? '' : 's'}</p>
				</div>
			</div>
			<a href="/" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:text-white bg-surface hover:bg-surface-hover rounded-full border border-white/5 transition-all">
				<ArrowLeft size={16} />
				Back to Dashboard
			</a>
		</div>

		{#if currentTags}
			<div class="flex items-center gap-3 p-3 bg-surface border border-white/5 rounded-lg text-sm" transition:slide={{duration: 300, easing: cubicOut}}>
				<ListFilter size={16} class="text-secondary" />
				<span class="text-secondary">Filtering by tag:</span>
				<span class="px-2 py-1 bg-accent/20 text-accent font-mono text-xs rounded border border-accent/30">{currentTags}</span>
				<a href="/study" class="ml-auto flex items-center justify-center p-1 text-secondary hover:text-danger hover:bg-danger/10 rounded transition-colors" title="Clear filter">
					<X size={16} />
				</a>
			</div>
		{/if}

		{#if !isDone}
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-end text-sm">
					<span class="font-mono text-secondary"><span class="text-white">{completed}</span> / {total}</span>
					<span class="font-mono text-accent">{Math.round(progress)}%</span>
				</div>
				<div class="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
					<div class="h-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,138,101,0.5)]" style="width: {progress}%"></div>
				</div>
			</div>
		{/if}
	</header>

	<main class="flex-1 flex flex-col relative perspective-1000">
		{#if isDone}
			<div class="m-auto flex flex-col items-center justify-center text-center p-12 glass rounded-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-500" in:scale={{duration: 500, start: 0.9, easing: backOut}}>
				<div class="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6 border border-success/30 shadow-[0_0_30px_rgba(102,187,106,0.3)]">
					<CheckCircle2 size={40} />
				</div>
				<h2 class="text-2xl font-bold text-white mb-3">Session Complete!</h2>
				<p class="text-secondary mb-8 leading-relaxed">
					You've reviewed all your scheduled concepts for today. Your brain is building stronger connections.
				</p>
				<div class="flex flex-col w-full gap-3">
					<a href="/questions" class="px-6 py-3 bg-surface hover:bg-surface-hover text-white rounded-xl border border-white/10 font-medium transition-all flex items-center justify-center gap-2 group">
						<ListFilter size={18} class="group-hover:-translate-x-1 transition-transform" />
						Browse Library
					</a>
					<button onclick={() => window.location.reload()} class="px-6 py-3 bg-transparent text-secondary hover:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
						<RefreshCw size={18} />
						Check Again
					</button>
				</div>
			</div>
		{:else if currentCard}
			<!-- Hidden form for SvelteKit action -->
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
					class="w-full transition-all duration-300 transform-gpu"
					class:opacity-0={animatingOut}
					class:scale-95={animatingOut}
					class:translate-y-4={animatingOut}
					in:fly|local={{ y: 20, duration: 400, delay: 100, easing: cubicOut }}
					out:fly|local={{ y: -20, duration: 300, easing: quintOut }}
				>
					<Flashcard 
						question={currentCard.content} 
						answer={currentCard.answer} 
						onRate={handleRate}
						category={currentCard.category}
						tags={currentCard.tags}
						difficulty={currentCard.difficulty}
					/>
				</div>
			{/key}
		{/if}
	</main>
</div>

<script module>
	import { fly } from 'svelte/transition';
</script>
