const CompanyCtrl = require('../../controllers/company/company.controller')


const resolvers = {
    Query: {
       getAllCompanies:CompanyCtrl.getAllCompanies,
       getCompanyByID:CompanyCtrl.getCompanyByID,
       getAllCompaniesFull:CompanyCtrl.getAllCompaniesFull
    
    },
    Mutation: {
        addNewCompany:CompanyCtrl.addNewCompany,
        updateCompanyByID:CompanyCtrl.updateCompanyByID
    }
}


module.exports = resolvers