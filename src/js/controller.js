import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model.js';
import recipeView from './views/recipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function() {
  try {

    //get hash form the url
    const id = window.location.hash.slice(1)

    //create guard for empty hash
    if (!id) return;

    recipeView.renderSpinner();

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe)

  } catch (err) {
    recipeView.renderError();
    console.error(` 🔥🔥🔥 ${err} ошибка в контролере`);
  }
};

const init = function(){
  recipeView.addHandlerRener(controlRecipes);
}

init();
