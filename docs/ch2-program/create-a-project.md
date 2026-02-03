---
sidebar_position: 1
---

# Create and Run a Project

It *is* possible to create a Rust program the old-fashioned way: manually creating a directory, writing a `main.rs` file, and invoking the compiler directly.

For example:

```bash
» mkdir ~/projects
» cd ~/projects
» mkdir hello_world
» cd hello_world
» echo 'fn main() { println!("Hello, world!"); }' > main.rs
» rustc main.rs && ./main
Hello, world!
```

This works because `rustc` can compile a single Rust source file into an executable directly.

However, this approach **does not scale** beyond very small examples. There is no dependency management, no project metadata, and no standardized layout.

This is where **Cargo** comes in.

---

## Create your first project using Cargo

Cargo is Rust’s official build system and package manager, and it is the idiomatic way to create and manage Rust projects.

Let's navigate back to the `projects` directory:
```bash
. ($HOME)
└── projects    ← here
```

Then on any OS, type:
```bash
» cargo new guessing_game
```

Cargo will generate the following project structure:
```bash
. ($HOME)
└── projects    ← where command was executed
      └── guessing_game
          ├── Cargo.toml
          └── src
                └── main.rs
```
Here’s what each part means:
- `guessing_game`: The project directory (also called a *package* in Cargo terminology).
- `Cargo.toml`: The project’s manifest file; it contains metadata such as the package name, version, dependencies, and build configuration. (`.toml` stands for *Tom's Obvious, Minimal Language*)
- `main.rs`: The entry point of a binary Rust program (by default, it is a simple `Hello, World!` program). 
---

## Important Cargo conventions

Cargo enforces a few conventions that are worth understanding early:

- All Rust source files for a project live inside the `src/` directory.
- A binary crate expects `src/main.rs` to exist.
- Cargo automatically invokes:
  1. the Rust compiler (`rustc`)
  2. the system linker
  3. dependency resolution
  4. build orchestration

**You rarely call `rustc` directly when working with Cargo-based projects.**

If we were to let's say work on any existing projects, you could use the following commands to clone, change to that project directory, and build using `cargo`:

```bash
» git clone project.git
» cd project
» cargo build
```

---

## Run a Project

At this point, we have a properly structured Rust project that can be built and run using:
```bash
» cargo build
  Compiling ch2-guessing-game v0.1.0 ($HOME/rust-up-experiments/ch2-guessing-game)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.58s
```
```bash
» cargo run
  Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.00s
     Running `target/debug/ch2-guessing-game`
Hello, world!
```
```bash
» cargo test
  Compiling ch2-guessing-game v0.1.0 ($HOME/rust-up-experiments/ch2-guessing-game)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.15s
     Running unittests src/main.rs (target/debug/deps/ch2_guessing_game-1475e7bc0812efd9)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```
```bash
» cargo check
  Checking ch2-guessing-game v0.1.0 (/home/jw-jang/rust-up-experiments/ch2-guessing-game)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.38s
```
---

Now that we know how to create and run a project, let's start diving deeper into programming using Rust!