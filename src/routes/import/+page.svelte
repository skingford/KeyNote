<script lang="ts">
	import { enhance } from '$app/forms';
	
	let isSubmitting = $state(false);
	let result = $state<{success?: boolean; error?: string} | null>(null);

	// Example markdown template
	const templateExample = `---
category: Go基础
title: Slices (切片) 的底层结构是什么？
---
描述一下 Go 中 Slice 的底层数据结构，以及扩容时的核心行为。
====
Slice 底层是一个 \`reflect.SliceHeader\` 结构体，包含三个字段：
1. \`Data\`: 指向底层数组的指针。
2. \`Len\`: 切片的当前长度。
3. \`Cap\`: 到底层数组末尾的容量。

**扩容机制**:
- 当所需容量大于 2 倍时，直接扩容到所需容量。
- 小于 1024 之前，每次扩容 2 倍。
- 超过 1024 后，每次扩容 1.25 倍，直到满足所需的容量。
***
---
category: 微服务架构
title: 分布式系统中 CAP 定理的含义？
---
请解释 CAP 定理，并说明为何 P (分区容错性) 通常是必选项。
====
- **C (Consistency)**: 一致性。
- **A (Availability)**: 可用性。
- **P (Partition tolerance)**: 分区容错性。

因为在分布式系统中，**网络故障是不可避免的**，所以 P 是必须保证的。架构师只能在 C 和 A 之间进行权衡 (CP 或 AP)。
***`;
</script>

<div class="w-full max-w-4xl mx-auto py-8">
	<div class="mb-10 text-center">
		<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
			导入题库数据
		</h1>
		<p class="text-secondary max-w-2xl mx-auto">
			支持使用 JSON 数组或简化的 Markdown 模板批量快速导入题目。
		</p>
	</div>

	{#if result?.success}
		<div class="p-4 mb-8 rounded-xl bg-success/10 border border-success/30 text-success flex items-center gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
			导入成功！题目已加入您的架构知识库。
		</div>
	{/if}

	{#if result?.error}
		<div class="p-4 mb-8 rounded-xl bg-danger/10 border border-danger/30 text-danger flex items-center gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
			{result.error}
		</div>
	{/if}

	<div class="glass p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl">
		<form 
			method="POST" 
			class="flex flex-col gap-8"
			use:enhance={() => {
				isSubmitting = true;
				result = null;
				return async ({ result: actionResult, update }) => {
					isSubmitting = false;
					if (actionResult.type === 'success' || actionResult.type === 'failure') {
						result = actionResult.data as any;
					}
					if (actionResult.type === 'success') {
						update({ reset: true });
					}
				};
			}}
		>
			<div class="flex flex-col gap-3">
				<label for="format" class="text-base font-bold text-primary flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
					数据格式
				</label>
				<select name="format" id="format" class="bg-surface border border-white/10 rounded-xl p-4 text-primary font-medium outline-none focus:border-accent transition-colors">
					<option value="markdown">Markdown 模板 (推荐)</option>
					<option value="json">JSON 数组格式</option>
				</select>
			</div>

			<div class="flex flex-col gap-3">
				<div class="flex justify-between items-end">
					<label for="data" class="text-base font-bold text-primary flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
						题目数据内容
					</label>
					<div class="text-xs text-accent/80 font-mono px-2 py-1 bg-accent/10 rounded">使用 ==== 区分正文与答案，*** 区分独立题目</div>
				</div>
				<textarea 
					name="data" 
					id="data" 
					rows="16"
					placeholder={templateExample}
					class="w-full bg-[#161616] border border-white/10 rounded-xl p-5 text-primary font-mono text-sm outline-none focus:border-accent transition-colors resize-y leading-relaxed shadow-inner"
					required
				></textarea>
			</div>

			<button 
				type="submit" 
				disabled={isSubmitting}
				class="mt-2 py-4 px-8 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold shadow-lg shadow-accent/20 cursor-pointer flex justify-center items-center gap-3 text-lg"
			>
				{#if isSubmitting}
					<span class="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
					正在解析导入中...
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
					一键存入数据库
				{/if}
			</button>
		</form>
	</div>
</div>
