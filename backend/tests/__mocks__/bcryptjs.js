// Mock bcrypt to avoid issues with Jest
const bcrypt = require('bcryptjs');

// Mock the bcrypt methods
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('$2a$10$abcdefghijklmnopqrstu'),
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((candidate, hashed) => Promise.resolve(candidate === 'correct_password' || hashed.includes('hashed_'))),
  genSaltSync: jest.fn(() => '$2a$10$abcdefghijklmnopqrstu'),
  hashSync: jest.fn((password) => `hashed_${password}`),
  compareSync: jest.fn((candidate, hashed) => candidate === 'correct_password' || hashed.includes('hashed_'))
}));

module.exports = bcrypt;