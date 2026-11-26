---
title: "Git Undo Cheatsheet: reset, revert or restore?"
description: Map the right command by answering three questions — what changed, was it committed, was it pushed.
pubDate: 2026-11-22
category: 技术
tags: ['Git', 'Version Control']
---

Undo is where Git trips people up. Three questions decide everything:

1. Did I change the **working tree** or **already commit**?
2. Was the commit **pushed**?
3. Do I want to **keep the changes** or discard them?

## 1. Not committed yet: `restore`

**Discard working tree changes**

```bash
git restore filename
```

**Unstage a file** (changes stay in the working tree)

```bash
git restore --staged filename
```

Both are safe — history is untouched.

## 2. Committed but not pushed: `reset`

```bash
git reset --soft HEAD~1    # undo commit, keep changes staged
git reset HEAD~1           # undo commit, keep changes in working tree (default: mixed)
git reset --hard HEAD~1    # undo commit and discard changes ⚠️
```

The only difference is where the changes go:

| Flag | Commit | Index | Working tree |
|---|---|---|---|
| `--soft` | undone | kept | kept |
| `--mixed` (default) | undone | cleared | kept |
| `--hard` | undone | cleared | **discarded** |

**`--hard` destroys code.** Run `git status` first, or `git stash` beforehand.

## 3. Already pushed: `revert`

Do **not** use reset on pushed commits — you would rewrite history and everyone else's pull breaks.

Instead, create an inverse commit:

```bash
git revert <commit>
```

It produces a new commit that undoes the change. History is preserved and everyone can pull normally.

## 4. One file is wrong, everything else is fine

```bash
git checkout <commit> -- filename        # old syntax
git restore --source=<commit> filename   # new syntax
```

Restores a single file to a historical version and leaves the rest alone.

## 5. Everything is a mess, go back to the remote

```bash
git fetch origin
git reset --hard origin/main
```

⚠️ This discards every unpushed local commit. Back up first:

```bash
git branch backup-$(date +%Y%m%d)
```

## 6. Recover a deleted branch or commit

`reset --hard` is not the end — `reflog` records every movement of HEAD:

```bash
git reflog
# find the target hash
git reset --hard <hash>
```

`reflog` is kept for 90 days by default. It is the undo button for your undo button.

## Decision table

| Situation | Command | Risk |
|---|---|---|
| Broke the working tree | `git restore file` | Low |
| Staged the wrong thing | `git restore --staged file` | Low |
| Wrong commit message (unpushed) | `git commit --amend` | Low |
| One commit too many (unpushed) | `git reset --soft HEAD~1` | Low |
| Committed and pushed | `git revert <hash>` | Low |
| Local branch is chaos | `git reset --hard origin/main` | **High** |
| Deleted a branch by accident | `git reflog` + `reset` | Medium |

## One rule of thumb

**Before pushing, do whatever you like. After pushing, only revert.**

The first half holds because local history is your private property; the second because remote history is a shared contract.
