import { gameState, resetState } from './state.js';
import {
    showScreen,
    updateScoreDisplay,
    updateTimerDisplay,
    updateProgressDisplay,
    updateDecisionTimerVisual,
    displayJunctionChoices,
    disablePaths,
    highlightSelectedPath,
    animateAvatar,
    showPointFeedback,
    displayResults,
    elements // Get access to buttons etc.
} from './ui.js';
import { calculateRiskProfile } from './assessment.js';

const AVATAR_ANIMATION_DURATION = 800; // ms, matches CSS transition
const FEEDBACK_DELAY = 1200; // ms, delay before next junction after feedback

function initializeGame() {
    resetState();
    updateScoreDisplay(gameState.score);
    updateTimerDisplay(gameState.gameTimeRemaining);
    updateProgressDisplay(gameState.currentJunction, gameState.maxJunctions);
    showScreen('initial-screen');
    // Ensure event listeners are added only once or managed correctly
     elements.startButton.onclick = startGame; // Use onclick for simplicity here
     elements.playAgainButton.onclick = initializeGame;
}

function startGame() {
    gameState.screen = 'game';
    showScreen('game-screen');
    startMainTimer();
    proceedToNextJunction();
}

function startMainTimer() {
    updateTimerDisplay(gameState.gameTimeRemaining); // Initial display
    gameState.gameIntervalId = setInterval(() => {
        gameState.gameTimeRemaining--;
        updateTimerDisplay(gameState.gameTimeRemaining);
        if (gameState.gameTimeRemaining <= 0) {
            console.log("Game Timer Expired!");
            endGame(true); // Indicate timeout
        }
    }, 1000);
}

function startDecisionTimer() {
    gameState.decisionTimeRemaining = gameState.decisionTimeTotal;
    updateDecisionTimerVisual(gameState.decisionTimeRemaining, gameState.decisionTimeTotal);
    gameState.lastChoiceTime = Date.now(); // Record when decision started

    gameState.decisionIntervalId = setInterval(() => {
        gameState.decisionTimeRemaining -= 0.1; // Update every 100ms
        updateDecisionTimerVisual(gameState.decisionTimeRemaining, gameState.decisionTimeTotal);

        if (gameState.decisionTimeRemaining <= 0) {
             console.log("Decision Timer Expired - Auto Selecting Safe");
            handlePathSelection({ target: elements.safePath }, true); // Simulate safe path click, mark as auto
        }
    }, 100);
}

function proceedToNextJunction() {
    if (gameState.currentJunction >= gameState.maxJunctions) {
        endGame();
        return;
    }

    updateProgressDisplay(gameState.currentJunction + 1, gameState.maxJunctions); // Show 1/3, 2/3 etc.
    const safeValue = gameState.junctionValues.safe[gameState.currentJunction];
    displayJunctionChoices(gameState.currentJunction, safeValue, handlePathSelection);
    startDecisionTimer();
}

function handlePathSelection(event, autoSelected = false) {
    clearInterval(gameState.decisionIntervalId); // Stop decision timer
    disablePaths(); // Prevent further clicks

    const pathType = event.target.closest('.path-option').dataset.pathType;
    highlightSelectedPath(pathType);

    if (!autoSelected && gameState.lastChoiceTime) {
         const decisionTime = (Date.now() - gameState.lastChoiceTime) / 1000; // Time in seconds
         gameState.decisionTimes.push(decisionTime);
    } else {
         gameState.decisionTimes.push(gameState.decisionTimeTotal); // Record max time if auto-selected
    }


    let pointsEarned = 0;
    if (pathType === 'safe') {
        pointsEarned = gameState.junctionValues.safe[gameState.currentJunction];
    } else { // risky
        const range = gameState.junctionValues.riskyRanges[gameState.currentJunction];
        pointsEarned = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    gameState.choices.push(pathType);
    gameState.score += pointsEarned;

    updateScoreDisplay(gameState.score);
    animateAvatar(pathType);
    showPointFeedback(pointsEarned);

    gameState.currentJunction++;

    // Wait for animations/feedback before proceeding
    setTimeout(() => {
        // Check if game ended due to time running out during animation
        if (gameState.gameTimeRemaining > 0) {
            proceedToNextJunction();
        }
    }, FEEDBACK_DELAY);
}


function endGame(timedOut = false) {
    console.log("Game Ended. Timed Out:", timedOut);
    clearInterval(gameState.gameIntervalId);
    clearInterval(gameState.decisionIntervalId); // Ensure decision timer is stopped

    const profile = calculateRiskProfile(gameState.choices);

    // Calculate time taken string HERE
    const timeElapsed = gameState.gameTimeTotal - gameState.gameTimeRemaining;
    const timeTakenString = `${timeElapsed} second${timeElapsed !== 1 ? 's' : ''}`; // Handle pluralization

    displayResults(
        gameState.score,
        gameState.choices,
        // timeTotal, // No longer pass total time
        timeTakenString, // Pass the calculated string instead
        profile
    );
    showScreen('results-screen');
}


// Initial setup when the script loads
document.addEventListener('DOMContentLoaded', initializeGame);