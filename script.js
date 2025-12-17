const initialGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const gridContainer = document.getElementById('sudoku-grid');
const messageElement = document.getElementById('message');
let currentGrid = JSON.parse(JSON.stringify(initialGrid)); 


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
                
                
                input.addEventListener('input', function() {
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
            if (seen.has(num)) {
                return false; 
            }
            seen.add(num);
        }
        return true;
    };
    
    let isCorrect = true;
    
    
    for (let r = 0; r < 9; r++) {
        if (!isValidArray(currentGrid[r])) {
            isCorrect = false;
            
            for (let c = 0; c < 9; c++) {
                if (currentGrid[r][c] !== 0) {
                     const inputElement = document.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
                     if (inputElement) {
                         inputElement.parentElement.classList.add('error');
                     }
                }
            }
        }
    }

    
    for (let c = 0; c < 9; c++) {
        const col = currentGrid.map(row => row[c]);
        if (!isValidArray(col)) {
            isCorrect = false;
           
            for (let r = 0; r < 9; r++) {
                if (currentGrid[r][c] !== 0) {
                     const inputElement = document.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
                     if (inputElement) {
                         inputElement.parentElement.classList.add('error');
                     }
                }
            }
        }
    }
    
    
    for (let blockR = 0; blockR < 9; blockR += 3) {
        for (let blockC = 0; blockC < 9; blockC += 3) {
            const region = [];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    region.push(currentGrid[blockR + r][blockC + c]);
                }
            }
            if (!isValidArray(region)) {
                isCorrect = false;
                
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        if (currentGrid[blockR + r][blockC + c] !== 0) {
                             const inputElement = document.querySelector(`input[data-row="${blockR + r}"][data-col="${blockC + c}"]`);
                             if (inputElement) {
                                 inputElement.parentElement.classList.add('error');
                             }
                        }
                    }
                }
            }
        }
    }

    
    if (isComplete && isCorrect) {
        messageElement.textContent = "🥳 Félicitations ! La solution est correcte !";
        messageElement.classList.add('success');
    } else if (isComplete && !isCorrect) {
        messageElement.textContent = "❌ Erreur : La grille est pleine, mais elle contient des erreurs (cases en rouge).";
        messageElement.classList.remove('success');
    } else if (!isComplete && isCorrect) {
        messageElement.textContent = "✅ La partie remplie est correcte. Continuez !";
        messageElement.classList.add('success');
    } else {
        messageElement.textContent = "⚠️ Il y a des erreurs dans votre grille (cases en rouge) et il reste des cases à remplir.";
        messageElement.classList.remove('success');
    }
}

function resetGrid() {
    currentGrid = JSON.parse(JSON.stringify(initialGrid));
    renderGrid(currentGrid);
    messageElement.textContent = "";
    messageElement.classList.remove('success');
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('error'));
}

// Fonction pour vérifier si un nombre peut être placé à une position donnée
function isValid(grid, row, col, num) {
    // Vérifier la ligne
    for (let c = 0; c < 9; c++) {
        if (grid[row][c] === num) return false;
    }
    
    // Vérifier la colonne
    for (let r = 0; r < 9; r++) {
        if (grid[r][col] === num) return false;
    }
    
    // Vérifier la région 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (grid[r][c] === num) return false;
        }
    }
    
    return true;
}

// Fonction de résolution du Sudoku avec backtracking
function solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        
                        if (solveSudoku(grid)) {
                            return true;
                        }
                        
                        grid[row][col] = 0; // Backtrack
                    }
                }
                return false; // Aucun nombre valide trouvé
            }
        }
    }
    return true; // Grille complète
}

// Fonction pour afficher la solution
function showSolution() {
    // Créer une copie de la grille initiale pour résoudre
    const solutionGrid = JSON.parse(JSON.stringify(initialGrid));
    
    if (solveSudoku(solutionGrid)) {
        // Mettre à jour currentGrid avec la solution
        currentGrid = solutionGrid;
        renderGrid(currentGrid);
        messageElement.textContent = "💡 Voici la solution complète !";
        messageElement.classList.add('success');
        document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('error'));
    } else {
        messageElement.textContent = "❌ Impossible de résoudre cette grille.";
        messageElement.classList.remove('success');
    }
}



// Gestion du thème sombre
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Vérifier si un thème est sauvegardé dans le localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderGrid(initialGrid);
    document.getElementById('check-btn').addEventListener('click', checkSolution);
    document.getElementById('reset-btn').addEventListener('click', resetGrid);
    document.getElementById('solution-btn').addEventListener('click', showSolution);
    initTheme();
});