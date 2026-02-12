---
sidebar_position: 3
title: Functions
---

# Functions and Comments

---

## Functions

Functions in Rust are conceptually similar to those in most programming languages: 
> They are **named blocks of code** that perform a specific task.

There’s no need to redefine what a function is in detail here — the Rust Book already covers it clearly:
https://doc.rust-lang.org/book/ch03-03-how-functions-work.html#functions


Instead, here are the key Rust-specific points:

- The `main` function is required for a binary program. It acts as the entry point.
- The `fn` keyword is used to declare functions.
- Rust uses `snake_case` by convention for function and variable names.
- The location of function definitions in the file does not matter.

Example:
```rust
fn greet() {
    println!("Hello!");
}

fn main() {
    greet();
}
```

Notice that `greet` could appear above or below `main`, it would still compile.


<details>
<summary><strong>
How can Rust allow functions to be defined anywhere?
</strong></summary>
Rust does not execute code as it reads it from top to bottom.

Instead, during compilation, Rust:

1. Parses the entire file
2. Collects all function signatures
3. Builds an internal representation of the program
4. Then performs type checking and validation

By the time Rust checks `main`, it already knows that `greet` exists.

In other words:

> The compiler has global knowledge of the function definitions within the module before it validates individual calls.

This is different from some interpreted or scripting languages that evaluate code strictly in execution order.

</details>

### Parameters


Similar to most programming languages, Rust functions can take *parameters*.

A parameter is:

> A variable that is part of a function’s signature and receives a value when the function is called.

Example:

```rust
fn main() {
    another_function(5);
}

fn another_function(x: i32) {
    println!("The value of x is: {x}");
}
```

In Rust, **every parameter must have an explicit type**.

This is important because:
- Rust is statically typed.
- Function signatures are part of the contract of the function.
- The compiler does not guess the intended type of a parameter.

Being explicit here improves clarity and avoids ambiguity.
<details>
<summary><strong>
How is a value passed into a function?
</strong></summary>

When a function is called, the argument is passed into the function parameter.

As previously mentioned, in Rust, this can happen in three different ways:

- **Copy**
- **Move**
- **Borrow (by reference)**

In the example above:

```rust
fn another_function(x: i32)
```

The value `5` is passed by **copy**, because `i32` implements the `Copy` trait.

That means:
- A duplicate value is created.
- The original value remains usable.

Later, when we discuss ownership in more detail, we will see that:

- Types like `String` do **not** implement `Copy`.
- Passing them to a function may transfer ownership (a move).
- To avoid transferring ownership, we pass them by reference (`&T`).

For now, just remember:

> Primitive numeric types are copied.  
> More complex types may move unless explicitly borrowed.
</details>

---

### Statements and Expressions


This is actually one of the most important ideas in Rust.

The book states:

> Function bodies are made up of a *series* of **statements** optionally ending in an **expression**.

That single sentence explains a lot about how Rust works.

---

#### What’s the difference?

- **Statements**
  - Perform an action
  - **Do not return a value**
  - Usually end with a semicolon (`;`)

- **Expressions**
  - Evaluate to a value
  - Do **not** end with a semicolon

This distinction matters more in Rust than in many other languages.

---

#### How this works in `C`:

In C, many things are expressions — even assignments.

```c
int v = 1337;
```


This is a declaration statement.

But assignment itself is an **expression** in C:

```c
int x;
int y = (x = 5);   // valid in C
```

Here:
- `x = 5` assigns `5` to `x`
- The assignment expression evaluates to `5`
- That value is then assigned to `y`

So in C, assignment both:
- Performs an action
- Produces a value

Rust deliberately does **not** work this way.

---

#### How this works in Rust

In Rust:

```rust
let y = 6;
```

This is a **statement**.
It creates a binding, but it does **not** evaluate to a value.

That’s why this does **not** work:

```rust
let x = (let y = 6);
```

Because:

- `let y = 6` is a statement.
- Statements do not produce a value.
- But `let x = (...)` expects **something that evaluates to a value**.

So the compiler rejects it.

---

#### A useful mental model

Think of it like this:

- **Statements change the program’s state**
- **Expressions compute values**

In Rust, if you want something to produce a value, it must be an expression.

For example:
```rust
let x = {
    let y = 6;
    y + 1
};
```

That value becomes the value of `x`.

---

This difference is important in Rust because:

- `if`, `match`, and `{}` blocks are expressions (we will discuss more about control flow later on)
- The last line of a function (without `;`) **becomes the return value**
- Adding or removing a semicolon can change the type of a function

This is not just syntax detail; it shapes how Rust programs are structured.

---

### Functions with Return Values

Like other languages, Rust functions can return values to the caller.

However, Rust does this in a slightly different way.

Three key points:

- Return values are produced by the **final expression**
- The function signature must declare the return type using `->`
- If a function declares a return type (`-> T`), its body must evaluate to `T`.
This usually means the final line is an expression (without a semicolon), unless you use `return`.


---

### Example

```rust
fn five() -> i32 {
    5
}
```

Here:
- The return type is `i32`
- The final line `5` is an **expression**
- Because it has no semicolon, its value becomes the return value

---

#### What happens if we add a semicolon?

```rust
fn five() -> i32 {
    5;  // ❌ not allowed
}
```

This fails because:

- `5;` is a **statement**
- Statements do not return values
- The function is expected to return `i32`
- But the body now evaluates to `()` (unit type)

---

#### What if we remove the return type?

```rust
fn five() {
    5;
}
```

This is allowed.

Because:
- When no return type is specified, the function implicitly returns `()`
- `5;` is a statement
- Statements evaluate to `()`
- So the function body correctly evaluates to `()`

Important:  
- This function does **not** return `5`.  
- The value `5` is computed and immediately discarded.

## Comments

Comments in Rust behave exactly as you would expect from most modern languages.

For full details, refer to the official documentation: https://doc.rust-lang.org/book/ch03-04-comments.html

In summary:

- `//` — single-line comment
- `///` — documentation comment (used to generate API docs)
- `//!` — inner documentation comment (used for modules or crates)

Example:
```rust
// This is a regular comment

/// This is a documentation comment
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

Rust encourages clear documentation, especially for public APIs.
The `///` comments integrate with `cargo doc` to generate structured documentation automatically.