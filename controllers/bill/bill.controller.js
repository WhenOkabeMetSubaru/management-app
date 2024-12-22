const Bill = require('../../models/bill.model');

const addNewBill = async(_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return {
            error:true,
            message:'Admin Login is Required'
        }
    }

    try {
        
        args.BillInput.user = context.user_id;
        let billDetails = new Bill(args.BillInput);

        let result = await billDetails.save();

        if(!result){
            return {
                error:true,
                message:'Bill Could not be created'
            }
        }

        return {
            error:false,
            message:'Bill Created Successfully',
            data:result
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not create a bill'
        }
    }
}

const getAllBills = async(_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return {
            error:true,
            message:'Admin Login Required'
        }
    }
    try {
        
        let query = {
            doc_type:{
                $ne:"saved-doc"
            },
            user:context.user_id
        };

        args.status = '';
       
        
        if(args.status !==''){
            query = {
                status:args.status
            }
        }

        if(args.vehicle !==''){
            query = {
                ...query,
                vehicle:args.vehicle
            }
        }

        if(args.company !==''){
            query = {
                ...query,
                company:args.company
            }
        }

        if(args.start_time !== '' && args.end_time !== ''){
            query = {
                ...query,
                created:{
                    $gte:new Date(args.start_time),
                    $lt:new Date(args.end_time)
                }
            }
        }

       
        let options = {
            page:args.pageNumber || 0,
            limit:args.pageSize || 5,
            sort:{
                'created':-1
            }
        }

        // let billDetails = await Bill.find().sort({'created':-1});

        let billPagination = await Bill.paginate(query,options);


        if(!billPagination?.docs?.length>0){
            return {
                error:true,
                message:'Could not find any bills'
            }
        }

        return {
            error:false,
            message:'Bills found',
            data:billPagination.docs,
            totalDocs: billPagination.totalDocs,
            limit: billPagination.limit,
            totalPages: billPagination.totalPages,
            page: billPagination.page
        }

    } catch (error) {
        console.log(error)
      return {
        error:true,
        message:'Could not fetch Bill Details'
      }  
    }
}

const getAllBillsFull = async(_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return {
            error:true,
            message:'Admin Login Required'
        }
    }
    try {

        let billDetails = await Bill.find({$and:[{bill_type:'Bill'},{doc_type:{$ne:'saved-doc'}}],user:context.user_id}).sort({'created':-1});

 


        if(!billDetails?.length>0){
            return {
                error:true,
                message:'Could not find any bills'
            }
        }

        return {
            error:false,
            message:'Bills found',
            data:billDetails
        }

    } catch (error) {
        console.log(error)
      return {
        error:true,
        message:'Could not fetch Bill Details'
      }  
    }
}


const getBillByID = async(_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return {
            error:true,
            message:'Admin Login Required'
        }
    }
    try
     {
            if(!args.bill_id){
                return {
                    error:true,
                    message:'Bill ID is missing'
                }
            }

            let billDetails = await Bill.findById(args.bill_id);

            if(!billDetails){
                return {
                    error:true,
                    message:'Could not find any bill'
                }
            }

            return {
                error:true,
                message:'Bill Found',
                data:billDetails
            }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch Bill Details'
        }
    }
}

const updateBillByID = async (_,args,context)=>{
    if(!context.user_id && context.type !== 'admin'){
        return {
            error:true,
            message:'Admin Login Required'
        }
    }
    try {
        
        let _id = args.BillInput._id;
        delete args.BillInput._id;
        let billDetails = await Bill.findByIdAndUpdate({_id},args.BillInput,{new:true});

        if(!billDetails){
            return {
                error:true,
                message:'Could not update the bill'
            }
        }

        return {
            error:false,
            message:'Bill Updated Successfully',
            data:billDetails
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not update bill for some unknown reason'
        }
    }
}

const getBillTemplateByUser = async(_,args,context)=>{
    if(!context.user_id && context.type !== 'admin'){
        return {
            error:true,
            message:'Admin Login Required'
        }
    }
    try {
        
        let billDetails = await Bill.find({bill_type:'Bill',doc_type:'saved-doc',user:context.user_id}).limit(50);

        if(!billDetails?.length>0){
            return {
                error:true,
                message:'No Bills Found'
            }
        }

        return {
            error:false,
            message:'Bill Template Found',
            data:billDetails
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch details for some unknown reason'
        }
    }
}

const getLRTemplateByUser = async(_,args,context)=>{
    if(!context.user_id && context.type !== 'admin'){
        return {
            error:true,
            message:'Admin Login Required'
        }
    }
    try {
        
        let billDetails = await Bill.find({bill_type:'LR',doc_type:'saved-doc',user:context.user_id}).limit(50);

        if(!billDetails?.length>0){
            return {
                error:true,
                message:'No LR Bills Found'
            }
        }

        return {
            error:false,
            message:'LR Bill Template Found',
            data:billDetails
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch details for some unknown reason'
        }
    }
}

const getLoadingSlipTemplateByUser = async(_,args,context)=>{
    if(!context.user_id && context.type !== 'admin'){
        return {
            error:true,
            message:'Admin Login Required'
        }
    }
    try {
        
        let billDetails = await Bill.find({bill_type:'LoadingAdvice',doc_type:'saved-doc',user:context.user_id}).limit(50);

        if(!billDetails?.length>0){
            return {
                error:true,
                message:'No Loading Slip Found'
            }
        }

        return {
            error:false,
            message:'Loading Advice Template Found',
            data:billDetails
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch details for some unknown reason'
        }
    }
}

const deleteBillByID = async (_,args,context)=>{
    if (!context.user_id && context.type !== 'admin')
    {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try
    {

        let billDetails = await Bill.findByIdAndDelete({_id:args.bill_id})

        // if (!billDetails?.length > 0)
        // {
        //     return {
        //         error: true,
        //         message: 'Unable to delete'
        //     }
        // }

        return {
            error: false,
            message: 'Bill Deleted'
        }

    } catch (error)
    {
        return {
            error: true,
            message: 'Could not delete details for some unknown reason'
        }
    }
}

const checkBillNumberExists = async(_,args,context)=>{
    try {
      
        let billDetails = await Bill.find({bill_no:args.bill_no,user:context.user_id});
    

        if(billDetails?.length>0){
            return {
                error:true,
                message:"Exist"
            }
        }

        return {
            error:false,
            message:"Not Found"
        }


    } catch (error) {
        return {
            error:true,
            message:"Server Not Available"
        }
    }
}

module.exports = {
    addNewBill,
    getAllBills,
    getBillByID,
    updateBillByID,
    getAllBillsFull,
    getBillTemplateByUser,
    getLRTemplateByUser,
    getLoadingSlipTemplateByUser,
    deleteBillByID,
    checkBillNumberExists
}