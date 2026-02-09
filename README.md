# 🦀 rust-up-knowledge

**rust-up-knowledge** is my **personal Rust knowledge base**, published as a small documentation site using **Docusaurus**.

It’s a **living Cheatsheet** built while working through  **_The Rust Programming Language (2021 Edition)_** (aka *the Rust Book*).

Instead of focusing on runnable code or projects, this repository is about:

> collecting, compressing, and revisiting Rust knowledge in a way that’s easy to skim, recall, and “brush up” later.

---

## 📘 What This Repo Is (and Isn’t)

### ✅ This repo **is**
- A **personal Rust reference**
- A collection of **distilled explanations**
- A place for **mental models**, diagrams, and “why this exists” notes
- A **Docusaurus-powered documentation site**

### ❌ This repo **is not**
- A tutorial
- A Cargo workspace
- A collection of runnable experiments
- A replacement for official Rust documentation

Runnable code lives in a **separate repository**:  
**Click here** 👉 [**`rust-up-experiments`**](https://github.com/boba-jjang/rust-up-experiments)

---

## 🧠 How the Content Is Organized

Content loosely follows the Rust Book, but is **concept-first**, not code-first.

Each chapter acts like a **collapsed knowledge box** — something I can quickly open, skim, and close.

Example structure:
```
docs/
├── ch1-intro/
│ ├── intro.md
│ └── img/
├── ch2-guessing-game/
│ └── ...
├── Cheatsheet/
│ └── ...
├── glossary/
│ └── ...
└── ...
```

Each chapter may include:
- Conceptual explanations
- Diagrams and visuals
- Mental shortcuts
- Common pitfalls
- Minimal code snippets (only when helpful)

---

## 🧱 Built With Docusaurus

This site is built using **Docusaurus (TypeScript)**.

### Local development

```bash
npm install
npm run start
```

### Production build
```bash
npm run build
```

The site is deployed via GitHub Pages.

## 🔗 Source Material & References

- The Rust Programming Language (2021)
https://doc.rust-lang.org/book/

- Rust standard library docs
https://doc.rust-lang.org/std/

- Rust Playground
https://play.rust-lang.org/


## 🧭 Philosophy

Think of this repo as:

> Notes I wish I had when coming back to Rust after a few months.

This repo may contain:
- Redundant explanations
- Over-simplifications
- Opinions=
- Notes that only make sense to me