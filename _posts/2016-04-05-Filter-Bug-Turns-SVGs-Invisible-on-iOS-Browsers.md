---
layout: post
title: Filter Bug Turns SVGs Invisible on iOS Browsers
technologies:
  - title: CSS
    link: https://www.codecademy.com/learn/css
excerpt: As of writing, CSS filters on inline SVG elements in any iOS browser cause the element to disappear altogether. Here's a quick workaround.
---

Let's get right to it.

## The Fix

[Selector credit where credit is due](http://stackoverflow.com/a/25975282/2233690).

```

/* iDevices Only */

@supports (-webkit-text-size-adjust:none) and (not (-ms-accelerator:true))
and (not (-moz-appearance:none))
{
  svg {
    filter:none !important;
  }

}

```

## Background

The problem, once more, is that applying CSS `filter` to inline SVG elements in any iOS browser will cause the SVG to disappear entirely. While I can't tell you why it happens, I _can_ tell you it affects all iOS browsers and not just one or another because [all iOS browsers are essentially Safari](http://allthingsd.com/20120628/googles-chrome-for-ios-is-more-like-a-chrome-plated-apple/).

I'll be sure to update this article if the status of that bug changes.
