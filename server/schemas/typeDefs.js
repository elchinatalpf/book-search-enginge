const typeDefs = `
type Query {
  me: User
}

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
    link: String
  }

  type Mutation {
    
  }


  
`;


module.exports = typeDefs;