'use strict';

const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: dbConfig.dialectOptions,
  }
);

// Import models
const UserModel = require('./User');
const PostModel = require('./Post');
const CommentModel = require('./Comment');
const LikeModel = require('./Like');

// Initialize models
const User = UserModel(sequelize);
const Post = PostModel(sequelize);
const Comment = CommentModel(sequelize);
const Like = LikeModel(sequelize);

// Define associations
User.hasMany(Post, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Comment, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

Comment.hasMany(Comment, {
  foreignKey: 'parent_id',
  as: 'replies',
  onDelete: 'CASCADE',
});
Comment.belongsTo(Comment, {
  foreignKey: 'parent_id',
  as: 'parentComment',
  allowNull: true,
});

User.belongsToMany(Post, {
  through: Like,
  foreignKey: 'user_id',
  otherKey: 'post_id',
});
Post.belongsToMany(User, {
  through: Like,
  foreignKey: 'post_id',
  otherKey: 'user_id',
});

Post.hasMany(Like, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Like, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Post,
  Comment,
  Like,
};
