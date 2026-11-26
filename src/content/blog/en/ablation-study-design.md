---
title: How to design an ablation experiment to be convincing
description: From "proving that each module is useful" to "proving cause and effect", here are the four most common mistakes in ablation design.
pubDate: 2026-11-15
category: 科研
tags: ['实验设计', '消融', '方法论']
cover: cover-least-squares.jpg
---
The purpose of the ablation study is to answer: **Which part of this method is working? **

But after many ablations are done, the reviewer can ask in one sentence: "How do you know that it is A that works and not the interaction between A and B?"

## What does ablation prove?

Let’s first distinguish between the three strengths:

| Target | illustrate | difficulty |
|---|---|---|
| Relevance | Remove A and the indicator drops. | easy |
| necessity | A is necessary | medium |
| Causality | is A causing the decline | Disaster |

Most papers only cover the first level, but are written according to the third level. This is a common over-interpretation.

## Four common mistakes

### Mistake 1: Remove multiple modules at once

"Remove A and B, the indicator drops by 5%" - this sentence cannot be attributed. Is it A, is it B, or does it only work when both are present?

**Method**: Only move one at a time and dissolve them one by one.

### Mistake 2: Only "remove" and not "replace"

If the indicator drops after removing a module, it may just be that the number of parameters has become smaller, rather than that there is something special about the design of this module.

**Method**: Add a set of "alternatives with equal parameters" as a comparison. For example, if a complex module is replaced by a common layer with the same number of parameters, if the indicators are close, it means that capacity is the only factor that matters rather than design.

### Mistake Three: Drawing Conclusions from a Single Run

Deep learning indicators themselves fluctuate. If you run the same configuration three times with different seeds, the difference may be 1–2 points.

**Practice**: Run the key conclusions at least 3 times, and report the mean and standard deviation, rather than the single best result.

### Mistake 4: Only report favorable indicators

A certain ablation falls on indicator A, but rises on indicator B - reporting only A would be a selective presentation.

**How ​​to do**: List all major indicators, including those that are not good for you.

## A convincing ablation table

Designed with this structure:

| Configuration | Indicator 1 | Indicator 2 | Parameter quantity |
|---|---|---|---|
| complete model | benchmark | benchmark | N |
| − Module A | decline | flat | N − a |
| − Module B | flat | decline | N − b |
| A is replaced by equal parameter quantities | close to benchmark | close to benchmark | N |
| Remove both A + B | drop more | drop more | N − a − b |

This table can answer four questions:

1. What each module contributes (line by line)
2. Is the module "useful by design" or "useful by parameter" (replacement line)
3. Whether the two modules are complementary (last line)
4. What is the cost (parameter quantity column)

## When does ablation make no sense?

**1. Modules are inherently standard components**

For example, if you use residual connection, there is no need for ablation to prove that the residual is useful - that is a known conclusion.

**2. The data set is too small and fluctuations outweigh the differences**

If the variance of the three runs is larger than the ablation difference, no conclusion can be drawn from this ablation. Let’s solve the variance problem first.

**3. The ablation configuration itself is unreasonable**

If you do not make corresponding adjustments (such as learning rate, normalization) after removing module A, the performance degradation may be just a configuration mismatch, not that the module is useless.

## Writing Advice

**Don't write "verified the validity of A"**, rewrite it more specifically:

> After removing A, the indicator dropped from This shows that the benefits mainly come from the structural design of A rather than the increase in the number of parameters.

This passage clearly states "how it was done, what the results were, and what alternative explanations were eliminated."

## summary

| Main points | practice |
|---|---|
| Clear attribution | Move only one at a time |
| Exclude capacity explanation | Add equal parameter quantity comparison |
| Resistant to volatility | Run multiple times and report the mean variance |
| Present honestly | All major indicators |
