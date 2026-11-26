---
title: Three principles for tool selection
description: It's not "which one is better", it's "how much does it cost to replace it". Three principles filter out most choice anxiety.
pubDate: 2026-11-08
category: 生活
tags: ['工具', '决策', '方法']
cover: anime-04.jpg
---
The confusion when choosing tools mostly comes from a wrong question: Which one is better? **

The better question is: **How ​​much does it cost to replace it? **

## Principle 1: Data is more important than tools

When choosing a tool, ask first: **Can my data be taken away? **

- Plain text Markdown → can be opened by any editor
- Export database into standard format → with migration path
- Private cloud format → The tool will be gone when the service is stopped

I've seen too many people store their notes in a private format on a service. When the service changes its charging strategy, years of accumulation become hostage.

**Judgment Criteria**: Suppose this tool is shut down tomorrow, can your data be completely available?

## Principle 2: Look at maintenance costs first, then look at functions

A new tool will always have a longer feature list than an old tool - because it hasn't accumulated technical debt yet.

But the real cost is in **maintenance**:

| Cost item | illustrate |
|---|---|
| learning cost | One-time, but potentially high |
| Migration costs | One-time, depends on principle one |
| **Maintenance Cost** | **Continuous and most underestimated** |
| exit cost | What to do if the tool dies |

Maintenance costs include: configuration synchronization, plug-in upgrades, version compatibility, and troubleshooting time when problems occur.

A tool with few functions but zero maintenance is often better in the long run than a tool with many functions but requires daily tossing.

**Judgment Criteria**: How many hours of my non-productive time will this tool take up per month?

## Principle 3: Don’t change tools for 5% of scenarios

"This tool has a function that is particularly suitable for something I occasionally do" - this is the most common reason for changing tools, and it is also the easiest to regret.

Do the math: How many times a year does that scene occur? How much does it cost to replace a tool?

In most cases: **Pay 100% of the migration cost for 5% of the scenarios**.

**Judgement Criteria**: Will this advantage scenario be used more than 10 times a year?

## A practical decision-making process

```
遇到新工具
  ↓
它能解决我现在的真实痛点吗？  ── 不能 → 跳过
  ↓ 能
我的数据能带走吗？            ── 不能 → 慎重
  ↓ 能
维护成本比现在低吗？          ── 更高 → 跳过
  ↓ 更低
先用一周，不动现有工具  ──→ 满意再迁移
```

The last step is critical: **Trial in parallel, don’t migrate immediately**. After a week you'll find that the appeal of most new tools has worn off.

## About "The Best Tool"

Doesn't exist. The quality of a tool depends on:

- your specific scenario
- your proficiency
- The amount of maintenance time you are willing to invest

Therefore, other people's recommendations can only be used as candidates, not as conclusions.

**What is truly scarce is not the tools, but the attention to continue using them. **

## summary

| in principle | Judgment criteria |
|---|---|
| Data first | The tool will be shut down tomorrow, can the data be available? |
| Maintenance cost | How much non-productive time is taken up in a month |
| Reject migration for edge scenarios | Are the advantage scenarios used more than 10 times a year? |

The purpose of choosing a tool is not to "use the best", but to "make the tool disappear" - the best tool is the one that you don't need to think about.