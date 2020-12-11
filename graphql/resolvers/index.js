const PostsResovers = require('./posts')
const usersResovers = require('./users')

module.exports = {
    Query: {
        ...PostsResovers.Query
    }
}