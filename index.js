import { ApolloServer, gql } from 'apollo-server'

const persons = [
  {
    name: 'Joaco',
    phone: '123456789',
    street: 'Calle Falsa 123',
    city: 'Springfield',
    id: '550e8400-e29b-41d4-a716-346655440000',
  },
  {
    name: 'Juan',
    phone: '987654321',
    street: 'Calle Falsa 321',
    city: 'Springfield',
    id: '550e8400-e29b-41d4-a716-246655440000',
  },
  {
    name: 'Pedro',
    phone: '456789123',
    street: 'Calle Falsa 213',
    city: 'Ibiza',
    id: '550e8400-e29b-41d4-a716-146655440000',
  },
]

const typeDefs = gql`
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }
  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find((p) => p.name === args.name),
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
