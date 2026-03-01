---
title: Goroutine 调度模型
category: go
tags: ["goroutine", "调度", "GMP"]
difficulty: 2
---

## 问题

请简述 Go 语言中的 GMP 调度模型。

## 答案

GMP 是 Go 语言实现的高效并发调度模型：
- **G (Goroutine)**: 代表一个并发执行的协程，包含运行栈和状态信息。
- **M (Machine)**: 代表操作系统的线程（OS Thread），由 OS 调度，执行 G。
- **P (Processor)**: 代表逻辑处理器，包含了运行 G 所需的资源和本地队列。默认数量由 `GOMAXPROCS` 决定。

**核心机制：**
1. M 必须绑定一个 P 才能执行 G。
2. P 有一个本地运行队列（上限 256），全局也有一个运行队列。
3. **Work Stealing (工作窃取)**: 当一个 P 的本地队列空了，它会尝试从其他 P 的本地队列窃取一半的 G 来运行，或者从全局队列获取。
4. **Handoff (移交)**: 当 M 执行的 G 发生系统调用阻塞时，M 会释放绑定的 P，把 P 移交给其他空闲的 M 执行，保证 P 不被浪费。
