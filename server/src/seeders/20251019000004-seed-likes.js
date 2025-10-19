'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('likes', [
      {
        id: 1,
        user_id: 2,
        post_id: 1,
        created_at: new Date('2025-01-11'),
      },
      {
        id: 2,
        user_id: 1,
        post_id: 2,
        created_at: new Date('2025-01-16'),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('likes', null, {});
  },
};
