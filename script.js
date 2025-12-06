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
/**
 * Vérifie qu'une ligne spécifique de la grille est valide.
 * @param {number[][]} grille - Le tableau 2D (9x9) de la grille de Sudoku.
 * @param {number} indexLigne - L'indice (de 0 à 8) de la ligne à vérifier.
 * @returns {boolean} True si la ligne est valide (pas de doublon de 1-9), False sinon.
 */
function verifierLigne(grille, indexLigne) {
    // 1. Extrait la ligne du tableau
    const ligne = grille[indexLigne];

    return verifierUnite(ligne);
}
/**
 * Vérifie qu'une colonne spécifique de la grille est valide.
 * @param {number[][]} grille - Le tableau 2D (9x9) de la grille de Sudoku.
 * @param {number} indexColonne - L'indice (de 0 à 8) de la colonne à vérifier.
 * @returns {boolean} True si la colonne est valide (pas de doublon de 1-9), False sinon.
 */
function verifierColonne(grille, indexColonne) {
    // 1. Extrait la colonne (parcours vertical du tableau)
    const colonne = [];
    
    // Parcourt les 9 lignes de la grille
    for (let i = 0; i < 9; i++) {
        colonne.push(grille[i][indexColonne]);
    }

    return verifierUnite(colonne);
}
/**
 * Vérifie qu'une région 3x3 est valide.
 * @param {number[][]} grille - Le tableau 2D (9x9) de la grille de Sudoku.
 * @param {number} startLigne - L'indice de LIGNE (0, 3 ou 6) du coin supérieur gauche de la région.
 * @param {number} startColonne - L'indice de COLONNE (0, 3 ou 6) du coin supérieur gauche de la région.
 * @returns {boolean} True si la région est valide, False sinon.
 */
function verifierRegion(grille, startLigne, startColonne) {
    // 1. Extrait les 9 cases de la région
    const region = [];
    
    // Parcourt les 3 lignes de la région (startLigne à startLigne + 2)
    for (let i = 0; i < 3; i++) {
        // Parcourt les 3 colonnes de la région (startColonne à startColonne + 2)
        for (let j = 0; j < 3; j++) {
            const valeur = grille[startLigne + i][startColonne + j];
            region.push(valeur);
        }
    }

    return verifierUnite(region);
}
/**
 * Vérifie si un tableau de 9 chiffres (unité) est valide.
 * @param {number[]} unite - Un tableau de 9 nombres (ligne, colonne ou région).
 * @returns {boolean} True si tous les chiffres non-zéro sont uniques, False sinon.
 */
function verifierUnite(unite) {
    // Crée un Set pour stocker les chiffres rencontrés. Les Set n'acceptent pas les doublons.
    const chiffresEnregistres = new Set(); 

    for (let i = 0; i < unite.length; i++) {
        const chiffre = unite[i];

        // Ignorer les cases vides (représentées par 0)
        if (chiffre !== 0) {
            // Si le chiffre est déjà dans le Set, c'est un doublon. L'unité est invalide.
            if (chiffresEnregistres.has(chiffre)) {
                return false;
            }
            // Sinon, ajouter le chiffre au Set
            chiffresEnregistres.add(chiffre);
        }
    }

    // Si nous avons parcouru toute l'unité sans trouver de doublons, elle est valide.
    return true;
}
/**
 * Vérifie si la grille de Sudoku est entièrement valide (toutes les lignes,
 * colonnes et régions 3x3 sont valides).
 * @param {number[][]} grille - Le tableau 2D (9x9) de la grille de Sudoku.
 * @returns {boolean} True si la grille est entièrement valide, False sinon.
 */
function verifierGrilleComplete(grille) {
    // Le nombre d'unités à vérifier dans chaque dimension
    const TAILLE = 9;

    // 1. Vérifie les 9 lignes et les 9 colonnes
    for (let i = 0; i < TAILLE; i++) {
        // Si une ligne est invalide, on arrête et retourne False
        if (!verifierLigne(grille, i)) {
            console.log(`Erreur: Doublon trouvé dans la ligne ${i + 1}`);
            return false;
        }

        // Si une colonne est invalide, on arrête et retourne False
        if (!verifierColonne(grille, i)) {
            console.log(`Erreur: Doublon trouvé dans la colonne ${i + 1}`);
            return false;
        }
    }

    // 2. Vérifie les 9 régions 3x3
    // Les points de départ (startLigne et startColonne) sont 0, 3 et 6.
    for (let i = 0; i < TAILLE; i += 3) {
        for (let j = 0; j < TAILLE; j += 3) {
            // Si une région est invalide, on arrête et retourne False
            if (!verifierRegion(grille, i, j)) {
                console.log(`Erreur: Doublon trouvé dans la région commençant à (${i}, ${j})`);
                return false;
            }
        }
    }

    // 3. Si toutes les 27 vérifications sont passées, la grille est valide.
    return true;
}
// Récupérer la fonction que vous avez créée dans la Mission 2.2
// function recupererGrilleJoueur() { ... } 

document.addEventListener('DOMContentLoaded', () => {
    const boutonVerification = document.getElementById('verifier-solution');
    const messageFeedback = document.getElementById('message-feedback');

    if (boutonVerification) {
        boutonVerification.addEventListener('click', gererVerificationSudoku);
    }

    function gererVerificationSudoku() {
        // A. Récupérer la grille joueur
        const grilleJoueur = recupererGrilleJoueur(); 
        
        // B. Lancer la vérification complète
        const estValide = verifierGrilleComplete(grilleJoueur);

        // C. Afficher un message de victoire ou d'erreur
        if (estValide) {
            // Optionnel : Vérifier si la grille est aussi complète (pas de 0) pour la victoire finale
            const estComplete = grilleJoueur.flat().every(val => val !== 0);

            if (estComplete) {
                messageFeedback.textContent = "🥳 FÉLICITATIONS ! La grille est correcte et complète ! Vous avez gagné !";
                messageFeedback.style.color = 'green';
            } else {
                messageFeedback.textContent = "✅ La grille est valide pour l'instant, mais il reste des cases à remplir.";
                messageFeedback.style.color = 'blue';
            }
        } else {
            messageFeedback.textContent = "❌ Erreur de Sudoku détectée ! Vérifiez vos doublons (ligne, colonne ou région).";
            messageFeedback.style.color = 'red';
        }
    }
});