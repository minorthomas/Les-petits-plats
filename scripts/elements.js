/**
 * 
 * @param {Array} recipes 
 */
export const CreateRecipeCard = (recipes) => {
    const recipeContainer = document.querySelector(".recipe");
    let recipesInDom = '';
    recipes.forEach(recipe => {
        let ingredientsInDom = '';
        const { ingredients } = recipe;

        ingredients.forEach(ingredient => {
            let normalizeIngredient = ingredient.ingredient.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (ingredient.quantity) {
                if (ingredient.unit && ingredient.quantity) {
                    ingredientsInDom += `
                        <li><strong>${normalizeIngredient}: </strong>${ingredient.quantity} ${ingredient.unit}</li>
                    `;
                } else {
                    ingredientsInDom += `
                        <li><strong>${normalizeIngredient}: </strong>${ingredient.quantity}</li>
                    `;
                }
            } else {
                ingredientsInDom += `
                    <li><strong>${normalizeIngredient}</strong></li>
                `;
            }
        });

        let normalizeDescription = recipe.description.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        recipesInDom += `
            <article id="recipe${recipe.id}" class="recipe_card">
                <div class="recipe_card_image"></div>
                <div class="recipe_card_infos">
                    <div class="recipe_card_infos_header">
                        <h2 class="recipe_card_infos_header_title">${recipe.name}</h2>
                        <div class="recipe_card_infos_header_time">
                            <i class="fa-regular fa-clock"></i>
                            <p>${recipe.time} min</p>
                        </div>
                    </div>
                    <div class="recipe_card_infos_details">
                        <div class="recipe_card_infos_details_ingredients">
                            <ul>
                                ${ingredientsInDom}
                            </ul>
                        </div>
                        <p class="recipe_card_infos_details_instructions">
                            ${normalizeDescription}
                        </p>
                    </div>
                </div>
            </article>
        `
    });

    recipeContainer.innerHTML = recipesInDom;
}

/**
 * 
 * @param {String} id 
 * @param {Array} tagsList 
 * @param {String} tagType 
 */
export const CreateListOfTags = (id, tagsList, tagType) => {
    const listContainer = document.querySelector(id);
    let tagsInDom = '';

    tagsList.forEach(tag => {
        tagsInDom += `
            <li class="tag" role="option" tabindex="0" data-list="${tagType}" aria-label="${tag}">${tag}</li>
        `
        listContainer.innerHTML = tagsInDom;
    });
}

/**
 * 
 * @param {String} tagSelected
 * @param {String} tagType 
 */
export const CreateTags = (tagSelected, tagType) => {
    const tagsContainer = document.querySelector('.search_selectedtags');
    let bgColor;

    switch (tagType) {
        case 'ingredientsTag': bgColor = 'blue'; break;
        case 'appliancesTag': bgColor = 'green'; break;
        case 'ustensilsTag': bgColor = 'red'; break;
        default: console.log('no color set');
    };

    tagsContainer.insertAdjacentHTML("afterbegin", `
            <li class="search_selectedtags_tag search_selectedtags_tag-${bgColor}">
                <p>${tagSelected}</p>
                <i class="fa-regular fa-circle-xmark fa-lg"></i>
            </li>
        `
    );
};