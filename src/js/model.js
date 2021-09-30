import 'regenerator-runtime/runtime'
import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const  state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerGage: RES_PER_PAGE,
  },
  bookMarks: [],
}

export const loadRecipe = async function(id) {
  try{
     const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
    };

    state.recipe.bookmarked = state.bookMarks.some(bookMark => { return bookMark.id === id});

  } catch (err) {
    throw err;
  }
}

export const loadSearchResults = async function (query){
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`)

    state.search.results =  data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      }
    });

    state.search.page = 1;
  }
  catch (err) {
throw err;
  }
}

export const getSearchResultPage = function(page = state.search.page) {
  state.search.page = page;

  const start = (page -1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;
  return state.search.results.slice(start, end);
}

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
  })

  state.recipe.servings = newServings;
}

const persistBookmarks = function(){
  localStorage.setItem('BOOKMARKS', JSON.stringify(state.bookMarks));
}

export const addBookmark = function(recipe) {
  //add bookmark
  state.bookMarks.push(recipe)

  //add current recipe as bookmark
  if(recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmarks();
}

export const deleteBookmark = function(id) {
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);

  if(id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
}

const init = function(){
  const storage = localStorage.getItem('BOOKMARKS');
  if(storage) {state.bookMarks = JSON.parse(storage);}
}

init();