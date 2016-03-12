var $q;

class LocalStorage {
    constructor($$q) {
        $q = $$q;
    }

    get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}

LocalStorage.$inject = ['$q'];

angular
    .module('ebil.base')
    .service('Storage', LocalStorage);