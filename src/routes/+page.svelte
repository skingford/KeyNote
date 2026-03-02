<script lang="ts">
	import { ArrowRight, BookOpen, Layers, Zap } from 'lucide-svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>KeyNote v1</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center py-12">
	<!-- Hero Section -->
	<div class="max-w-3xl w-full flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 fade-in">
		<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-8 tracking-wide">
			<Zap size={14} />
			<span>V1.0 RELEASE</span>
		</div>
		
		<h1 class="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
			Master Concepts <br/> <span class="text-gradient">Intelligently.</span>
		</h1>
		
		<p class="text-lg md:text-xl text-secondary max-w-2xl mb-12 leading-relaxed">
			KeyNote is a spaced repetition flashcard system designed for engineers. 
			Focus on understanding, let the algorithm handle the scheduling.
		</p>

		<!-- Main Action Area -->
		<div class="w-full max-w-xl bg-surface/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-16 shadow-[0_0_50px_rgba(0,0,0,0.2)] relative overflow-hidden">
			<!-- Decorative glow -->
			<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150px] bg-accent/10 blur-[100px] pointer-events-none rounded-[100%]"></div>
			
			<div class="relative z-10 flex flex-col items-center">
				<h2 class="text-sm font-semibold text-secondary uppercase tracking-wider mb-6">Today's Queue</h2>
				
				{#if data.totalDue > 0}
					<div class="flex items-baseline gap-2 mb-8 group cursor-default">
						<span class="text-7xl font-black text-white tracking-tighter group-hover:text-accent transition-colors duration-500">{data.totalDue}</span>
						<span class="text-2xl text-secondary font-medium">cards</span>
					</div>
					
					<div class="flex flex-wrap justify-center gap-4 mb-10 w-full">
						{#each Object.entries(data.stats) as [category, count]}
							<div class="flex flex-col items-center px-4 py-2 bg-base/50 rounded-xl border border-white/5 flex-1 min-w-[100px]">
								<span class="text-xs text-secondary uppercase tracking-wider font-semibold mb-1">{category}</span>
								<span class="text-xl font-bold text-white">{count}</span>
							</div>
						{/each}
					</div>

					<a href="/study" class="group relative inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-white text-base font-bold rounded-2xl transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,138,101,0.3)]">
						<span class="text-base">Start Review Session</span>
						<ArrowRight size={20} class="group-hover:translate-x-1 transition-transform" />
					</a>
				{:else}
					<div class="flex flex-col items-center py-8">
						<div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border border-success/20">
							<span class="text-4xl">🎉</span>
						</div>
						<h3 class="text-xl font-bold text-white mb-2">You're all caught up!</h3>
						<p class="text-secondary mb-8">No cards due for review today.</p>
						<a href="/questions" class="text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-white/10">
							Browse Library
						</a>
					</div>
				{/if}
			</div>
		</div>

		<!-- Features -->
		<div class="grid md:grid-cols-2 gap-6 w-full text-left">
			<div class="p-6 bg-surface border border-white/5 rounded-2xl hover:border-white/10 transition-colors group">
				<div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
					<BookOpen size={24} class="text-primary" />
				</div>
				<h3 class="text-lg font-bold text-white mb-2">Spaced Repetition</h3>
				<p class="text-secondary text-sm leading-relaxed">Powered by SM-2 algorithm. Cards you struggle with appear more frequently, while easy cards are pushed further into the future.</p>
			</div>
			<div class="p-6 bg-surface border border-white/5 rounded-2xl hover:border-white/10 transition-colors group">
				<div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
					<Layers size={24} class="text-primary" />
				</div>
				<h3 class="text-lg font-bold text-white mb-2">Markdown native</h3>
				<p class="text-secondary text-sm leading-relaxed">Write your cards in plain markdown. Code highlighting, diagrams, and formatting are fully supported natively.</p>
			</div>
		</div>
	</div>
</div>