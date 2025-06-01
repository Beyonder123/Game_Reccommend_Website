// Get game title from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const gameTitle = decodeURIComponent(urlParams.get('game'));

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

// Progress tracking
function updateProgress() {
    const totalQuestions = 7; // Not counting comments
    const answeredQuestions = Object.values(ratings).filter(rating => rating > 0).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    
    document.getElementById('progressIndicator').style.width = `${progressPercentage}%`;
}

// Star rating interaction
document.querySelectorAll('.rating-stars').forEach(ratingGroup => {
    ratingGroup.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const question = this.parentElement.dataset.question;
            const value = parseInt(this.dataset.value);
            
            // Update visual state
            this.parentElement.querySelectorAll('.star').forEach((s, index) => {
                s.classList.toggle('active', index < value);
            });

            // Store rating
            ratings[question] = value;
            
            // Update progress
            updateProgress();
            
            // Add animation effect
            const card = this.closest('.question-card');
            card.classList.add('rated');
            setTimeout(() => {
                card.classList.remove('rated');
            }, 500);
        });
    });
});

// Form submission
document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all ratings
    const unansweredQuestions = Object.entries(ratings)
        .filter(([key, value]) => value === 0)
        .map(([key]) => key.replace('q', ''));
    
    if (unansweredQuestions.length > 0) {
        // Highlight unanswered questions
        document.querySelectorAll('.question-card').forEach(card => {
            const questionNumber = card.dataset.question;
            if (unansweredQuestions.includes(questionNumber)) {
                card.classList.add('unanswered');
                setTimeout(() => {
                    card.classList.remove('unanswered');
                }, 2000);
            }
        });
        
        alert(`Please answer all questions before submitting! Missing questions: ${unansweredQuestions.join(', ')}`);
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
    
    // Show success message with animation
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Review Submitted!';
    submitBtn.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
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

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .question-card.rated {
        background: rgba(108, 92, 231, 0.1);
        transition: background 0.5s ease;
    }
    
    .question-card.unanswered {
        animation: shake 0.5s ease-in-out, highlight 2s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
    
    @keyframes highlight {
        0%, 100% { background: rgba(255,255,255,0.05); }
        50% { background: rgba(255, 71, 87, 0.2); }
    }
`;
document.head.appendChild(style);

// Initialize progress
updateProgress();