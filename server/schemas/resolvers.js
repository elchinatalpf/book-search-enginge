const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
        .select('_v -password')
        return userData;
      }
      throw new AuthenticationError('User is not logged In');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const newUser = await User.create({ username, email, password });
      const token = signToken(newUser);

      return { token, newUser };
    },

    login: async (parent, { email, password }) => {
      const userData = await User.findOne({ email });
      
      if (!userData) {
        throw new AuthenticationError('Incorret Credentials');
      }

      const correctPw = await userData.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const token = signToken(userData);
      return { token, userData };
    },

    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const updateUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { book } } },
          { new: true },
        );
        return updateUser;
      };
      throw new AuthenticationError('User is not logged In');
    },

    removeBook: async(parent, { bookId }, context) => {
      if (context.user) {
        const updateUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updateUser;
      }
      throw new AuthenticationError('User is not logged In');
    }

  },
};

module.exports = resolvers;