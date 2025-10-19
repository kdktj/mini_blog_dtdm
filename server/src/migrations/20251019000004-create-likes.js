'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('likes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    });

    await queryInterface.addIndex('likes', ['user_id']);
    await queryInterface.addIndex('likes', ['post_id']);
    await queryInterface.addConstraint('likes', {
      fields: ['user_id', 'post_id'],
      type: 'unique',
      name: 'unique_user_post',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('likes');
  },
};
