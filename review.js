document.addEventListener('DOMContentLoaded', () => {
    const gameTitleSpan = document.querySelector('#gameToReview span');
    const reviewForm = document.getElementById('reviewForm');
    const starsContainers = document.querySelectorAll('.stars');
    const progressBar = document.getElementById('progressBar');
    const submitBtn = document.getElementById('submitReviewBtn');

    let ratings = {
        enjoyment: 0,
        storyline: 0,
        gameplay: 0,
        graphics: 0,
        replayValue: 0,
        sound: 0,
        difficulty: 0
    };
    const totalQuestions = Object.keys(ratings).length;

    // Get game title from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameName = urlParams.get('game');
    if (gameName && gameTitleSpan) {
        gameTitleSpan.textContent = decodeURIComponent(gameName);
    } else if (gameTitleSpan) {
        gameTitleSpan.textContent = "Game Title Not Found";
    }

    function updateProgress() {
        const answeredQuestions = Object.values(ratings).filter(rating => rating > 0).length;
        const progressPercentage = (answeredQuestions / totalQuestions) * 100;
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.textContent = `${Math.round(progressPercentage)}%`;
        }
    }

    starsContainers.forEach(container => {
        const question = container.dataset.question;
        const stars = container.querySelectorAll('span');
        const questionCard = container.closest('.question-card');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                ratings[question] = parseInt(star.dataset.value);
                stars.forEach(s => {
                    s.classList.toggle('active', parseInt(s.dataset.value) <= ratings[question]);
                });
                if (questionCard) {
                    questionCard.classList.remove('unanswered');
                    questionCard.classList.add('rated');
                }
                updateProgress();
            });

            star.addEventListener('mouseover', () => {
                const hoverValue = parseInt(star.dataset.value);
                stars.forEach(s => {
                    s.style.color = parseInt(s.dataset.value) <= hoverValue ? '#ffc107' : '#ddd';
                });
            });

            container.addEventListener('mouseout', () => {
                stars.forEach(s => {
                    s.style.color = parseInt(s.dataset.value) <= ratings[question] ? '#ffc107' : '#ddd';
                });
            });
        });
    });

    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let allAnswered = true;

            // Check star ratings
            for (const question in ratings) {
                const card = document.getElementById(`card-${question}`);
                if (ratings[question] === 0) {
                    allAnswered = false;
                    if (card) {
                        card.classList.add('unanswered');
                        card.classList.remove('rated');
                    }
                } else {
                    if (card) {
                        card.classList.remove('unanswered');
                        card.classList.add('rated');
                    }
                }
            }

            if (!allAnswered) {
                alert('Please rate all aspects before submitting.');
                return;
            }

            const comments = document.getElementById('comments').value;
            const reviewData = {
                game: gameName || 'Unknown Game',
                timestamp: new Date().toISOString(),
                ratings: ratings,
                comments: comments
            };

            console.log('Review Data:', reviewData);
            saveReviewToExcel(reviewData);

            if (submitBtn) {
                submitBtn.classList.add('success-animation');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
                setTimeout(() => {
                    submitBtn.classList.remove('success-animation');
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
                    alert('Review submitted successfully! (Data saved to LocalStorage and logged to console)');
                    // Optionally, redirect or clear form
                    // window.location.href = 'index.html'; 
                }, 2000);
        }});
    }

    function saveReviewToExcel(review) {
        const filename = 'game_reviews.xlsx';
        let data = [];
        try {
            const existingData = localStorage.getItem('gameReviewsExcel');
            if (existingData) {
                const workbook = XLSX.read(existingData, {type: 'base64'});
                const sheetName = workbook.SheetNames[0];
                data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            }
        } catch (e) {
            console.error("Error reading existing review data from localStorage:", e);
        }

        const newReviewEntry = {
            'Game Title': review.game,
            'Timestamp': review.timestamp,
            'Overall Enjoyment': review.ratings.enjoyment,
            'Storyline/Narrative': review.ratings.storyline,
            'Gameplay Mechanics': review.ratings.gameplay,
            'Graphics & Visuals': review.ratings.graphics,
            'Replay Value': review.ratings.replayValue,
            'Sound & Music': review.ratings.sound,
            'Difficulty Balance': review.ratings.difficulty,
            'Additional Comments': review.comments
        };
        data.push(newReviewEntry);

        const worksheet = XLSX.utils.json_to_sheet(data);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Reviews');
        
        try {
            // Save to localStorage as base64 string
            const excelBase64 = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'base64' });
            localStorage.setItem('gameReviewsExcel', excelBase64);
            console.log('Review saved to localStorage.');

            // Optional: Trigger download (might be blocked by pop-up blockers if not user-initiated)
            // XLSX.writeFile(newWorkbook, filename);
        } catch (e) {
            console.error("Error saving review data to localStorage:", e);
            alert("Could not save review data to localStorage. See console for details.");
        }
    }

    // Initial progress update
    updateProgress();
});