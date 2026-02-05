/**
 * Multiplication trainer - Difference of Squares
 * Uses (a+b)(a-b) = a² - b² for mental math practice
 */

#include <cstdint>
#include <emscripten/bind.h>
#include <cmath>
#include <cstdlib>
#include <string>
#include <algorithm>

struct Question {
    int factor1;
    int factor2;
    int answer;
    std::string hint;  // e.g. "50² - 3²"
};

// Simple LCG for deterministic randomness (seed from JS)
unsigned int rng_state = 1;

void seed_rng(unsigned int seed) {
    rng_state = seed;
}

unsigned int rand_int(unsigned int max_val) {
    rng_state = rng_state * 1103515245 + 12345;
    return (int) (rng_state / 65536) % max_val;
}

Question generateQuestion(unsigned int seed) {
    seed_rng(seed);

    // Center n: 15-85 (gives factors roughly 10-99)
    int n = 15 + rand_int(71);
    // Difference d: 1 to min(n-10, 99-n) to keep factors in 10-99
    int maxD = std::min(n - 10, 99 - n);
    if (maxD < 1) maxD = 1;
    int d = 1 + rand_int(maxD);

    int factor1 = n - d;
    int factor2 = n + d;
    int answer = n * n - d * d;

    // Ensure factor1 <= factor2 for consistent display
    if (factor1 > factor2) std::swap(factor1, factor2);

    Question q;
    q.factor1 = factor1;
    q.factor2 = factor2;
    q.answer = answer;
    q.hint = std::to_string(n) + "\u00B2 - " + std::to_string(d) + "\u00B2";

    return q;
}

bool checkAnswer(int userAnswer, int correctAnswer) {
    return userAnswer == correctAnswer;
}

EMSCRIPTEN_BINDINGS(multiply_module) {
    emscripten::value_object<Question>("Question")
        .field("factor1", &Question::factor1)
        .field("factor2", &Question::factor2)
        .field("answer", &Question::answer)
        .field("hint", &Question::hint);

    emscripten::function("generateQuestion", &generateQuestion);
    emscripten::function("checkAnswer", &checkAnswer);
}
