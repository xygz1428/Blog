---
title: Why a Static Site Does Not Need a Database
description: Starting from "what is the content, who writes it, how often does it change", explaining why a whole backend can be dropped.
pubDate: 2026-11-19
category: 技术
tags: ['Architecture', 'Static Site', 'Deployment']
cover: cover-schema.jpg
---

Whenever someone asks which database my blog uses, I say: none. The usual reply is "then where do the posts live".

Simple answer: **in a Git repository, one Markdown file per post**.

## What a database does in a blog

Traditional blogs (the WordPress kind) need a database to solve three problems:

1. **Storage** — post bodies and metadata
2. **Querying** — filtering by category, tag, date
3. **Writing** — saving from an admin editor

A static site replaces all three:

| Need | Database approach | Static approach |
|---|---|---|
| Storage | tables | Markdown files + Git |
| Query | SQL at request time | computed **at build time**, emitted as HTML |
| Write | admin form | edit a file, `git push` |

## The key insight: queries can run at build time

Blog queries have a property that makes this work — **every reader sees the same result**.

"Latest 10 posts" or "all posts in the engineering category" do not need to be computed per request. Compute once at build time and emit static HTML.

That is the whole reason static blogs exist: **many reads, few writes, and the read results can be precomputed**.

Once you need per-user content (a personalised feed after login), static stops being enough — that is a different problem.

## What you get in return

**1. No backend to attack**

No database connection, no SQL injection, no session management, no admin login page. The attack surface shrinks from "a whole server" to "a handful of static files".

**2. Near-zero deployment cost**

The build output is HTML/CSS/images and runs on any static host. GitHub Pages is free and needs no server maintenance, no patching.

**3. Content has version history for free**

`git log` is the revision history, `git diff` is the change comparison. Deletions are recoverable, mistakes are revertible — things you would otherwise have to build.

**4. Local equals production**

`npm run dev` starts a local server that behaves like production. No MySQL install, no data import.

## The costs (must be acknowledged)

**1. Build time grows with content**

100 posts build in about 2 seconds; 10,000 might take minutes. Past a certain scale you need incremental builds.

**2. No real-time interaction**

Comments, likes, search suggestions all need a server — you end up with third parties (Giscus over GitHub Discussions, for example).

**3. Writing requires Git**

This is the biggest barrier. For someone who just wants to write, you first have to teach `git add / commit / push`, or wrap it in a script.

## When to switch away

If any of these become true, a static site is the wrong tool:

- You need login or personalised content
- Content volume makes build time unacceptable and you do not want incremental builds
- You need a complex editorial workflow (multi-role review, scheduled publishing)

Otherwise, static is the lowest-maintenance option.

## Summary

A database solves "dynamic querying and concurrent writes". A blog needs both only weakly: queries can be precomputed, and writes happen a few times a day.

**Removing what you do not need beats optimising it.**
