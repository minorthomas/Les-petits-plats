//importation des recettes depuis le dossier data
import { recipes } from "../data/recipes.js";

//importation des fonctions pour la création des éléments dans le DOM
import { CreateRecipeCard } from "./elements.js";

CreateRecipeCard(recipes);
