---
sidebar_position: 2
title: What is Ownership?
---

---

## Ownership Rules

Rust’s ownership system answers one central question:

> Who is responsible for this value right now?

More precisely:
> For a given value (and any heap memory it manages), which binding is responsible for it?

---

### The Three Ownership Rules

1. **Each value has exactly one owner at a time.**  
   The owner is the binding (name) currently responsible for that value.

2. **Ownership can move to another binding.**  
   After a move, the previous binding can no longer be used.

3. **When the owner goes out of scope, the value is dropped.**  
   - For stack-only values (`i32`, `bool`, etc.), this is trivial.
   - For heap-backed values (`String`, `Vec<T>`), this frees the heap memory.

---
<details>
<summary><strong>What does “one owner at a time” actually mean?</strong></summary>

It does NOT mean:
> “Only one variable in the program can have this number.”

It means:
> One specific value instance is owned by one specific binding at a time.

For example:

```rust
let x = 5;
let y = 5;
```

Here:
- `x` owns its `5`
- `y` owns its `5`

Even though the values look identical, they are separate value instances.

For simple scalar values, ownership doesn’t feel dramatic.  
It becomes important when heap memory is involved.

</details>

---

<details>
<summary><strong>Where ownership really matters (heap-backed values)</strong></summary>

```rust
let s1 = String::from("hello");
let s2 = s1; // ownership moves
// s1 is no longer valid here
```

Here:
- `String` stores data on the heap
- When `s2 = s1` happens, ownership moves
- `s1` is no longer usable

This prevents:
- double-free
- use-after-free
- dangling pointers

Rust ensures that heap memory is freed exactly once — when the final owner goes out of scope.

</details>

---

<details>
<summary><strong>Clarifying “value” vs “allocation”</strong></summary>

When we say “value,” we mean the entire thing.

For `String`, that includes:
- stack metadata (pointer, length, capacity)
- heap allocation (actual string contents)

Ownership governs the entire structure.

</details>

---

#### Quick Summary Table

| Concept | Meaning |
|----------|----------|
| Owner | Binding responsible for a value |
| Move | Transfer ownership to a new binding |
| Drop | Automatic cleanup when owner goes out of scope |
| Heap-backed type | Owns heap memory (`String`, `Vec<T>`) |
| Stack-only type | Stored entirely on stack (`i32`, `bool`) |

---

## The String Type

So far, we’ve mostly used string literals like `"hello"`.

In Rust, there are **two common “string” forms**, and they exist for a reason:

- `&str` (string **slice**) — usually a **string literal**, known ahead of time
- `String` — a **growable** string type that can hold text whose size is not known at compile time (often user input)

---

### Key idea: `&str` vs `String`

- A string literal like `"hello"` is typically a `&'static str`:
  - the text is baked into the compiled program (read-only)
  - you *borrow* it; you don’t “own” or resize it

- A `String` owns its contents:
  - it stores its actual text on the **heap**
  - it can grow/shrink as needed (push, append, etc.)
  - it’s commonly used for user input (`read_line`) and text building

---

#### Example 1 — `&str` (string literal)

```rust
fn main() {
    let greeting = "hello"; // greeting: &'static str
    println!("{greeting}");
    // greeting.push_str(" world"); // ❌ not allowed
}
```

Why?

- `"hello"` is stored in the program’s binary
- `greeting` is just a reference to that static memory
- It cannot be resized or modified

---

#### Example 2 — `String` (owned, heap-backed)

```rust
fn main() {
    let mut greeting = String::from("hello"); // greeting: String
    greeting.push_str(" world");
    greeting.push('!');
    println!("{greeting}");
}
```

Here:

- `String::from("hello")` allocates memory on the heap
- `greeting` owns that allocation
- Because it’s declared `mut`, it can grow and change


---

<details>
<summary><strong>More detail: what’s the difference between <code>&str</code> and <code>String</code>?</strong></summary>

#### 1) What type is `"hello"`?

```rust
let s: &str = "hello";
```

This is a **string slice** that points at some UTF-8 bytes.  
For string literals, those bytes live in your program’s read-only memory.

You can take slices of other strings too:

```rust
let owned = String::from("hello");
let slice: &str = &owned[0..2]; // "he"
```

So: `&str` is a **view** into some string data owned elsewhere.

---

#### 2) What type is `String::from("hello")`?

```rust
let s: String = String::from("hello");
```

This creates an owned string:
- `s` owns a heap allocation containing `"hello"`
- because it owns the bytes, it can modify / grow them

Also `::from` is an associated function

Example:

```rust
let mut s = String::from("hello");
s.push('!');
println!("{s}");
```

---

#### 3) Which one should I use?

- Use `&str` when you just need to *read* a string (especially function parameters)
- Use `String` when you need to *own* the text (store it, build it, modify it, accept user input)

A very common Rust pattern is:

```rust
fn takes_str(s: &str) {
    println!("{s}");
}

fn main() {
    let owned = String::from("hello");
    takes_str(&owned);    // String -> &str via borrowing
    takes_str("world");   // literal is already &str
}
```

</details>


---

## Variable Scope and Memory Management

**Scope** itself is a familiar idea from most programming languages, so I won’t over-explain it here.  
If you want the Rust Book’s explanation, see:  
https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variable-scope

For **memory/allocation**, we already covered the stack vs heap model (and why it matters in Rust) earlier in this chapter.  
If you want the official Rust Book section as a reference, see:  
https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#memory-and-allocation

---
## Variable Interactions

Similarly, in previous chapters we’ve already touched on “copy vs move” a few times.  
For the official explanation + the best visuals, refer to:  
https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variables-and-data-interacting-with-move

<details>
<summary><strong>Move vs Clone vs Copy (quick refresher)</strong></summary>

#### Move (default for heap-backed types like `String`, `Vec<T>`)
```rust
let s1 = String::from("hello");
let s2 = s1; // move (s1 invalid)
```
- Ownership transfers to `s2` (prevents double-free / use-after-free)

#### Clone (explicit deep copy)
```rust
let s1 = String::from("hello");
let s2 = s1.clone();
```
- Heap data is duplicated (can be expensive)

#### Copy (stack-only types)
```rust
let x = 5;
let y = x; // copy (x still valid)
```
- Trivial bitwise copy (`Copy` types like integers, bool, char, etc.)

#### Reassignment drops the old value
```rust
let mut s = String::from("hello");
s = String::from("ahoy"); // old value dropped
```

</details>


---
## Ownership and Functions

Passing a value to a function follows the same ownership rules as assignment.

- If the type implements `Copy`, the value is copied.
- If it does not implement `Copy`, ownership moves.

---

### Passing ownership into a function

```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s);  // move occurs here

    let x = 5;
    makes_copy(x);       // copy occurs here
}

fn takes_ownership(some_string: String) {
    println!("{some_string}");
} // some_string goes out of scope → drop is called

fn makes_copy(some_integer: i32) {
    println!("{some_integer}");
}
```

Key idea:

- `String` does **not** implement `Copy` → ownership moves.
- `i32` **does** implement `Copy` → value is duplicated.

---
<details>
<summary><strong>
Why does “nothing special happen” for <code>s</code> at the end of <code>main</code>?
</strong></summary>

In the book it says:

> “Because s’s value was moved, nothing special happens.”

What does that mean?

If `s` had **not** been moved, then when `main` ended:
- `s` would go out of scope
- `drop` would be called
- the heap memory would be freed

However, in this example:

```rust
takes_ownership(s);
```

Ownership moved into `takes_ownership`.  
That function already dropped the `String` when it ended.

So by the time `main` finishes:
- `s` is no longer valid
- there is nothing left to drop

In other words:

> The value was already cleaned up earlier.

That’s what “nothing special happens” means.

</details>

---
## Return Values and Ownership

Ownership can also move **when a function returns a value**.

```rust
fn main() {
    let s1 = gives_ownership();
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2);
}

fn gives_ownership() -> String {
    let some_string = String::from("yours");
    some_string   // moved to caller
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string      // moved back to caller
}
```

Ownership always follows the same rule:

- assignment moves  
- passing into a function moves  
- returning from a function moves  

There is no special exception for return values.  
Ownership transfer is consistent.

---

To make this idea more concrete, consider the following pattern:

```rust
fn main() {
    let s1 = String::from("hello");
    let (s2, len) = calculate_length(s1);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)
}
```

Here:
- `s1` is moved into `calculate_length`
- the function returns `(String, usize)`
- ownership of the `String` moves back into `s2`

---

<details>
<summary><strong>Question: Why no type annotation here?</strong></summary>

In this line:

```rust
let (s2, len) = calculate_length(s1);
```

You might wonder whether something like this is required:

```rust
let (s2: String, len: usize) = calculate_length(s1);
```

The answer is: **no**.

Rust infers the types from the function signature.

Because the function is defined as:

```rust
fn calculate_length(s: String) -> (String, usize)
```

Rust already knows:
- the first element is `String`
- the second element is `usize`

Tuple destructuring simply binds names to each returned value.
Type inference fills in the rest automatically.

</details>

---

### Why returning ownership feels awkward

But notice what’s happening in `calculate_length`:

- take ownership  
- use the value  
- give ownership back  

This ceremony exists **only because ownership was transferred into the function**.

In many cases, we don’t actually want the function to *own* the value.  
We just want it to temporarily *use* it.

That is exactly the problem that **references** solve.

Instead of transferring ownership, we can allow a function to *borrow* a value.

That’s what we’ll discuss next.
