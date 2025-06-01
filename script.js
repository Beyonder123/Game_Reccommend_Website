// Game list - can be expanded or moved to a separate JSON file later
const games = [
    "The Witcher 3: Wild Hunt",
    "Red Dead Redemption 2",
    "Stardew Valley",
    "Hollow Knight",
    "Celeste",
    "Portal 2",
    "Disco Elysium",
    "Hades",
    "God of War (2018)",
    "The Legend of Zelda: Breath of the Wild",
    "Elden Ring",
    "Minecraft",
    "Undertale",
    "Dark Souls III",
    "Super Mario Odyssey",
    "Final Fantasy VII Remake",
    "Persona 5 Royal",
    "Sekiro: Shadows Die Twice",
    "Ghost of Tsushima",
    "DOOM Eternal",
    "Cyberpunk 2077",
    "Gta 4",
    "Gta Vice City",
    "Gta San Andreas",
];

// DOM elements
const recommendButton = document.getElementById('recommendButton');
const resultDiv = document.getElementById('result');
const gameCountElement = document.getElementById('gameCount');

// Display game count
gameCountElement.textContent = games.length;

// Track last recommended game
let lastRecommendedGame = null;
let currentRecommendedGame = null; 

// Initialize review link visibility
document.getElementById('reviewLink').style.display = 'none';

// Function to recommend a game
function recommendGame() {
    // Show result container if hidden
    resultDiv.style.display = 'block';
    
    // Add fade-out effect
    resultDiv.classList.add('fade-out');
    
    // Add button animation
    recommendButton.classList.add('button-clicked');
    setTimeout(() => {
        recommendButton.classList.remove('button-clicked');
    }, 300);
    
    setTimeout(() => {
        let selectedGame;
        let attempts = 0;
        
        // Ensure we get a different game than the last one
        do {
            const randomIndex = Math.floor(Math.random() * games.length);
            selectedGame = games[randomIndex];
            attempts++;
            
            // Safety check in case all games are the same
            if (attempts > 100) break;
        } while (selectedGame === lastRecommendedGame);

        // Update last recommended game
        lastRecommendedGame = selectedGame;
        currentRecommendedGame = selectedGame; // Store the current recommendation

        // Update display with animation
        resultDiv.innerHTML = `<div class="result-animation">How about...</div><span class="game-title">${selectedGame}</span>`;
        resultDiv.classList.remove('fade-out');

        // Update review link
        const reviewLink = document.getElementById('reviewLink');
        reviewLink.href = `review.html?game=${encodeURIComponent(selectedGame)}`;
        reviewLink.style.display = 'inline-block';
    }, 300);
}

// Add event listener for keyboard navigation (press Enter to recommend)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.ctrlKey && !event.altKey) {
        recommendGame();
    }
});

// Initialize with hidden result container
resultDiv.style.display = 'none';