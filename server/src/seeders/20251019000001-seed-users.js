'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordUser = await bcrypt.hash('User123456', salt);
    const hashedPasswordDemo = await bcrypt.hash('Demo123456', salt);
    const hashedPasswordAdmin = await bcrypt.hash('admin', salt);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password_hash: hashedPasswordAdmin,
        full_name: 'Administrator',
        bio: 'System Administrator',
        avatar_url: 'https://api.example.com/avatars/admin.jpg',
        role: 'admin',
        is_banned: false,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      },
      {
        id: 2,
        username: 'johnsmith',
        email: 'john@example.com',
        password_hash: hashedPasswordUser,
        full_name: 'John Smith',
        bio: 'A passionate blogger sharing tech insights and life experiences.',
        avatar_url: 'https://api.example.com/avatars/user1.jpg',
        role: 'user',
        is_banned: false,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      },
      {
        id: 3,
        username: 'sarahjones',
        email: 'sarah@example.com',
        password_hash: hashedPasswordDemo,
        full_name: 'Sarah Jones',
        bio: 'Enthusiast of travel, photography, and storytelling.',
        avatar_url: 'https://api.example.com/avatars/user2.jpg',
        role: 'user',
        is_banned: false,
        created_at: new Date('2025-01-05'),
        updated_at: new Date('2025-01-05'),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};

