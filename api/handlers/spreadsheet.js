var debug = require('debug')('ebil:handlers:spreadsheet');
var GoogleSpreadsheet = require("google-spreadsheet");
var doc = new GoogleSpreadsheet('12LKigtLwhplJfLdCDQOv2t6tTqbIyJff4wUCKnoml0E');
var async = require('async');
var sheet;
var ratingService = require('../services/rating');
var extractedRatings;
var users = {};

var errorHandler = function(res){ 
    res.status(500).send('Error generating spreadsheet');
};

exports.makeSpreadSheet = function(req, res){

    async.series([
        function getData(step){
            ratingService.getAllRatings()
            .then(function(ratings){
                extractedRatings = ratings;
                step();
            }, function(err){
                errorHandler(res);
            });
        },
      
        function parseData(step){
            users = {};
            var ratings_added = 0;
            var users_added = 0;

            console.log("started parseData");
            for(var i = 0; i < extractedRatings.length; i++){
                var rating = extractedRatings[i];
                if (rating.user && typeof users[rating.user._id] === "undefined"){
                    // no user found
                    var userProperties = {
                        rating_three_artists : "",
                        rating_two_artists : "",
                        rating_one_artists : "",
                        email : rating.user.email,
                        hash : rating.user.hash,
                        created : rating.user.created
                    }
                    users_added++;
                    users[rating.user._id] = userProperties;
                }

                if(rating.user && rating.ratingGiven == 3){
                    ratings_added++;
                    users[rating.user._id].rating_three_artists = users[rating.user._id].rating_three_artists == "" ? rating.artist.name : users[rating.user._id].rating_three_artists + ', ' + rating.artist.name;
                } else if(rating.user &&  rating.ratingGiven == 2){
                    ratings_added++;
                    users[rating.user._id].rating_two_artists = users[rating.user._id].rating_two_artists == "" ? rating.artist.name : users[rating.user._id].rating_two_artists + ', ' + rating.artist.name;
                } else if(rating.user && rating.ratingGiven == 1){
                    ratings_added++;
                    users[rating.user._id].rating_one_artists = users[rating.user._id].rating_one_artists == "" ? rating.artist.name : users[rating.user._id].rating_one_artists + ', ' + rating.artist.name;
                } 
            }

            console.log("users length:", Object.keys(users).length);
            console.log("ratings added:", ratings_added);
            console.log("users added:", users_added);
            step();
        },
        function setAuth(step) {
            console.log("started setAuth");
            var creds = require('../../creds.json');

            doc.useServiceAccountAuth(creds, step);
        },
      
        function getInfoAndWorksheets(step) {
            console.log("started getInfoAndWorksheets");
            doc.getInfo(function(err, info) {
                console.log('Loaded doc: '+info.title+' by '+info.author.email);
                sheet = info.worksheets[0];
                console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
                step();
            });
        },

        function clear(step){
            console.log("started clear");
            sheet.clear(function(){
                step();
            });
        },

        function addHeader(step){
            console.log("started addHeader");
            sheet.setHeaderRow([
                'user',
                'created',
                'hash',
                'rating_three_artists',
                'rating_two_artists',
                'rating_one_artists'
            ], function(){
                step();
            });
        },

        function addRow(step){
            console.log("started addRow");
            var usersArr = [];

            for(var user in users) usersArr.push(users[user]);

            async.eachSeries(usersArr, function(user, callback){
                var username = "";
                if(user.email && user.email !== "")
                    username = user.email;
                else if(user.first_name && user.first_name !== "" && user.last_name && user.last_name !== "")
                    username = user.first_name + ' ' + user.last_name;
                else if(user.first_name && user.first_name !== "") 
                    username = user.first_name;
                else username = user.name;

                sheet.addRow({
                    user : username,
                    created : user.created,
                    hash  : user.hash,
                    rating_three_artists : user.rating_three_artists,
                    rating_two_artists : user.rating_two_artists,
                    rating_one_artists : user.rating_one_artists
                }, function(err){
                    callback();
                });
            }, function(){
                step();
            });
            
        },

        function workingWithRows(step) {
            console.log("started workingWithRows");
           res.send('<h1>Spreadsheet Generated. <a href="https://docs.google.com/spreadsheets/d/12LKigtLwhplJfLdCDQOv2t6tTqbIyJff4wUCKnoml0E/edit?usp=sharing"> Go to spreadsheet</a></h1>');
        }
    ]);
};