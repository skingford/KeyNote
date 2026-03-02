---
title: FCM 推送为什么要做 token 失效清理？
category: 出海架构
---

## 问题

Firebase Cloud Messaging（FCM）里，为什么服务端必须维护 token 生命周期并清理失效 token？

## 答案

Context7 对应 Firebase 文档强调：发送失败时要识别无效 token 并清理。

- 典型错误包含 `UNREGISTERED`，表示 token 已不再有效。
- 在 payload 明确正确时，`INVALID_ARGUMENT` 也可能意味着目标 token 无效。
- 不清理失效 token 会导致推送成功率统计失真、重试浪费、告警噪声增大。

推荐策略：
- 每次发送都记录结果，失败分级处理（临时错误重试，永久错误删除）。
- 建立 token 最近活跃时间，定期回收长期不活跃 token。
- 设备重新登录/重装后及时上报新 token，保证用户触达率。
