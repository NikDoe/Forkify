import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';

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

const controlSearchResults = async function() {
  try {
    //1. get search query
    const query = searchView.getQuery()

    //2. load search result
    await model.loadSearchResults(query)

    //3. render results
    console.log(model.state.search.results);
  }
  catch (err) {
    console.error(err)
  }

}

const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults)
}

init();
