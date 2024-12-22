const { default: mongoose } = require('mongoose');
const { responseError } = require('../../helpers/response');
const Consignment = require('../../models/consignment.model');
const Fuel = require('../../models/fuel.model');
const Transaction = require('../../models/transaction.model');
const { last } = require('lodash');


const addNewConsignment = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login is Required'
        }
    }

    try {

        args.ConsignmentInput.user = context.user_id;
        let consignmentDetails = new Consignment(args.ConsignmentInput);

        let result = await consignmentDetails.save();

        if (!result) {
            return {
                error: true,
                message: 'Consignment Document Could not be created'
            }
        }

        return {
            error: false,
            message: 'Consignment Document Created Successfully',
            data: result
        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not create a Consignment Document'
        }
    }
}

const getAllConsignments = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let query = {
            user:context.user_id
        };



        if (args.status !== '') {
            query = {
                status: args.status
            }
        }

        if (args.company) {
            query = {
                ...query,
                company: args.company
            }
        }

        if (args.primary_driver) {
            query = {
                ...query,
                primary_driver: args.primary_driver
            }
        }

        if (args.truck) {
            query = {
                ...query,
                truck: args.truck
            }
        }

        if (args.start_time !== '' && args.end_time !== '') {
            query = {
                ...query,
                created: {
                    $gte: new Date(args.start_time),
                    $lt: new Date(args.end_time)
                }
            }
        }

        if (args.start_location_name) {
            let str = new RegExp(args.start_location_name, 'i');
            query = {
                ...query,
                start_location_name: {
                    $regex: str
                }
            }
        }


        if (args.destination_name) {
            let str = new RegExp(args.destination_name, 'i')
            query = {
                ...query,
                destination_name: {
                    $regex: str
                }
            }
        }



        let options = {
            page: args.pageNumber || 0,
            limit: args.pageSize || 5,
            populate: [{ path: 'truck', select: '_id vehicle_no' }],
            sort: {
                'created': -1
            },
            select: {
                fuel_filled_location: 0,
                stoppages: 0,
                tolls: 0,
                additional_expenses: 0,
                fines: 0,
                vehicle_damage_types: 0
            }
        }

        let consignmentPagination = await Consignment.paginate(query, options);



        // let consignmentDetails = await Consignment.find({},{fuel_filled_location:0,stoppages:0,tolls:0,additional_expenses:0}).sort({ 'created': -1 });
        if (!consignmentPagination?.docs?.length > 0) {
            return {
                error: true,
                message: 'Could not find any Consignments'
            }
        }

        return {
            error: false,
            message: 'Consignments found',
            data: consignmentPagination?.docs,
            totalDocs: consignmentPagination.totalDocs,
            limit: consignmentPagination.limit,
            totalPages: consignmentPagination.totalPages,
            page: consignmentPagination.page
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch consignment Details'
        }
    }
}

const getAllConsignmentsFull = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let consignmentDetails = await Consignment.find({user:context.user_id}, { fuel_filled_location: 0, stoppages: 0, tolls: 0, additional_expenses: 0 }).sort({ 'created': -1 }).limit(100);
        if (!consignmentDetails?.length > 0) {
            return {
                error: true,
                message: 'Could not find any Consignments'
            }
        }

        return {
            error: false,
            message: 'Consignments found',
            data: consignmentDetails
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch consignment Details'
        }
    }
}


const getConsignmentByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        if (!args.consignment_id) {
            return {
                error: true,
                message: 'Consignment ID is missing'
            }
        }

        let consignmentDetails = await Consignment.findById(args.consignment_id, { fuel_filled_location: 0, stoppages: 0, tolls: 0, additional_expenses: 0 });

        if (!consignmentDetails) {
            return {
                error: true,
                message: 'Could not find any Consignment'
            }
        }

        return {
            error: true,
            message: 'Consignment Found',
            data: consignmentDetails
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch Consignment Details'
        }
    }
}

const updateConsignmentByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let _id = args.ConsignmentInput._id;
        delete args.ConsignmentInput._id;

        let consignmentDetails = await Consignment.findByIdAndUpdate({ _id }, args.ConsignmentInput, { new: true });
        if (!consignmentDetails) {
            return {
                error: true,
                message: 'Could not update Details'
            }
        }

        return {
            error: false,
            message: 'Details Updated Successfully',
            data: consignmentDetails
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not update details due to unknown reasons'
        }
    }
}

const getFuelFilledLocationByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        // let fuelData = await Consignment.aggregate([
        //     {
        //         $match:{
        //             _id:mongoose.Types.ObjectId(args.consignment_id)
        //         },

        //     },
        //     {
        //         $project:{
        //             _id:0,
        //             fuel_filled_location:1
        //         }
        //     },
        //     {
        //         $unwind:"$fuel_filled_location"

        //     },
        //     {
        //         $sort:{
        //             'fuel_filled_location.created':-1
        //         }
        //     },
        //     {
        //         $group:{
        //             _id:"$_id",
        //             "fuel_filled_location":{$push:"$fuel_filled_location"}
        //         }
        //     }

        // ]);

        let { fuel_filled_location } = await Consignment.findById({ _id: args.consignment_id }, { _id: 0, fuel_filled_location: 1 })

        // let {fuel_filled_location} = fuelData[0];
        if (!fuel_filled_location?.length > 0) {
            return {
                error: true,
                message: 'No Data Found'
            }
        }

        return {
            error: false,
            message: 'Fuel Data Found',
            data: fuel_filled_location
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch the fuel details for some reason'
        }
    }
}

const addFuelFilledLocationByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let fuelFilledLocationData = {
            location: args.location,
            amount: args.amount,
            fuel_before_filling: args.fuel_before_filling,
            fuel_after_filling: args.fuel_after_filling,
            time_spent: args.time_spent
        }

        // let { fuel_filled_location } = await Consignment.findByIdAndUpdate({ _id: args.consignment_id }, {
        //     $push: {
        //         fuel_filled_location: fuelFilledLocationData
        //     }
        // }, { new: true, "fields": { _id: 0, fuel_filled_location: 1 } });
        let { fuel_filled_location } = await Consignment.findByIdAndUpdate({ _id: args.consignment_id }, {
            $push: {
                fuel_filled_location: {
                    $each: [fuelFilledLocationData],
                    $position: 0
                }
            }
        }, { new: true, "fields": { _id: 0, fuel_filled_location: 1 } });



        if (!fuel_filled_location) {
            return {
                error: true,
                message: 'Could not update fuel details'
            }
        }

        return {
            error: false,
            message: 'Fuel Details Successfully Updated',
            data: fuel_filled_location

        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not add new details for some unknown reason'
        }
    }
}

const getAllStoppagesByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let { stoppages } = await Consignment.findById({ _id: args.consignment_id }, { _id: 0, stoppages: 1 });

        if (!stoppages?.length > 0) {
            return {
                error: true,
                message: 'Could not find any details'
            }
        }
        return {
            error: false,
            message: 'Details Found Successfully',
            data: stoppages
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch stoppage details for some reason'
        }
    }
}

const addStoppageByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        let { location, arrived_at, departed_at, fuel_on_arrival, fuel_on_departure, time_spent } = args;
        let stoppageData = {
            location,
            arrived_at,
            departed_at,
            fuel_on_arrival,
            fuel_on_departure,
            time_spent,

        }

        // let { fuel_filled_location } = await Consignment.findByIdAndUpdate({ _id: args.consignment_id }, {
        //     $push: {
        //         fuel_filled_location: fuelFilledLocationData
        //     }
        // }, { new: true, "fields": { _id: 0, fuel_filled_location: 1 } });
        let { stoppages } = await Consignment.findByIdAndUpdate({ _id: args.consignment_id }, {
            $push: {
                stoppages: {
                    $each: [stoppageData],
                    $position: 0
                }
            }
        }, { new: true, "fields": { _id: 0, stoppages: 1 } });



        if (!stoppages) {
            return {
                error: true,
                message: 'Could not update  details'
            }
        }

        return {
            error: false,
            message: 'Stoppage Details Successfully Updated',
            data: stoppages

        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not add new details for some unknown reason'
        }
    }
}

const getAllTollsByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let { tolls } = await Consignment.findById({ _id: args.consignment_id }, { _id: 0, tolls: 1 });

        if (!tolls?.length > 0) {
            return {
                error: true,
                message: 'Could not find any details'
            }
        }
        return {
            error: false,
            message: 'Details Found Successfully',
            data: tolls
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch tolls details for some reason'
        }
    }
}

const addTollByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        let { location, amount } = args;
        let tollData = {
            location,
            amount
        }

        // let { fuel_filled_location } = await Consignment.findByIdAndUpdate({ _id: args.consignment_id }, {
        //     $push: {
        //         fuel_filled_location: fuelFilledLocationData
        //     }
        // }, { new: true, "fields": { _id: 0, fuel_filled_location: 1 } });
        let { tolls } = await Consignment.findByIdAndUpdate({ _id: args.consignment_id }, {
            $push: {
                tolls: {
                    $each: [tollData],
                    $position: 0
                }
            }
        }, { new: true, "fields": { _id: 0, tolls: 1 } });

        if (!tolls) {
            return {
                error: true,
                message: 'Could not update  details'
            }
        }

        return {
            error: false,
            message: 'Toll Details Successfully Updated',
            data: tolls

        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not add new details for some unknown reason'
        }
    }
}

const getAllExpensesByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let { additional_expenses } = await Consignment.findById({ _id: args.consignment_id }, { _id: 0, additional_expenses: 1 });

        if (!additional_expenses?.length > 0) {
            return {
                error: true,
                message: 'Could not find any details'
            }
        }
        return {
            error: false,
            message: 'Details Found Successfully',
            data: additional_expenses
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch tolls details for some reason'
        }
    }
}

const addExpenseByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        let { expense_info, total_cost, paid_to_driver, date } = args;
        let expenseData = {
            expense_info,
            total_cost,
            paid_to_driver,
            date
        }

        let { additional_expenses } = await Consignment.findByIdAndUpdate({ _id: args.consignment_id }, {
            $push: {
                additional_expenses: {
                    $each: [expenseData],
                    $position: 0
                }
            }
        }, { new: true, "fields": { _id: 0, additional_expenses: 1 } });

        if (!additional_expenses) {
            return {
                error: true,
                message: 'Could not update  details'
            }
        }

        return {
            error: false,
            message: 'Expense Details Successfully Updated',
            data: additional_expenses

        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not add new details for some unknown reason'
        }
    }
}

const getAllFinesByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let { fines } = await Consignment.findById({ _id: args.consignment_id }, { _id: 0, fines: 1 });

        if (!fines?.length > 0) {
            return {
                error: true,
                message: 'Could not find any details'
            }
        }
        return {
            error: false,
            message: 'Details Found Successfully',
            data: fines
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch tolls details for some reason'
        }
    }
}

const addFineByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        let { location, amount, reason, date } = args;
        let fineData = {
            location,
            amount,
            reason,
            date
        }

        let { fines } = await Consignment.findByIdAndUpdate({ _id: args.consignment_id }, {
            $push: {
                fines: {
                    $each: [fineData],
                    $position: 0
                }
            }
        }, { new: true, "fields": { _id: 0, fines: 1 } });

        if (!fines) {
            return {
                error: true,
                message: 'Could not update  details'
            }
        }

        return {
            error: false,
            message: 'Fine Details Successfully Updated',
            data: fines

        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not add new details for some unknown reason'
        }
    }
}

const getAllVehicleDamagesByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let { vehicle_damage_types } = await Consignment.findById({ _id: args.consignment_id }, { _id: 0, vehicle_damage_types: 1 });

        if (!vehicle_damage_types?.length > 0) {
            return {
                error: true,
                message: 'Could not find any details'
            }
        }
        return {
            error: false,
            message: 'Details Found Successfully',
            data: vehicle_damage_types
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch vehicle damage details for some reason'
        }
    }
}

const addVehicleDamageByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        let { damage_type, amount_charged, time_to_repair, date } = args;
        let damageData = {
            damage_type,
            amount_charged,
            time_to_repair,
            date
        }

        let { vehicle_damage_types } = await Consignment.findByIdAndUpdate({ _id: args.consignment_id }, {
            $push: {
                vehicle_damage_types: {
                    $each: [damageData],
                    $position: 0
                }
            }
        }, { new: true, "fields": { _id: 0, vehicle_damage_types: 1 } });

        if (!vehicle_damage_types) {
            return {
                error: true,
                message: 'Could not update  details'
            }
        }

        return {
            error: false,
            message: 'Damage Details Successfully Updated',
            data: vehicle_damage_types

        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not add new details for some unknown reason'
        }
    }
}


const getConsignmentExpenseMetrics = async (_, args, context) => {
    if (!context.user_id || context.type !== 'admin') {
        return responseError(true, "Unauthorized Access,Admin Login Required")
    }
    try {

        let outputData = {};

        let consignmentDetails = await Consignment.findById({ _id: args._id });

        let totalAmount = 0;

        let tollAmount = consignmentDetails?.tolls?.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.amount
        }, 0);

        outputData.allTolls = consignmentDetails?.tolls?.map((toll) => {
            return {
                name: toll.location,
                amount: toll.amount
            }

        })

        totalAmount += tollAmount || 0;


        let fuelData = await Fuel.find({ consignment: args._id });

        let fuelExpenses = fuelData?.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.cost
        }, 0);

        outputData.allFuels = fuelData?.map((fuel) => {
            return {
                name: fuel.location,
                amount: fuel.cost
            }
        })

        totalAmount += fuelExpenses || 0;

        let transactionData = await Transaction.find({ consignment: args._id });

        let transactionExpense = transactionData?.reduce((accumulator, currentValue) => {
            return accumulator + +currentValue.amount_to_send
        }, 0);

        outputData.allTransactions = transactionData?.map((transaction) => {
            return {
                name: transaction.sender_name + " -> " + transaction.receiver_name,
                amount: +transaction.amount_to_send
            }
        })


        totalAmount += transactionExpense

        let additional_expense_charge = consignmentDetails?.additional_expenses?.reduce((accumulator, currentValue) => {

            return accumulator + currentValue.total_cost
        }, 0);

        outputData.allAdditionalCharges = consignmentDetails?.additional_expenses?.map((expense) => {
            return {
                name: expense.expense_info,
                amount: expense.total_cost
            }
        })

        totalAmount += additional_expense_charge || 0

        outputData = {
            ...outputData,
            fuelExpense: fuelExpenses || 0,
            transactionExpense: transactionExpense || 0,
            tollExpense: tollAmount || 0,
            additionalExpense: additional_expense_charge || 0,
            totalAmount: totalAmount || 0

        }



        return {
            error: false,
            message: 'Expense Data Calculated Successfully',
            data: outputData
        }


    } catch (error) {

        return {
            error: true,
            message: 'Cannot Calculate the expense Data'
        }
    }
}




module.exports = {
    addNewConsignment,
    getAllConsignments,
    getConsignmentByID,
    updateConsignmentByID,
    getFuelFilledLocationByID,
    addFuelFilledLocationByID,
    getAllStoppagesByID,
    addStoppageByID,
    getAllTollsByID,
    addTollByID,
    getAllExpensesByID,
    addExpenseByID,
    getAllFinesByID,
    addFineByID,
    getAllVehicleDamagesByID,
    addVehicleDamageByID,
    getAllConsignmentsFull,
    getConsignmentExpenseMetrics
}

