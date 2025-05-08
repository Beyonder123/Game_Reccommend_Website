// Get game title from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const gameTitle = decodeURIComponent(urlParams.get('game'));
document.getElementById('gameTitle').textContent = gameTitle || 'Unknown Game';

// Display the game title
if (gameTitle) {
    document.getElementById('gameTitle').textContent = gameTitle;
} else {
    document.getElementById('gameTitle').textContent = 'the recommended game';
}

// Initialize ratings object
let ratings = {
    q1: 0, // Overall enjoyment
    q2: 0, // Storyline
    q3: 0, // Gameplay
    q4: 0, // Graphics
    q5: 0, // Replayability
    q6: 0, // Sound/Music
    q7: 0  // Difficulty Balance
};

// Star rating interaction
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        const question = this.parentElement.dataset.question;
        const value = parseInt(this.dataset.value);
        
        // Update visual state
        this.parentElement.querySelectorAll('.star').forEach((s, index) => {
            s.classList.toggle('active', index < value);
        });

        // Store rating
        ratings[question] = value;
    });
});

// Form submission
document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all ratings
    if (Object.values(ratings).some(rating => rating === 0)) {
        alert('Please answer all questions before submitting!');
        return;
    }

    // Create review object
    const review = {
        game: gameTitle,
        date: new Date().toISOString(),
        ...ratings,
        comments: document.getElementById('comments').value
    };

    // Save to Excel
    saveToExcel(review);
    
    alert('Thank you for your review!');
    window.location.href = 'index.html';
});

function saveToExcel(review) {
    // Try to read existing data
    let workbook;
    try {
        const existingData = localStorage.getItem('reviews');
        workbook = XLSX.read(existingData, {type: 'string'});
    } catch {
        workbook = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([review]);
        XLSX.utils.book_append_sheet(workbook, ws, 'Reviews');
    }

    // Add new review
    XLSX.utils.sheet_add_json(workbook.Sheets['Reviews'], [review], {skipHeader: true, origin: -1});

    // Save updated data
    const wbout = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    localStorage.setItem('reviews', XLSX.write(workbook, {type: 'string'}));
}

function downloadReviews() {
    const data = localStorage.getItem('reviews');
    const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'game_reviews.xlsx';
    link.click();
}