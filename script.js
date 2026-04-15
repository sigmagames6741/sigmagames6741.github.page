// Game Library
let games = [];
let currentGame = null;
let settings = {
    theme: 'light',
    sound: 'off',
    defaultTicTacSize: 3,
    animations: 'on',
    optimization: 'balanced'
};

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('gamingWebsiteSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
    }
    applySettings();
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('gamingWebsiteSettings', JSON.stringify(settings));
    applySettings();
}

// Apply settings
function applySettings() {
    document.body.classList.toggle('dark', settings.theme === 'dark');
    document.body.classList.toggle('performance-mode', settings.optimization === 'performance');
    document.body.classList.toggle('high-quality-mode', settings.optimization === 'quality');
    document.body.classList.toggle('balanced-mode', settings.optimization === 'balanced');
}

// Generate games
async function generateGames() {
    games = [];

    // Fetch selenite games
    try {
        const response = await fetch('https://raw.githubusercontent.com/selenite-cc/selenite-old/main/games.json');
        const seleniteGames = await response.json();
        
        seleniteGames.forEach(game => {
            games.push({
                id: `selenite-${game.directory}`,
                title: game.name,
                type: 'selenite',
                params: { directory: game.directory },
                description: `Play ${game.name} - an unblocked game`
            });
        });
    } catch (error) {
        console.error('Failed to load selenite games:', error);
        // Fallback to some basic games
        games.push({
            id: 'fallback-number-guess',
            title: 'Number Guess (1-100)',
            type: 'number-guess',
            params: { max: 100 },
            description: 'Guess a number between 1 and 100'
        });
    }

    // Fetch ChickenKingsVault games
    try {
        const response = await fetch('https://raw.githubusercontent.com/WanoCapy/ChickenKingsVault/main/games.js');
        const gamesJsContent = await response.text();
        
        // Parse the games.js content to extract game links and names
        const gameLinks = gamesJsContent.match(/<a class="game-link" href="gamefiles\/([^"]*\.html)">[\s\S]*?<div>([^<]+)<\/div>/g);
        
        if (gameLinks) {
            gameLinks.forEach(link => {
                const hrefMatch = link.match(/href="gamefiles\/([^"]*\.html)"/);
                const nameMatch = link.match(/<div>([^<]+)<\/div>/);
                
                if (hrefMatch && nameMatch) {
                    const fileName = hrefMatch[1].replace('.html', '');
                    const gameName = nameMatch[1].trim();
                    
                    games.push({
                        id: `chickening-${fileName}`,
                        title: gameName,
                        type: 'chickening',
                        params: { file: fileName },
                        description: `Play ${gameName} from Chicken King's Vault`
                    });
                }
            });
        }
    } catch (error) {
        console.error('Failed to load ChickenKingsVault games:', error);
    }

    // Add UGS Games if available
    if (typeof files !== 'undefined') {
        files.forEach(file => {
            const cleanName = file.replace(/^cl/, '').replace(/([A-Z])/g, ' $1').replace(/\(\d+\)$/, '').trim();
            games.push({
                id: `ugs-${file}`,
                title: cleanName || file,
                type: 'ugs',
                params: { file: file },
                description: `UGS Game: ${cleanName || file}`
            });
        });
    }

    // Sort games alphabetically by title for better variety and organization
    games.sort((a, b) => a.title.localeCompare(b.title));
    
    // Update the game counter
    updateGameCounter();
}

// Render game library
function renderGameLibrary(filter = '') {
    const grid = document.getElementById('games-grid');
    grid.innerHTML = '';

    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(filter.toLowerCase()) ||
        game.description.toLowerCase().includes(filter.toLowerCase())
    );

    filteredGames.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.innerHTML = `
            <h3>${game.title}</h3>
            <p>${game.description}</p>
        `;
        card.addEventListener('click', () => loadGame(game));
        grid.appendChild(card);
    });
}

// Load a game
function loadGame(game) {
    currentGame = game;
    document.body.classList.add('game-playing');
    document.getElementById('game-library').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('current-game-title').textContent = game.title;
    document.getElementById('game-content').innerHTML = '';

    switch (game.type) {
        case 'number-guess':
            loadNumberGuess(game.params);
            break;
        case 'tic-tac-toe':
            loadTicTacToe(game.params);
            break;
        case 'rps':
            loadRPS(game.params);
            break;
        case 'quiz':
            loadQuiz(game.params);
            break;
        case 'ugs':
            loadUGSGame(game.params);
            break;
        case 'selenite':
            loadSeleniteGame(game.params);
            break;
        case 'chickening':
            loadChickeningGame(game.params);
            break;
    }
}

// Back to library
document.getElementById('back-btn').addEventListener('click', () => {
    document.body.classList.remove('game-playing');
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('game-library').style.display = 'block';
    currentGame = null;
});

// Fullscreen toggle
document.getElementById('fullscreen-btn').addEventListener('click', () => {
    const gameContent = document.getElementById('game-content');
    
    if (!document.fullscreenElement) {
        // Enter fullscreen for game content
        if (gameContent.requestFullscreen) {
            gameContent.requestFullscreen();
        } else if (gameContent.webkitRequestFullscreen) { // Safari
            gameContent.webkitRequestFullscreen();
        } else if (gameContent.msRequestFullscreen) { // IE11
            gameContent.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen();
        }
    }
});

// Search
document.getElementById('search-input').addEventListener('input', (e) => {
    renderGameLibrary(e.target.value);
});

// Settings modal
const modal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const closeBtn = document.querySelector('.close');
const saveBtn = document.getElementById('save-settings');

settingsBtn.addEventListener('click', () => {
    // Load current settings into form
    document.getElementById('theme-toggle').value = settings.theme;
    document.getElementById('sound-toggle').value = settings.sound;
    document.getElementById('default-tic-tac-size').value = settings.defaultTicTacSize;
    document.getElementById('animations-toggle').value = settings.animations;
    document.getElementById('optimization-toggle').value = settings.optimization;
    modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

saveBtn.addEventListener('click', () => {
    settings.theme = document.getElementById('theme-toggle').value;
    settings.sound = document.getElementById('sound-toggle').value;
    settings.defaultTicTacSize = parseInt(document.getElementById('default-tic-tac-size').value);
    settings.animations = document.getElementById('animations-toggle').value;
    settings.optimization = document.getElementById('optimization-toggle').value;
    saveSettings();
    modal.style.display = 'none';
});

// Initialize
loadSettings();
generateGames().then(() => {
    renderGameLibrary();
});

// Function to check and load UGS games
function checkAndLoadUGSGames() {
    if (typeof files !== 'undefined' && Array.isArray(files) && files.length > 0) {
        console.log('UGS games loaded:', files.length);
        // Add UGS games to existing games array
        files.forEach(file => {
            const cleanName = file.replace(/^cl/, '').replace(/([A-Z])/g, ' $1').replace(/\(\d+\)$/, '').trim();
            const existingGame = games.find(g => g.id === `ugs-${file}`);
            if (!existingGame) {
                games.push({
                    id: `ugs-${file}`,
                    title: cleanName || file,
                    type: 'ugs',
                    params: { file: file },
                    description: `UGS Game: ${cleanName || file}`
                });
            }
        });
        // Sort and update
        games.sort((a, b) => a.title.localeCompare(b.title));
        updateGameCounter();
        renderGameLibrary();
    } else {
        // Retry after a short delay, up to 10 times
        if (typeof checkAndLoadUGSGames.retries === 'undefined') {
            checkAndLoadUGSGames.retries = 0;
        }
        checkAndLoadUGSGames.retries++;
        if (checkAndLoadUGSGames.retries < 10) {
            setTimeout(checkAndLoadUGSGames, 1000);
        } else {
            console.log('UGS games failed to load after 10 attempts');
            // Add a message to the UI
            setTimeout(() => {
                const library = document.getElementById('game-library');
                if (library) {
                    const message = document.createElement('p');
                    message.style.color = '#ff6b6b';
                    message.style.textAlign = 'center';
                    message.style.marginTop = '20px';
                    message.textContent = 'Note: Some UGS games may not load due to external hosting limitations.';
                    library.appendChild(message);
                }
            }, 1000);
        }
    }
}

// Start checking for UGS games
checkAndLoadUGSGames();

// Game implementations
function loadNumberGuess(params) {
    const content = document.getElementById('game-content');
    content.innerHTML = `
        <p>Guess a number between 1 and ${params.max}.</p>
        <input type="number" id="guess-input" placeholder="Enter your guess" min="1" max="${params.max}">
        <button id="guess-btn">Guess</button>
        <p id="feedback"></p>
    `;

    let secretNumber = Math.floor(Math.random() * params.max) + 1;
    const guessInput = document.getElementById('guess-input');
    const guessBtn = document.getElementById('guess-btn');
    const feedback = document.getElementById('feedback');

    guessBtn.addEventListener('click', () => {
        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > params.max) {
            feedback.textContent = `Please enter a number between 1 and ${params.max}.`;
            return;
        }
        if (guess === secretNumber) {
            feedback.textContent = 'Congratulations! You guessed it!';
            secretNumber = Math.floor(Math.random() * params.max) + 1;
        } else if (guess < secretNumber) {
            feedback.textContent = 'Too low! Try again.';
        } else {
            feedback.textContent = 'Too high! Try again.';
        }
        guessInput.value = '';
    });
}

function loadTicTacToe(params) {
    const content = document.getElementById('game-content');
    const size = params.size;
    content.innerHTML = `
        <div id="board" style="display: grid; grid-template-columns: repeat(${size}, 50px); grid-template-rows: repeat(${size}, 50px); gap: 2px; margin: 1rem 0;"></div>
        <button id="reset-btn">Reset Game</button>
        <p id="status"></p>
    `;

    const board = document.getElementById('board');
    const resetBtn = document.getElementById('reset-btn');
    const status = document.getElementById('status');
    let currentPlayer = 'X';
    let gameBoard = Array(size * size).fill('');
    let gameActive = true;

    // Create cells
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.width = '50px';
        cell.style.height = '50px';
        cell.style.backgroundColor = '#eee';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.cursor = 'pointer';
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    const cells = board.querySelectorAll('.cell');

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        checkResult();
    }

    function checkResult() {
        // Simple win check for rows, columns, diagonals
        const winLength = size <= 3 ? size : 3; // For larger boards, still check for 3 in a row
        let roundWon = false;

        // Check rows and columns
        for (let i = 0; i < size; i++) {
            for (let j = 0; j <= size - winLength; j++) {
                const row = gameBoard.slice(i * size + j, i * size + j + winLength);
                const col = [];
                for (let k = 0; k < winLength; k++) {
                    col.push(gameBoard[(j + k) * size + i]);
                }
                if (row.every(cell => cell === currentPlayer && cell !== '') ||
                    col.every(cell => cell === currentPlayer && cell !== '')) {
                    roundWon = true;
                    break;
                }
            }
            if (roundWon) break;
        }

        // Check diagonals
        if (!roundWon) {
            for (let i = 0; i <= size - winLength; i++) {
                for (let j = 0; j <= size - winLength; j++) {
                    const diag1 = [];
                    const diag2 = [];
                    for (let k = 0; k < winLength; k++) {
                        diag1.push(gameBoard[(i + k) * size + (j + k)]);
                        diag2.push(gameBoard[(i + k) * size + (j + winLength - 1 - k)]);
                    }
                    if (diag1.every(cell => cell === currentPlayer && cell !== '') ||
                        diag2.every(cell => cell === currentPlayer && cell !== '')) {
                        roundWon = true;
                        break;
                    }
                }
                if (roundWon) break;
            }
        }

        if (roundWon) {
            status.textContent = `Player ${currentPlayer} has won!`;
            gameActive = false;
            return;
        }

        let roundDraw = !gameBoard.includes('');
        if (roundDraw) {
            status.textContent = 'Game ended in a draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `It's ${currentPlayer}'s turn`;
    }

    function resetGame() {
        gameBoard = Array(size * size).fill('');
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.textContent = '');
    }

    resetBtn.addEventListener('click', resetGame);
    status.textContent = `It's ${currentPlayer}'s turn`;
}

function loadRPS(params) {
    const content = document.getElementById('game-content');
    content.innerHTML = `
        <p>Choose your move:</p>
        <button id="rock">Rock</button>
        <button id="paper">Paper</button>
        <button id="scissors">Scissors</button>
        <p id="result"></p>
        <p id="score">Score: You 0 - Computer 0</p>
    `;

    const result = document.getElementById('result');
    const score = document.getElementById('score');
    let userScore = 0;
    let computerScore = 0;
    const maxScore = params.variant.includes('Best of') ? parseInt(params.variant.split(' ')[2]) : 1;

    function playRound(userChoice) {
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * 3)];

        let roundResult = '';
        if (userChoice === computerChoice) {
            roundResult = "It's a tie!";
        } else if (
            (userChoice === 'rock' && computerChoice === 'scissors') ||
            (userChoice === 'paper' && computerChoice === 'rock') ||
            (userChoice === 'scissors' && computerChoice === 'paper')
        ) {
            roundResult = 'You win!';
            userScore++;
        } else {
            roundResult = 'Computer wins!';
            computerScore++;
        }

        result.textContent = `You chose ${userChoice}, computer chose ${computerChoice}. ${roundResult}`;
        score.textContent = `Score: You ${userScore} - Computer ${computerScore}`;

        if (params.variant.includes('Best of') && (userScore > maxScore / 2 || computerScore > maxScore / 2)) {
            result.textContent += ` Game over! ${userScore > computerScore ? 'You won the series!' : 'Computer won the series!'}`;
            // Reset for next game
            userScore = 0;
            computerScore = 0;
        }
    }

    document.getElementById('rock').addEventListener('click', () => playRound('rock'));
    document.getElementById('paper').addEventListener('click', () => playRound('paper'));
    document.getElementById('scissors').addEventListener('click', () => playRound('scissors'));
}

function loadQuiz(params) {
    const content = document.getElementById('game-content');
    const questions = {
        Math: [
            { q: 'What is 2 + 2?', a: '4' },
            { q: 'What is 5 * 3?', a: '15' },
            { q: 'What is 10 - 7?', a: '3' }
        ],
        Colors: [
            { q: 'What color is the sky on a clear day?', a: 'blue' },
            { q: 'What color are apples?', a: 'red' },
            { q: 'What color is grass?', a: 'green' }
        ],
        Animals: [
            { q: 'What animal says "meow"?', a: 'cat' },
            { q: 'What animal says "woof"?', a: 'dog' },
            { q: 'What animal has a long neck?', a: 'giraffe' }
        ],
        Shapes: [
            { q: 'How many sides does a triangle have?', a: '3' },
            { q: 'How many sides does a square have?', a: '4' },
            { q: 'How many sides does a circle have?', a: '0' }
        ]
    };

    const topicQuestions = questions[params.topic] || questions.Math;
    let currentQuestion = 0;
    let score = 0;

    function showQuestion() {
        if (currentQuestion >= topicQuestions.length) {
            content.innerHTML = `<p>Quiz complete! Your score: ${score}/${topicQuestions.length}</p>`;
            return;
        }

        const q = topicQuestions[currentQuestion];
        content.innerHTML = `
            <p>${q.q}</p>
            <input type="text" id="answer-input" placeholder="Your answer">
            <button id="submit-btn">Submit</button>
            <p id="quiz-feedback"></p>
        `;

        document.getElementById('submit-btn').addEventListener('click', () => {
            const answer = document.getElementById('answer-input').value.toLowerCase().trim();
            const feedback = document.getElementById('quiz-feedback');
            if (answer === q.a.toLowerCase()) {
                feedback.textContent = 'Correct!';
                score++;
            } else {
                feedback.textContent = `Wrong! The answer is ${q.a}`;
            }
            currentQuestion++;
            setTimeout(showQuestion, 2000);
        });
    }

    showQuestion();
}

function loadUGSGame(params) {
    const content = document.getElementById('game-content');
    const url = `https://raw.githubusercontent.com/bubbls/ugs-singlefile/main/UGS-Files/${params.file}.html`;
    
    content.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p>Loading UGS game...</p>
            <div id="game-container" style="width: 100%; height: 600px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); background: #f0f0f0; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <iframe id="game-iframe" 
                        width="100%" 
                        height="100%" 
                        style="border-radius: 12px; border: none; opacity: 0; transition: opacity 0.5s;">
                    <p>Your browser doesn't support embedded content. 
                       <a href="${url}" target="_blank">Click here to play the game</a>
                    </p>
                </iframe>
                <div class="loading" style="position: absolute; color: #666;">Loading game...</div>
            </div>
            <p style="margin-top: 10px; color: #666;">
                If the game doesn't load, try the link below to open it in a new tab.
            </p>
            <a href="${url}" target="_blank" style="color: #667eea; text-decoration: none;">Open Game in New Tab</a>
        </div>
    `;
    
    // Fetch the HTML content and create a blob URL
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const blob = new Blob([html], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);
            const iframe = document.getElementById('game-iframe');
            iframe.src = blobUrl;
            iframe.style.opacity = '1';
            content.querySelector('.loading').style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading game:', error);
            content.querySelector('.loading').textContent = 'Error loading game. Try the link below.';
        });
}

function loadSeleniteGame(params) {
    const content = document.getElementById('game-content');
    const url = `https://selenite-cc.github.io/selenite-old/${params.directory}/`;
    
    content.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p>Loading game...</p>
            <div id="game-container" style="width: 100%; height: 600px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); background: #f0f0f0; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <iframe id="game-iframe" 
                        src="${url}"
                        width="100%" 
                        height="100%" 
                        style="border-radius: 12px; border: none; opacity: 0; transition: opacity 0.5s;"
                        onload="this.style.opacity='1'; document.querySelector('.loading').style.display='none';">
                    <p>Your browser doesn't support embedded content. 
                       <a href="${url}" target="_blank">Click here to play the game</a>
                    </p>
                </iframe>
                <div class="loading" style="position: absolute; color: #666;">Loading game...</div>
            </div>
            <p style="margin-top: 10px; color: #666;">
                If the game doesn't load, try the link below to open it in a new tab.
            </p>
            <a href="${url}" target="_blank" style="color: #667eea; text-decoration: none;">Open Game in New Tab</a>
        </div>
    `;
}

function loadChickeningGame(params) {
    const content = document.getElementById('game-content');
    const url = `https://wanocapy.github.io/ChickenKingsVault/gamefiles/${params.file}.html`;
    
    content.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p>Loading game...</p>
            <div id="game-container" style="width: 100%; height: 600px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); background: #f0f0f0; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <iframe id="game-iframe" 
                        src="${url}"
                        width="100%" 
                        height="100%" 
                        style="border-radius: 12px; border: none; opacity: 0; transition: opacity 0.5s;"
                        onload="this.style.opacity='1'; document.querySelector('.loading').style.display='none';">
                    <p>Your browser doesn't support embedded content. 
                       <a href="${url}" target="_blank">Click here to play the game</a>
                    </p>
                </iframe>
                <div class="loading" style="position: absolute; color: #666;">Loading game...</div>
            </div>
            <p style="margin-top: 10px; color: #666;">
                If the game doesn't load, try the link below to open it in a new tab.
            </p>
            <a href="${url}" target="_blank" style="color: #667eea; text-decoration: none;">Open Game in New Tab</a>
        </div>
    `;
}

function updateGameCounter() {
    const counterElements = document.querySelectorAll('.hero-stats strong');
    if (counterElements.length > 0) {
        counterElements[0].textContent = games.length.toLocaleString();
    }
}