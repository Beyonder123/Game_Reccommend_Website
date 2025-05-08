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
    "Super Mario Odyssey"
];

function recommendGame() {
    const resultDiv = document.getElementById('result');
    // Clear previous result with fade effect
    resultDiv.style.opacity = '0';
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * games.length);
        const selectedGame = games[randomIndex];
        resultDiv.innerHTML = `How about...<br><span class="game-title">${selectedGame}</span>`;
        resultDiv.style.opacity = '1';
    }, 300);
}
