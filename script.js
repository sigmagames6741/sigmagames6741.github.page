}

// Generate games
function generateGames() {
async function generateGames() {
games = [];

    // Number Guessing Games (250 variations)
    for (let i = 4; i <= 1000; i += 4) {
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
            id: `number-guess-${i}`,
            title: `Number Guess (1-${i})`,
            id: 'fallback-number-guess',
            title: 'Number Guess (1-100)',
type: 'number-guess',
            params: { max: i },
            description: `Guess a number between 1 and ${i}`
            params: { max: 100 },
            description: 'Guess a number between 1 and 100'
});
}

    // Tic-Tac-Toe Games (250 variations - different board sizes)
    for (let size = 3; size <= 12; size++) {
        for (let variant = 1; variant <= Math.floor(250 / 10); variant++) {
            games.push({
                id: `tic-tac-toe-${size}-${variant}`,
                title: `Tic-Tac-Toe ${size}x${size} v${variant}`,
                type: 'tic-tac-toe',
                params: { size: size },
                description: `${size}x${size} grid Tic-Tac-Toe`
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
    }

    // Rock Paper Scissors (250 variations)
    const rpsVariants = ['Classic', 'Best of 3', 'Best of 5', 'Timed', 'No Ties'];
    for (let i = 0; i < 250; i++) {
        const variant = rpsVariants[i % rpsVariants.length];
        games.push({
            id: `rps-${i}`,
            title: `Rock Paper Scissors - ${variant} #${Math.floor(i / rpsVariants.length) + 1}`,
            type: 'rps',
            params: { variant: variant },
            description: `Rock Paper Scissors with ${variant} rules`
        });
    }

    // Simple Quiz (250 variations)
    const topics = ['Math', 'Colors', 'Animals', 'Shapes'];
    for (let i = 0; i < 250; i++) {
        const topic = topics[i % topics.length];
        games.push({
            id: `quiz-${i}`,
            title: `${topic} Quiz #${Math.floor(i / topics.length) + 1}`,
            type: 'quiz',
            params: { topic: topic },
            description: `Simple ${topic.toLowerCase()} quiz`
        });
    } catch (error) {
        console.error('Failed to load ChickenKingsVault games:', error);
}

// Add UGS Games if available
@@ -102,6 +109,9 @@ function generateGames() {

// Sort games alphabetically by title for better variety and organization
games.sort((a, b) => a.title.localeCompare(b.title));
    
    // Update the game counter
    updateGameCounter();
}

// Render game library
@@ -152,6 +162,12 @@ function loadGame(game) {
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

@@ -231,14 +247,31 @@ saveBtn.addEventListener('click', () => {

// Initialize
loadSettings();
generateGames();
renderGameLibrary();
generateGames().then(() => {
    renderGameLibrary();
});

// Function to check and load UGS games
function checkAndLoadUGSGames() {
if (typeof files !== 'undefined' && Array.isArray(files) && files.length > 0) {
console.log('UGS games loaded:', files.length);
        generateGames();
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
@@ -573,4 +606,67 @@ function loadUGSGame(params) {
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
