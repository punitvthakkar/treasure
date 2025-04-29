export let gameState = {
    screen: 'initial', // 'initial', 'game', 'results'
    score: 0,
    gameTimeTotal: 60, // Total seconds for the game
    gameTimeRemaining: 60,
    decisionTimeTotal: 10, // Total seconds for decision
    decisionTimeRemaining: 10,
    currentJunction: 0, // 0, 1, 2
    maxJunctions: 3,
    choices: [], // Array of 'safe' or 'risky'
    decisionTimes: [], // Time taken for each decision
    junctionValues: {
        safe: [5, 10, 15],
        riskyRanges: [
            { min: -5, max: 20 },
            { min: -10, max: 30 },
            { min: -20, max: 50 }
        ]
    },
    gameIntervalId: null,
    decisionIntervalId: null,
    lastChoiceTime: null // Timestamp when junction appears
};

export function resetState() {
    gameState.screen = 'initial';
    gameState.score = 0;
    gameState.gameTimeRemaining = gameState.gameTimeTotal;
    gameState.decisionTimeRemaining = gameState.decisionTimeTotal;
    gameState.currentJunction = 0;
    gameState.choices = [];
    gameState.decisionTimes = [];
    clearInterval(gameState.gameIntervalId);
    clearInterval(gameState.decisionIntervalId);
    gameState.gameIntervalId = null;
    gameState.decisionIntervalId = null;
    gameState.lastChoiceTime = null;
}