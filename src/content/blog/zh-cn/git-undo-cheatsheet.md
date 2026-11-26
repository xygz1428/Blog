---
cover: cover-hello-astro.jpg
title: Git 撤销场景速查：reset / revert / restore 到底用哪个
description: 按「改了什么、提交了没有、推没推」三个维度，把撤销命令对应清楚。
pubDate: 2026-11-22
category: 技术
tags: ['Git', '版本控制']
---

撤销是 Git 最容易用错的地方。判断只需三个问题：

1. 改了**工作区**还是**已提交**？
2. 提交**推没推**到远端？
3. 要**保留改动内容**还是彻底丢弃？

## 一、还没提交：`restore`

**丢弃工作区的修改**

```bash
git restore 文件名
```

**把文件从暂存区撤回**（改动还在工作区）

```bash
git restore --staged 文件名
```

这两个是安全的——不碰历史。

## 二、提交了但没推：`reset`

```bash
git reset --soft HEAD~1    # 撤销提交，改动留在暂存区
git reset HEAD~1           # 撤销提交，改动留在工作区（默认 mixed）
git reset --hard HEAD~1    # 撤销提交，改动一起丢掉 ⚠️
```

区别只在「改动去哪」：

| 参数 | 提交 | 暂存区 | 工作区 |
|---|---|---|---|
| `--soft` | 撤销 | 保留 | 保留 |
| `--mixed`（默认） | 撤销 | 清空 | 保留 |
| `--hard` | 撤销 | 清空 | **丢弃** |

**`--hard` 会丢代码**。执行前先 `git status` 确认没有未提交的东西，或者先 `git stash`。

## 三、已经推了：`revert`

推上去的提交**不要用 reset**——你改写了历史，别人拉下来会冲突。

正确做法是「反向提交」：

```bash
git revert <commit>
```

它生成一个新提交，内容是把那次改动撤掉。历史保留，所有人都能正常 pull。

## 四、改错了某个文件，但不想动其他

```bash
git checkout <commit> -- 文件名     # 旧写法
git restore --source=<commit> 文件名  # 新写法
```

只把某个文件回退到历史版本，其余不动。

## 五、彻底乱了，想回到远端状态

```bash
git fetch origin
git reset --hard origin/main
```

⚠️ 这会丢掉所有本地未推送的提交。执行前先备份：

```bash
git branch backup-$(date +%Y%m%d)
```

## 六、救回误删的分支或提交

`reset --hard` 之后不是没救——`reflog` 记录了 HEAD 的每次移动：

```bash
git reflog
# 找到目标提交的哈希
git reset --hard <hash>
```

`reflog` 默认保留 90 天，这是个后悔药。

## 决策表

| 情况 | 命令 | 危险 |
|---|---|---|
| 工作区改坏了 | `git restore 文件` | 低 |
| 暂存错了 | `git restore --staged 文件` | 低 |
| 提交信息写错（没推） | `git commit --amend` | 低 |
| 多提交了一次（没推） | `git reset --soft HEAD~1` | 低 |
| 提交了且推了 | `git revert <hash>` | 低 |
| 本地彻底乱了 | `git reset --hard origin/main` | **高** |
| 误删分支 | `git reflog` + `reset` | 中 |

## 一条经验

**没推之前，随便折腾；推了之后，只用 revert。**

前半句是因为本地历史是你的私有财产，后半句是因为远端历史是共享契约。
