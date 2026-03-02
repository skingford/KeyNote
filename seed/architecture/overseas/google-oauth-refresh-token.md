---
title: Google OAuth 为什么经常“拿不到 refresh_token”？
category: 出海架构
---

## 问题

做 Google 授权登录时，为什么有时只有 access token，没有 refresh token？后端该怎么设计？

## 答案

Context7 对应 Google Auth 文档给出的关键点：

- 需要在授权 URL 中请求离线访问：`access_type=offline`。
- `refresh_token`通常只在用户首次授权时返回。
- 若要重新拿到 refresh token，常见做法是加 `prompt=consent` 触发重新同意。

后端设计建议：
- 把 refresh token 视为高敏凭证，单独加密存储并限制访问。
- access token 过期后由服务端静默刷新，客户端不直接持有长期凭证。
- 建立 token 轮换与失效告警，防止授权链路静默失效。
