# Untitled

A smooth, modern gaming website with over 1000+ procedurally generated games, featuring a polished UI and customizable settings.

## Features

- **1000+ Games**: Procedurally generated variations of classic games
  - 250+ Number Guessing games (ranges from 1-4 to 1-1000)
  - 250+ Tic-Tac-Toe games (board sizes 3x3 to 12x12)
  - 250+ Rock Paper Scissors games (different rule variants)
  - 250+ Quiz games (on Math, Colors, Animals, Shapes)
- **UGS Games**: Full collection of Ultimate Game Stash HTML5 games (thousands more!)
- **Smooth UI**: Modern design with animations, transitions, and responsive layout
- **Settings Panel**: Customize theme (light/dark), sound, default game settings, and animations
- **Search Functionality**: Find games quickly by title or description
- **Persistent Settings**: Settings saved in browser localStorage

## Game Categories

### Number Guessing
Guess numbers in ranges from 1-4 up to 1-1000.

### Tic-Tac-Toe
Play on grids from 3x3 up to 12x12, with 3-in-a-row winning condition.

### Rock Paper Scissors
Classic game with variations like Best of 3, Best of 5, etc.

### Quizzes
Simple quizzes on Math, Colors, Animals, and Shapes.

### UGS Games
Thousands of HTML5 games from the Ultimate Game Stash collection, including popular titles like Portal, PvZ, Minecraft, and many more.

## Settings

Access settings via the gear icon in the header:
- **Theme**: Switch between light and dark modes
- **Sound Effects**: Toggle sound (currently placeholder)
- **Default Tic-Tac-Toe Size**: Set preferred board size
- **Animations**: Enable/disable UI animations

## Usage

1. Open `index.html` in your web browser.
2. Click the settings icon to customize your experience.
3. Browse the game library or use the search bar.
4. Click on any game card to play.
5. Use the "Back" button to return to the library.

## Files

- `index.html`: Main webpage with game library, settings modal, and play area
- `style.css`: Modern CSS with smooth transitions, dark mode, and responsive design
- `script.js`: Game generation, library management, settings handling, and game logic

## Technical Details

- **Animations**: CSS transitions and keyframes for smooth interactions
- **Themes**: Dynamic class switching for light/dark modes
- **Settings Persistence**: localStorage for user preferences
- **Responsive Design**: Grid layout adapts to screen sizes
- **Performance**: Staggered animations and efficient DOM manipulation

## Security

This website contains no external scripts, dependencies, or network calls. All games are implemented in pure JavaScript and run entirely client-side. Settings are stored locally in the browser.
- Games reset automatically when switching between them