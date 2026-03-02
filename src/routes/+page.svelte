<script lang="ts">
	let { data } = $props();
</script>

<div class="w-full max-w-4xl mx-auto py-8">
	<div class="mb-10 text-center">
		<h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 group">
			<span class="text-gradient">知识图谱与架构题库</span>
		</h1>
		<p class="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
			巩固 Go 语言底层原理、微服务架构与分布式系统设计的核心知识点。
		</p>
	</div>

	{#if data.dueCount > 0}
		<div class="mb-10 p-6 glass rounded-2xl flex items-center justify-between border-l-4 border-l-accent animate-pulse-slow">
			<div>
				<h2 class="text-xl font-bold mb-1">今日复习任务</h2>
				<p class="text-secondary">您有 <span class="text-accent font-bold text-lg">{data.dueCount}</span> 道复习题待完成，保持每日精进。</p>
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each data.categories as cat}
			<a href="/study/{cat.category}" class="block group h-full">
				<div class="glass p-6 sm:p-8 rounded-2xl border border-white/5 hover:border-accent/40 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 relative overflow-hidden h-full flex flex-col justify-between hover:-translate-y-1">
					<div class="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500"></div>
					<div>
						<h3 class="text-2xl font-bold mb-2 group-hover:text-primary transition-colors relative z-10">{cat.category}</h3>
						<p class="text-secondary mb-4 relative z-10 font-medium">共 <span class="text-primary">{cat.count}</span> 道架构题</p>
					</div>
					<div class="mt-4 flex items-center text-sm font-bold text-accent relative z-10">
						开始测试 
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
					</div>
				</div>
			</a>
		{/each}
	</div>

	{#if data.categories.length === 0}
		<div class="text-center p-12 glass rounded-2xl border border-white/5 border-dashed mt-8">
			<div class="text-5xl mb-4 opacity-50">🗂️</div>
			<h3 class="text-xl font-bold mb-2 text-primary">题库空空如也</h3>
			<p class="text-secondary/60 mb-8 max-w-sm mx-auto">点击导入题目，开始建立您的私人离线架构知识库。</p>
			<a href="/import" class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-surface-hover hover:bg-surface text-primary transition-all duration-200 border border-white/10 font-bold shadow-md hover:shadow-lg">
				📥 前往数据导入台
			</a>
		</div>
	{/if}
</div>

<style>
	.animate-pulse-slow {
		animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	@keyframes pulse-slow {
		0%, 100% {
			border-left-color: rgba(255, 138, 101, 1);
		}
		50% {
			border-left-color: rgba(255, 138, 101, 0.4);
		}
	}
</style>
