require('dotenv').config();

var mongoose = require('mongoose');
var User = require('./api/models/user');
var Artist = require('./api/models/artist');
var Rating = require('./api/models/rating');
var config = require('./api/config');

// Connect to MongoDB
mongoose.connect(config.mongo_uri)
  .then(function() {
    console.log('Connected to MongoDB');
    return seedDatabase();
  })
  .then(function() {
    console.log('Database seeded successfully!');
    process.exit(0);
  })
  .catch(function(err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  });

function seedDatabase() {
  return mongoose.connection.db.dropDatabase()
    .catch(function(err) {
      // Database might not exist, that's okay
      console.log('Database does not exist, creating new one...');
    })
    .then(function() {
      return createUsers();
    })
    .then(function(users) {
      return createArtists()
        .then(function(artists) {
          return { users: users, artists: artists };
        });
    })
    .then(function(data) {
      return createRatings(data.users, data.artists);
    });
}

function createUsers() {
  console.log('Creating users...');
  
  var users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      first_name: 'John',
      last_name: 'Doe',
      hash: 'aaa',
      picture: 'https://via.placeholder.com/150'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      hash: 'aab',
      picture: 'https://via.placeholder.com/150'
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      first_name: 'Bob',
      last_name: 'Johnson',
      hash: 'aac',
      picture: 'https://via.placeholder.com/150'
    }
  ];

  return User.insertMany(users)
    .then(function(createdUsers) {
      console.log(`Created ${createdUsers.length} users`);
      return createdUsers;
    });
}

function createArtists() {
  console.log('Creating artists...');
  
  var artists = [
    {
      name: 'The Beatles',
      spotifyId: '3WrFJ7ztbogyGnTHbXXFlQ',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['rock', 'pop', 'british invasion']
    },
    {
      name: 'Radiohead',
      spotifyId: '4Z8W4fKeB5YxbusRsdQVPb',
      picture: 'https://i.scdn.co/image/ab6761610000e5ebec0b0c0c0c0c0c0c0c0c0c0',
      genres: ['alternative rock', 'art rock', 'electronic']
    },
    {
      name: 'Pink Floyd',
      spotifyId: '0k17h0D3J5VfsdmQ1iZtE9',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['progressive rock', 'psychedelic rock', 'classic rock']
    },
    {
      name: 'Led Zeppelin',
      spotifyId: '36QJpDe2go2KgaRleHCDTp',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['hard rock', 'blues rock', 'classic rock']
    },
    {
      name: 'The Rolling Stones',
      spotifyId: '22bE4uQ6baNwSHPVcDxLCe',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['rock', 'blues rock', 'classic rock']
    },
    {
      name: 'David Bowie',
      spotifyId: '0oSGxfWSnnOXhD2fKuz2Gy',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['art rock', 'glam rock', 'pop rock']
    },
    {
      name: 'Nirvana',
      spotifyId: '6olE6TJLqED3rqDCT0FyPh',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['grunge', 'alternative rock', 'punk']
    },
    {
      name: 'The Doors',
      spotifyId: '22WZ7M8sxp5THdruNY3gXt',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['psychedelic rock', 'blues rock', 'classic rock']
    },
    {
      name: 'Queen',
      spotifyId: '1dfeR4HaWDbWqFHLkxsg1d',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['rock', 'glam rock', 'progressive rock']
    },
    {
      name: 'The Clash',
      spotifyId: '3RGLhK1IP9jnYFH4BrFmUT',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['punk rock', 'new wave', 'post-punk']
    },
    {
      name: 'Arcade Fire',
      spotifyId: '3kjuyTCjPG1WMFCiyc5IuB',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['indie rock', 'art rock', 'baroque pop']
    },
    {
      name: 'The Strokes',
      spotifyId: '0epOFNiUfyON9EYx7Tpr6V',
      picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
      genres: ['indie rock', 'garage rock', 'post-punk revival']
    }
  ];

  return Artist.insertMany(artists)
    .then(function(createdArtists) {
      console.log(`Created ${createdArtists.length} artists`);
      return createdArtists;
    });
}

function createRatings(users, artists) {
  console.log('Creating ratings...');
  
  // Rating 1 = lowest, Rating 3 = highest
  var ratings = [];
  
  // User 1 (aaa) - John's ratings
  ratings.push({ user: users[0]._id, artist: artists[0]._id, ratingGiven: 3 }); // The Beatles - 3
  ratings.push({ user: users[0]._id, artist: artists[1]._id, ratingGiven: 3 }); // Radiohead - 3
  ratings.push({ user: users[0]._id, artist: artists[2]._id, ratingGiven: 2 }); // Pink Floyd - 2
  ratings.push({ user: users[0]._id, artist: artists[3]._id, ratingGiven: 3 }); // Led Zeppelin - 3
  ratings.push({ user: users[0]._id, artist: artists[4]._id, ratingGiven: 2 }); // Rolling Stones - 2
  ratings.push({ user: users[0]._id, artist: artists[5]._id, ratingGiven: 1 }); // David Bowie - 1
  
  // User 2 (aab) - Jane's ratings
  ratings.push({ user: users[1]._id, artist: artists[1]._id, ratingGiven: 3 }); // Radiohead - 3
  ratings.push({ user: users[1]._id, artist: artists[5]._id, ratingGiven: 3 }); // David Bowie - 3
  ratings.push({ user: users[1]._id, artist: artists[6]._id, ratingGiven: 3 }); // Nirvana - 3
  ratings.push({ user: users[1]._id, artist: artists[7]._id, ratingGiven: 2 }); // The Doors - 2
  ratings.push({ user: users[1]._id, artist: artists[8]._id, ratingGiven: 2 }); // Queen - 2
  ratings.push({ user: users[1]._id, artist: artists[9]._id, ratingGiven: 1 }); // The Clash - 1
  
  // User 3 (aac) - Bob's ratings
  ratings.push({ user: users[2]._id, artist: artists[0]._id, ratingGiven: 2 }); // The Beatles - 2
  ratings.push({ user: users[2]._id, artist: artists[2]._id, ratingGiven: 3 }); // Pink Floyd - 3
  ratings.push({ user: users[2]._id, artist: artists[3]._id, ratingGiven: 2 }); // Led Zeppelin - 2
  ratings.push({ user: users[2]._id, artist: artists[6]._id, ratingGiven: 2 }); // Nirvana - 2
  ratings.push({ user: users[2]._id, artist: artists[10]._id, ratingGiven: 3 }); // Arcade Fire - 3
  ratings.push({ user: users[2]._id, artist: artists[11]._id, ratingGiven: 3 }); // The Strokes - 3
  
  return Rating.insertMany(ratings)
    .then(function(createdRatings) {
      console.log(`Created ${createdRatings.length} ratings`);
      return createdRatings;
    });
}

