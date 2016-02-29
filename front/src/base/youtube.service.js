var $http, $q;

class YoutubeService {
    constructor($$http, $$q) {
        $http = $$http;
        $q = $$q;
    }

    getTrackId(artist, track) {
        var query = "";

        if(track) {
            var trackName = "";
            if (track.indexOf(' - ') > -1) {
                trackName = track.split(' - ')[0];
            } else if (track.indexOf(' / ') > -1) {
                trackName = track.split(' / ')[0];
            } else if (track.indexOf(' : ') > -1) {
                trackName = track.split(' : ')[0];
            } else trackName = track;
            query = artist + ' ' + trackName;
        }
        else
            query = artist;

        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/thirdPartyApi/youtubeSearchForVideos`, {
                    params: {
                        param: query
                    }
                })
                .success(function (response) {
                    if (response.error) {
                        console.error(response.error.code + ': Youtube ' + response.error.errors[0].message);
                        reject(response.error.errors[0]);
                        return;
                    }

                    resolve(response.items.length ? response.items[0].id.videoId : null);
                })
                .error(function (err) {
                    reject(err)
                });
        });
    }

    relatedVideos(videoId) {
        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/thirdPartyApi/youtubeSearchForRelatedVideos`, {
                    params: {
                        param: videoId
                    }
                })
                .success(function (response) {
                    if (response.error) {
                        console.error(response.error.code + ': Youtube ' + response.error.errors[0].message);
                        reject(response.error.errors[0]);
                        return;
                    }

                    var relatedVideos = [];
                    for(var i = 0; i < response.items.length; i++){
                        relatedVideos.push({
                            name : response.items[i].snippet.title,
                            songId : response.items[i].id.videoId
                        })
                    }

                    resolve(relatedVideos);
                })
                .error(function (err) {
                    reject(err)

                });
        });
    }
}

YoutubeService.$inject = ['$http', '$q'];

angular
    .module('streamfeed.base')
    .service('YoutubeService', YoutubeService);