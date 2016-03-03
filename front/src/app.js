angular
    .module('ebil', [
        'ebil.base',
        'ebil.auth',

        'ebil.share'
    ])
    .constant('CONFIG', CONFIG);