---
title: PowerShell 里容易踩的五个坑
description: 只读变量、编码、错误继续执行、中文匹配——都是让脚本"看起来跑成功了"的坑。
pubDate: 2026-11-20
category: 技术
tags: ['PowerShell', '脚本', 'Windows']
---

PowerShell 的坑大多不是报错，而是**静默给出错误结果**。以下五个我都踩过。

## 坑一：`$HOME`、`$PWD`、`$PID` 是只读变量

```powershell
$home = Get-Content index.html -Raw   # ❌ 报错
$home -match 'keyword'                 # 检查的是用户目录路径，永远 False
```

赋值失败会报错，但**脚本继续执行**。于是后面的判断建立在一个完全无关的值上，得出「检查不通过」的假结论。

我第一次遇到时以为是页面真的没内容，排查了很久。

**解法**：换个名字。

```powershell
$homeHtml = Get-Content index.html -Raw
```

同类只读变量还有 `$PWD`、`$PID`、`$PSHOME`、`$Host`。

## 坑二：错误不会中断脚本

PowerShell 默认 `$ErrorActionPreference = 'Continue'`——命令失败了，脚本接着往下跑。

结果是一堆红色错误里夹着「成功」的输出，你分不清哪句可信。

**解法**：在脚本开头加

```powershell
$ErrorActionPreference = 'Stop'
```

或者在单条命令上加 `-ErrorAction Stop`。

## 坑三：`-Raw` 不是所有场合都有

`Get-Content -Raw` 把整个文件读成一个字符串。但在某些受限环境（如约束语言模式）下，这个参数会报「找不到与参数名称 Raw 匹配的参数」。

更稳的写法是用 .NET：

```powershell
[System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
```

顺带还能明确指定编码。

## 坑四：中文匹配会假失败

```powershell
$content -match '关键词'   # 可能永远是 False
```

原因通常是编码不一致：文件是 UTF-8，PowerShell 按 GBK 解码，中文变成乱码，自然匹配不上。

**解法**：

- 读文件时明确用 UTF-8
- 或者匹配 ASCII 锚点（比如 HTML 里的 `class="post-toc"`），避开中文

```powershell
$c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
$c -match 'class="post-toc"'
```

## 坑五：写 UTF-8 脚本文件时丢中文

用 `Set-Content` 写 `.ps1` 或 `.cmd`，如果不指定编码，可能写成 ANSI，里面的中文全变问号。

**解法**：

```powershell
$enc = New-Object System.Text.UTF8Encoding($false)   # $false = 不写 BOM
[System.IO.File]::WriteAllText($path, $content, $enc)
```

带 BOM 的 UTF-8 在某些 Windows 命令行工具里会解析失败，所以通常用无 BOM。

## 一个通用的排查习惯

脚本给出「检查失败」时，先确认**它真的读到了内容**：

```powershell
Write-Output ('长度: ' + $content.Length)
```

长度为 0 或明显不对，说明问题在读文件，而不是在被检查的东西上。

**这条习惯能省掉大半误判。**
