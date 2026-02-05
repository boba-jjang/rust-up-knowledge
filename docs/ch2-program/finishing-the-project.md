---
sidebar_position: 4
---

# Finishing the Project

## Mismatched Types

At the end of the previous section, we ran into the following error:

```rust
error[E0308]: mismatched types
  --> src/main.rs:33:19
   |
33 |   match guess.cmp(&secret_number) {
   |               --- ^^^^^^^^^^^^^^ expected `&String`, found `&{integer}`
   |               |
   |               arguments to this method are incorrect
```

This error highlights a few important things about Rust’s type system.

### A few key points about Rust and types
- Rust has a strong, static type system.
> If types don’t line up correctly, the program simply will not compile.
- Rust also uses type inference.
For example, when we write:
```rust
let mut guess = String::new();
```
Rust automatically infers that `guess` is of type `String`.
- Numeric literals default to `i32` unless otherwise specified.

### Why this error happens?

In our program:
- `guess` is a `String`
- `secret_number` is an integer (specifically a number type like `u32` or `i32`)
When we call:
```rust
guess.cmp(&secret_number)
```
Rust complains because:
- `cmp` expects both values to be of the same type
- We are comparing a `String` with an integer

This results in a **mismatched** types error.

To fix this, we need to **convert the user input** from a `String` into a number.

---

### Shadowing

Rust provides a clean way to do this using **shadowing**.

Shadowing allows us to reuse a variable name while giving it a new value and even a new type.

> This is different from mutability.

#### Mutability vs Shadowing (important distinction)
- `mut` allows a **variable’s value** to change
- Shadowing allows a **variable’s type** to change

In our case, we want to transform `guess` from a `String` into a number.

This can be done with the following line:

```rust
let guess: u32 = guess
    .trim()
    .parse()
    .expect("Please type a number!");

```

What’s happening here:
- The name `guess` is reused (this is **shadowing**)
- The new `guess` is now of type `u32`
- The original `String` value is **no longer accessible**
- We now have a numeric value that can be compared correctly

Breaking it down step by step:
- `.trim()` removes whitespace (like the newline `\n` from pressing Enter)
- `.parse()` attempts to convert the string into a number
- `.expect(...)` handles the case where the conversion fails

---

Once above line is inserted, the first iteration of guessing game is complete:

```bash
» cargo run 
   Compiling ch2-guessing-game v0.1.0 (/home/jw-jang/rust-up-experiments/ch2-guessing-game)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.40s
     Running `target/debug/ch2-guessing-game`
guess the number!
The secret number is: 10
Please input your guess.
10
You guessed: 10
You win!
```

---

## Quality-of-Life Additions (Looping and Handling Invalid Input)

The following changes are mostly **extensions of concepts we’ve already seen**, so we won’t re-explain everything in detail. Instead, this section focuses on *why* these additions matter.

One important thing to keep in mind is this:

> Rust is excellent at catching **compile-time** errors,  
> but it cannot always prevent **runtime mistakes** caused by user input or program logic.

---

### Allowing multiple guesses with a loop

At this point, our guessing game only allows **one attempt**.

To let the user keep guessing, we can use Rust’s infinite loop:

```rust
loop {}
```

Applied to our program, the structure looks like this:
```rust {1,11}
loop {
    println!("Please input your guess.");

    // -- snip --

    match guess.cmp(&secret_number) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
    }
}
```

This works—but there’s an important caveat.

If there is no exit condition, the program will run forever.
That’s not a compiler error; it’s a logic error.

Rust allows this because an infinite loop is sometimes intentional (servers, event loops, etc.).
It’s up to the programmer to decide when the loop should end.

---

### Handling invalid user input

So far, we’ve relied on this line:
```rust
let guess: u32 = guess
    .trim()
    .parse()
    .expect("Please type a number!");
```

This works, but there’s an important detail here.

Unlike `cmp`, `parse()` can fail at runtime in ways the compiler cannot predict.

For example:
- The user types `"abc"`
- The user types `"12abc"`
- The user just presses Enter

In all of these cases, `.parse()` returns an error.

Using `.expect()` means:
- The program crashes immediately
- The user is kicked out of the game

That may be acceptable for learning, but it’s not very user-friendly.

---

### Gracefully handling parse failures

Instead of crashing, we can handle the error explicitly:

```rust
let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => {
        println!("Please enter a valid number.");
        continue;
    }
};
```

What this does:
- If parsing succeeds, we get a number (Ok(num))
- If parsing fails, we:
  - Print a helpful message
  - Skip the rest of the loop iteration
  - Prompt the user again

This is another example of Rust encouraging explicit control flow instead of silent failure.

--- 

That was a long chapter, but we have finally finished the first programming project!
