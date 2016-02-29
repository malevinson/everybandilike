angular
    .module('streamfeed', [
        'streamfeed.base',
        'streamfeed.auth',

        'streamfeed.share'
    ])
    .constant('CONFIG', CONFIG);