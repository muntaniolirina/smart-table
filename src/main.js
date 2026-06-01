// render() — основной цикл рендера и инициализация компонент

import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";

// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initFiltering } from "./components/filtering.js";
import { initSorting } from "./components/sorting.js";
import { initSearching } from "./components/searching.js";

const API = initData(sourceData); // 7ПР

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage); // приводим количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  // для 7ПР делаем функцию ассинхронной
  let state = collectState(); // состояние полей из таблицы

  let query = {}; //  здесь будут формироваться параметры запроса 7ПР

  // @todo: использование
  // другие apply*
  //   result = applySearching(result, state, action);
  //   result = applyFiltering(result, state, action);
  //   result = applySorting(result, state, action);
  //   result = applyPagination(result, state, action);

  query = applySearching(query, state, action); // обновляем query 7ПР
  query = applyFiltering(query, state, action); // обновляем query 7ПР
  query = applySorting(query, state, action); // обновляем query 7ПР
  query = applyPagination(query, state, action); // обновляем query 7ПР

  const { total, items } = await API.getRecords(query); // запрашиваем данные с собранными параметрами 7ПР

  updatePagination(total, query); // перерисовываем пагинатор 7ПР
  sampleTable.render(items); // 7ПР
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["header", "filter"],
    after: ["pagination"],
  },
  render,
);

// @todo: инициализация

// const applyPagination = initPagination(  // 6.2
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
);

const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements,
);

const applySearching = initSearching("search");

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

// 7ПР
async function init() {
  const indexes = await API.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

init().then(render); // 7ПР
