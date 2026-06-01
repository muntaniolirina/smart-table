// initSearching() — поиск
// import { rules, createComparison } from "../lib/compare.js";   // 6.2

export function initSearching(searchField) {
  // НИЖЕ КОД ДЛЯ 6.2
  // @todo: #5.1 — настроить компаратор
  // const ruleNames = ["skipEmptyTargetValues"];
  // const compare = createComparison(ruleNames, [
  //   rules.searchMultipleFields("search", ["date", "customer", "seller"], false),
  // ]); // Создаём компаратор на основе правил
  // return (data, state, action) => {
  //   // @todo: #5.2 — применить компаратор
  //   return data.filter((row) => compare(row, state));
  // };
  //////////////////////////////////////////////
  // КОД ДЛЯ 7 проектной
  return (query, state, action) => {
    // result заменили на query
    return state[searchField]
      ? Object.assign({}, query, {
          // проверяем, что в поле поиска было что-то введено
          search: state[searchField], // устанавливаем в query параметр
        })
      : query; // если поле с поиском пустое, просто возвращаем query без изменений
  };
}
