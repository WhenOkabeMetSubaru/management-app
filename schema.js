const {mergeTypeDefs} = require('graphql-tools-merge-typedefs');
const {mergeResolvers} = require('@graphql-tools/merge');
const {makeExecutableSchema} = require('@graphql-tools/schema');

const authType = require('./types/auth/auth.schema');
const userType = require('./types/user/user.schema');
const companyType = require('./types/company/company.schema');
const billType = require('./types/bill/bill.schema');
const truckType = require('./types/truck/truck.schema');
const consignmentType = require('./types/consignment/consignment.schema');
const transactionType = require('./types/transaction/transaction.schema');
const fuelType = require('./types/fuel/fuel.schema')

const type=[
   authType,
   userType,
   companyType,
   billType,
   truckType,
   consignmentType,
   transactionType,
   fuelType
]

const authResolver = require('./resolver/auth/auth.resolver');
const userResolver = require('./resolver/user/user.resolver');
const companyResolver = require('./resolver/company/company.resolver');
const billResolver = require('./resolver/bill/bill.resolver');
const truckResolver = require('./resolver/truck/truck.resolver');
const consignmentResolver = require('./resolver/consignment/consignment.resolver');
const transactionResolver = require('./resolver/transaction/transaction.resolver');
const fuelResolver = require('./resolver/fuel/fuel.resolver')

const allResolvers = [
   authResolver,
   userResolver,
   companyResolver,
   billResolver,
   truckResolver,
   consignmentResolver,
   transactionResolver,
   fuelResolver
]


const typeDefs = mergeTypeDefs(type);
const resolvers = mergeResolvers(allResolvers);


const executables= makeExecutableSchema({
    typeDefs:typeDefs,
    resolvers:resolvers
});

module.exports = executables;