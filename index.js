import { gql } from 'apollo-server'

const persons = [
  {
    name: 'Joaco',
    phone: '123456789',
    street: 'Calle Falsa 123',
    city: 'Springfield',
    id: '1',
  },
  {
    name: 'Juan',
    phone: '987654321',
    street: 'Calle Falsa 321',
    city: 'Springfield',
    id: '2',
  },
  {
    name: 'Pedro',
    phone: '456789123',
    street: 'Calle Falsa 213',
    city: 'Ibiza',
    id: '3',
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
`
