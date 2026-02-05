# Multiplication Trainer

A minimal web app to practice multiplication using the **difference of squares** trick.

## The Trick

Use: **(a+b)(a−b) = a² − b²**

Example: **47 × 53**

- Center: 50  
- Difference: 3  
- 47 × 53 = 50² − 3² = 2500 − 9 = **2491**

## How to Use

1. Serve the project with a local web server (ES modules need HTTP):
   ```bash
   python3 -m http.server 8080
   ```
2. Open `http://localhost:8080` in a browser
3. Solve the multiplication shown (e.g. `47 × 53 = ?`) in your head
4. Enter your answer in the text box and press Check
5. Use **Next question** for a new problem

## What It Does

- Generates random two-digit multiplications that suit the difference of squares method
- Shows the correct answer and a hint (e.g. `50² − 3²`) if you’re wrong
- Lets you keep practicing with new questions

## No Build Required

You can run the app right away; it uses JavaScript by default. To use the C++/WebAssembly version, build with Emscripten (see `devNotes.md`).
