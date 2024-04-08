import { ApolloServer, gql } from 'apollo-server'

const persons = [
  {
    age: 18,
    name: 'Joaco',
    phone: '123456789',
    street: 'Calle Falsa 123',
    city: 'Springfield',
    id: '550e8400-e29b-41d4-a716-346655440000',
  },
  {
    age: 15,
    name: 'Juan',
    street: 'Calle Falsa 321',
    city: 'Springfield',
    id: '550e8400-e29b-41d4-a716-246655440000',
  },
  {
    age: 20,
    name: 'Pedro',
    phone: '456789123',
    street: 'Calle Falsa 213',
    city: 'Ibiza',
    id: '550e8400-e29b-41d4-a716-146655440000',
  },
]

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }
  type Person {
    age: Int!
    canDrink: Boolean!
    name: String!
    phone: String
    address: Address!
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
  Person: {
    canDrink: (root) => root.age >= 18,
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      }
    },
  },
  // Address: {
  //   address: (root) => `${root.street}, ${root.city}`,
  // },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
