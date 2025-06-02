document.addEventListener('DOMContentLoaded', () => {
    const recommendBtn = document.getElementById('recommendBtn');
    const resultDiv = document.getElementById('result');
    const gameTitleP = document.getElementById('gameTitle');
    const reviewLinkA = document.getElementById('reviewLink');
    const gameCountSpan = document.getElementById('count');

    const games = [
        "The Witcher 3: Wild Hunt",
        "Red Dead Redemption 2",
        "The Legend of Zelda: Breath of the Wild",
        "Grand Theft Auto V",
        "Minecraft",
        "Dark Souls III",
        "Overwatch",
        "Fortnite",
        "Among Us",
        "Stardew Valley",
        "Hades",
        "Cyberpunk 2077",
        "Animal Crossing: New Horizons",
        "Super Mario Odyssey",
        "God of War (2018)",
        "Spider-Man (PS4)",
        "Sekiro: Shadows Die Twice",
        "Doom Eternal",
        "Ghost of Tsushima",
        "Elden Ring"
    ];

    let lastRecommendedGame = "";

    // Display total game count
    if (gameCountSpan) {
        gameCountSpan.textContent = games.length;
    }

    function recommendGame() {
        if (resultDiv) resultDiv.style.display = 'block'; // Ensure resultDiv is visible

        let randomIndex;
        let recommendedGame = "";

        // Ensure a new game is recommended if there's more than one game
        if (games.length > 1) {
            do {
                randomIndex = Math.floor(Math.random() * games.length);
                recommendedGame = games[randomIndex];
            } while (recommendedGame === lastRecommendedGame);
        } else if (games.length === 1) {
            recommendedGame = games[0];
        } else {
            if (gameTitleP) gameTitleP.textContent = "No games available in the list!";
            if (reviewLinkA) reviewLinkA.style.display = 'none';
            return;
        }
        
        lastRecommendedGame = recommendedGame;

        // Fade out, change text, fade in
        if (resultDiv) {
            resultDiv.style.opacity = 0;
        }

        setTimeout(() => {
            if (gameTitleP) gameTitleP.textContent = recommendedGame;
            if (reviewLinkA) {
                reviewLinkA.href = `review.html?game=${encodeURIComponent(recommendedGame)}`;
                reviewLinkA.style.display = 'inline-block'; // Ensure link is visible
            }
            if (resultDiv) {
                resultDiv.style.opacity = 1;
            }
        }, 300); // Match this duration with CSS transition if any

        // Button animation
        if (recommendBtn) {
            recommendBtn.classList.add('button-active-animation');
            setTimeout(() => {
                recommendBtn.classList.remove('button-active-animation');
            }, 500); // Duration of animation
        }
    }

    if (recommendBtn) {
        recommendBtn.addEventListener('click', recommendGame);
        // Add Enter key functionality for the button
        recommendBtn.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                recommendGame();
            }
        });
    }

    // Style for button animation (can also be in CSS)
    const style = document.createElement('style');
    style.textContent = `
        .button-active-animation {
            animation: button-pop 0.5s ease-out;
        }
        @keyframes button-pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});