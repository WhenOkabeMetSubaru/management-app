const { responseError, responseSuccess } = require('../../helpers/response');
const Fuel = require('../../models/fuel.model');

const addNewFuel = async (_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return {
            error:true,
            message:'User not authorized Admin Login Required'
        }
    }
    try {
        args.FuelInput.user = context.user_id;
        let fuelData = new Fuel(args.FuelInput);
        let result = await fuelData.save();

        if(!result){
            return  {
                error:true,
                message:'Fuel data creation unsuccessful'
            }
        }

        return {
            error:false,
            message:'Fuel Data Created Successfully',
            data:result
        }

    } catch (error) {
        return {
            error:true,
            message:'Could not create fuel data for some reason'
        }
    }
}

const updateFuelByID = async (_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return responseError(true,"User not authorized ,admin login is required")
    }
    try {
        
        let isFound = await Fuel.findById({_id:args.FuelUpdate._id});
       
        if(!isFound) return responseError(true,"Fuel Data Not Found");
        let _id = args.FuelUpdate._id;
        delete args.FuelUpdate._id
        let result = await Fuel.findByIdAndUpdate({_id},args.FuelUpdate,{new:true});
       
        return {
            error:false,
            message:'Successfully updated',
            data:result
        }

    } catch (error) {
        return responseError(true,"Could not update details for some unknown reason")
    }
}

const deleteFuelByID = async (_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return responseError(true,"User not authorized ,admin login is required")
    }
    try {
        
        let isFound = await Fuel.findById({_id:args._id});

        if(!isFound) return responseError(true,"Fuel Data Not Found");

        let result = await Fuel.findByIdAndDelete({_id:args._id});

        return {
            error:false,
            message:'Successfully Deleted',
            data:result
        }

    } catch (error) {
        return responseError(true,"Could not update details for some unknown reason")
    }
}


const getFuelByID = async (_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return responseError(true,"User not authorized ,admin login is required")
    }
    try {
        
        let fuelDetails = await Fuel.findById({_id:args._id});

        if(!fuelDetails) return responseError(true,"Fuel Data Not Found");

  

        return {
            error:false,
            message:'Successfully fetched',
            data:fuelDetails
        }

    } catch (error) {
        return responseError(true,"Could not update details for some unknown reason")
    }
}


const getAllFuelsFull = async (_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return responseError(true,"User not authorized ,admin login is required")
    }
    try {
        
        let fuelDetails = await Fuel.find({user:context.user_id});

        if(!fuelDetails?.length>0) return responseError(true,"Fuel Data Not Found");

  
        return {
            error:false,
            message:'Successfully fetched',
            data:fuelDetails
        }
        

    } catch (error) {
        return responseError(true,"Could not fetch details for some unknown reason")
    }
}

const getAllFuels = async (_,args,context)=>{
    if(!context.user_id && context.type !=='admin'){
        return responseError(true,"User not authorized ,admin login is required")
    }
    try {
        
        let query = {
            user:context.user_id
        };

        if(args.truck !==""){
            query = {
                ...query,
                truck:args.truck
            }
        }

        if(args.driver !== ""){
            query = {
                ...query,
                driver:args.driver
            }
        }

        if(args.consignment !== ""){
            query = {
                ...query,
                consignment:args.consignment
            }
        }
        
        if(args.transaction !== ""){
            query = {
                ...query,
                transaction:args.transaction
            }
        }

        if(args.start_time !== "" && args.end_time !== ""){
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
            populate:[{path:'truck',select:'_id vehicle_no'}],
            sort:{
                'created':-1
            }
        }
      
        let fuelData = await Fuel.paginate(query,options)
     
        if(!fuelData?.docs?.length>0) responseError(true,'No Fuel Data Found')

        return {
            error:false,
            message:'Fuel Data found',
            data:fuelData.docs,
            totalDocs: fuelData.totalDocs,
            limit: fuelData.limit,
            totalPages: fuelData.totalPages,
            page: fuelData.page
        }

    } catch (error) {
        
        return {
            error:true,
            message:'Could not fetch details for some unknown reason'
        }
    }
}


module.exports = {
    addNewFuel,
    updateFuelByID,
    deleteFuelByID,
    getAllFuels,
    getFuelByID,
    getAllFuelsFull 
}