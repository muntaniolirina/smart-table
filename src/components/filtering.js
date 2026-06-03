export function initFiltering(elements) {
  // Заполняем выпадающий список продавцов После получения данных с сервера:
  // 1.Получаем ключи из объекта 2. Перебираем по именам
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        // 3.в каждый элемент добавляем опции
        ...Object.values(indexes[elementName]) // 4.формируем массив имён, значений опций
          .map((name) => {
            // @todo: создать и вернуть тег опции; используйте name как значение и текстовое содержимое
            const el = document.createElement("option");
            el.textContent = name;
            el.value = name;
            return el;
          }),
      );
    });
  };

  // Собираем данные из полей фильтра До отправки запроса на сервер
  const applyFiltering = (query, state, action) => {
    // из @todo: #4.2 — обработать очистку поля по крестику
    if (action?.name === "clear") {
      const field = action.dataset.field; // получаем имя поля из data - атрибута
      // проверим что поле указано в разметке
      if (!field) {
        console.warn("Атрибут data-filed не указан для элемента очистки");
        return;
      }

      // найдем связанный input в родительском контейнере
      const input = action.parentElement.querySelector("input");
      // проверим что input существует в DOM
      if (!input) {
        console.warn("Связанный input не найден для элемента очистки");
        return;
      }

      // очищаем значение в UI
      input.value = "";
      // обновляем состояние приложения
      state[field] = "";
    }

    // @todo: #4.5 — отфильтровать данные
    // Формируем параметры фильтрации для сервера
    const filter = {}; // создаем пустой объект для хранения параметров фильтра, получится структура вида: { 'filter[username]': 'john', 'filter[status]': 'active' }.

    // перебираем все ключи объекта elements; Object.keys - получает массив всех ключей объекта elements
    Object.keys(elements).forEach((key) => {
      // Проверяем, что элемент с текущим ключом существует (не null/undefined)
      if (elements[key]) {
        // Проверяем два условия одновременно:
        // 1. Элемент является полем ввода (INPUT) или выпадающим списком (SELECT) 2. У элемента есть непустое значение (value)
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          // Если оба условия выполнены - добавляем поле в объект filter
          // форматируем ключ в виде filter[имя_поля] для формирования вложенного объекта в query-параметрах (напр: filter[username=john])
          filter[`filter[${elements[key].name}]`] = elements[key].value.trim();
        }
      }
    });

    // если в фильтре что то не заполнено - склеиваем с query, если нет - отдаем query без изменений
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query; // если в фильтре что-то добавилось, применим к запросу
  };

  // возвращаем 2 новые функции коробкой
  return {
    updateIndexes,
    applyFiltering,
  };
}
