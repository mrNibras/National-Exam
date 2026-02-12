#!/usr/bin/env node

// Script to run the school seeding process
const seedSchools = require('./seedSchools');

console.log('Starting school data seeding process...');

// Run the seeding function
seedSchools()
  .then(() => {
    console.log('Seeding completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });