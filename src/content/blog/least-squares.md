---
title: 公式渲染测试：从最小二乘说起
description: 用最小二乘法验证站点的公式渲染与代码高亮是否正常工作。
pubDate: 2026-11-25
category: 科研
tags: ['公式', 'KaTeX', '线性代数']
---

这篇用来验证数学公式能否正常渲染。

## 最小二乘

给定设计矩阵 $X \in \mathbb{R}^{n \times p}$ 与观测向量 $y \in \mathbb{R}^{n}$，
最小二乘估计为：

$$
\hat{\beta} = \arg\min_{\beta} \| y - X\beta \|_2^2
$$

对目标函数求导并令其为零：

$$
\frac{\partial}{\partial \beta} \| y - X\beta \|_2^2
= -2X^{\top}(y - X\beta) = 0
$$

于是得到正规方程：

$$
X^{\top}X\hat{\beta} = X^{\top}y
\quad\Longrightarrow\quad
\hat{\beta} = (X^{\top}X)^{-1}X^{\top}y
$$

当 $X^{\top}X$ 不可逆时，通常改用岭回归：

$$
\hat{\beta}_{\text{ridge}} = (X^{\top}X + \lambda I)^{-1}X^{\top}y
$$

## 对应的代码

```python
import numpy as np

def ols(X: np.ndarray, y: np.ndarray) -> np.ndarray:
    """普通最小二乘：beta = (X'X)^-1 X'y"""
    XtX = X.T @ X
    Xty = X.T @ y
    return np.linalg.solve(XtX, Xty)

def ridge(X: np.ndarray, y: np.ndarray, lam: float) -> np.ndarray:
    """岭回归：加 L2 正则，缓解共线性"""
    p = X.shape[1]
    return np.linalg.solve(X.T @ X + lam * np.eye(p), X.T @ y)
```

行内公式也可以：当 $\lambda = 0$ 时，岭回归退化为最小二乘。

> 如果上面的公式排版正常、代码有配色，说明 remark-math 与 rehype-katex 都配好了。
