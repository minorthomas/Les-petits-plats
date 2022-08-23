export const CreateRecipeCard = (recipes) => {
    //Selectionne le container contiendra les recettes
    const recipeContainer = document.querySelector(".recipe");

    let recipesInDom = ''; //Déclare une variable vide

    //Boucle qui cherche chaque recette
    recipes.forEach(recipe => {
        let ingredientsInDom = '';//Déclare une variable vide

        const { ingredients } = recipe; //Récupère les ingredients de chaque recette

        //Boucle qui cherche chaque ingrédient du tableau d'ingr de chaque recette
        ingredients.forEach(ingredient => {
            if (ingredient.quantity) { //Si on trouve quantité dans la tableau
                if (ingredient.unit && ingredient.quantity) { //Si on trouve quantité et unité dans le tableau
                    //Affiche l'ingrédient, la quantité et l'unité
                    ingredientsInDom += `
                        <li><strong>${ingredient.ingredient}: </strong>${ingredient.quantity} ${ingredient.unit}</li>
                    `;
                } else { //Si on trouve juste quantity dans le tableau
                    //Affiche l'ingrédient et la quantité
                    ingredientsInDom += `
                        <li><strong>${ingredient.ingredient}: </strong>${ingredient.quantity}</li>
                    `;
                }
            } else { //Si on trouve ni de quantité ni d'unité dans le tableau
                //Affiche uniquement l'ingrédient
                ingredientsInDom += `
                    <li><strong>${ingredient.ingredient}</strong></li>
                `;
            }
        });

        //Appel de la variable recipesInDom et ajoute chaque recette dans la var
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
                            ${recipe.description}
                        </p>
                    </div>
                </div>
            </article>
        `
    });

    recipeContainer.innerHTML = recipesInDom;
}

export const CreateListOfTags = (id, tagsList, tagType) => {
    //Selectionne le container qui contiendra la liste des tags
    const listContainer = document.querySelector(id);

    let tagsInDom = ''; //Déclare une variable vide

    //Boucle qui récupère chaque item du tableau de d'items
    tagsList.forEach(tag => {
        //Appel la var tagsInDom et ajoute chaque tag dedans
        tagsInDom += `
            <li role="option" tabindex="0" data-list="${tagType}" aria-label="${tag}">${tag}</li>
        `

        listContainer.innerHTML = tagsInDom;
    });

}