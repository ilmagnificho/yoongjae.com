---
title: "Astro로 개인 사이트 만들기"
date: 2026-02-10
description: "왜 Astro를 선택했고, 개인 사이트에 어떤 장점이 있는지 정리합니다."
tags: ["Insight"]
isDraft: false
---

## 왜 Astro인가?

개인 사이트를 만들 때 가장 중요한 것은 **속도**와 **단순함**입니다. Astro는 이 두 가지를 모두 충족시킵니다.

### Zero JavaScript by Default

Astro의 가장 큰 특징은 기본적으로 JavaScript를 보내지 않는다는 것입니다. 정적 HTML만 생성하기 때문에 번들 사이즈가 극도로 작습니다.

### Content Collections

```typescript
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});
```

TypeScript 기반의 Content Collections는 마크다운 파일의 frontmatter를 타입 안전하게 관리할 수 있게 해줍니다.

### Island Architecture

인터랙티브한 부분만 선택적으로 hydrate할 수 있습니다. 블로그 같은 콘텐츠 중심 사이트에 이상적인 구조입니다.

## 결론

개인 사이트는 자기 자신의 실험실입니다. Astro는 그 실험을 빠르고 간결하게 만들어줍니다.
