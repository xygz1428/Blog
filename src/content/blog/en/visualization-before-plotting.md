---
title: Before visualizing data, ask clearly what questions you want to answer
description: The same data, different questions, and completely different graphs. Four common problems correspond to four types of diagrams.
pubDate: 2026-11-14
category: 科研
tags: ['可视化', '数据', '方法']
cover: anime-05.jpg
---
Before drawing a picture, think about one thing clearly: **What question does this picture want to answer? **

If you start drawing without thinking clearly, the result is usually "a little bit of everything is drawn, but nothing is explained clearly."

## Four types of questions, four types of pictures

### Question 1: What does the distribution look like?

"Where are the values ​​of this batch of data concentrated, how scattered are they, and are there any abnormalities?"

**Use**: histogram, box plot, violin plot.

**Note**: The number of bins in a histogram can significantly change the look and feel. If there are too few binnings, the structure cannot be seen; if there are too many binnings, it will be just noise. Try a few more and see the conclusion.

### Question 2: What is the relationship between the two variables?

“How does Y change when X becomes larger?”

**Used**: Scatter plot.

**Note**: Scatter plots can only illustrate **correlation**. To talk about cause and effect, it must be supported by experimental design, and the graph itself cannot prove it.

When the scatter points are very dense, use transparency or a two-dimensional density map (hexbin) instead of pure scatter points, otherwise it will be all ink blocks.

### Question 3: How does it change over time?

"How has this indicator performed over the past year?"

**Use**: Line chart.

**Note**: Time axes should be equidistant. If the sampling intervals are uneven, direct connections can be misleading. Either interpolate or use point plots.

### Question 4: How to compare between several groups?

"Which method A, B or C is higher or lower on the same indicator?"

**Use**: bar chart (compare absolute values), point chart (compare multiple indicators).

**Note**: The vertical axis of the bar chart must start at 0, otherwise the differences will be visually magnified. Line charts do not have to start at 0, but this should be stated in the legend.

## a counterexample

I have seen a picture: a pie chart showing the proportions of 8 categories, where the difference between the two smallest categories is 1 percentage point. The human eye cannot tell the difference between a 3% and a 4% sector area.

**Change to a bar or dot plot** and the differences will be immediately readable.

Principles for selecting chart types: **The human eye is the most accurate at judging position and length, and the worst at judging area and angles**.

## Prioritization of visual coding

From accurate to inaccurate:

1. Location (scatter, dot plot)
2. Length (bar chart)
3. Angle/area (pie chart, bubble chart)
4. Color depth (heat map)
5. Volume/3D (almost should not be used)

If you can use position, don't use area. If you can use two dimensions, don't use three dimensions.

## three details

**1. Axis labels must have units**

"Time" is not as good as "time (seconds)", and "loss" is not as good as "loss (cross entropy)".

**2. Clearly indicate the sample size in the figure**

The images of `n=30` and `n=3000` have completely different credibility. Write a sentence in the caption so readers know what to read.

**3. No more than 6 colors**

It's hard to tell the difference beyond that. When there are many categories, use the "emphasis" strategy: color the categories you want to emphasize and keep the rest in gray.

## Color matching and accessibility

- Avoid combining red and green (difficult for color-blind people to distinguish)
- Pictures in dark mode should be checked separately for contrast
- It can still be read after grayscale printing, indicating that the color matching is safe.

## a checklist

After drawing the picture, ask yourself:

1. Which question does this picture answer? (I can’t explain it just because I haven’t thought clearly)
2. Can you understand it without reading the text?
3. Is the starting point of the vertical axis misleading?
4. Has the sample size been written down?
5. Can you still distinguish grayscale printing?

## summary

Visualization is not about "drawing the data", it is about answering a specific question visually.

Ask questions first and then choose a pattern; instead of drawing a picture first and then thinking about what it can illustrate.