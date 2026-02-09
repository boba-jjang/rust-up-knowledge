---
sidebar_position: 2
title: Variables and Basic Types
---

# Variables and Basic Types
---
## Variables and Mutability

### Variables

Rust variables look familiar, but Rust has a few important defaults and guarantees:
- **Bindings are immutable by default**
- Types are **known at compile time**
- The compiler enforces strict rules around how values are used


<details>
<summary><strong>
**Binding refresher**
</strong></summary>
In many languages, we casually say: “Assign a value to a variable”

However, in Rust, let does not mean “assign”.

It means:
> Bind a name to a value. In other words, a binding is the association between a name and a value.

When you write:
```rust
let x = 5;
```
Rust is doing two things:
1. **Creating a value** (`5`)
2. **Binding the name** `x` to that **value**

![binding](./img/bindings.png)

- The value (like `5`) lives in memory (stack, in this case). That memory location is very real at runtime.
- The name `x` lives in the compiler’s symbol table (the name is a compile-time binding), not as a runtime object. Tracked in the compiler’s internal data structures. Not something you can take the address of.

Notably:
- You are not creating a “box” that later gets overwritten
- You are not reserving memory and mutating it by default

You are simply saying:
> “For this scope, x refers to this value.”

---
**Why Rust avoids “assignment” by default**

In many languages:
```c
int x = 5;
x = 6;   // same variable, new value
```

This encourages thinking of variables as containers that change over time.

Rust intentionally flips that model:
```rust
let x = 5;
x = 6; // ❌ not allowed
```

Because x is a binding, not a mutable container.

If Rust allowed this by default, it would:
1. Complicate reasoning about aliasing
2. Make borrow checking far harder
3. Allow subtle bugs where values change unexpectedly

Instead, Rust asks you to be explicit.

</details>

```rust
let x = 5;
let mut y = 5;
```

### Constants

In contrast to variables, *constants* are:
- **Always immutable**
- Declared with the `const` keyword
- Required to have an explicit type annotation
- Must be initialized with a compile-time constant expression
- Scoped like any other name (they’re visible only within the scope they’re declared in)

```rust
const CONST_VALUE: u32 = 1337; 
// Convention: constants are usually SCREAMING_SNAKE_CASE
```

### Shadowing

We briefly mentioned shadowing earlier; here’s the precise idea.

Shadowing means declaring a **new binding** with the **same name** as an existing one.
The old binding still exists conceptually, but it is no longer accessible by name.

```rust
let x = 5;
let x = x + 1;
```

What’s important here is that:
- This is not **reassignment**
- **A new value** is created
- **A new binding** named `x` replaces the old one in the current scope

A helpful way of visualizing this (new `x` is overshadowing the first `x`):
![shadowing](./img/shadowing.png)

<details>
<summary><strong>
What is the purpose of shadowing?
</strong></summary>

1. **Shadowing avoids mutation while allowing transformation**

With an immutable binding, reassignment is not allowed:
```rust
let x = 5;
x = 6; // ❌ not allowed (reassignment)
```
But creating a new binding **is** allowed:
```rust
let x = 5;
let x = x + 1; // ✅ allowed (new binding)
```
You’re not changing a value; you’re **binding the same name to a new value.**

2. **Transform a value while keeping the same “conceptual name”**
A common case is parsing user input:

```rust
let guess = "42";              // &str
let guess: u32 = guess.parse().expect("number"); // u32 (new binding)
```
Here:
- The first `guess` is a string slice
- The second `guess` is a number
- The name stays the same **because the idea (“the user’s guess”) stays the same**

This works because shadowing creates a new binding, not because Rust allows mutation.
</details>

---

## Basic Types