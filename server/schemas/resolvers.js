const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    addUser: async (parent, { name, email, password }) => {
      const newUser = await User.create({ name, email, password });
      const token = signToken(newUser);

      return { token, newUser };
    },

    login: async (parent, { email, password }) => {
      const userData = await User.findOne({ email });
      
      if (!userData) {
        throw AuthenticationError;
      }

      const correctPw = await userData.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(userData);
      return { token, userData };
    },

    saveBook: async {
      
    }
  },

};