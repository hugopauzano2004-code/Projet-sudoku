// ======================================================================
//                       GENERATEUR DE SUDOKU
// ======================================================================

// Vérifie si un nombre peut être placé dans une case
function isValid(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    let br = row - row % 3;
    let bc = col - col % 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (grid[br + r][bc + c] === num) return false;
        }
    }
    return true;
}

// Remplit entièrement une grille (Sudoku complet)
function generateFullGrid() {
    let grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    function fill() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) {
                    const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
                    for (let num of nums) {
                        if (isValid(grid, r, c, num)) {
                            grid[r][c] = num;
                            if (fill()) return true;
                            grid[r][c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    fill();
    return grid;
}

// Clone
function clone(g) {
    return g.map(row => [...row]);
}

// Compte les solutions (max 2)
function countSolutions(grid) {
    let count = 0;

    function solve(g) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (g[r][c] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(g, r, c, num)) {
                            g[r][c] = num;
                            solve(g);
                            g[r][c] = 0;
                        }
                    }
                    return;
                }
            }
        }
        count++;
    }

    solve(clone(grid));
    return count;
}

// Génère une grille jouable
function generateSudoku() {
    let grid = generateFullGrid();
    let attempts = 45;

    while (attempts > 0) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);

        if (grid[r][c] !== 0) {
            let backup = grid[r][c];
            grid[r][c] = 0;

            if (countSolutions(clone(grid)) !== 1) {
                grid[r][c] = backup;
                attempts--;
            }
        }
    }

    return grid;
}

// ======================================================================
//                       RENDU ET LOGIQUE DE JEU
// ======================================================================

let initialGrid = generateSudoku();
let currentGrid = JSON.parse(JSON.stringify(initialGrid));

const gridContainer = document.getElementById('sudoku-grid');
const messageElement = document.getElementById('message');
const themeBtn = document.getElementById('theme-btn'); 

function renderGrid(grid) {
    gridContainer.innerHTML = '';

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const value = grid[r][c];

            if (value !== 0) {
                cell.textContent = value;
                cell.classList.add('fixed');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = r;
                input.dataset.col = c;

                input.addEventListener('input', function () {
                    // Nettoyage de l'entrée: seulement des chiffres de 1 à 9
                    this.value = this.value.replace(/[^1-9]/g, '');
                    currentGrid[r][c] = parseInt(this.value) || 0;

                    if (this.parentElement.classList.contains('error')) {
                        this.parentElement.classList.remove('error');
                    }
                });

                cell.appendChild(input);
            }
            gridContainer.appendChild(cell);
        }
    }
}

function checkSolution() {
    messageElement.textContent = '';
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('error'));

    let isComplete = true;

    const isValidArray = (arr) => {
        const seen = new Set();
        for (const num of arr) {
            if (num === 0) {
                isComplete = false;
                continue;
            }
            if (seen.has(num)) return false;
            seen.add(num);
        }
        return true;
    };

    let isCorrect = true;

    // Vérification lignes, colonnes et blocs
    
    // Vérification lignes
    for (let r = 0; r < 9; r++) {
        if (!isValidArray(currentGrid[r])) isCorrect = false;
    }

    // Vérification colonnes
    for (let c = 0; c < 9; c++) {
        const column = currentGrid.map(row => row[c]);
        if (!isValidArray(column)) isCorrect = false;
    }

    // Vérification blocs
    for (let br = 0; br < 9; br += 3) {
        for (let bc = 0; bc < 9; bc += 3) {
            const block = [];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    block.push(currentGrid[br + r][bc + c]);
                }
            }
            if (!isValidArray(block)) isCorrect = false;
        }
    }
    
    // Messages
    if (isComplete && isCorrect) {
        messageElement.textContent = "🥳 Félicitations ! La solution est correcte !";
    } else if (isComplete && !isCorrect) {
        messageElement.textContent = "❌ La grille est pleine mais contient des erreurs.";
    } else if (!isComplete && isCorrect) {
        messageElement.textContent = "👍 Tout est correct pour l’instant, continuez !";
    } else {
        messageElement.textContent = "⚠️ Erreurs détectées dans la grille.";
    }
}


function resetGrid() {
    currentGrid = JSON.parse(JSON.stringify(initialGrid));
    renderGrid(currentGrid);
    messageElement.textContent = "";
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('error'));
}

function newGrid() {
    initialGrid = generateSudoku();
    resetGrid();
}

// ======================================================================
//                    EVENEMENTS & GESTION DU THÈME
// ======================================================================

function updateThemeButtonText() {
    // Si la classe 'dark' est présente (Thème Cyber Futur)
    if (document.body.classList.contains('dark')) {
        themeBtn.textContent = "☀️ Thème Vacances"; 
    } else {
        // Si la classe 'dark' n'est pas présente (Thème Vacances)
        themeBtn.textContent = "👾 Thème Cyber Futur"; 
    }
}

themeBtn.addEventListener('click', () => {
    // Bascule la classe 'dark' (SYNCHRONISATION CSS/JS CORRIGÉE)
    document.body.classList.toggle('dark');
    updateThemeButtonText(); 
});


document.addEventListener('DOMContentLoaded', () => {
    renderGrid(initialGrid);

    document.getElementById('check-btn').addEventListener('click', checkSolution);
    document.getElementById('reset-btn').addEventListener('click', resetGrid);
    document.getElementById('new-grid-btn').addEventListener('click', newGrid);
    
    // Synchronise le texte du bouton au chargement initial
    updateThemeButtonText();
});