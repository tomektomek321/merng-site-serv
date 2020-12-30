
const { AuthenticationError, UserInputError } = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context);
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not empty'
                    }
                });
            }

            const post = await Post.findById(postId);

            if (post) {

                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                });

                await post.save();
                return post;
            } else {

                throw new UserInputError('Post not found');

            }
          },
          async deleteComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
              const commentIndex = post.comments.findIndex((c) => c.id === commentId);

              if (post.comments[commentIndex].username === username) {

                post.comments.splice(commentIndex, 1);

                await post.save();

                return post;

              } else {
                throw new AuthenticationError('Action not allowed');
              }
            } else {
              throw new UserInputError('Post not found');
            }
          },
          async likeComment(_, {postId, commentId}, context) {

            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if(post) {
              const comIdx = post.comments.findIndex((c) => c.id === commentId);

              if(post.comments[comIdx]) {

                if (post.comments[comIdx].likes.find((like) => like.username === username)) {

                  post.comments[comIdx].likes
                    = post.comments[comIdx].likes.filter((like) => like.username !== username);

                } else {

                  post.comments[comIdx].likes.unshift({
                    username,
                    createdAt: new Date().toISOString()
                  });
                }

                await post.save();

                return post.comments[comIdx];

              } else {
                throw new UserInputError('Post found, comment not found');
              }

            } else {
              throw new UserInputError('Post not found');
            }

          }

    }
};




