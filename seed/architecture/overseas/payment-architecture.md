---
title: 海外支付为什么要做 IAP 与三方支付双轨架构？
category: 出海架构
---

## 问题

运动 APP 出海时，为什么常见方案是 App 内购（Apple/Google）+ Stripe/PayPal 双轨并行？

## 答案

原因是渠道、场景和风控要求不同。

- 移动端数字内容：通常走 Apple/Google 内购，符合平台政策。
- Web 站点或地区化支付：常用 Stripe/PayPal/Adyen，覆盖信用卡和本地钱包。
- 风险隔离：IAP 与三方支付账务链路分离，便于对账与追责。
- 收入优化：不同地区可按支付成功率和成本做策略分流。

实现要点：
- 订单中心统一建单，支付通道只是“执行层”。
- 统一状态机：`created -> pending -> paid -> failed/refunded`。
- 用 webhook 驱动状态更新，避免只依赖前端回调。
