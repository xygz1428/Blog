---
title: Checklist for reproducing someone else's experiment
description: From environment, data, parameters to evaluation caliber, a recurrence list is arranged in order.
pubDate: 2026-11-13
category: 科研
tags: ['复现', '实验', '检查清单']
cover: anime-01.webp
---
When reproducing other people's experiments, the most common outcome is "it ran through, but the numbers don't match up."

Don't suspect that the paper is fake - 80% of the time it's because the details of a certain link are not correct. Listed below in order of investigation.

## The first layer: environment

- [ ] Whether the dependent version is consistent with the paper (`requirements.txt` / `environment.yml` yes or no)
- [ ] Python / CUDA / framework version
- [ ] Hardware differences (different GPU models may cause numerical differences)
- [ ] Whether the source of randomness is fixed (seed, `cudnn.deterministic`, multi-thread order)

**Experience**: Differences in major framework versions often lead to 1–2 point differences in metrics, and differences in minor versions are usually negligible.

## Second layer: data

- [ ] Dataset version (there may be multiple revisions with the same name)
- [ ] Division method (random division or fixed division? What is the seed?)
- [ ] Preprocessing details (whether the normalization parameters are calculated using the training set or the entire population)
- [ ] How to deal with class imbalance
- [ ] Data leakage check (whether test set information is used in preprocessing)

**The most common mistake**: Preprocessing order. The results will be different between dividing first and then normalizing and normalizing and then dividing.

## The third layer: training details

- [ ] Learning rate, scheduling strategy, warmup
- [ ] batch size (noise scale that affects gradients)
- [ ] Number of training rounds/early stopping strategy
- [ ] Optimizer and its default parameters (β, eps are often ignored)
- [ ] Weight initialization method
- [ ] Gradient cropping

**Note**: Changing the batch size often requires adjusting the learning rate synchronously, otherwise it will not be a fair comparison.

## The fourth level: evaluation caliber

- [ ] Indicator definition (the same name may be defined differently in different papers)
- [ ] Whether to take the optimal value (`best of k`) or the average value of multiple runs
- [ ] Whether data augmentation (TTA) was used during testing
- [ ] How to determine the threshold (choose on the validation set or be fixed)

**This step is most easily overlooked**. Many "cannot be reproduced" are actually due to different calibers: the paper reported the best of 5 times, and you reported a single time.

## Troubleshooting strategy

**Don't change multiple variables at the same time**. In this order:

1. First make sure you can run through it (even if the indicator is very poor)
2. Align the evaluation caliber to see if the numbers are close
3. Align data partitioning
4. Adjust the hyperparameters again

Every time you change an item, record the change in the indicator. In this way, we can finally locate which item caused the difference.

## How much difference is considered normal?

| difference | judge |
|---|---|
| < 1% | Normal fluctuations, acceptable |
| 1–3% | Need to find reasons, but don’t doubt the thesis |
| > 5% | There is a high probability that some links are not aligned. |
| opposite direction | Give priority to doubting data or assessment caliber |

The specific threshold depends on the variance of the task itself - tasks with large variance (small data sets, strong randomness) are more tolerant.

## What should I do if it cannot be reproduced?

**Write down what you tried first**. This record itself has value:

- Which links are aligned and which are not?
- At which step does the difference occur?
- your guess

What you can then do:

1. Ask the author for code or configuration (many papers have appendices or supplementary materials)
2. Ask a question in the community and attach your complete configuration
3. If the difference is stable and explainable, include it as a discussion in your own paper

**Failure to reproduce does not mean there is a problem with the paper**, but **unexplained differences are worth recording**.

## summary

The order of reproduction should be: **Environment → Data → Training → Evaluation Caliber**.

Start aligning from the outermost layer, change only one variable at each step, and write down the results each time. This way, even if it doesn't reappear in the end, you'll still know which level you're stuck on.