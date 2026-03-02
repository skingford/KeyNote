<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props<{
		data: {
			categories: Array<{ id: number; name: string; count: number }>;
			pagination: { page: number; pageSize: number; total: number; totalPages: number };
		};
	}>();

	let result = $state<{ success?: boolean; error?: string } | null>(null);
	let isSubmitting = $state(false);

	function enhancedSubmit() {
		isSubmitting = true;
		result = null;
		return async ({ result: actionResult }: any) => {
			isSubmitting = false;
			if (actionResult.type === 'success' || actionResult.type === 'failure') {
				result = actionResult.data as any;
			}
			if (actionResult.type === 'success') {
				await invalidateAll();
			}
		};
	}
</script>

<div class="w-full max-w-4xl mx-auto py-8">
	<div class="mb-10 text-center">
		<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">分类管理</h1>
		<p class="text-secondary max-w-2xl mx-auto">统一管理题目分类：创建、重命名、删除（空分类）。</p>
	</div>

	{#if result?.success}
		<div class="p-4 mb-6 rounded-xl bg-success/10 border border-success/30 text-success">操作成功。</div>
	{/if}
	{#if result?.error}
		<div class="p-4 mb-6 rounded-xl bg-danger/10 border border-danger/30 text-danger">{result.error}</div>
	{/if}

	<div class="glass p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl mb-8">
		<h2 class="text-lg font-bold mb-4">创建分类</h2>
		<form method="POST" action="?/create" class="flex gap-3 flex-col sm:flex-row" use:enhance={enhancedSubmit}>
			<input
				name="name"
				type="text"
				placeholder="例如：系统设计、数据库、出海架构"
				class="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-3 text-primary outline-none focus:border-accent transition-colors"
				required
			/>
			<button
				type="submit"
				disabled={isSubmitting}
				class="px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-50 transition-colors font-bold"
			>
				创建
			</button>
		</form>
	</div>

	<div class="glass p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-bold">分类列表</h2>
			<div class="text-xs text-secondary">共 {data.pagination.total} 条</div>
		</div>
		{#if data.categories.length === 0}
			<div class="text-secondary">暂无分类。</div>
		{:else}
			<div class="overflow-x-auto rounded-xl border border-white/10">
				<table class="w-full min-w-[700px] text-sm">
					<thead>
						<tr class="bg-surface-hover/70 text-secondary">
							<th class="text-left px-4 py-3 font-semibold">分类名称</th>
							<th class="text-left px-4 py-3 font-semibold w-28">题目数</th>
							<th class="text-left px-4 py-3 font-semibold w-[420px]">操作</th>
						</tr>
					</thead>
					<tbody>
						{#each data.categories as cat (cat.id)}
							<tr class="border-t border-white/10 bg-surface/40 hover:bg-surface/60 transition-colors">
								<td class="px-4 py-3 font-medium">{cat.name}</td>
								<td class="px-4 py-3 text-secondary">{cat.count}</td>
								<td class="px-4 py-3">
									<div class="flex gap-2">
										<form method="POST" action="?/rename" class="flex gap-2 flex-1" use:enhance={enhancedSubmit}>
											<input type="hidden" name="id" value={cat.id} />
											<input
												name="name"
												type="text"
												value={cat.name}
												class="flex-1 bg-base border border-white/10 rounded-lg px-3 py-2 text-primary outline-none focus:border-accent"
												required
											/>
											<button type="submit" disabled={isSubmitting} class="px-3 py-2 rounded-lg bg-surface-hover border border-white/10 hover:border-white/20 transition whitespace-nowrap">重命名</button>
										</form>
										<form method="POST" action="?/delete" use:enhance={enhancedSubmit}>
											<input type="hidden" name="id" value={cat.id} />
											<button
												type="submit"
												disabled={isSubmitting || cat.count > 0}
												class="px-3 py-2 rounded-lg border transition whitespace-nowrap {cat.count > 0 ? 'border-white/10 text-secondary/50 cursor-not-allowed' : 'border-danger/30 text-danger hover:bg-danger/15'}"
											>
												删除
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-4 flex items-center justify-between gap-3">
				<div class="text-xs text-secondary">
					第 {data.pagination.page} / {data.pagination.totalPages} 页
				</div>
				<div class="flex items-center gap-2">
					{#if data.pagination.page > 1}
						<a
							href={`/categories?page=${data.pagination.page - 1}`}
							class="px-3 py-1.5 rounded-lg border border-white/10 bg-surface hover:bg-surface-hover transition-colors text-sm"
						>
							上一页
						</a>
					{:else}
						<span class="px-3 py-1.5 rounded-lg border border-white/10 text-secondary/50 text-sm">上一页</span>
					{/if}

					{#if data.pagination.page < data.pagination.totalPages}
						<a
							href={`/categories?page=${data.pagination.page + 1}`}
							class="px-3 py-1.5 rounded-lg border border-white/10 bg-surface hover:bg-surface-hover transition-colors text-sm"
						>
							下一页
						</a>
					{:else}
						<span class="px-3 py-1.5 rounded-lg border border-white/10 text-secondary/50 text-sm">下一页</span>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
