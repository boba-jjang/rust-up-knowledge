---
sidebar_position: 3
title: References and Borrowing
---

---
## References (Borrowing Instead of Owning)

In the previous section, we saw that **moving ownership into a function** can be annoying:

- you pass a value in
- the function owns it
- you can’t use the original binding anymore unless ownership is returned

In many cases, we don’t want a function to *own* a value.  
We just want the function to **temporarily use it**.

That’s what **references** are for.

---

### What is a reference?

A **reference** is a way to let code access a value **without taking ownership**.

If you’ve used `C`, you can loosely think of a reference as “like a pointer.”  
But the key difference is:

- a reference in Rust is guaranteed (in safe Rust) to point to a **valid value**
- and Rust tracks **how long** that reference is allowed to live (its *lifetime*)

So a reference is basically:

> “An address that lets you access a value, without owning it.”


---

### Borrowing a `String`

Here’s the same `calculate_length` example, rewritten using a reference:

```rust {6-7}
fn main()  {
    let s1 = String::from("hello");
    
    //let (s2, len) = calculate_length(s1); Original code
    
    // We borrow s1 instead of moving it.
    let len = calculate_length(&s1); 

    // s1 is still valid here because ownership never moved.
    println!("The length of '{s1}' is {len}.");
}

/* Original code
fn calculate_length(s: String) -> (String, usize) {
    ...
}
*/

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

Key points:
- `&s1` creates a **reference** to `s1` (this is called *borrowing*)
- `calculate_length` takes `&String`, meaning:
  - it can **read** the String (**by default, you may not modify a borrowed value**)
  - but it does **not** own it
- when the function ends, the reference goes away, but `s1` is still owned by `main`


<details>
<summary><strong>Why this helps</strong></summary>

Compare these two patterns:

**Move (ownership transfers):**

```rust
let (s2, len) = calculate_length(s1);
```

Now `s1` is no longer valid unless returned.

**Borrow (ownership stays):**

```rust
let len = calculate_length(&s1);
```

Now `s1` stays usable because the function never owned it.

</details>

Borrowing solves the “take ownership / give it back” trouble.

But it also introduces new rules, such as:
- when borrowing is allowed
- mutable vs immutable references
- “only one mutable reference at a time”

--- 

## Mutable References

Previously, we saw that borrowing a value with `&T` creates an **immutable reference**.  
That means the borrowed value cannot be modified through that reference.

Rust also provides **mutable references**, written as `&mut T`, which allow the borrowed value to be modified.

```rust {2,4,7}
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

Let’s break this down carefully.

- `let mut s = ...`  
  The binding `s` must be mutable, because we want to modify the value it owns.

- `&mut s`  
  We are creating a **mutable reference** to the value owned by `s`.

- `fn change(some_string: &mut String)`  
  The function signature explicitly says:
  > “I require a mutable reference to a `String`.”

Because the function only receives a reference:
- it does **not** take ownership
- it can modify the original value
- `s` is still valid after the function call

---

### The Core Restriction of Mutable References

The most important rule is:

> At any given time, you can have **either**
> - any number of immutable references  
> - or exactly one mutable reference  
> but not both.

More specifically:

> Only **one mutable reference to a value** can exist at a time within a given scope.

For example:
```rust
let mut s = String::from("hello");

{
    let r1 = &mut s;
} // r1 goes out of scope here

let r2 = &mut s; // OK
```

This works because:
- `r1` **stops existin**g before `r2` is created
- so there is never more than one mutable reference at the same time
<details>
<summary><strong>Why Rust enforces “only one mutable reference”</strong></summary>

Rust enforces this rule to prevent what is known as a **data race**.

A data race occurs when:

1. Two or more pointers/reference-like handles access the same data at the same time  
2. At least one of them writes to it  
3. And there is no synchronization  

Rust prevents this *at compile time* by enforcing rules like:

- no simultaneous mutable aliases (`&mut T`)
- no mixing mutable and immutable references in conflicting ways (`&mut T` + `&T`)

**Note:**  
This is not about “atomicity” in the CPU instruction sense. It’s about preventing **aliasing + mutation** from happening at the same time.

---

Mutable references are powerful, but tightly controlled.

Rust forces you to be explicit about:

- who can modify data  
- when they can modify it  
- and guarantees that no hidden mutation happens elsewhere  

This becomes even more important once we talk about concurrency.

</details>

<details>
<summary><strong>Why multiple immutable references are allowed</strong></summary>

While only **one mutable reference** is allowed at a time,
Rust allows **multiple immutable references** simultaneously.

For example:

```rust
let s = String::from("hello");

let r1 = &s;
let r2 = &s;

println!("{r1} and {r2}");
```

This is allowed because:
- Neither `r1` nor `r2` can modify the value
- Multiple read-only accesses are safe

---

Rust also allows this pattern (immutable then mutable):

```rust
let mut s = String::from("hello");

let r1 = &s; // ok
let r2 = &s; // ok
println!("{r1} and {r2}");
// r1 and r2 are not used after this point

let r3 = &mut s; // ok
println!("{r3}");
```

This works because Rust tracks **where references are last used** (their *lifetime* in practice).

> A lifetime describes:
>- how long a reference is valid
>- how long the value it refers to must live
> For now, Rust often infers lifetimes automatically.
> But later, we will see cases where we must annotate them explicitly.

---

However, this is **not allowed**:

```rust
let mut s = String::from("hello");

let r1 = &s;        // immutable reference
let r2 = &mut s;    // mutable reference ❌
```

Rust prevents this because:
- `r1` assumes the value won’t change
- `r2` could change it

That would violate Rust’s safety guarantees.

</details>

---

## Dangling References

One of Rust’s strongest guarantees is this:

> In safe Rust, references can never be dangling.

A **dangling reference** is a reference that points to memory that has already been freed.

In languages like `C`, this is possible:

```c
char* dangle() {
    char s[] = "hello";
    return s;   // returning pointer to stack memory ❌
}
```

Here:
- `s` lives on the stack
- When the function returns, that stack frame disappears
- The returned pointer now points to invalid memory

This is a classic source of memory corruption and security bugs.

---

### How Rust Prevents This

Rust prevents dangling references through **lifetime checking**.

Consider this Rust example:

```rust
fn dangle() -> &String {
    let s = String::from("hello");
    &s   // ❌
}
```

This does **not compile**.

Why?

- `s` is created inside the function
- When the function ends, `s` is dropped
- Returning `&s` would return a reference to freed memory

The compiler detects this at compile time and rejects it.


### The Rule Behind the Scenes

A reference must never:
- Outlive the value it points to.

Rust’s borrow checker enforces this by:
- Tracking where values are created
- Tracking when they go out of scope
- Ensuring references do not live longer than their owners

---

Rust doesn’t prevent dangling references by:
- Adding a garbage collector
- Adding runtime checks

It prevents them by:
- Enforcing strict ownership and lifetime rules at **compile time**

So if your Rust program compiles (in safe Rust):

> You are guaranteed not to have dangling references.

That guarantee is one of the core reasons Rust can be both:
- Memory-safe  
- Zero-cost at runtime

---

So far, we’ve seen:

- Ownership moves values.
- References let us borrow values safely.
- The compiler guarantees that references never dangle.

However, there is still an important limitation.

In many real programs, we don’t just want:
- “the whole `String`”
- or “a reference to the whole `String`”

Sometimes we want:
- a **portion** of a string  
- a **view into part of a collection**  
- a way to reference data **without copying it**

For example:
- Getting the first word of a sentence
- Working with part of an array
- Passing a sub-range of data to a function

This is where **slices** come in.

A slice is:

> A reference to a contiguous sequence of elements within a collection.

Slices build directly on everything we just learned:
- ownership
- borrowing
- lifetimes
- stack vs heap distinctions

In the next section, we’ll see how slices allow us to:
- reference part of a value
- avoid unnecessary allocation