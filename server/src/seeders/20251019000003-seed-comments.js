'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('comments', [
      {
        id: 1,
        post_id: 1,
        user_id: 2,
        content: 'Great introduction to Node.js! Really helped me understand the basics.',
        parent_id: null,
        created_at: new Date('2025-01-11'),
        updated_at: new Date('2025-01-11'),
      },
      {
        id: 2,
        post_id: 1,
        user_id: 1,
        content: 'Thanks for the positive feedback! I hope you continue following for more advanced topics.',
        parent_id: 1,
        created_at: new Date('2025-01-12'),
        updated_at: new Date('2025-01-12'),
      },
      {
        id: 3,
        post_id: 2,
        user_id: 1,
        content: 'Amazing travel recommendations! I\'ve already booked flights to two of these destinations.',
        parent_id: null,
        created_at: new Date('2025-01-16'),
        updated_at: new Date('2025-01-16'),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('comments', null, {});
  },
};
