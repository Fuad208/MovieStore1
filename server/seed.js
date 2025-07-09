require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./src/models/user');
const Movie = require('./src/models/movie');
const Cinema = require('./src/models/cinema');
const Showtime = require('./src/models/showtime');
const Reservation = require('./src/models/reservation');

const connectDB = require('./src/db/mongoose');

const seedData = {
  users: [
    {
      name: 'Super Admin',
      username: 'superadmin',
      email: 'superadmin@moviestore.com',
      password: 'superadmin123',
      role: 'superadmin',
      phone: '+6281234567890',
    },
    {
      name: 'Admin User',
      username: 'admin',
      email: 'admin@moviestore.com',
      password: 'admin123',
      role: 'admin',
      phone: '+6281111111111',
    },
    {
      name: 'Staff User',
      username: 'staff',
      email: 'staff@moviestore.com',
      password: 'staff123',
      role: 'staff',
      phone: '+6282222222222',
    },
    {
      name: 'Regular User',
      username: 'user',
      email: 'user@moviestore.com',
      password: 'user123',
      role: 'user',
      phone: '+6283333333333',
    },
  ],
  cinemas: [
    {
      name: 'CGV Grand Indonesia',
      ticketPrice: 75000,
      city: 'jakarta',
      totalSeats: 100,
      image: 'https://via.placeholder.com/400x300?text=CGV+Grand+Indonesia'
    },
    {
      name: 'Cinema XXI Bandung',
      ticketPrice: 50000,
      city: 'bandung',
      totalSeats: 80,
      image: 'https://via.placeholder.com/400x300?text=Cinema+XXI+Bandung'
    },
    {
      name: 'Cinepolis Surabaya',
      ticketPrice: 60000,
      city: 'surabaya',
      totalSeats: 120,
      image: 'https://via.placeholder.com/400x300?text=Cinepolis+Surabaya'
    },
  ],
  movies: [
    {
      title: 'Avatar: The Way of Water',
      image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      language: 'english',
      genre: 'action, adventure, fantasy',
      director: 'James Cameron',
      cast: 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
      description: 'Jake Sully lives with his newfound family formed on the planet of Pandora.',
      duration: 192,
      releaseDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      rating: 'PG-13'
    },
    {
      title: 'Top Gun: Maverick',
      image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
      language: 'english',
      genre: 'action, drama',
      director: 'Joseph Kosinski',
      cast: 'Tom Cruise, Miles Teller, Jennifer Connelly',
      description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.',
      duration: 130,
      releaseDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      rating: 'PG-13'
    },
    {
      title: 'Black Panther: Wakanda Forever',
      image: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
      language: 'english',
      genre: 'action, adventure, drama',
      director: 'Ryan Coogler',
      cast: 'Letitia Wright, Lupita Nyongo, Danai Gurira',
      description: 'The people of Wakanda fight to protect their home from intervening world powers.',
      duration: 161,
      releaseDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      rating: 'PG-13'
    },
  ]
};

// Helper function to generate seats
const generateSeats = (totalSeats) => {
  const seats = [];
  const seatsPerRow = 10;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  
  for (let row = 0; row < totalRows; row++) {
    const rowLetter = String.fromCharCode(65 + row);
    const seatsInThisRow = Math.min(seatsPerRow, totalSeats - (row * seatsPerRow));
    
    for (let seat = 1; seat <= seatsInThisRow; seat++) {
      seats.push({
        row: rowLetter,
        number: seat,
        available: true
      });
    }
  }
  
  return seats;
};

// Hash passwords
const hashPasswords = async (users) => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, saltRounds)
    }))
  );
};

const seed = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data with better error handling
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Cinema.deleteMany({}),
      Showtime.deleteMany({}),
      Reservation.deleteMany({})
    ]);
    console.log('✅ Existing data cleared');

    // Create users with hashed passwords
    console.log('👥 Creating users...');
    const hashedUsers = await hashPasswords(seedData.users);
    const users = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${users.length} users`);

    // Create cinemas with generated seats
    console.log('🏢 Creating cinemas...');
    const cinemasWithSeats = seedData.cinemas.map(cinema => ({
      ...cinema,
      seats: generateSeats(cinema.totalSeats),
      seatsAvailable: cinema.totalSeats
    }));
    const cinemas = await Cinema.insertMany(cinemasWithSeats);
    console.log(`✅ Created ${cinemas.length} cinemas`);

    // Create movies with cinema references
    console.log('🎬 Creating movies...');
    const moviesWithCinemas = seedData.movies.map(movie => ({
      ...movie,
      cinemaIds: cinemas.map(c => c._id)
    }));
    const movies = await Movie.insertMany(moviesWithCinemas);
    console.log(`✅ Created ${movies.length} movies`);

    // Create showtimes
    console.log('⏰ Creating showtimes...');
    const showtimes = [];
    const times = ['10:00', '13:00', '16:00', '19:00', '22:00'];
    
    for (const movie of movies) {
      for (const cinema of cinemas) {
        for (const time of times) {
          // Create showtimes for the next 30 days
          for (let day = 0; day < 30; day++) {
            const showDate = new Date();
            showDate.setDate(showDate.getDate() + day);
            
            showtimes.push({
              movieId: movie._id,
              cinemaIds: cinema._id,
              startAt: time,
              startDate: showDate,
              endDate: showDate,
              availableSeats: cinema.totalSeats
            });
          }
        }
      }
    }
    
    await Showtime.insertMany(showtimes);
    console.log(`✅ Created ${showtimes.length} showtimes`);

    // Create sample reservations
    console.log('🎫 Creating sample reservations...');
    const sampleReservations = [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        startAt: '19:00',
        seats: ['A1', 'A2'],
        ticketPrice: 75000,
        total: 150000,
        movieId: movies[0]._id,
        cinemaIds: cinemas[0]._id,
        username: users[3].username,
        phone: users[3].phone,
        checkin: false,
        status: 'confirmed'
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        startAt: '16:00',
        seats: ['B5', 'B6', 'B7'],
        ticketPrice: 50000,
        total: 150000,
        movieId: movies[1]._id,
        cinemaIds: cinemas[1]._id,
        username: users[3].username,
        phone: users[3].phone,
        checkin: false,
        status: 'confirmed'
      }
    ];
    
    const reservations = await Reservation.insertMany(sampleReservations);
    console.log(`✅ Created ${reservations.length} sample reservations`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏢 Cinemas: ${cinemas.length}`);
    console.log(`🎬 Movies: ${movies.length}`);
    console.log(`⏰ Showtimes: ${showtimes.length}`);
    console.log(`🎫 Reservations: ${reservations.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
    process.exit(0);
  }
};

// Run seed function
seed();