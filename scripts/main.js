//importation des recettes depuis le dossier data
import { recipes } from "../data/recipes.js";

//importation des fonctions pour la création des éléments dans le DOM
import { CreateRecipeCard, CreateListOfTags } from "./elements.js";

//INGREDIENTS

//ajoute chaque ingrédients dans un tableau
let arrayOfIngredients = []; //déclare un tableau vide

//boucle chaque recette et ajoute chaque ingrédients dans le tableau défini
recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredients => {
        const ingredient = ingredients.ingredient

        //retire les caractères spéciaux
        ingredient.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        //envoi chaque ingrédients en minuscules dans le tableau
        arrayOfIngredients.push(ingredient.toLowerCase());
    })
});

//selectionne le tableau d'ingrédients et retire les doublons + dans l'ordre alpha
const cleanIngredientsList = [...new Set(arrayOfIngredients)].sort();

//appel la fonction de création de tag
CreateListOfTags('#ingredients_list', cleanIngredientsList, 'ingredientsTag');

//APPLIANCES

//ajoute chaque appareils dans un tableau
let arrayOfAppliances = []; //déclare un tableau vide

//boucle chaque recette et ajoute chaque appareils dans le tableau défini
recipes.forEach(recipe => {
    const appliance = recipe.appliance;

    //retire les caractères spéciaux
    appliance.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    //envoi chaque appareils en minuscules dans le tableau
    arrayOfAppliances.push(appliance.toLowerCase());
});

//selectionne le tableau d'appareils et retire les doublons + dans l'ordre alpha
const cleanAppliancesList = [...new Set(arrayOfAppliances)].sort();

//appel la fonction de création de tag
CreateListOfTags('#appliances_list', cleanAppliancesList, 'appliancesTag');

//USTENSILS

//ajoute chaque ustensiles dans un tableau
let arrayOfUstensils = []; //déclare un tableau vide

//boucle chaque recette et ajoute chaque ustensiles dans le tableau défini
recipes.forEach(recipe => {
    recipe.ustensils.forEach(ustensil => {
        //retire les caractères spéciaux
        ustensil.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        //envoi chaque ingrédients en minuscules dans le tableau
        arrayOfUstensils.push(ustensil.toLowerCase());
    })
});
//selectionne le tableau d'ustensiles et retire les doublons + dans l'ordre alpha
const cleanUstensilsList = [...new Set(arrayOfUstensils)].sort();


//appel la fonction de création de tag
CreateListOfTags('#ustensils_list', cleanUstensilsList, 'ustensilsTag');

//////////////////////////////////////////////////

//appel la fonction de création des recettes
CreateRecipeCard(recipes);


const dropDownFilters = () => {
    const filterButtons = document.querySelectorAll('.search_tags_form');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            //retire par défaut la class "button_active" sur tous les boutons
            filterButtons.forEach((btn) => {
                btn.classList.remove('button_active');
            });

            //si user clique sur le bouton entier
            if (event.target.classList.contains('search_tags_form')) {
                event.target.classList.add('button_active');
            }

            //si user clique sur l'input ou la liste  ul
            if (event.target.classList.contains('search_tags_form_input') || event.target.classList.contains('search_tags_form_tagslist')) {
                event.target.parentNode.classList.add('button_active');
            }

            //si user clique sur les li dans la liste ul
            if (event.target.querySelectorAll('li')) {
                event.target.parentNode.parentNode.classList.add('button_active');
            }

            //le chevron ferme le filtre si bouton contient button_active
            if (event.target.classList.contains('fa-chevron-down') && event.target.parentNode.classList.contains('button_active')) {
                event.target.parentNode.classList.remove('button_active');
            }
        });
    });
}

dropDownFilters();