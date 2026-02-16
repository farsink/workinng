---
name: browser_brainstorming
description: "Use this skill to research, brainstorm, and plan web-based ideas using the browser. It helps refine user ideas into structured, industry-standard plans through research and interactive dialogue."
---

# Browser-Enhanced Brainstorming

## Overview

Turn raw ideas into polished, industry-standard implementation plans by leveraging web research and collaborative refinement.

This skill combines active web research with structured brainstorming to ensure proposed solutions are modern, efficient, and well-aligned with current best practices.

## The Process

### 1. Research & Understanding
**Goal:** Deeply understand the user's idea and contextualize it within current industry standards.

- **Analyze the Request:** Identify the core problem, target audience, and key features.
- **Web Research (Mandatory):**
    - Use `search_web` or `browser_subagent` to find similar existing solutions.
    - Look for "best practices [year]" or "standard architecture for [topic]".
    - Identify modern libraries, frameworks, or patterns that are currently favored by the industry.
    - *Constraint:* Do not rely potentially outdated internal knowledge; verify with current web data.

### 2. Refine & Question
**Goal:** Clarify ambiguities and offer researched alternatives.

- **Identify Gaps:** Based on your research, what is missing from the user's initial idea?
- **Interactive Questionnaire:**
    - Ask questions *one by one* or in small, logical groups (max 3).
    - Provide context for *why* you are asking (e.g., "Industry standard X suggests Y, but your idea implies Z. Which direction do you prefer?").
    - Offer **Multiple Choice** options derived from your research (e.g., "Option A: [Industry Standard], Option B: [Alternative], Option C: [Custom]").
- **Propose Improvements:** proactive suggest features or architectural changes that improve efficiency or user experience, citing your research sources.

### 3. Plan & Summarize
**Goal:** Create a structured, actionable, and efficient plan.

- **Comprehensive Summary:** Present a clear summary of the final, agreed-upon concept.
- **Implementation Plan:**
    - **Architecture:** detailed technical description of the system architecture.
    - **Tech Stack:** Specific recommendations (libraries, frameworks) based on "latest industry standards".
    - **Step-by-Step Guide:** efficient execution plan.
- **Presenting the Design:**
    - Break the plan into digestible sections (200-300 words).
    - **Incremental Validation:** Ask for confirmation after each section ("Does this look right so far?").
    - Be ready to backtrack and refine if the user disagrees.
- **Validation:** simple checklist or strategy to verify the implementation.

## Key Principles

- **Research-First:** Always validate ideas and look for modern standards before proposing a plan.
- **Industry Standard:** Default to what is currently considered "best practice" in the web development community.
- **Interactive:** Engage the user in the refinement process; don't just lecture.
- **Efficient:** Focus on lean, performant, and maintainable solutions.
