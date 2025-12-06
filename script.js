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
const conteneurGrille = document.getElementById('sudoku-grid');
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
/**
 * Parcourt tous les inputs de la grille, reconstruit et retourne
 * un tableau 2D (9x9) des valeurs saisies par l'utilisateur.
 * Une case vide sera représentée par 0 (ou null, selon votre choix).
 * @returns {number[][]} La grille 9x9 des valeurs.
 */
function recupererGrilleJoueur() {
    // 1. Parcourir tous les inputs du DOM (ceux de la grille)
    const inputs = document.querySelectorAll('.sudoku-grid .cell');
    const grille = [];
    let ligne = [];

    inputs.forEach((input, index) => {
        // Obtenir la valeur. Le "+" convertit la chaîne en nombre (ou NaN si vide)
        let valeur = parseInt(input.value) || 0; // Utiliser 0 pour les cases vides

        ligne.push(valeur);

        // 2. Reconstruire un tableau 2D (9x9)
        // Changer de ligne après chaque groupe de 9 cellules
        if ((index + 1) % 9 === 0) {
            grille.push(ligne);
            ligne = [];
        }
    });

    // 3. Retourner ce tableau
    return grille;
}
document.querySelectorAll('.sudoku-grid .cell:not(.initial)').forEach(cell => {
    cell.addEventListener('input', validerEntree);
});
/**
 * Gère et valide la saisie de l'utilisateur sur une cellule.
 * Empêche les caractères non numériques et limite les valeurs entre 1 et 9.
 * @param {Event} event L'événement 'input'.
 */
function validerEntree(event) {
    let input = event.target;
    let valeur = input.value;

    // 1. Empêcher la saisie de caractères non numériques (Garder seulement les chiffres)
    // Et filtrer les entrées pour ne garder que le premier chiffre valide
    valeur = valeur.replace(/[^1-9]/g, '');

    // 2. Limiter les valeurs entre 1 et 9 inclus
    // Si l'utilisateur a saisi plus d'un caractère, on ne garde que le premier.
    if (valeur.length > 1) {
        valeur = valeur.charAt(0);
    }
    
    // Mettre à jour la valeur de l'input
    input.value = valeur;
    
    // (Optionnel) Si l'entrée est valide, vous pouvez déclencher ici 
    // une vérification visuelle (ex: changer la couleur si la case est déjà correcte).
}
