// DOM Elements Cache
const elements = {
    screens: document.querySelectorAll('.screen'),
    initialScreen: document.getElementById('initial-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultsScreen: document.getElementById('results-screen'),
    startButton: document.getElementById('start-button'),
    playAgainButton: document.getElementById('play-again-button'),
    scoreDisplay: document.getElementById('score-display'),
    timerDisplay: document.getElementById('timer-display'),
    progressDisplay: document.getElementById('progress-display'),
    decisionTimerVisual: document.getElementById('decision-timer-visual'),
    safePath: document.getElementById('safe-path'),
    riskyPath: document.getElementById('risky-path'),
    safePathValue: document.getElementById('safe-path-value'),
    playerAvatar: document.getElementById('player-avatar'),
    pointFeedback: document.getElementById('point-feedback'),
    // Results Screen Elements
    finalScore: document.getElementById('final-score'),
    pathSummary: document.getElementById('path-summary'),
    timeTaken: document.getElementById('time-taken'),
    profileType: document.getElementById('profile-type'),
    profileDescription: document.getElementById('profile-description'),
    profileStrength: document.getElementById('profile-strength'),
    profileChallenge: document.getElementById('profile-challenge'),
};

export function showScreen(screenId) {
    elements.screens.forEach(screen => {
        screen.classList.remove('active');
    });
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        activeScreen.classList.add('active');
    } else {
        console.error("Screen not found:", screenId);
    }
}

export function updateScoreDisplay(score) {
    elements.scoreDisplay.textContent = score;
}

export function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function updateProgressDisplay(current, max) {
    elements.progressDisplay.textContent = `${current}/${max}`;
}

export function updateDecisionTimerVisual(remaining, total) {
    const percentage = (remaining / total) * 100;
    elements.decisionTimerVisual.style.width = `${percentage}%`;
}

export function displayJunctionChoices(junctionIndex, safeValue, pathClickHandler) {
    // Reset path styles and enable
    elements.safePath.classList.remove('selected', 'disabled');
    elements.riskyPath.classList.remove('selected', 'disabled');
    elements.playerAvatar.className = ''; // Reset avatar position class

    // Update safe path value display
    elements.safePathValue.textContent = `+${safeValue}`;

    // Remove old listeners before adding new ones
    elements.safePath.replaceWith(elements.safePath.cloneNode(true));
    elements.riskyPath.replaceWith(elements.riskyPath.cloneNode(true));
    // Re-cache elements after cloning
    elements.safePath = document.getElementById('safe-path');
    elements.riskyPath = document.getElementById('risky-path');
    elements.safePathValue = document.getElementById('safe-path-value');


    // Add new event listeners
    elements.safePath.addEventListener('click', pathClickHandler);
    elements.riskyPath.addEventListener('click', pathClickHandler);

    // Reset point feedback
    elements.pointFeedback.classList.remove('show', 'positive', 'negative');
}

export function disablePaths() {
    elements.safePath.classList.add('disabled');
    elements.riskyPath.classList.add('disabled');
     // Remove listeners immediately
    elements.safePath.replaceWith(elements.safePath.cloneNode(true));
    elements.riskyPath.replaceWith(elements.riskyPath.cloneNode(true));
    elements.safePath = document.getElementById('safe-path');
    elements.riskyPath = document.getElementById('risky-path');
    elements.safePathValue = document.getElementById('safe-path-value');
}

export function highlightSelectedPath(pathType) {
     if (pathType === 'safe') {
         elements.safePath.classList.add('selected');
     } else {
          elements.riskyPath.classList.add('selected');
     }
}


export function animateAvatar(pathType) {
    elements.playerAvatar.classList.add(pathType === 'safe' ? 'move-safe' : 'move-risky');
}

export function showPointFeedback(points) {
     elements.pointFeedback.textContent = `${points >= 0 ? '+' : ''}${points}`;
     elements.pointFeedback.classList.remove('positive', 'negative');
     elements.pointFeedback.classList.add(points >= 0 ? 'positive' : 'negative');
     elements.pointFeedback.classList.add('show');

     // Hide after a short duration
     setTimeout(() => {
        elements.pointFeedback.classList.remove('show');
     }, 1000);
}


export function displayResults(score, choices, timeTakenString, profile) {
    elements.finalScore.textContent = score;
    elements.pathSummary.textContent = choices.join(', ') || 'N/A';
    // Use the passed string directly
    elements.timeTaken.textContent = timeTakenString;

    elements.profileType.textContent = profile.type;
    // Ensure class name is safe for CSS (lowercase, replace space with hyphen)
    elements.profileType.className = profile.type.toLowerCase().replace(/\s+/g, '-');
    elements.profileDescription.textContent = profile.description;
    elements.profileStrength.textContent = profile.strength;
    elements.profileChallenge.textContent = profile.challenge;
}


// Export cached elements if needed elsewhere (though functions are preferred)
export { elements };