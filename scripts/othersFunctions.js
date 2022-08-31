//importation des recettes depuis le dossier data
import { recipes } from "../data/recipes.js";

export const normalize = (text) => {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
};

//fonction de recherche par input pour les tags
export const inputSearchTagList = (category, categoryListId) => {
    const filter = document.getElementById(category);

    //Chaque entrée utilisateur appel la fonction de filtres
    filter.addEventListener("keyup", function () {
        FilterFunction();
    });

    //cherche si l'input utilisateur match avec un tag
    const FilterFunction = () => {
        const input = document.getElementById(category);
        const inputValue = input.value.toUpperCase().trim();
        const listOfTags = document.getElementById(categoryListId);
        const list = listOfTags.getElementsByTagName("li");
        for (let i = 0; i < list.length; i++) {
            let txtValue = list[i].textContent || list[i].innerText;
            if (txtValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().indexOf(inputValue) > -1) {
                list[i].style.display = "";
            } else {
                list[i].style.display = "none";
            }
        }
    }
};

//fonction display un message d'erreur si aucune recette ne correspond
export const recipeNotFound = () => {
    const recipeContainer = document.querySelector('.recipe');
    recipeContainer.insertAdjacentHTML("afterbegin", `<div id="recipe_error">Aucune recette ne correspond à votre critère… vous pouvez
    chercher « tarte aux pommes », « poisson », etc.</div>`);
};

//fonction display un message d'erreur si aucun tag ne correspond
const tagNotFound = (id) => {
    const dropdownList = document.querySelector(id);
    switch (id) {
        case '#ingredients_list': dropdownList.insertAdjacentHTML("afterbegin", `<div class="search_tags_form_tagslist_error">Aucun ingrédient disponible...</div>`); break;
        case '#appliances_list': dropdownList.insertAdjacentHTML("afterbegin", `<div class="search_tags_form_tagslist_error">Aucun appareil disponible...</div>`); break;
        case '#ustensils_list': dropdownList.insertAdjacentHTML("afterbegin", `<div class="search_tags_form_tagslist_error">Aucun ustensile disponible...</div>`); break;
        default: console.log('Error: No lists found in the DOM');;
    };
}

//fonction vérifie si il n'y a plus de tag dispo, si oui affiche le message d'err
const isTagLeft = () => {
    let tagNotFoundMessage = document.querySelectorAll('.search_tags_form_tagslist_error');
    if (tagNotFoundMessage) {
        tagNotFoundMessage.forEach((error) => {
            error.remove();
        });
    }

    //check si la liste des ingredients est égale à la liste des ingredients cachés === renvoi tagNotFound
    const selectAllIngredients = document.querySelectorAll("[data-list ='ingredientsTag']");
    const selectHiddenIngredients = document.querySelector('#ingredients_list').getElementsByClassName('hide');
    if (selectAllIngredients.length === selectHiddenIngredients.length) {
        tagNotFound('#ingredients_list');
    }

    //check si la liste des appareils est égale à la liste des appareils cachés === renvoi tagNotFound
    const selectAllAppliances = document.querySelectorAll("[data-list ='appliancesTag']");
    const selectHiddenAppliances = document.querySelector('#appliances_list').getElementsByClassName('hide');
    if (selectAllAppliances.length === selectHiddenAppliances.length) {
        tagNotFound('#appliances_list');
    }

    //check si la liste des ustensiles est égale à la liste des ustensiles cachés === renvoi tagNotFound
    const selectAllUstensils = document.querySelectorAll("[data-list ='ustensilsTag']");
    const selectHiddenUstensils = document.querySelector('#ustensils_list').getElementsByClassName('hide');
    if (selectAllUstensils.length === selectHiddenUstensils.length) {
        tagNotFound('#ustensils_list');
    }
};


const RemoveDuplicatesTags = () => {
    const tagAlreadySelectedList = document.querySelectorAll('.search_selectedtags_tag');
    const tagList = document.querySelectorAll('.tag');
    tagAlreadySelectedList.forEach((tag) => {
        tagList.forEach((item) => {
            if (item.innerHTML === tag.textContent.trim()) {
                item.classList.add("hide");
            }
        });
    });
    isTagLeft();
};


export const updateTagsLists = (recipesArray) => {
    const tagList = document.querySelectorAll('.tag');
    tagList.forEach((item) => {
        item.classList.add('hide');
    });
    tagList.forEach((tag) => {
        let normalizedTag = normalize(tag.innerHTML);
        recipesArray.forEach((recipe) => {
            recipe.ingredients.forEach((items) => {
                let NormalizedIngredient = normalize(items.ingredient);
                if (normalizedTag === NormalizedIngredient) {
                    tag.classList.remove("hide");
                }
            });
            let Normalizedappliance = normalize(recipe.appliance);
            if (normalizedTag === Normalizedappliance) {
                tag.classList.remove("hide");
            }
            recipe.ustensils.forEach((item) => {
                let NormalizedUstensil = normalize(item);
                if (normalizedTag === NormalizedUstensil) {
                    tag.classList.remove("hide");
                }
            });
        });
    });
    RemoveDuplicatesTags();
};

// DISPLAYS RECIPES

export const displayRecipes = (RecipesArray) => {
    const allRecipes = document.getElementsByTagName('article');

    for (let i = 0; i < recipes.length; i++) {
        let showRecipe = false;
        RecipesArray.forEach((item) => {
            if (recipes[i].name == item.name) {
                showRecipe = true;
            }
        });
        if (showRecipe) {
            allRecipes[i].style.display = 'flex';
        } else {
            allRecipes[i].style.display = 'none';
        }
    }
};