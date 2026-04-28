import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    
    const ruleNames = ['skipEmptyTargetValues'];

    const compare = createComparison(ruleNames, [
        rules.searchMultipleFields('search', ['date', 'customer', 'seller'], false)
    ]);// Создаём компаратор на основе правил

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    }
}

