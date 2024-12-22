const Transaction = require('../../models/transaction.model');


const addNewTransaction = async(_,args,context)=>{
    if(!context.user_id && !context.type =='admin'){
        return {
            error:true,
            message:'Admin Login Required'
        }
    }
    try {
        
        args.TransactionInput.user = context.user_id;
        let transaction = new Transaction(args.TransactionInput);
        let result =await transaction.save();
        return {
            error:false,
            message:'Transaction Successfully Added',
            data:result
        }


    } catch (error) {
        return {
            error:true,
            message:'Could not create a transaction'
        }
    }
}

const getAllTransactions = async(_,args,context)=>{
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
        if(args.truck){
            query = {
                ...query,
                truck:args.truck
            }
        }

        if(args.company){
            query = {
                ...query,
                company:args.company
            }
        }

        if(args.consignment){
            query = {
                ...query,
                consignment:args.consignment
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

        if(args.bill){
            query = {
                ...query,
                bill:args.bill
            }
        }

        let options = {
            page:args.pageNumber || 0,
            limit:args.pageSize || 5,
            sort:{
                'created':-1
            }
        }
      
        let pageTransactions   = await Transaction.paginate(query,options);
        

        // let transactions = await Transaction.find().sort({'created':-1});
        // if(!transactions.length>0){
        //     return {
        //         error:true,
        //         message:'No Transactions Found'
        //     }
        // }
        if(!pageTransactions.docs?.length > 0){
            return {
                error:true,
                message:'No Transactions Found'
            }
        }

        
        return {
            error:false,
            message:'Transactions Found',
            data:pageTransactions.docs,
            totalDocs: pageTransactions.totalDocs,
            limit: pageTransactions.limit,
            totalPages: pageTransactions.totalPages,
            page: pageTransactions.page
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch transaction details'
        }
    }
}

const getTransactionByID = async(_,args,context)=>{
    if(!context.user_id && !context.text=='admin'){
        return {
            error:true,
            message:'Admin Login is required'
        }
    }
    try {
        
        if(!args.transaction_id){
            return {
                error:true,
                message:'Transaction ID is missing'
            }
        }

        let transactionDetails = await Transaction.findById({_id:args.transaction_id});

        if(!transactionDetails){
            return {
                error:true,
                message:'No Such Transaction Found'
            }
        }

        return {
            error:false,
            message:'Transaction Details Retrieved Successfully',
            data:transactionDetails
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch the transaction details'
        }
    }
}

const getTransactionsFull = async(_,args,context)=>{
    if(!context.user_id && !context.text=='admin'){
        return {
            error:true,
            message:'Admin Login is required'
        }
    }
    try {
        
     

        let transactionDetails = await Transaction.find({user:context.user_id}).sort({created:'-1'}).limit(50);

        if(!transactionDetails?.length>0){
            return {
                error:true,
                message:'No Such Transaction Found'
            }
        }

        return {
            error:false,
            message:'Transaction Details Retrieved Successfully',
            data:transactionDetails
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not fetch the transaction details'
        }
    }
}

const updateTransactionByID = async (_,args,context)=>{
    if(!context.user_id && context.type !== 'admin'){
        return {
            error:true,
            message:'Admin Login is Required'
        }
    }
    try {
        
        let _id = args.TransactionInput._id;
        delete args.TransactionInput._id;
        let transactionDetails = await Transaction.findByIdAndUpdate({_id},args.TransactionInput,{new:true});

        if(!transactionDetails){
            return {
                error:true,
                message:'Could not update transaction details'
            }
        }

        return {
            error:false,
            message:'Details Updated Successfully',
            data:transactionDetails
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not update transaction details for some unknown reason'
        }
    }
}

module.exports={
    addNewTransaction,
    getAllTransactions,
    getTransactionByID,
    updateTransactionByID,
    getTransactionsFull
}