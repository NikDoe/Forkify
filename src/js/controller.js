import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

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
    resultsView.renderSpinner();
    //1. get search query
    const query = searchView.getQuery()
    if(!query) return;

    //2. load search result
    await model.loadSearchResults(query)

    //3. render results
    resultsView.render(model.getSearchResultPage());

    //4. render initial pagination buttons
    paginationView.render(model.state.search);
  }
  catch (err) {
    console.error(err)
  }

}

const controlPagination = function(goToPage) {
  //3. render New results
  resultsView.render(model.getSearchResultPage(goToPage));

  //4. render New initial pagination buttons
  paginationView.render(model.state.search);
}

const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination);
}

init();
