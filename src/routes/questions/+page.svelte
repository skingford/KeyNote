<script lang="ts">
	import { resolve } from '$app/paths';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ArrowLeft, Search, Filter, BookOpen, ChevronDown, Tag } from 'lucide-svelte';

	let { data } = $props();
	let allQuestions = $derived.by(() => data.questions);

	let selectedCategory = $state<string | null>(null);
	let selectedTags = $state<Set<string>>(new Set());

	let expandedId = $state<number | null>(null);

	// Extract unique categories and tags
	let categories = $derived([...new Set(allQuestions.map(q => q.category))]);
	let allTags = $derived.by(() => {
		const tags = new Set<string>();
		allQuestions.forEach(q => {
			try {
				const qTags = JSON.parse(q.tags || '[]');
				qTags.forEach((t: string) => tags.add(t));
			} catch (e) {}
		});
		return [...tags];
	});

	let filteredQuestions = $derived(allQuestions.filter(q => {
		if (selectedCategory && q.category !== selectedCategory) return false;
		
		if (selectedTags.size > 0) {
			try {
				const qTags = JSON.parse(q.tags || '[]');
				const hasAllTags = [...selectedTags].every(t => qTags.includes(t));
				if (!hasAllTags) return false;
			} catch (e) {
				return false;
			}
		}
		
		return true;
	}));

	function toggleTag(tag: string) {
		const newTags = new Set(selectedTags);
		if (newTags.has(tag)) {
			newTags.delete(tag);
		} else {
			newTags.add(tag);
		}
		selectedTags = newTags;
	}

	function toggleExpand(id: number) {
		if (expandedId === id) {
			expandedId = null;
		} else {
			expandedId = id;
		}
	}
</script>

<svelte:head>
	<title>Library - KeyNote</title>
</svelte:head>

<div class="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
	<header class="flex flex-col gap-6 animate-in slide-in-from-top-4 duration-500">
		<div class="flex flex-wrap justify-between items-center gap-4">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
					<BookOpen size={24} />
				</div>
				<div>
					<h1 class="text-2xl font-bold text-white tracking-tight">Question Library</h1>
					<p class="text-sm text-secondary">Browse {allQuestions.length} concepts in your database</p>
				</div>
			</div>
			<a href={resolve('/')} class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:text-white bg-surface hover:bg-surface-hover rounded-full border border-white/5 transition-all">
				<ArrowLeft size={16} />
				Back to Dashboard
			</a>
		</div>
	</header>

	<div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
		<!-- Sidebar Filters -->
		<aside class="flex flex-col gap-6 lg:sticky lg:top-24 bg-surface/50 border border-white/5 p-6 rounded-2xl animate-in fade-in duration-700 delay-100">
			
			<!-- Category Filter -->
			<div>
				<div class="flex items-center gap-2 text-sm font-bold text-white mb-4 uppercase tracking-wider">
					<Filter size={16} class="text-secondary" />
					Categories
				</div>
				<div class="flex flex-wrap gap-2">
					<button 
						class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border {selectedCategory === null ? 'bg-primary text-base border-primary' : 'bg-surface-hover text-secondary border-white/5 hover:border-white/20 hover:text-white'}" 
						onclick={() => selectedCategory = null}
					>
						All
					</button>
					{#each categories as cat (cat)}
						<button 
							class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border uppercase {selectedCategory === cat ? 'bg-primary text-base border-primary' : 'bg-surface-hover text-secondary border-white/5 hover:border-white/20 hover:text-white'}" 
							onclick={() => selectedCategory = cat}
						>
							{cat}
						</button>
					{/each}
				</div>
			</div>

			<div class="h-px w-full bg-white/5"></div>

			<!-- Tags Filter -->
			<div>
				<div class="flex items-center gap-2 text-sm font-bold text-white mb-4 uppercase tracking-wider">
					<Tag size={16} class="text-secondary" />
					Tags
				</div>
				<div class="flex flex-wrap gap-2">
					{#each allTags as tag (tag)}
						<button 
							class="px-2.5 py-1 text-xs font-mono rounded transition-colors border {selectedTags.has(tag) ? 'bg-accent/20 text-accent border-accent/50 shadow-[0_0_10px_rgba(255,138,101,0.2)]' : 'bg-base text-secondary border-white/5 hover:border-accent/30 hover:text-accent/80'}" 
							onclick={() => toggleTag(tag)}
						>
							#{tag}
						</button>
					{/each}
				</div>
				{#if selectedTags.size > 0}
					<button 
						class="mt-4 text-xs text-danger hover:text-danger/80 transition-colors w-full text-left"
						onclick={() => selectedTags = new Set()}
					>
						Clear all tags
					</button>
				{/if}
			</div>
		</aside>

		<!-- Main Content Area -->
		<main class="flex flex-col gap-4 min-h-[500px]">
			<div class="flex justify-between items-center text-sm text-secondary px-2">
				<span>Showing {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''}</span>
				{#if selectedCategory || selectedTags.size > 0}
					<span class="text-accent/80" transition:fade>Filters active</span>
				{/if}
			</div>

			<div class="flex flex-col gap-3">
				{#each filteredQuestions as q (q.id)}
					<div 
						class="bg-surface border transition-all duration-300 rounded-xl overflow-hidden group {expandedId === q.id ? 'border-primary/50 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-white/5 hover:border-white/20 hover:bg-surface-hover'}"
					>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div 
							class="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
							onclick={() => toggleExpand(q.id)}
						>
							<div class="flex items-center gap-3">
								<div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold
									{q.difficulty === 1 ? 'bg-success/20 text-success' : q.difficulty === 2 ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'}">
									L{q.difficulty}
								</div>
								<span class="font-bold text-white text-lg group-hover:text-primary transition-colors">{q.title}</span>
							</div>

							<div class="flex items-center gap-4">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-secondary uppercase tracking-wider">{q.category}</span>
									{#each JSON.parse(q.tags || '[]') as tag (tag)}
										<span class="text-accent text-xs font-mono">#{tag}</span>
									{/each}
								</div>
								<div class="text-secondary transition-transform duration-300 {expandedId === q.id ? 'rotate-180' : ''}">
									<ChevronDown size={20} />
								</div>
							</div>
						</div>
						
						{#if expandedId === q.id}
							<div class="px-6 pb-6 pt-2 border-t border-white/5" transition:slide={{ duration: 300, easing: cubicOut }}>
								<div class="grid md:grid-cols-2 gap-8 mt-4">
									<div class="flex flex-col gap-3">
										<h4 class="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
											<span class="w-2 h-2 rounded-full bg-warning"></span> Question
										</h4>
										<div class="prose prose-invert prose-sm max-w-none bg-base/50 p-5 rounded-xl border border-white/5">
											<MarkdownRenderer content={q.content} />
										</div>
									</div>
									
									<div class="flex flex-col gap-3">
										<h4 class="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
											<span class="w-2 h-2 rounded-full bg-success"></span> Answer
										</h4>
										<div class="prose prose-invert prose-sm max-w-none bg-base/50 p-5 rounded-xl border border-white/5">
											<MarkdownRenderer content={q.answer} />
										</div>
									</div>
								</div>
								
								<div class="mt-6 flex justify-end">
									<form method="GET" action={resolve('/study')}>
										<input type="hidden" name="tags" value={JSON.parse(q.tags || '[]').join(',')} />
										<button type="submit" class="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors border border-primary/20">
											Study related cards
										</button>
									</form>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center p-12 text-center bg-surface/50 border border-white/5 rounded-xl mt-8">
						<Search size={48} class="text-secondary/50 mb-4" />
						<p class="text-lg text-white font-medium mb-1">No matches found</p>
						<p class="text-secondary text-sm">Try adjusting your category or tag filters to see more results.</p>
						<button 
							class="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
							onclick={() => { selectedCategory = null; selectedTags = new Set(); }}
						>
							Clear all filters
						</button>
					</div>
				{/each}
			</div>
		</main>
	</div>
</div>
