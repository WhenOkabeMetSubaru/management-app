const Company = require('../../models/company.model');

const addNewCompany = async(_,args,context)=>{
    if(!context.user_id && !context.type =='admin'){
        return {
            error:true,
            message:'Admin Login Required'
        }
    }
    try {
        args.CompanyInput.user = context.user_id;
        let isFound = await Company.findOne({company_name:args.CompanyInput.company_name});
        if(isFound){
            return {
                error:true,
                message:'Company already exists'
            }
        }
        let company = new Company(args.CompanyInput);
        let result =await company.save();
        return {
            error:false,
            message:'Company Successfully Added',
            data:result
        }


    } catch (error) {
        return {
            error:true,
            message:'Could not create a company'
        }
    }
}

const getAllCompanies = async(_,args,context)=>{
    if(!context.user_id && !context.type =='admin'){
        return {
            error:true,
            message:'Admin Login is required'
        }
    }
    try {

        let query = {
            user:context.user_id
        };
        args.status = '';
       
        
        if(args.status !==''){
            query = {
                status:args.status
            }
        }

        let options = {
            page:args.pageNumber || 0,
            limit:args.pageSize || 5,
            sort:{
                'created':-1
            }
        }

        let companyDetails = await Company.paginate(query,options);
        
        // let companies = await Company.find().sort({'created':-1});

        if(!companyDetails?.docs?.length>0){
            return {
                error:true,
                message:'No Companies Found'
            }
        }

        return {
            error:false,
            message:'Companies Found',
            data:companyDetails.docs,
            totalDocs: companyDetails.totalDocs,
            limit: companyDetails.limit,
            totalPages: companyDetails.totalPages,
            page: companyDetails.page
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch company details'
        }
    }
}

const getAllCompaniesFull = async(_,args,context)=>{
    if(!context.user_id && !context.type =='admin'){
        return {
            error:true,
            message:'Admin Login is required'
        }
    }
    try {

     
     let companies = await Company.find({user:context.user_id}).sort({'created':-1});

        if(!companies?.length>0){
            return {
                error:true,
                message:'No Companies Found'
            }
        }
       

        return {
            error:false,
            message:'Companies Found',
            data:companies
          
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch company details'
        }
    }
}

const getCompanyByID = async(_,args,context)=>{
    if(!context.user_id && !context.text=='admin'){
        return {
            error:true,
            message:'Admin Login is required'
        }
    }
    try {
        
        if(!args.company_id){
            return {
                error:true,
                message:'Company ID is missing'
            }
        }

        let companyDetails = await Company.findById({_id:args.company_id});

        if(!companyDetails){
            return {
                error:true,
                message:'No Such Company Found'
            }
        }

        return {
            error:false,
            message:'Company Details Retrieved Successfully',
            data:companyDetails
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch the company details'
        }
    }
}

const updateCompanyByID = async (_,args,context)=>{
    if(!context.user_id && context.type !== 'admin'){
        return {
            error:true,
            message:'Admin Login is required'
        }
    }
    try {
        let _id = args.CompanyInput._id;
        delete args.CompanyInput._id;
        let companyDetails = await Company.findByIdAndUpdate({_id},args.CompanyInput,{new:true});

        if(!companyDetails){
            return {
                error:true,
                message:'Could not update company details'
            }
        }

        return {
            error:true,
            message:'Details Updated Successfully',
            data:companyDetails
        }

    } catch (error) {
        return {
            error:true,
            message:'Could update the company details for some reason'
        }
    }
}

module.exports={
    addNewCompany,
    getAllCompanies,
    getCompanyByID,
    updateCompanyByID,
    getAllCompaniesFull
}