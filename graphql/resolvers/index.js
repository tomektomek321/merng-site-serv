const PostsResovers = require('./posts')
const usersResovers = require('./users')
const commentsResolvers = require('./comments')

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },

    Query: {
        ...PostsResovers.Query
    },

    Mutation: {
        ...usersResovers.Mutation,
        ...PostsResovers.Mutation,
        ...commentsResolvers.Mutation
    },

    Subscription: {
      ...PostsResovers.Subscription
    }
}