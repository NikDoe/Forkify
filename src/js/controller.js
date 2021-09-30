import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';
import { timeoutFunction } from './helpers';

///////////////////////////////////////

const controlRecipes = async function() {
  try {

    //get hash form the url
    const id = window.location.hash.slice(1)

    //create guard for empty hash
    if (!id) return;

    recipeView.renderSpinner();

    //update results
    resultsView.update(model.getSearchResultPage());

    //upd bookmarks
    bookmarksView.update(model.state.bookMarks);

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
    const query = searchView.getQuery();
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

const controlServings = function(newServings) {
  // upd the servings recipe(in the state)
  model.updateServings(newServings);

  // upd recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function() {
  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  }
  else {
    model.deleteBookmark(model.state.recipe.id)
  }
  recipeView.update(model.state.recipe)

  bookmarksView.render(model.state.bookMarks)
}

const controlBookmark = function() {
  bookmarksView.render(model.state.bookMarks);
}

const controlAddRecipe = async function(newRecipe) {
  try{
    addRecipeView.renderSpinner();

    //upload new recipe
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmarks
    bookmarksView.render(model.state.bookMarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    //close the window and render Form
    setTimeout(()=>{
      addRecipeView.toggleWindow();
      setTimeout(()=>{
        addRecipeView.render(true);
      }, 1000);
    }, MODAL_CLOSE_SEC * 1000);
  }
  catch (err){
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
