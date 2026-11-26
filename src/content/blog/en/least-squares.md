---
title: "Formula rendering test: starting from least squares"
description: Use the least squares method to verify that the site's formula rendering and code highlighting are working properly.
pubDate: 2026-11-25
category: 科研
tags: ['公式', 'KaTeX', '线性代数']
cover: cover-least-squares.jpg
---
This article is used to verify whether mathematical formulas can be rendered normally.

## least squares

Given the design matrix $X \in \mathbb{R}^{n \times p}$ and the observation vector $y \in \mathbb{R}^{n}$,
The least squares estimate is:

$$
\hat{\beta} = \arg\min_{\beta} \| y - X\beta \|_2^2
$$

Derive the objective function and set it to zero:

$$
\frac{\partial}{\partial \beta} \| y - X\beta \|_2^2
= -2X^{\top}(y - X\beta) = 0
$$

So we get the normal equation:

$$
X^{\top}X\hat{\beta} = X^{\top}y
\quad\Longrightarrow\quad
\hat{\beta} = (X^{\top}X)^{-1}X^{\top}y
$$

When $X^{\top}X$ is irreversible, ridge regression is usually used instead:

$$
\hat{\beta}_{\text{ridge}} = (X^{\top}X + \lambda I)^{-1}X^{\top}y
$$

## Corresponding code

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

The inline formula works too: when $\lambda = 0$, ridge regression degenerates into least squares.

> If the above formula is formatted normally and the code has color matching, it means that remark-math and rehype-katex are both configured.