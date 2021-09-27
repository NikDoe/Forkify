import icons from '../../img/icons.svg';
import View from './View';

class PaginationView extends View{
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    })
  }

  _generateMarkup(){
    const currPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultPerGage);

    //page 1, and there are other pages
    if(currPage === 1 && numPages > 1) {
      return this._generateMarkupButton(currPage + 1, 'next', 'right');
    }

    //last page
    if(currPage === numPages && numPages > 1) {
      return this._generateMarkupButton(currPage - 1, 'prev', 'left');
    }

    //other pages
    if(currPage < numPages) {
      return `
        ${this._generateMarkupButton(currPage - 1, 'prev', 'left')}
        ${this._generateMarkupButton(currPage + 1, 'next', 'right')}
      `
    }
    //page 1, and there are NO other pages
    return '';
  }

  _generateMarkupButton(num, str, dir) {
    return `
      <button data-goto='${num}' class="btn--inline pagination__btn--${str}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${dir}"></use>
        </svg>
        <span>Page ${num}</span>
      </button>
    `
  }
}

export default new PaginationView();