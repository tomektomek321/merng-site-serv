const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');


const User = require('../../models/User');


module.exports = {
    Mutation: {
        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            },
            context,
            info
        ) {
            /*const user = await User.findOne({username});
            if(user) {
                throw new UserInputError('username is taken', {
                    errors: {
                        username: 'this name is taken'
                    }
                });
            }*/


            password = await bcrypt.hash(password, 12);

            const newuser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newuser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            },
                SECRET_KEY,
                {expiresIn: '1h'}
            );


            return {
                ...res._doc,
                id: res._id,
                token
            };


        }

    }

};








