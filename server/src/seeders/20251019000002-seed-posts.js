'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('posts', [
      {
        id: 1,
        user_id: 1,
        title: 'Getting Started with Node.js',
        content: `Node.js is a powerful JavaScript runtime that allows you to build server-side applications using JavaScript. 
In this comprehensive guide, we'll explore the fundamentals of Node.js, including setting up your development environment, 
understanding the event loop, and building your first REST API. We'll cover best practices, common patterns, and real-world examples 
to help you become proficient with Node.js development.`,
        excerpt: 'Learn the basics of Node.js and start building server-side applications with JavaScript.',
        featured_image: 'https://api.example.com/images/nodejs.jpg',
        status: 'published',
        views_count: 245,
        created_at: new Date('2025-01-10'),
        updated_at: new Date('2025-01-10'),
        published_at: new Date('2025-01-10'),
      },
      {
        id: 2,
        user_id: 2,
        title: 'Top 10 Travel Destinations for 2025',
        content: `Travel opens doors to incredible experiences, cultural understanding, and personal growth. 
Whether you're a budget traveler or seeking luxury experiences, there are amazing destinations waiting for you. 
This article covers 10 must-visit places in 2025, including hidden gems and popular hotspots. 
From the beaches of Thailand to the mountains of Peru, discover where your next adventure should take you.`,
        excerpt: 'Discover the most amazing travel destinations to visit in 2025 with tips and recommendations.',
        featured_image: 'https://api.example.com/images/travel.jpg',
        status: 'published',
        views_count: 512,
        created_at: new Date('2025-01-15'),
        updated_at: new Date('2025-01-15'),
        published_at: new Date('2025-01-15'),
      },
      {
        id: 3,
        user_id: 1,
        title: 'React Hooks Deep Dive',
        content: `React Hooks have revolutionized the way we write React components. Instead of using class components with lifecycle methods, 
we can now use functional components with hooks like useState, useEffect, and useContext. 
In this deep dive, we'll explore advanced patterns, custom hooks, and best practices for using hooks effectively in your React applications.
You'll learn how to optimize performance, manage complex state, and structure your components in maintainable ways.`,
        excerpt: 'Master React Hooks and build more efficient, maintainable React components with this comprehensive guide.',
        featured_image: 'https://api.example.com/images/react.jpg',
        status: 'draft',
        views_count: 0,
        created_at: new Date('2025-01-18'),
        updated_at: new Date('2025-01-18'),
        published_at: null,
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('posts', null, {});
  },
};
