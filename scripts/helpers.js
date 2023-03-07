import { recipes } from "../data/recipes.js";

/**
 *
 * @param {String} text
 * @returns
 */
export const normalize = (text) => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
};

/**
 *
 * @param {String} category
 * @param {String} categoryListId
 */
export const inputSearchTagList = (category, categoryListId) => {
    const filter = document.getElementById(category);
    filter.addEventListener("keyup", function () {
        FilterFunction();
    });
    const FilterFunction = () => {
        const input = document.getElementById(category);
        const inputValue = input.value.toUpperCase().trim();
        const listOfTags = document.getElementById(categoryListId);
        const list = listOfTags.getElementsByTagName("li");
        for (let i = 0; i < list.length; i++) {
            let txtValue = list[i].textContent || list[i].innerText;
            if (
                txtValue
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toUpperCase()
                    .indexOf(inputValue) > -1
            ) {
                list[i].style.display = "";
            } else {
                list[i].style.display = "none";
            }
        }
    };
};

export const recipeNotFound = () => {
    const recipeContainer = document.querySelector(".recipe");
    recipeContainer.insertAdjacentHTML(
        "afterbegin",
        `<div id="recipe_error">Aucune recette ne correspond à votre critère… vous pouvez
    chercher « tarte aux pommes », « poisson », etc.</div>`
    );
};

/**
 * 
 * @param {*} id 
 */
const tagNotFound = (id) => {
    const dropdownList = document.querySelector(id);
    switch (id) {
        case "#ingredients_list":
            dropdownList.insertAdjacentHTML(
                "afterbegin",
                `<div class="search_tags_form_tagslist_error">Aucun ingrédient disponible...</div>`
            );
            break;
        case "#appliances_list":
            dropdownList.insertAdjacentHTML(
                "afterbegin",
                `<div class="search_tags_form_tagslist_error">Aucun appareil disponible...</div>`
            );
            break;
        case "#ustensils_list":
            dropdownList.insertAdjacentHTML(
                "afterbegin",
                `<div class="search_tags_form_tagslist_error">Aucun ustensile disponible...</div>`
            );
            break;
        default:
            console.log("Error: No lists found in the DOM");
    }
};


const isTagLeft = () => {
    let tagNotFoundMessage = document.querySelectorAll(
        ".search_tags_form_tagslist_error"
    );
    if (tagNotFoundMessage) {
        tagNotFoundMessage.forEach((error) => {
            error.remove();
        });
    }
    const selectAllIngredients = document.querySelectorAll(
        "[data-list ='ingredientsTag']"
    );

    const selectHiddenIngredients = document
        .querySelector("#ingredients_list")
        .getElementsByClassName("hide");
    if (selectAllIngredients.length === selectHiddenIngredients.length) {
        tagNotFound("#ingredients_list");
    }

    const selectAllAppliances = document.querySelectorAll(
        "[data-list ='appliancesTag']"
    );
    const selectHiddenAppliances = document
        .querySelector("#appliances_list")
        .getElementsByClassName("hide");
    if (selectAllAppliances.length === selectHiddenAppliances.length) {
        tagNotFound("#appliances_list");
    }

    const selectAllUstensils = document.querySelectorAll(
        "[data-list ='ustensilsTag']"
    );
    const selectHiddenUstensils = document
        .querySelector("#ustensils_list")
        .getElementsByClassName("hide");
    if (selectAllUstensils.length === selectHiddenUstensils.length) {
        tagNotFound("#ustensils_list");
    }
};

const RemoveDuplicatesTags = () => {
    const tagAlreadySelectedList = document.querySelectorAll(
        ".search_selectedtags_tag"
    );
    const tagList = document.querySelectorAll(".tag");
    tagAlreadySelectedList.forEach((tag) => {
        tagList.forEach((item) => {
            if (item.innerHTML === tag.textContent.trim()) {
                item.classList.add("hide");
            }
        });
    });
    isTagLeft();
};

/**
 * 
 * @param {Array} recipesArray 
 */
export const updateTagsLists = (recipesArray) => {
    const tagList = document.querySelectorAll(".tag");
    tagList.forEach((item) => {
        item.classList.add("hide");
    });
    console.log(recipes);
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

/**
 * 
 * @param {Array} RecipesArray 
 */
export const displayRecipes = (RecipesArray) => {
    const allRecipes = document.getElementsByTagName("article");
    for (let i = 0; i < recipes.length; i++) {
        let showRecipe = false;
        RecipesArray.forEach((item) => {
            if (recipes[i].name == item.name) {
                showRecipe = true;
            }
        });
        if (showRecipe) {
            allRecipes[i].style.display = "flex";
        } else {
            allRecipes[i].style.display = "none";
        }
    }
};
