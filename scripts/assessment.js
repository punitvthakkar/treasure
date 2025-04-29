// Profile Definitions
const profiles = {
    guardian: {
        type: "Guardian",
        description: "You prefer certainty and carefully avoid unnecessary risks. You value security and predictability in your decision-making.",
        strength: "Excellent at preserving resources and avoiding catastrophic losses.",
        challenge: "Might miss high-reward opportunities by being too cautious."
    },
    evaluator: {
        type: "Evaluator",
        description: "You thoughtfully weigh each decision on its own merits, considering both risk and reward. You take calculated risks when the potential payoff seems worth it.",
        strength: "Balanced approach leads to steady progress with occasional high gains.",
        challenge: "May sometimes overthink decisions, leading to missed opportunities."
    },
    adventurer: {
        type: "Adventurer",
        description: "You embrace uncertainty and are willing to take chances. You understand that great rewards often come with significant risks.",
        strength: "Poised to achieve exceptional results when risks pay off.",
        challenge: "More vulnerable to substantial setbacks if multiple risks fail."
    },
    // Basic fallback or could add Adapter/Impulsive logic later if needed
    default: {
         type: "Balanced",
         description: "Your choices show a mix of caution and willingness to take risks.",
         strength: "Adaptable to various situations.",
         challenge: "Strategy might seem inconsistent at times."
    }
};


export function calculateRiskProfile(choices) {
    const riskyCount = choices.filter(choice => choice === 'risky').length;

    if (riskyCount <= 1) {
        return profiles.guardian;
    } else if (riskyCount === 2) {
        return profiles.evaluator;
    } else if (riskyCount >= 3) {
        return profiles.adventurer;
    } else {
        // Should not happen with 3 choices, but include a fallback
        return profiles.default;
    }
}