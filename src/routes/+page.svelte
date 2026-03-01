<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>KeyNote v1 - 首页</title>
</svelte:head>

<div class="home-page">
	<header>
		<h1>KeyNote v1</h1>
		<p class="subtitle">个人面试背题工具</p>
	</header>

	<main>
		<section class="overview">
			<h2>今日待复习</h2>
			
			{#if data.totalDue > 0}
				<div class="huge-number">
					{data.totalDue} <span class="unit">题</span>
				</div>
				
				<div class="stats">
					{#each Object.entries(data.stats) as [category, count]}
						<div class="stat-item">
							<span class="category-name">{category.toUpperCase()}</span>
							<span class="count">{count}</span>
						</div>
					{/each}
				</div>

				<div class="actions">
					<a href="/study" class="btn primary">快速开始</a>
				</div>
			{:else}
				<div class="all-clear">
					<div class="icon">🎉</div>
					<p>今日任务已全部完成！</p>
				</div>
			{/if}
		</section>

		<nav class="links">
			<a href="/questions" class="nav-card">
				<h3>题库浏览 →</h3>
				<p>查看所有题目，按分类/标签筛选</p>
			</a>
		</nav>
	</main>
</div>

<style lang="scss">
	.home-page {
		max-width: 600px;
		margin: 0 auto;
		padding: 4rem 1rem;
		text-align: center;
	}

	header {
		margin-bottom: 3rem;
		
		h1 {
			font-size: 2.5rem;
			margin-bottom: 0.5rem;
			color: var(--primary, #3b82f6);
		}
		
		.subtitle {
			color: var(--text-muted, #6c7086);
		}
	}

	.overview {
		background: var(--surface, #1e1e2e);
		padding: 3rem 2rem;
		border-radius: var(--radius-lg, 16px);
		margin-bottom: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

		h2 {
			margin-bottom: 1.5rem;
			font-size: 1.2rem;
			color: var(--text-muted, #6c7086);
		}
	}

	.huge-number {
		font-size: 5rem;
		font-weight: bold;
		line-height: 1;
		color: var(--text, #cdd6f4);
		margin-bottom: 1rem;

		.unit {
			font-size: 1.5rem;
			color: var(--text-muted, #6c7086);
		}
	}

	.stats {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-bottom: 2.5rem;

		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.category-name {
				font-size: 0.8rem;
				color: var(--text-muted, #6c7086);
				text-transform: uppercase;
				margin-bottom: 0.2rem;
			}
			
			.count {
				font-weight: bold;
				font-size: 1.2rem;
			}
		}
	}

	.actions {
		.btn {
			display: inline-block;
			padding: 1rem 3rem;
			border-radius: 99px;
			font-weight: bold;
			text-decoration: none;
			transition: transform 0.2s, box-shadow 0.2s;

			&.primary {
				background: var(--primary, #3b82f6);
				color: white;

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
				}
			}
		}
	}

	.all-clear {
		padding: 2rem 0;
		.icon {
			font-size: 4rem;
			margin-bottom: 1rem;
		}
		p {
			color: var(--success, #a6e3a1);
			font-weight: bold;
		}
	}

	.links {
		display: flex;
		gap: 1rem;
		
		.nav-card {
			flex: 1;
			background: var(--surface, #1e1e2e);
			padding: 1.5rem;
			border-radius: var(--radius-md, 8px);
			text-align: left;
			text-decoration: none;
			color: inherit;
			transition: background 0.2s;

			&:hover {
				background: var(--surface-hover, #2a2a3e);
			}

			h3 {
				color: var(--primary, #3b82f6);
				margin-bottom: 0.5rem;
			}
			
			p {
				font-size: 0.9rem;
				color: var(--text-muted, #6c7086);
				margin: 0;
			}
		}
	}
</style>
