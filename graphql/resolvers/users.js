const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');

const {validateRegisterInput, validateLoginInput} = require('../../util/Validators');
const User = require('../../models/User');


function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    },
        SECRET_KEY,
        {expiresIn: '1h'}
    );
}

module.exports = {
    Mutation: {
        async login(_, {username, password}) {
            const {errors, valid} = validateLoginInput(username, password);

            if(!valid) {
                throw new UserInputError("Wrong input data", {errors});
            }

            const user = await User.findOne({username});

            if(!user) {
                errors.general = "user not found";
                throw new UserInputError("Wrong credentials", {errors});
            }

            const match = await bcrypt.compare(password, user.password);

            if(!match) {
                errors.general = "wrong credentials"
                throw new UserInputError("Wrong credentials", {errors});
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },


        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            },
        ) {
            const { valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                throw new UserInputError('Errors', {errors});
            }

            const user = await User.findOne({username});
            if(user) {
                throw new UserInputError('username is taken', {
                    errors: {
                        username: 'this name is taken'
                    }
                });
            }


            password = await bcrypt.hash(password, 12);

            const newuser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newuser.save();


            const token = generateToken(res);
            /*const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            },
                SECRET_KEY,
                {expiresIn: '1h'}
            );*/


            return {
                ...res._doc,
                id: res._id,
                token
            };


        }

    }

};








