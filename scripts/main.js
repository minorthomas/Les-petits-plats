//importation des recettes depuis le dossier data
import { recipes } from "../data/recipes.js";

//importation des fonctions pour la création des éléments dans le DOM
import { CreateRecipeCard, CreateListOfTags, CreateTags } from "./elements.js";

//importation des fonctions support
import { normalize, inputSearchTagList, recipeNotFound, updateTagsLists, displayRecipes } from "./othersFunctions.js";

/*INGREDIENTS
*********************************/

let arrayOfIngredients = [];

//boucle chaque recette et ajoute chaque ingrédients dans le tableau défini
recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredients => {
        const ingredient = ingredients.ingredient

        arrayOfIngredients.push(ingredient.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
    })
});

//selectionne le tableau d'ingrédients et retire les doublons + dans l'ordre alpha
const cleanIngredientsList = [...new Set(arrayOfIngredients)].sort();
CreateListOfTags('#ingredients_list', cleanIngredientsList, 'ingredientsTag');

/*APPLIANCES
***************************************/

//ajoute chaque appareils dans un tableau
let arrayOfAppliances = []; //déclare un tableau vide

//boucle chaque recette et ajoute chaque appareils dans le tableau défini
recipes.forEach(recipe => {
    const appliance = recipe.appliance;

    //envoi chaque appareils en minuscules et sans caracteres speciaux dans le tableau
    arrayOfAppliances.push(appliance.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
});

//selectionne le tableau d'appareils et retire les doublons + dans l'ordre alpha
const cleanAppliancesList = [...new Set(arrayOfAppliances)].sort();
CreateListOfTags('#appliances_list', cleanAppliancesList, 'appliancesTag');

/*USTENSILS
*************************************/

//ajoute chaque ustensiles dans un tableau
let arrayOfUstensils = []; //déclare un tableau vide

//boucle chaque recette et ajoute chaque ustensiles dans le tableau défini
recipes.forEach(recipe => {
    recipe.ustensils.forEach(ustensil => {
        //envoi chaque ingrédients en minuscules et sans caracteres speciaux  dans le tableau
        arrayOfUstensils.push(ustensil.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
    })
});
//selectionne le tableau d'ustensiles et retire les doublons + dans l'ordre alpha
const cleanUstensilsList = [...new Set(arrayOfUstensils)].sort();
CreateListOfTags('#ustensils_list', cleanUstensilsList, 'ustensilsTag');

//fonction change placeholder si filtre est ouvert ou fermé
const changeInputPlaceholder = () => {
    //placeholder ingredients
    const ingredientsInput = document.querySelector('#ingredients_input');

    if (ingredientsInput.parentNode.classList.contains('button_active')) {
        ingredientsInput.placeholder = 'Rechercher un ingrédient';
    } else {
        ingredientsInput.placeholder = 'Ingrédients';
    }

    //placeholder appareils
    const appliancesInput = document.querySelector('#appliances_input');

    if (appliancesInput.parentNode.classList.contains('button_active')) {
        appliancesInput.placeholder = 'Rechercher un appareil';
    } else {
        appliancesInput.placeholder = 'Appareils';
    }

    //placeholder ustensiles
    const ustensilsInput = document.querySelector('#ustensils_input');

    if (ustensilsInput.parentNode.classList.contains('button_active')) {
        ustensilsInput.placeholder = 'Rechercher un ustensile';
    } else {
        ustensilsInput.placeholder = 'Ustensiles';
    }
}

//fonction ouvre ou ferme les filtres
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
            if (event.target.classList.contains('fa-chevron-down')) {
                event.target.parentNode.classList.remove('button_active');
            }

            changeInputPlaceholder();
        });
    });
}

//function de recherche tag par input, appel la fonction inputSearchTagList
const searchTagsInput = () => {
    const inputs = document.querySelectorAll('.search_tags_form_input');

    inputs.forEach((input) => {
        input.addEventListener('click', (event) => {
            event.preventDefault();

            inputSearchTagList(event.target.id, event.target.parentNode.lastChild.previousSibling.id)
        })
    })
}

const removeSelectedTag = () => {
    const closeSelectedTagIcon = document.querySelectorAll('.fa-circle-xmark');

    closeSelectedTagIcon.forEach((icon) => {
        icon.addEventListener('click', (event) => {
            event.target.parentNode.remove();
            let tagToRemove = event.target.previousElementSibling.textContent;

            let tagIndex = tagListArray.map(function (item) {
                return item.itemSelected;
            }).indexOf(tagToRemove);

            if (tagIndex !== -1) tagListArray.splice(tagIndex, 1);

            if (sortedrecipesLeftArray.length < 1) {
                filterRecipes(tagListArray, recipes);
            } else {
                filterRecipes(tagListArray, sortedrecipesLeftArray);
            }
        });
    });
}

//fonction ajoute taglist et remove du dom et du tableau + filtres les recettes by tags
const tagsList = document.querySelectorAll('.tag');

let tagListArray = [];

tagsList.forEach((item) => {
    item.addEventListener('click', (event) => {
        const tagSelected = event.target.textContent.toLowerCase();

        const tagType = event.target.getAttribute("data-list");
        let tag = { itemSelected: tagSelected, itemType: tagType };
        tagListArray.push(tag);

        CreateTags(tagSelected, tagType);
        removeSelectedTag();

        if (sortedrecipesLeftArray.length < 1) {
            filterRecipes(tagListArray, recipes);
        } else {
            filterRecipes(tagListArray, sortedrecipesLeftArray);
        }
    });
});

/*recherche input principal
******************************************/

const searchNavigationInput = document.querySelector('#searchbar');
let sortedrecipesLeftArray = [];

searchNavigationInput.addEventListener("input", (event) => {
    let recipesLeftArray = [];
    let NormalizedInput = normalize(event.target.value.trim());
    let errorMessage = document.querySelector('#recipe_error');

    if (errorMessage) {
        errorMessage.remove();
    }

    if (NormalizedInput.length >= 3) {
        //speedtest start
        console.time();

        recipes.forEach((recipe) => {
            let NormalizedRecipeName = normalize(recipe.name);
            let NormalizedDescription = normalize(recipe.description);

            if (NormalizedRecipeName.includes(NormalizedInput) || NormalizedDescription.includes(NormalizedInput)) {
                recipesLeftArray.push(recipe);
            } else {
                recipe.ingredients.forEach((item) => {
                    let NormalizedIngredient = normalize(item.ingredient);
                    if (NormalizedIngredient.includes(NormalizedInput)) {
                        recipesLeftArray.push(recipe);
                    }
                });
            }
            //speedtest end    
            console.timeEnd();
        });

        if (recipesLeftArray.length < 1) {
            recipeNotFound();
        }

        sortedrecipesLeftArray = [...new Set(recipesLeftArray)];
    }

    if (NormalizedInput.length < 3) {
        sortedrecipesLeftArray = recipes;
    }

    if (tagListArray.length < 1) {
        updateTagsLists(sortedrecipesLeftArray);
        displayRecipes(sortedrecipesLeftArray);
    } else {
        filterRecipes(tagListArray, sortedrecipesLeftArray);
    }
});

/*Filtres les recettes
****************************************/

const filterRecipes = (tagListArray, RecipeArray) => {
    let errorMessage = document.querySelector('#recipe_error');
    if (errorMessage) {
        errorMessage.remove();
    }
    tagListArray.forEach((tagItem) => {
        console.log(tagItem.itemSelected);
        switch (tagItem.itemType) {
            case 'ingredientsTag':
                RecipeArray = RecipeArray.filter(recipe => recipe.ingredients.some(i => i.ingredient.toLowerCase() === tagItem.itemSelected));
                break;

            case 'appliancesTag':
                RecipeArray = RecipeArray.filter(recipe => recipe.appliance.toLowerCase() === tagItem.itemSelected);
                break;

            case 'ustensilsTag':
                RecipeArray = RecipeArray.filter(recipe => recipe.ustensils.indexOf(tagItem.itemSelected) > -1);
                break;

            default: console.log('Aucun tag de ce type');
        }
    });
    if (RecipeArray.length < 1) {
        recipeNotFound();
    };

    updateTagsLists(RecipeArray);
    displayRecipes(RecipeArray);
    console.log(RecipeArray);
};

//initialise toutes les fonctions
const init = () => {
    CreateRecipeCard(recipes);
    dropDownFilters();
    searchTagsInput();
}

init();