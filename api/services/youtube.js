var debug = require('debug')('streamfeed:services:youtube');

var Q 	=   require('q');
var apiCall = require('../helpers/apiCall');
var ApiData = require('./../models/apiData');

var config = require('./../config');

var youtubeHost = 'www.googleapis.com';
var youtubeKey = config.youtube_key;

exports.youtubeSearchForVideos = function(SearchText) {
	var deferred = Q.defer()
	var last90Day = new Date();
	last90Day.setDate(last90Day.getDate()-90);
	ApiData.findOne({'method': 'youtubeSearchForVideos', params: SearchText, timestamp: {$gt:last90Day} }).execQ().then(function(result){
        if(result != null && !JSON.parse(result.data).error){
        	var responseObject = JSON.parse(result.data);
      		deferred.resolve(responseObject)
        }
        else{
        	console.log("going to make call: ", SearchText)
        	apiCall.performRequest(youtubeHost, '/youtube/v3/search','GET', { q: SearchText, part: 'snippet', order: 'viewCount',maxResults: 8, type: 'video', key: youtubeKey})
	    		.then(function(data){
			        var apiData = new ApiData({method:'youtubeSearchForVideos', params: SearchText, timestamp: new Date(), data: JSON.stringify(data)});
			        apiData.saveQ();
			        deferred.resolve(JSON.stringify(data))
			    },function(err){
			        console.log("Error is: ", err);
			        deferred.reject(err)
			    })
        }
    });
    return deferred.promise
}

exports.youtubeSearchForRelatedVideos = function(VideoId) {
	var deferred = Q.defer()
	var last90Day = new Date();
	last90Day.setDate(last90Day.getDate()-90);
	ApiData.findOne({ 'method' : 'youtubeSearchForRelatedVideos', params: VideoId, timestamp: {$gt:last90Day} }).execQ().then(function(result){
        if(result != null && !JSON.parse(result.data).error){
        	var responseObject = JSON.parse(result.data);
      		deferred.resolve(responseObject)
        }
        else{
        	apiCall.performRequest(youtubeHost, '/youtube/v3/search', 'GET' , {
                relatedToVideoId: VideoId,
                part: 'snippet',
                order: 'viewCount',
                type: 'video',
                key: youtubeKey,
                maxResults : 49  // -> items per page parameter
            })
	    		.then(function(data){
			        var apiData = new ApiData({method:'youtubeSearchForRelatedVideos', params: VideoId, timestamp: new Date(), data: JSON.stringify(data)});
			        apiData.saveQ();
			        deferred.resolve(JSON.stringify(data))
			    },function(err){
			        console.log("Error is: ", err);
			        deferred.reject(err)
			    })
        }
    });
    return deferred.promise
}