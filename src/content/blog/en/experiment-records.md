---
title: What should be recorded in experimental records so that they can be reviewed three months later?
description: A minimum list of fields for experimental records, and a traceability method for "why this result is not credible".
pubDate: 2026-11-16
category: 科研
tags: ['实验', '记录', '复现']
cover: cover-least-squares.jpg
---
The biggest problem with experimental records is: **I think it is enough when recording, but when I look back, I find that key information is missing**.

Three months later, you open a file called `result_final_v3.csv` and you can’t remember which set of parameters it came from.

## Minimal field list

Remember at least these for each experiment:

| Field | why must there be |
|---|---|
| time | Locate the specific run |
| Purpose | What hypothesis do you want to test this time? |
| variable | What has been changed, the rest remains the same |
| Full parameters | Not just the changed ones, **all** parameter values |
| Data version | Which data and version are used? |
| code version | Git commit hash, not the "latest version" |
| Operating environment | Depends on version, hardware, random seed |
| result | Raw output + key metrics |
| abnormal | Error reports, warnings, places where running is particularly slow |
| in conclusion | In one sentence: Assumption is true/not true/uncertain |

## The three most common leaks

### 1. Random seed

Without seeds, results cannot be reproduced. This is especially true for machine learning experiments - if you change the seed of the same code, the indicators may differ by a few percentage points.

**Notation**: Write the seed into the configuration and configure the overall archive, instead of just remembering "seed=42".

### 2. The times you failed

People only remember the time they succeeded, but **failure records are often more valuable** - they can tell you which path doesn't work and save you repeated trials and errors.

It is recommended to have a separate "failure record" file, and write one line for each failure: what configuration, what phenomenon, and guessed reasons.

### 3. Judgment at the time

After running the experiment, you have an explanation in your mind, such as "This drop should be because the learning rate is too high." If this judgment is not written down, you will guess again when you see the same curve two weeks later.

**Notation**: Write "My explanation is..." next to the result, and indicate that this is a speculation rather than a conclusion.

## Directory structure suggestions

```
experiments/
├── 2026-11-16-lr-sweep/
│   ├── README.md          # 目的、变量、结论
│   ├── config.yaml        # 完整参数
│   ├── result.csv         # 原始输出
│   ├── notes.md           # 当时判断、异常、下一步
│   └── figures/           # 图
```

There is one directory for each experiment, **directory name with date**. In this way `ls` is the timeline.

## Recorded cost control

Recording all the data sounds tiring, but in reality most of it can be automated:

- Configuration: Directly change the `dump` parameter to `config.yaml` in the script that runs the experiment
- Code version: `git rev-parse HEAD` Write into result file
- Environment: `pip freeze` or `conda list` Save a copy

The remaining handwritten parts are only "purpose", "judgment at the time" and "conclusion" - these three things happen to be the most needed to be written.

## How to judge whether the records are enough

A practical test: **Suppose someone else takes your record and wants to run this experiment again, can he escape? **

If he asks you "Where is the data?" "What parameters were used?" "How many times did you run it?", then it means that the records are not enough.

## A counter-intuitive suggestion

**Write the conclusion first, then add the process**.

After running the experiment, while your memory is fresh, write three lines of conclusion and judgment at the time. Details can be filled in later. If you do it the other way around, by the time you finish sorting out the data, you will have forgotten why it was designed this way in the first place.

## summary

| item | Do you remember |
|---|---|
| All parameters | ✅ Required (automated) |
| random seed | ✅ Must |
| code commit | ✅ Must |
| failed experiment | ✅ Strongly recommended |
| judgment at the time | ✅ Strongly recommended |
| Intermediate process log | ⚠️Keep but don’t organize |
