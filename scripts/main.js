import { recipes } from "../data/recipes.js";
import { CreateRecipeCard, CreateListOfTags, CreateTags } from "./elements.js";
import {
    normalize,
    inputSearchTagList,
    recipeNotFound,
    updateTagsLists,
    displayRecipes,
} from "./helpers.js";

/*INGREDIENTS
 *********************************/
let arrayOfIngredients = [];
recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredients) => {
        const ingredient = ingredients.ingredient;

        arrayOfIngredients.push(
            ingredient
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
        );
    });
});
const cleanIngredientsList = [...new Set(arrayOfIngredients)].sort();
CreateListOfTags("#ingredients_list", cleanIngredientsList, "ingredientsTag");

/*APPLIANCES
 ***************************************/
let arrayOfAppliances = [];
recipes.forEach((recipe) => {
    const appliance = recipe.appliance;
    arrayOfAppliances.push(
        appliance
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
    );
});
const cleanAppliancesList = [...new Set(arrayOfAppliances)].sort();
CreateListOfTags("#appliances_list", cleanAppliancesList, "appliancesTag");

/*USTENSILS
 *************************************/
let arrayOfUstensils = [];
recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
        arrayOfUstensils.push(
            ustensil
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
        );
    });
});
const cleanUstensilsList = [...new Set(arrayOfUstensils)].sort();
CreateListOfTags("#ustensils_list", cleanUstensilsList, "ustensilsTag");

/**
 * FUNCTIONS
 */
const changeInputPlaceholder = () => {
    const ingredientsInput = document.querySelector("#ingredients_input");
    if (ingredientsInput.parentNode.classList.contains("button_active")) {
        ingredientsInput.placeholder = "Rechercher un ingrédient";
    } else {
        ingredientsInput.placeholder = "Ingrédients";
    }

    const appliancesInput = document.querySelector("#appliances_input");
    if (appliancesInput.parentNode.classList.contains("button_active")) {
        appliancesInput.placeholder = "Rechercher un appareil";
    } else {
        appliancesInput.placeholder = "Appareils";
    }

    const ustensilsInput = document.querySelector("#ustensils_input");
    if (ustensilsInput.parentNode.classList.contains("button_active")) {
        ustensilsInput.placeholder = "Rechercher un ustensile";
    } else {
        ustensilsInput.placeholder = "Ustensiles";
    }
};

const dropDownFilters = () => {
    const filterButtons = document.querySelectorAll(".search_tags_form");
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            filterButtons.forEach((btn) => {
                btn.classList.remove("button_active");
            });

            if (event.target.classList.contains("search_tags_form")) {
                event.target.classList.add("button_active");
            }

            if (
                event.target.classList.contains("search_tags_form_input") ||
                event.target.classList.contains("search_tags_form_tagslist")
            ) {
                event.target.parentNode.classList.add("button_active");
            }

            if (event.target.querySelectorAll("li")) {
                event.target.parentNode.parentNode.classList.add(
                    "button_active"
                );
            }

            if (event.target.classList.contains("fa-chevron-down")) {
                event.target.parentNode.classList.remove("button_active");
            }
            changeInputPlaceholder();
        });
    });
};

const searchTagsInput = () => {
    const inputs = document.querySelectorAll(".search_tags_form_input");

    inputs.forEach((input) => {
        input.addEventListener("click", (event) => {
            event.preventDefault();

            inputSearchTagList(
                event.target.id,
                event.target.parentNode.lastChild.previousSibling.id
            );
        });
    });
};

const removeSelectedTag = () => {
    const closeSelectedTagIcon = document.querySelectorAll(".fa-circle-xmark");

    closeSelectedTagIcon.forEach((icon) => {
        icon.addEventListener("click", (event) => {
            event.target.parentNode.remove();
            let tagToRemove = event.target.previousElementSibling.textContent;
            let tagIndex = tagListArray
                .map((item) => {
                    return item.itemSelected;
                })
                .indexOf(tagToRemove);
            if (tagIndex !== -1) tagListArray.splice(tagIndex, 1);
            if (sortedrecipesLeftArray.length < 1) {
                filterRecipes(tagListArray, recipes);
            } else {
                filterRecipes(tagListArray, sortedrecipesLeftArray);
            }
        });
    });
};

const tagsList = document.querySelectorAll(".tag");
let tagListArray = [];

tagsList.forEach((item) => {
    item.addEventListener("click", (event) => {
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

const searchNavigationInput = document.querySelector("#searchbar");
let sortedrecipesLeftArray = [];

/**
 * ALGORITHME
 */
searchNavigationInput.addEventListener("input", (event) => {
    let recipesLeftArray = [];
    let NormalizedInput = normalize(event.target.value.trim());
    let errorMessage = document.querySelector("#recipe_error");
    if (errorMessage) {
        errorMessage.remove();
    }
    if (NormalizedInput.length >= 3) {
        //speedtest start
        console.time();

        for (let i = 0; i < recipes.length; i++) {
            let NonNormalizedName = recipes[i].name;
            let NormalizedName = normalize(NonNormalizedName);

            let NonNormalizedDescription = recipes[i].description;
            let NormalizedDescription = normalize(NonNormalizedDescription);

            if (
                NormalizedName.includes(NormalizedInput) ||
                NormalizedDescription.includes(NormalizedInput)
            ) {
                recipesLeftArray.push(recipes[i]);
            } else {
                for (
                    let ingr = 0;
                    ingr < recipes[i].ingredients.length;
                    ingr++
                ) {
                    let NonNormalizedIngredient =
                        recipes[i].ingredients[ingr].ingredient;
                    let NormalizedIngredient = normalize(
                        NonNormalizedIngredient
                    );
                    if (NormalizedIngredient.includes(NormalizedInput)) {
                        recipesLeftArray.push(recipes[i]);
                    }
                }
            }
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

/**
 * FIN ALGORITHME
 */

/**
 * 
 * @param {Array} tagListArray 
 * @param {Array} RecipeArray 
 */
const filterRecipes = (tagListArray, RecipeArray) => {
    let errorMessage = document.querySelector("#recipe_error");
    if (errorMessage) {
        errorMessage.remove();
    }
    tagListArray.forEach((tagItem) => {
        console.log(tagItem.itemSelected);
        switch (tagItem.itemType) {
            case "ingredientsTag":
                RecipeArray = RecipeArray.filter((recipe) =>
                    recipe.ingredients.some(
                        (i) =>
                            i.ingredient.toLowerCase() === tagItem.itemSelected
                    )
                );
                break;
            case "appliancesTag":
                RecipeArray = RecipeArray.filter(
                    (recipe) =>
                        recipe.appliance.toLowerCase() === tagItem.itemSelected
                );
                break;
            case "ustensilsTag":
                RecipeArray = RecipeArray.filter(
                    (recipe) =>
                        recipe.ustensils.indexOf(tagItem.itemSelected) > -1
                );
                break;
            default:
                console.log("Aucun tag de ce type");
        }
    });
    if (RecipeArray.length < 1) {
        recipeNotFound();
    }

    updateTagsLists(RecipeArray);
    displayRecipes(RecipeArray);
    console.log(RecipeArray);
};

CreateRecipeCard(recipes);
dropDownFilters();
searchTagsInput();