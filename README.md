# 🦀 Learning Rust (The Rust Programming Language — 2021)

This repository is my **personal practice space** for working through  
**_The Rust Programming Language (2021 Edition)_** (aka *the Rust Book*).

The purpose here is simple:
> learn Rust by writing Rust — making mistakes, fixing them, and understanding *why* things work (or don’t).

This is **not** a tutorial repo or a finished project. It’s a learning log.

---

## 📘 What I’m Using

- Book: *The Rust Programming Language (2021 Edition)*
- Official link: https://doc.rust-lang.org/book/
- Rust edition: **2021**
- Tooling: `rustc`, `cargo`

---

## 🎯 Goals

- Get comfortable with **ownership, borrowing, and lifetimes**
- Learn how to *read* Rust compiler errors instead of fighting them
- Write small, focused Rust programs
- Build intuition for how Rust wants code to be structured
- Slowly move from “following the book” → “thinking in Rust”

---

## 📂 Repository Structure

The layout roughly follows the book chapters, with room to experiment:
```
.
├── chapter_01_hello_world/
├── chapter_02_guessing_game/
├── chapter_03_common_concepts/
├── chapter_04_ownership/
├── chapter_05_structs/
├── chapter_06_enums_match/
├── chapter_07_packages_crates/
├── chapter_08_collections/
├── chapter_09_error_handling/
├── chapter_10_generics_traits/
├── chapter_11_testing/
├── chapter_12_io_project/
├── chapter_13_functional_features/
├── chapter_14_cargo_more/
├── chapter_15_smart_pointers/
├── chapter_16_fearless_concurrency/
├── chapter_17_oop_features/
├── chapter_18_patterns_matching/
├── chapter_19_advanced_features/
├── chapter_20_final_project/
├── experiments/
└── notes/
```
yaml
Copy code

### What goes where?

- **`chapter_*`**  
  Code written while following specific Rust Book chapters.

- **`experiments/`**  
  Small side experiments when I want to test an idea or compiler behavior.

- **`notes/`**  
  Personal notes, explanations, and “aha” moments — mostly for future me.

---

## ▶️ Running the Code

Most directories are standalone Cargo projects.

```bash
cd chapter_04_ownership
cargo run
