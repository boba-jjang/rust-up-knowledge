---
sidebar_position: 3
---

# Generating a Secret Number


Next, we want to add functionality to **generate a secret number** so we can compare it against the user’s guess.

Instead of writing our own random number generator, we will rely on existing, well-tested Rust libraries. In Rust, reusable libraries are distributed as [**crate**](https://crates.io/), and they are managed through Cargo.

## Crate and `Cargo.toml`

A **crate** is a unit of compilation in Rust. It is a collection of Rust source files that can be built and reused.
- *binary crate*: Produces an executable program (for example, when you run `cargo build` or `cargo run`).
- *library crate*: Produces reusable code (non-executable) that can be used by other Rust programs.

---

## Why Cargo matters

The Rust ecosystem hosts public crates on **https://crates.io**, which is the official Rust package registry.

Cargo makes it easy to:
- Declare dependencies
- Download and version libraries
- Build, run, and test projects consistently

All of this configuration lives in a file called **`Cargo.toml`**. 
>`toml` stands for [*Tom's Obvious, Minimal Language*](https://toml.io/en/), a configuration format designed to be easy to read and write.

---

## The default `Cargo.toml`

When you create a new project with `cargo new`, Cargo generates a default `Cargo.toml` file that looks like this:

```toml
[package]
name = "ch2-guessing-game"
version = "0.1.0"
edition = "2024"

[dependencies]
```

A quick primer on what this means:

- `[package]`: Contains metadata about your project (name, version, Rust edition, etc.)
- `[dependencies]`: Lists external crates your project depends on

At the moment, the [dependencies] section is empty, meaning the project only relies on Rust’s standard library.

---

## Adding an external crate

To generate random numbers, we’ll use the popular rand crate.

To add it, we modify the `[dependencies]` section like this:
```toml
[dependencies]
rand = "0.8.5"
```
This tells Cargo:
- Download the `rand` crate
- Use a compatible version matching `0.8.5` (Also known as Semantic Versioning, and this is shorthand for `^0.8.5` that states any version that is **at least** `0.8.5`, but **below** `0.9.0`)
- Make it available to our Rust code (e.g., `cargo build`)

Cargo will automatically fetch the crate the next time you build or run the project.

Besides `[package]` and `[dependencies]`, you will commonly see sections such as:
- `[dev-dependencies]` — crates used only for testing
- `[profile.dev]` / `[profile.release]` — build optimization settings
- `[features]` — optional compile-time feature flags

We won’t dive into those yet, but you’ll see them later as projects grow more complex.

Once you run `cargo build`, you will see an output that looks similar to below:
```bash
~/rust-up-experiments/ch2-guessing-game (main) » cargo build        jw-jang@J1-PC
  Updating crates.io index
     Locking 14 packages to latest Rust 1.93.0 compatible versions
      Adding cfg-if v1.0.4
      Adding getrandom v0.2.17
      Adding libc v0.2.180
      Adding ppv-lite86 v0.2.21
      Adding proc-macro2 v1.0.106
      Adding quote v1.0.44
      Adding rand v0.8.5 (available: v0.9.2)
      ...
  Compiling libc v0.2.180
  Compiling zerocopy v0.8.37
  Compiling cfg-if v1.0.4
  Compiling getrandom v0.2.17
  Compiling rand_core v0.6.4
  Compiling ppv-lite86 v0.2.21
  Compiling rand_chacha v0.3.1
  Compiling rand v0.8.5
  Compiling ch2-guessing-game v0.1.0 (/home/jw-jang/rust-up-experiments/ch2-guessing-game)
  Finished `dev` profile [unoptimized + debuginfo] target(s) in 3.95s
```

Here is an interesting output: `Adding rand v0.8.5 (available: v0.9.2)`. So whenever there is a newer version of the package available in the crate, it notifies that new version exists. 

The reason Semantic Versioning keeps it within the range `0.8.5 <= x < 0.9.0` is because any version `>= 0.9.0` may introduce API changes compared to `0.8.5`.

---

## Generating Random Number

Now that we loaded the necessary package, the next step is to update `src/main.rs` as shown below:

```rust {2,6,7}
use std::io;
use rand::Rng;

fn main() {
  println!("guess the number!");
  let secret_number = rand::thread_rng().gen_range(1..=100);
  println!("The secret number is: {secret_number}");

  println!("Please input your guess.");
  let mut guess = String::new();

  io::stdin()
    .read_line(&mut guess)
    .expect("Failed to read line");

  println!("You guessed: {guess}");
}
```

### A quick note on `use std::io` vs `use rand::Rng`

There is an important difference between these two `use` statements:

```rust
use std::io;
use rand::Rng;
```
Although they look similar, they bring different kinds of things into scope.

`use std::io;`
- `std` → the Rust standard library
- `io` → a module inside `std`
In simple terms, this line means:
> “Bring the io module into scope.”

`use rand::Rng;`
This one is different.
- `rand` → an external **crate**
- `Rng` → a trait

Traits are **not modules**. They describe **behavior** that types can implement.

In simple terms, you can think of a trait as:
> “A set of methods that a type promises to provide.” or “I want access to the methods defined by the `Rng` trait.”

This is important to remember: 
> Rust only lets you call trait methods if the trait is in scope.

---

### A quick note on thread_rng() and gen_range()

Now that we’ve imported `Rng`, this line makes sense:

`let secret_number = rand::thread_rng().gen_range(1..=100);`

Let’s break it down (as a review):
- `rand::thread_rng()`
  - A free function provided by the `rand` crate
  - Returns a random number generator tied to the current thread
- `gen_range(1..=100)`
  - A method defined by the `Rng` trait
  - Generates a random number within the given range

Because `Rng` is in scope, Rust knows that the value returned by `thread_rng()` supports `gen_range`.

As a summary:
- **Modules** organize code → `use std::io`
- **Traits** provide methods → `use rand::Rng`
- **Free functions** create values → `thread_rng()`
- **Methods** operate on values → `gen_range(...)`

---

## Comparing the Guess to the Secret Number

Similar to how we have added method to generate random number, we can do a similar thing to perform comparison as shown below:

```rust {2,10-13}
use std::io;
use std::cmp::Ordering;
use rand::Rng;

fn main() {
  println!("Please input your guess.");
  let mut guess = String::new();
  ... 
  println!("You guessed: {guess}");
  match guess.cmp(&secret_number) {
    Ordering::Less => println!("Too small!"),
    Ordering::Equal => println!("You win!"),
    Ordering::Greater => println!("Too big!"),
  }
}
```

### A quick note on use `std::cmp::Ordering;` and `guess.cmp(...)`

This section introduces another `use` statement:

```rust
use std::cmp::Ordering;
```
At a glance, this looks similar to use `rand::Rng`, but there is an important distinction.

#### What `Ordering` actually is
- `std` → the Rust standard library
- `cmp` → a module inside `std`
- `Ordering` → an **enum**, not a trait (Rust enums are like enums in other languages, but with an extra catch: each variant can store data, we will discuss this later for the sake of brevity)

`Ordering` represents the three possible outcomes of a comparison:
- `Ordering::Less`
- `Ordering::Equal`
- `Ordering::Greater`

By bringing `Ordering` into scope, we can refer to these variants directly without writing: `std::cmp::Ordering::Less` every time.

---

#### The truth behind `guess.cmp(&secret_number)`

Earlier, we saw a line like this: 
```rust
rand::thread_rng().gen_range(1..=100);
```
That example felt natural because the explanation was: 
> "`gen_range` is a method defined by the `Rng` trait"

However, when we look at this line:
```rust
guess.cmp(&secret_number)
```
things feel less obvious.

Here, `guess` is a String, but `cmp` is not a method defined directly on `String`.
Instead, `cmp` comes from the `Ord` trait.

Up until now, we’ve mostly seen method calls like:
```rust
stdin.read_line(...)
rng.gen_range(...)
```
So it’s easy to fall into this mental model:
> "Methods belong to the type"

But in Rust, that's not entirely true. 

---

**Traits vs types** 

In Rust:
- A type (like `String`) represents data (*thing*)
- A trait (like `Ord`) represents a capability or behavior 
- When a type implements a trait, it agrees to provide the behavior described by that trait
- Once a type implements a trait, it gains access to the methods defined by that trait.

The `cmp` method is defined by the `Ord` trait:
```rust
fn cmp(&self, other: &Self) -> Ordering
```
So anything that implements `Ord` gets the access to the `cmp` method.

---

#### Does `String` implement `Ord`?

Turns out it does, because `String` implements `Ord` (define implement here to be clear), therefore `String` has access to `cmp`. 

Therefore, `cmp` is a method from the `Ord` trait, and `String` is allowed to use it.

---

### Why `match` is required here

Furthermore, the way this code is written (explicitly handling *less*, *equal*, and *greater*) is another example of how Rust pushes programmers toward **correctness by default**.

Rust encourages you to:
- **Not ignore possible outcomes**
- **Acknowledge that multiple cases exist**
- **Avoid assuming success or a single “happy path”**

This is similar in spirit to `.expect()`, but it works in a slightly different way.

With `.expect()`, you are explicitly choosing what happens when something **fails**.

With `match`, Rust requires you to handle **all possible outcomes** of a value.

This works because `match` is an **expression** (just like `let`) that is made up of multiple **arms**.

Each arm:
- Matches a specific pattern
- Describes what should happen in that case

Most importantly, the set of possible patterns is **known at compile time**.

That means:
- If you forget a case, the code will not compile
- You cannot accidentally ignore a possibility
- The compiler enforces completeness before the program can run

In this example, `Ordering` has exactly three possible values:
- `Less`
- `Equal`
- `Greater`

Rust makes sure all three are handled before the program is considered valid.

--- 

Now, with that, let's try to compile the code!

```bash
» cargo build 
   Compiling ch2-guessing-game v0.1.0 (/home/jw-jang/rust-up-experiments/ch2-guessing-game)
error[E0308]: mismatched types
  --> src/main.rs:33:19
   |
33 |   match guess.cmp(&secret_number) {
   |               --- ^^^^^^^^^^^^^^ expected `&String`, found `&{integer}`
   |               |
   |               arguments to this method are incorrect
   |
   = note: expected reference `&String`
              found reference `&{integer}`
note: method defined here
  --> /rustc/254b59607d4417e9dffbc307138ae5c86280fe4c/library/core/src/cmp.rs:987:8

For more information about this error, try `rustc --explain E0308`.
error: could not compile `ch2-guessing-game` (bin "ch2-guessing-game") due to 1 previous error
```

Uh… why?

The short version: we’re trying to compare two values that are not the same type (`String` vs an integer).

We’ll fix that in the next section.