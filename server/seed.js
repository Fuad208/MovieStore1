require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./src/models/user');
const Movie = require('./src/models/movie');
const Cinema = require('./src/models/cinema');
const Showtime = require('./src/models/showtime');
const Reservation = require('./src/models/reservation');

async function seed() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Cinema.deleteMany({}),
      Showtime.deleteMany({}),
      Reservation.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing data');

    // Create users
    const users = await Promise.all([
      User.create({
        name: 'Super Admin',
        username: 'superadmin',
        email: 'superadmin@moviestore.com',
        password: 'superadmin123',
        role: 'superadmin',
        phone: '+6281234567890',
      }),
      User.create({
        name: 'Admin User',
        username: 'admin',
        email: 'admin@moviestore.com',
        password: 'admin123',
        role: 'admin',
        phone: '+6281111111111',
      }),
      User.create({
        name: 'Staff User',
        username: 'staff',
        email: 'staff@moviestore.com',
        password: 'staff123',
        role: 'staff',
        phone: '+6282222222222',
      }),
      User.create({
        name: 'Regular User',
        username: 'user',
        email: 'user@moviestore.com',
        password: 'user123',
        role: 'user',
        phone: '+6283333333333',
      }),
    ]);
    console.log('👥 Created users');

    // Create cinemas
    const cinemas = await Promise.all([
      Cinema.create({
        name: 'CGV Grand Indonesia',
        ticketPrice: 75000,
        city: 'jakarta',
        seats: Array.from({ length: 100 }, (_, i) => ({
          row: String.fromCharCode(65 + Math.floor(i / 10)),
          number: (i % 10) + 1,
          available: true
        })),
        seatsAvailable: 100,
        image: 'https://via.placeholder.com/400x300?text=CGV+Grand+Indonesia'
      }),
      Cinema.create({
        name: 'Cinema XXI Bandung',
        ticketPrice: 50000,
        city: 'bandung',
        seats: Array.from({ length: 80 }, (_, i) => ({
          row: String.fromCharCode(65 + Math.floor(i / 10)),
          number: (i % 10) + 1,
          available: true
        })),
        seatsAvailable: 80,
        image: 'https://via.placeholder.com/400x300?text=Cinema+XXI+Bandung'
      }),
      Cinema.create({
        name: 'Cinepolis Surabaya',
        ticketPrice: 60000,
        city: 'surabaya',
        seats: Array.from({ length: 120 }, (_, i) => ({
          row: String.fromCharCode(65 + Math.floor(i / 12)),
          number: (i % 12) + 1,
          available: true
        })),
        seatsAvailable: 120,
        image: 'https://via.placeholder.com/400x300?text=Cinepolis+Surabaya'
      }),
    ]);
    console.log('🏢 Created cinemas');

    // Create movies
    const movies = await Promise.all([
      Movie.create({
        title: 'avatar: the way of water',
        image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        language: 'english',
        genre: 'action, adventure, fantasy',
        director: 'james cameron',
        cast: 'sam worthington, zoe saldana, sigourney weaver',
        description: 'jake sully lives with his newfound family formed on the planet of pandora.',
        duration: 192,
        releaseDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'top gun: maverick',
        image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        language: 'english',
        genre: 'action, drama',
        director: 'joseph kosinski',
        cast: 'tom cruise, miles teller, jennifer connelly',
        description: 'after thirty years, maverick is still pushing the envelope as a top naval aviator.',
        duration: 130,
        releaseDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'black panther: wakanda forever',
        image: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
        language: 'english',
        genre: 'action, adventure, drama',
        director: 'ryan coogler',
        cast: 'letitia wright, lupita nyongo, danai gurira',
        description: 'the people of wakanda fight to protect their home from intervening world powers.',
        duration: 161,
        releaseDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
    ]);
    console.log('🎬 Created movies');

    // Create showtimes
    const showtimes = [];
    const times = ['10:00', '13:00', '16:00', '19:00', '22:00'];
    
    for (const movie of movies) {
      for (const cinema of cinemas) {
        for (const time of times) {
          showtimes.push({
            movieId: movie._id,
            cinemaIds: cinema._id,
            startAt: time,
            startDate: new Date('2025-07-01'),
            endDate: new Date('2025-07-31'),
          });
        }
      }
    }
    
    await Showtime.insertMany(showtimes);
    console.log('⏰ Created showtimes');

    // Create sample reservations
    const reservations = await Promise.all([
      Reservation.create({
        date: new Date('2025-07-15'),
        startAt: '19:00',
        seats: ['A1', 'A2'],
        ticketPrice: 75000,
        total: 150000,
        movieId: movies[0]._id,
        cinemaIds: cinemas[0]._id,
        username: users[3].username,
        phone: users[3].phone,
        checkin: false
      }),
      Reservation.create({
        date: new Date('2025-07-16'),
        startAt: '16:00',
        seats: ['B5', 'B6', 'B7'],
        ticketPrice: 50000,
        total: 150000,
        movieId: movies[1]._id,
        cinemaIds: cinemas[1]._id,
        username: users[3].username,
        phone: users[3].phone,
        checkin: false
      }),
    ]);
    console.log('🎫 Created reservations');

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`Users: ${users.length}`);
    console.log(`Cinemas: ${cinemas.length}`);
    console.log(`Movies: ${movies.length}`);
    console.log(`Showtimes: ${showtimes.length}`);
    console.log(`Reservations: ${reservations.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();