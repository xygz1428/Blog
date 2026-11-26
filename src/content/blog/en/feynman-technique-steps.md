---
title: Feynman Technique Practical Steps
description: It’s not as simple as “telling it to others”. Four steps, each with testable standards.
pubDate: 2026-11-11
category: 学习
tags: ['学习方法', '费曼技巧']
cover: cover-three-pass.jpg
---
"Speak clearly in simple words" - this statement is too abstract, and in practice it can easily turn into feeling good about yourself.

Break it down into four actionable steps.

## Step 1: Write down the concept name and then close the data

Write down the concept you want to learn at the top of a blank piece of paper, such as "Bayes' Theorem."

**The key action is to close the data**. When reading the material, you will unconsciously repeat the original wording, which does not count as understanding.

## Step 2: Pretend to tell it to a layman

Write an explanation. The rules are:

- **No jargon** (unless it is explained first)
- **Do not use "obviously" or "easy to see"**
- Each sentence must be a complete judgment, not noun stacking

This time you will immediately get stuck - the place where you get stuck is what you don't understand.

**Output**: An explanation with obvious lag. Stuttering points are marked with a red pen.

## Step 3: Go back to the information and only fix the stuck areas

Don't reread the entire chapter. Only check the stuck points marked in the second step.

After checking it and telling it again, it’s still the same rules.

**Judgment Criteria**: Whether the stuck points disappear during the second lecture. If it's still there, it means you're looking in the wrong place - usually the prerequisite concepts are missing, not the knowledge point itself.

## Step 4: Find an analogy and check the boundaries of the analogy

Good explanations usually have an analogy. But **analogy leads to false expectations** and boundaries must be checked.

For example, compare "voltage" to "water pressure":

- Where the analogy works: Pressure differences drive flow
- **Not true**: Water will flow, but the charge will not disappear.

Only by writing clearly "where is this analogy right and where is it wrong?" can you truly master it.

## a concrete example

**Concept**: Overfitting

**Layman’s explanation (output of the first step)**:

> The model has memorized the training data, but it will not work when it encounters new data.

**Follow-up question**: Why is it bad to memorize it?

Stuck - Explain "why" you haven't figured it out yet.

**After completion**:

> Because the model learns not only the rules, but also the random noise in the data. Noise only exists in this batch of data and disappears when another batch is changed, so judgments based on noise will be wrong on new data.

**Analogy**: memorizing the question bank vs understanding the principles.

**Boundary**: If the question bank is large enough and distributed in the same distribution as the test questions, memorizing the question bank is also effective - so the statement "memorizing is not good" is not rigorous in itself, and must be added with the premise that "the amount of data is limited and the distribution will change".

Only here do I really understand.

## Three common misconceptions

**Misunderstanding 1: Feynman’s technique is “telling it to others”**

wrong. The core is to use output to expose loopholes in understanding. It doesn’t matter who you tell it to, just write it down.

**Misunderstanding 2: The more popular the better**

wrong. Popularity is the means, accuracy is the goal. Sacrificing accuracy for the sake of popularity (such as the "memorizing question bank" analogy) is harmful.

**Myth 3: All concepts are worth doing**

wrong. It's slow and only worth using for core concepts. You don’t need Feynman to look up an API usage.

## when to use

- Learn a concept that comes up repeatedly but can never be explained clearly
- When preparing for a defense or lecture
- After reading a paper, test whether you really understand it

## summary

| step | action | Inspection standards |
|---|---|---|
| one | Write down the concept and close the information | The data is really closed |
| two | Speak in vernacular | Obvious lag occurs |
| three | Only replenish card points | The lag disappeared the second time |
| Four | Find analogies + draw boundaries | Can tell where the analogy is correct and where it is wrong |

The Feynman Technique is not metaphysics, it just turns "I think I understand" into something testable.