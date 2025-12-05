// script.js

// Représentation de la grille 9x9 (0 = case vide)
const grilleDeDepart = [
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
//

//
const conteneurGrille = document.getElementById('sudoku-grid');

/**
 * Fonction pour parcourir le tableau 2D et créer les éléments <input> dans le DOM.
 */
function afficherGrille() {
    
    conteneurGrille.innerHTML = ''; 
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            

            const caseInput = document.createElement('input');
            caseInput.type = 'text';
            caseInput.maxLength = 1;
            caseInput.classList.add('sudoku-cell');

            const valeur = grilleDeDepart[r][c];
            if (valeur !== 0) {
                caseInput.value = valeur;
                caseInput.readOnly = true; 
                caseInput.classList.add('pre-rempli'); 
            }
            else {
                caseInput.value = ''; 
                caseInput.classList.add('vide');
            }
            conteneurGrille.appendChild(caseInput);
        }
    }
}
afficherGrille();

