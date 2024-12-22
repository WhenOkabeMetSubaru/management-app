const {gql} = require('apollo-server-express');


const typeDefs = gql`

    type Query{

       getAllCompanies(status:String,pageNumber:Int,pageSize:Int):MultipleCompanyOutput
       getAllCompaniesFull:MultipleCompanyOutput
       getCompanyByID(company_id:ID):SingleCompanyOutput
    }

    type Mutation{

        addNewCompany(CompanyInput:NewCompanyInput):SingleCompanyOutput
        updateCompanyByID(CompanyInput:UpdateCompanyInput):SingleCompanyOutput
    }

    input NewCompanyInput{
        company_name:String
        description:String
        company_image:String
        company_email:String
        company_type:String
        company_website:String
        company_contact_no:String
        gst_no:String
        address:String
        location:String
    }

    
    input UpdateCompanyInput{
        _id:ID
        company_name:String
        description:String
        company_image:String
        company_email:String
        company_type:String
        company_website:String
        company_contact_no:String
        gst_no:String
        address:String
        location:String
    }
   
    type SingleCompanyOutput{
        error:Boolean
        message:String
        data:CompanyData
    }

    type MultipleCompanyOutput{
        error:Boolean
        message:String
        data:[CompanyData]
        totalDocs: Int
        limit: Int
        totalPages: Int
        page: Int
    }

    type CompanyData {
        _id:ID
        company_name:String
        description:String
        company_image:String
        company_email:String
        company_type:String
        company_website:String
        company_contact_no:String
        gst_no:String
        address:String
        location:String
        consignments:[ID]
        bills:[ID]
    }


`

module.exports = typeDefs;