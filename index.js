import { ApolloServer, UserInputError, gql } from 'apollo-server'
import { v1 as uuid } from 'uuid'
import axios from 'axios'

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
  enum YesNo {
    YES
    NO
  }

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
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }
  type Mutation {
    addPerson(name: String!, street: String!, city: String!, age: Int!, phone: String): Person
    editNumber(name: String!, phone: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: async (root, args) => {
      const { data: personsFromRestApi } = await axios.get('http://localhost:3001/persons')
      console.log(personsFromRestApi)
      if (!args.phone) return personsFromRestApi

      const byPhone = (person) => (args.phone === 'YES' ? person.phone : !person.phone)
      return persons.filter(byPhone)
    },
    findPerson: (root, args) => persons.find((p) => p.name === args.name),
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name,
        })
      }
      const person = { ...args, id: uuid() }
      persons.push(person)
      return person
    },
    editNumber: (root, args) => {
      const personIndex = persons.findIndex((p) => p.name === args.name)
      if (personIndex === -1) return null

      const person = persons[personIndex]

      const updatedPerson = { ...person, phone: args.phone }
      persons[personIndex] = updatedPerson
      return updatedPerson
      // const person = persons.find((p) => p.name === args.name)
      // if (!person) return null

      // const updatedPerson = { ...person, phone: args.phone }
      // persons = persons.map((p) => (p.name === args.name ? updatedPerson : p))
      // return updatedPerson
    },
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
