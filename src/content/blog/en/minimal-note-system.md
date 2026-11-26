---
title: The smallest possible solution for a note-taking system
description: Don’t start with tools. Three documents and one rule, let’s run it first and then talk about the system.
pubDate: 2026-11-12
category: 学习
tags: ['笔记', '方法', '工具']
cover: cover-three-pass.jpg
---
The easiest pitfall when taking notes is: **Spend two weeks studying tools and then not remember a word**.

The solution described in this article is very simple, but it can be used immediately.

## Working backward from needs

First ask yourself: What problem are the notes trying to solve?

My answers are three:

1. **Remember to-do** - otherwise you will forget
2. **Find the old conclusion** - What were you thinking about three months ago?
3. **Precipitate reusable things** - methods, conclusions, code snippets

These three requirements have completely different structural requirements. Mixing them into one system is the reason why most note-taking systems break down.

## three files

```
inbox.md      —— 所有临时想法先扔这里，不分类
projects.md   —— 进行中的事，每个三行：目标 / 下一步 / 卡点
notes/        —— 值得长期留的，一个主题一个文件
```

Just these three.

**`inbox.md`** is the key. When an idea pops up, don’t worry about where to put it, just throw it in first. Leave classification until sorting - **The high cost of classification is the number one reason for the death of note-taking systems**.

**`projects.md`** Only records in progress. Remove when done and keep short. It answers "What should I do now?"

**`notes/`** Save the accumulated content. Each file has a theme, and the file name is the theme name.

## a rule

**Clear inbox once a week. **

- Done things → delete
- Those with long-term value → Organize into `notes/`
- To do → Move to `projects.md`
- Uncertain → Leave it until next week

The act of clearing your inbox is more important than any classification system. It ensures that the system does not break down.

## Why is it not recommended to build a labeling system from the beginning?

The labeling system looks beautiful, but there are actually three problems:

1. **The same thing can be described with five labels**, and you will be confused about which one to use.
2. **Tag will expand**. After three months you will have a hundred tags and can’t find anything.
3. **Maintenance costs increase linearly with the amount of notes**

Alternative: **Search by filename and full text**.

Modern editors and system searches enable full-text search. Giving a file a good name (including keywords) is more effective than a hundred tags.

## What content is worth entering `notes/`

There is only one criterion for judgment: **Will I still want to look for it after three months? **

- Yes → enter notes
- No → Delete it after use

for example:

| content | place |
|---|---|
| Conclusion of today's meeting | inbox (clear or transfer the project next week) |
| Specific configuration steps for a tool | notes (will be used repeatedly) |
| Thoughts after reading an article | inbox, it will probably be deleted. |
| A reusable code snippet | notes |
| To-do list | projects |

## Tool selection

**Any editor that supports plain text Markdown will do. **

The key is not the tool, but that the file is on your disk, is plain text, and can be managed by Git. so:

- Change tools without losing data
- Can be searched with grep
- Ability to manage versions

Negative example: Store notes only in a private format on a cloud service. Once the tool is stopped, the data will be lost.

## Common failure modes

| symptom | reason | solution |
|---|---|---|
| I memorized a bunch of them and never looked back. | No cleanup action | Clear inbox every week |
| can't find something | Classification is too detailed | Use full-text search instead |
| Created a bunch of empty files | Build the structure first and fill in the content later | Start with three files |
| Data was lost when changing tools | Used private format | Plain text + Git |

## summary

The core of the minimum available solution is not the number "three files", but two principles:

1. **Capture first, organize later** (reduce recording costs)
2. **Regular cleaning** (to prevent system corruption)

Systems are grown, not designed. Run it for three months and you'll find out which structures you really need.