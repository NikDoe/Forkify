import 'regenerator-runtime/runtime'
import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

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

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function(id) {
  try{
     const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    state.recipe.bookmarked = state.bookMarks.some(bookMark => { return bookMark.id === id});

  } catch (err) {
    throw err;
  }
}

export const loadSearchResults = async function (query){
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`)

    state.search.results =  data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
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

export const uploadRecipe = async function(newRecipe){
  try{
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if(ingArr.length !== 3){
          throw new Error('Wrong ingredient format! Please use the correct format ????');
        }
        const [quantity, unit, description] = ingArr;
        return {quantity: quantity ? +quantity : null, unit, description}
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  }
  catch (err){
    throw err;
  }
}