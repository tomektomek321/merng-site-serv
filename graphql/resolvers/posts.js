const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const { AuthenticationError, UserInputError  } = require('apollo-server');
const User = require('../../models/User');

module.exports = {
    Query: {
      async getPosts() {
        try {
            const posts = await Post.find().sort({createdAt: -1});
            return posts;
        } catch (error) {
            throw new Error(err);
        }

      },
      async getPostsOfUser(_, { userId }) {

        try {
          const user1 = await User.find({ username: userId });

          const posts = await Post.find({ username: user1[0].username }).sort({createdAt: -1});

          return posts;

        } catch (error) {
            throw new Error(err);
        }

      },
      async getLikedPostsOfUser(_, { userId }) {

        try {
          const post1 = await Post.find();

          return post1.filter(v => {
            if(v.likes.find(function(it) { return it.username === userId }) !== undefined) {
              return true;
            } else {
              return false;
            }
          })

        } catch (error) {
          throw new Error(err);
        }

      },
      async getCommentedPostsOfUser(_, { userId }) {

        try {
          const post1 = await Post.find();

          return post1.filter(v => {
            console.log(v.comments);
            if(v.comments.find(function(it) { return it.username === userId }) !== undefined) {
              return true;
            } else {
              return false;
            }
          })

        } catch (error) {
          throw new Error(err);
        }

      },
      async getPost(_, { postId }) {
        try {
          const post = await Post.findById(postId);
          if (post) {
            return post;
          } else {
            throw new Error('Post not found');
          }
        } catch (err) {
          throw new Error(err);
        }
      }
    },
    Mutation: {
      async createPost(_, { body }, context) {
        const user = checkAuth(context);

        if (body.trim() === '') {
          throw new Error('Post body must not be empty');
        }

        const newPost = new Post({
          body,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString()
        });

        const post = await newPost.save();

        context.pubsub.publish('NEW_POST', {
          newPost: post
        });

        return post;
      },
      async deletePost(_, { postId }, context) {
        const user = checkAuth(context);

        try {
          const post = await Post.findById(postId);
          if (user.username === post.username) {
            await post.delete();
            return 'Post deleted successfully';
          } else {
            throw new AuthenticationError('Action not allowed');
          }
        } catch (err) {
          throw new Error(err);
        }
      },
      async likePost(_, { postId }, context) {
        const { username } = checkAuth(context);

        const post = await Post.findById(postId);
        if (post) {
          if (post.likes.find((like) => like.username === username)) {

            post.likes = post.likes.filter((like) => like.username !== username);
          } else {

            post.likes.push({
              username,
              createdAt: new Date().toISOString()
            });
          }

          await post.save();
          return post;
        } else throw new UserInputError('Post not found');
      }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
}