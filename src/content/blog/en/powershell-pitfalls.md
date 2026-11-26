---
cover: demo-flow.png
title: Five common pitfalls in PowerShell
description: Read-only variables, encoding, error continuation, Chinese matching - all are pitfalls that make the script "look like it ran successfully".
pubDate: 2026-11-20
category: 技术
tags: ['PowerShell', '脚本', 'Windows']
---
Most of the pitfalls of PowerShell are not reporting errors, but silently giving incorrect results. I have stepped on all five of the following.

## Pitfall 1: `$HOME`, `$PWD`, `$PID` are read-only variables

```powershell
$home = Get-Content index.html -Raw   # ❌ 报错
$home -match 'keyword'                 # 检查的是用户目录路径，永远 False
```

If the assignment fails, an error will be reported, but the script will continue to execute. So the subsequent judgment is based on a completely irrelevant value, leading to the false conclusion that "the inspection failed".

When I first encountered it, I thought it was because the page really had no content, so I checked it for a long time.

**Solution**: Change the name.

```powershell
$homeHtml = Get-Content index.html -Raw
```

Similar read-only variables include `$PWD`, `$PID`, `$PSHOME`, and `$Host`.

## Pitfall 2: Errors do not interrupt the script

PowerShell default `$ErrorActionPreference = 'Continue'` - the command failed and the script continued to run.

The result is a bunch of red errors mixed with "successful" output, and you can't tell which one is credible.

**Solution**: Add at the beginning of the script

```powershell
$ErrorActionPreference = 'Stop'
```

Or add `-ErrorAction Stop` to a single command.

## Pitfall 3: `-Raw` Not available in all situations

`Get-Content -Raw` Read the entire file into a string. However, in some restricted environments (such as constrained language mode), this parameter will report "Cannot find a parameter matching the parameter name Raw".

A more stable way of writing is to use .NET:

```powershell
[System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
```

Incidentally, the encoding can also be specified explicitly.

## Pitfall 4: Chinese matching will falsely fail

```powershell
$content -match '关键词'   # 可能永远是 False
```

The reason is usually inconsistent encoding: the file is UTF-8, PowerShell decodes it according to GBK, and the Chinese becomes garbled, which naturally cannot be matched.

**solution**:

- Explicitly use UTF-8 when reading files
- Or match ASCII anchors (such as `class="post-toc"` in HTML) to avoid Chinese

```powershell
$c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
$c -match 'class="post-toc"'
```

## Pitfall 5: Lost Chinese characters when writing UTF-8 script files

Use `Set-Content` to write `.ps1` or `.cmd`. If the encoding is not specified, it may be written as ANSI, and all Chinese characters inside will become question marks.

**solution**:

```powershell
$enc = New-Object System.Text.UTF8Encoding($false)   # $false = 不写 BOM
[System.IO.File]::WriteAllText($path, $content, $enc)
```

UTF-8 with BOM will fail to be parsed in some Windows command line tools, so it is usually used without BOM.

## A common troubleshooting habit

When the script gives "check failed", first make sure it actually read the content:

```powershell
Write-Output ('长度: ' + $content.Length)
```

A length of 0 or something obviously wrong indicates that the problem is with reading the file, not with the thing being checked.

**This habit can save most of the misjudgments. **