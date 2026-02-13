---
sidebar_position: 4
title: Control Flow
---

# Control Flow

---

The control flow constructs in Rust look familiar (`if`, `loop`, `while`, `for`), but Rust adds a few “no surprises” rules that prevent common bugs.

The Rust Book already explains this well:
https://doc.rust-lang.org/book/ch03-05-control-flow.html

In this section, I’ll go one construct at a time and highlight the Rust-specific caveats.

--- 

## `if` / `else if` / `else` (Expressions)

### 1) Basic `if` / `else`

```rust
let number = 3;

if number < 5 {
    println!("condition was true!");
} else {
    println!("condition was false");
}
```

This is a standard `if`/`else`.

Two Rust-specific notes:

- The condition must be a **`bool`** (no “truthy/falsy” like `C`).
- Terminology: the Rust Book mentions the blocks in an `if` expression are *sometimes* called “arms” (by analogy to `match`),
  but the more common term is “branch” (`if` branch / `else` branch). I’ll mostly say **branch**.

<details>
<summary><strong>Example: Rust has no “truthy / falsy” values</strong></summary>

In `C` (and some other languages), integers can be used directly as conditions:

```c
int number = 3;
if (number) {
    /* runs because non-zero is treated as true */
}
```

Rust does **not** allow that. The condition must be a `bool`:

```rust
let number = 3;

if number {                 // ❌ error: expected `bool`, found integer
    println!("hi");
}
```

You must write the comparison explicitly:

```rust
let number = 3;

if number != 0 {            // ✅ explicit boolean condition
    println!("number was non-zero");
}
```

</details>

---

### 2) `else if`


Furthermore, something like this is also possible:
```rust
let number = 6;

if number % 4 == 0 {
    println!("Condition 1");
} else if number % 3 == 0 {
    println!("Condition 2");
} else {
    println!("Condition 3");
}
```

Same rule as most languages:
- Evaluation stops at the **first** condition that is `true`.

---

### 3) Using `if` inside `let` (because `if` is an expression)

Rust’s `if` is an **expression**, meaning it can produce a value.

Let's take a look at this example:
```rust
let condition = true;
let number = if condition {5} else {6};
```

Why this works:
- The blocks `{ 5 }` and `{ 6 }` end with expressions (no semicolons).
- That means each branch evaluates to a value.
- `number` is bound to whichever value is produced.

Important rule:
> If you use `if` as an expression, both branches must evaluate to the **same type**.

This is why the book’s example fails:

```rust
let condition = true;
let number = if condition { 5 } else { "six" }; // ❌ type mismatch (i32 vs &str)
```

This is very similar in spirit to `match`, where every arm must produce a compatible type when the overall `match` is used as an expression.

---

### 4) Small but common “semicolon” pitfall

If you accidentally add a semicolon, you turn an expression into a statement (`()`), and the types can stop matching:

```rust
let condition = true;

// ❌ the `if` branch becomes `()` because of the semicolon
let number = if condition { 5; } else { 6 };
```

(We saw the same idea earlier: adding/removing a semicolon changes whether a block produces a value.)

---

## `loop` (repeat forever unless you stop it)

`loop` creates an infinite loop. You usually stop it with `break`, or skip to the next iteration with `continue`.

```rust
loop {
    println!("again!");

    if should_stop() {
        break;
    }
}
```

### `break` can return a value

A nice Rust-specific feature: you can `break` with a value, and the `loop` expression evaluates to that value.

```rust
let mut counter = 0;

let result = loop {
    counter += 1;

    if counter == 3 {
        break counter * 10; // result becomes 30
    }
};

println!("result = {result}");
```

---

## `while` (loop while a condition is true)

`while` repeats as long as its condition is `true`. The condition must be a `bool`.

```rust
let mut n = 3;

while n != 0 {
    println!("{n}...");
    n -= 1;
}

println!("LIFTOFF!");
```

Use `while` when you naturally think “keep going until this condition becomes false”.

---

## `for` (iterate over a collection or a range)

`for` is Rust’s most common loop because it’s clear and safe.

### Iterate over a range

```rust
for i in 1..=3 {
    println!("{i}");
}
```

### Iterate over a collection (`Python`-style)

This is the common “scripting language” style: loop directly over items.

```rust
let names = vec!["alice", "bob", "carol"];

for name in names {
    println!("{name}");
}
```

> Note: the exact behavior (move vs borrow) depends on what you iterate over:
> - `for x in v` consumes `v` (moves items out)
> - `for x in &v` borrows items
> - `for x in &mut v` borrows items mutably

Example of borrowing (so you can still use the vector later):

```rust
let names = vec!["alice", "bob", "carol"];

for name in &names {
    println!("{name}");
}

println!("still have names: {:?}", names);
```

### Reverse range
```rust
for n in (1..=3).rev() {
    println!("{n}");
}
```

We haven't quite discussed about the ownership yet, but if you want a preview of this, here is the TMI:

<details>
<summary><strong>Why does <code>for name in names</code> “move out” of the collection?</strong></summary>

In Rust, a <code>for</code> loop decides whether it **consumes** a collection or **borrows** it based on what you write after <code>in</code>.

#### 1) Consuming the collection (moves ownership)
```rust
let names = vec!["alice", "bob", "carol"];

for name in names {
    println!("{name}");
}

println!("{:?}", names); // ❌ error: use of moved value: `names`
```

What’s happening:
- `names` is **moved into** the loop (consumed)
- the loop iterates using `into_iter()`
- after that, `names` is no longer available


#### 2) Borrowing the collection (keeps it usable)
```rust
let names = vec!["alice", "bob", "carol"];

for name in &names {
    println!("{name}");
}

println!("still have names: {:?}", names); // ✅
```

Here:
- `&names`is a **borrow**
- the loop iterates over references
- `names` stays owned by the current scope

</details>

---

## Loop labels (Rust-specific)

When you have nested loops, `break` and `continue` normally apply to the **innermost** loop.  
Rust lets you name a loop with a **label** (`'label:`) so you can target an outer loop directly.

This works with `loop`, `while`, and `for`.

### `loop` + label

```rust
'outer: loop {
    println!("outer");

    loop {
        println!("  inner");
        break 'outer; // breaks the OUTER loop
    }
}
```

### `continue` a specific loop:

```rust
'outer: loop {
    for i in 0..3 {
        if i == 1 {
            continue 'outer; // skip rest of inner loop, start next outer iteration
        }
        println!("i = {i}");
    }
    break;
}
```

### `while` + label (same idea)

```rust
let mut a = 0;

'outer: while a < 3 {
    let mut b = 0;

    while b < 3 {
        if a == 1 && b == 1 {
            break 'outer; // exits the labeled while loop
        }
        b += 1;
    }

    a += 1;
}
```

### `for` + label (common with nested iterators)

```rust
'rows: for r in 0..3 {
    for c in 0..3 {
        if r == 2 && c == 0 {
            continue 'rows; // jump to next row
        }
        println!("({r}, {c})");
    }
}
```

---

This chapter covered a lot of things that *look* familiar: variables, types, functions, and control flow.

At first glance, these can feel like “common programming concepts” that every language has, and that’s true.  
But Rust adds an extra layer to almost every familiar idea:

- **immutability by default**
- **clear rules about moves / borrows**
- **expressions vs statements** (and why that matters)
- **compile-time checks** that force you to be explicit

So even when the syntax looks normal, the *mental model* is often more Rust-specific than expected.

Next up is the chapter that makes Rust feel like Rust: **Ownership**.  
This is where Rust’s safety guarantees really start to click (and where the compiler gets a lot more opinionated).