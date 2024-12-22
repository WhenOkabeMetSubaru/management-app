const Truck = require('../../models/truck.model');
const Consignment = require('../../models/consignment.model')
const Fuel = require('../../models/fuel.model')
const Transaction = require('../../models/transaction.model');
const { default: mongoose } = require('mongoose');

const addNewTruck = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login is Required'
        }
    }

    try {
        args.TruckInput.user = context.user_id;

        let isFound = await Truck.findOne({ vehicle_no: args.TruckInput.vehicle_no });
        if (isFound) {
            return {
                error: true,
                message: 'Vehicle with same Number already exists'
            }
        }

        let truckDetails = new Truck(args.TruckInput);

        let result = await truckDetails.save();

        if (!result) {
            return {
                error: true,
                message: 'Truck Document Could not be created'
            }
        }

        return {
            error: false,
            message: 'Truck Document Created Successfully',
            data: result
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not create a Truck Document'
        }
    }
}

const getAllTrucks = async (_, args, context) => {
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
        args.status = '';


        if (args.status !== '') {
            query = {
                status: args.status,
                
            }
        }

        let options = {
            page: args.pageNumber || 0,
            limit: args.pageSize || 5,
            sort: {
                'created': -1
            }
        }

        // let truckDetails = await Truck.find().sort({'created':-1});

        let truckPagination = await Truck.paginate(query, options);

        if (!truckPagination?.docs?.length > 0) {
            return {
                error: true,
                message: 'Could not find any Trucks'
            }
        }

        return {
            error: false,
            message: 'Trucks found',
            data: truckPagination.docs,
            totalDocs: truckPagination.totalDocs,
            limit: truckPagination.limit,
            totalPages: truckPagination.totalPages,
            page: truckPagination.page
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch Truck Details'
        }
    }
}

const getAllTrucksFull = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {




        let truckDetails = await Truck.find({user:context.user_id}).sort({ 'created': -1 });

        if (!truckDetails?.length > 0) {
            return {
                error: true,
                message: 'Could not find any Trucks'
            }
        }

        return {
            error: false,
            message: 'Trucks found',
            data: truckDetails,

        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch Truck Details'
        }
    }
}

const getTruckByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        if (!args.truck_id) {
            return {
                error: true,
                message: 'Truck ID is missing'
            }
        }

        let truckDetails = await Truck.findById(args.truck_id);

        if (!truckDetails) {
            return {
                error: true,
                message: 'Could not find any Truck'
            }
        }

        return {
            error: true,
            message: 'Truck Found',
            data: truckDetails
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch Truck Details'
        }
    }
}

const updateTruckByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        let _id = args.TruckInput._id;
        delete args.TruckInput._id;

        let truckDetails = await Truck.findByIdAndUpdate({ _id }, args.TruckInput, { new: true });

        if (!truckDetails) {
            return {
                error: true,
                message: 'Could not update details'
            }
        }

        return {
            error: false,
            message: 'Details Updated Successfully',
            data: truckDetails
        }
    } catch (error) {
        return {
            error: true,
            message: 'Could not update details for some unknown reason'
        }
    }
}

const getAllVehicleRepairByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let { vehicle_repair_history } = await Truck.findById({ _id: args.truck_id }, { _id: 0, vehicle_repair_history: 1 });

        if (!vehicle_repair_history?.length > 0) {
            return {
                error: true,
                message: 'Could not find any details'
            }
        }
        return {
            error: false,
            message: 'Details Found Successfully',
            data: vehicle_repair_history
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch vehicle repair details for some reason'
        }
    }
}

const addVehicleRepairByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        let { repair_type, cost, reason, repaired_by, date_of_submit, date_of_return } = args;
        let repairData = {
            repair_type, cost, reason, repaired_by, date_of_submit, date_of_return
        }

        let { vehicle_repair_history } = await Truck.findByIdAndUpdate({ _id: args.truck_id }, {
            $push: {
                vehicle_repair_history: {
                    $each: [repairData],
                    $position: 0
                }
            }
        }, { new: true, "fields": { _id: 0, vehicle_repair_history: 1 } });

        if (!vehicle_repair_history) {
            return {
                error: true,
                message: 'Could not update  details'
            }
        }

        return {
            error: false,
            message: 'Repair Details Successfully Updated',
            data: vehicle_repair_history

        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not add new details for some unknown reason'
        }
    }
}

const getAllDeliveryRouteByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let { delivery_route_history } = await Truck.findById({ _id: args.truck_id }, { _id: 0, delivery_route_history: 1 });

        if (!delivery_route_history?.length > 0) {
            return {
                error: true,
                message: 'Could not find any details'
            }
        }
        return {
            error: false,
            message: 'Details Found Successfully',
            data: delivery_route_history
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch delivery route details for some reason'
        }
    }
}

const addDeliveryRouteByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        let { from, to, start_date, end_date, cost_incurred } = args;
        let deliveryRouteData = {
            from,
            to,
            start_date,
            end_date,
            cost_incurred
        }

        let { delivery_route_history } = await Truck.findByIdAndUpdate({ _id: args.truck_id }, {
            $push: {
                delivery_route_history: {
                    $each: [deliveryRouteData],
                    $position: 0
                }
            }
        }, { new: true, "fields": { _id: 0, delivery_route_history: 1 } });

        if (!delivery_route_history) {
            return {
                error: true,
                message: 'Could not update  details'
            }
        }

        return {
            error: false,
            message: 'Delivery Route Details Successfully Updated',
            data: delivery_route_history

        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not add new details for some unknown reason'
        }
    }
}


const getTruckAnalyticDataByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        const today = new Date();
        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);;
        let lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 31)
        let tempDate = [];
        let temp = new Date();
        temp.setDate(temp.getDate() - 7);

        let tempMonthDate = [];

        let tempMonth = new Date();
        tempMonth.setDate(tempMonth.getDate() - 30);

        let consignmentDetails = await Consignment.aggregate([
            {
                $match: {
                    truck: mongoose.Types.ObjectId(args._id),
                    created: {
                        $gt: lastMonth,
                        $lte: today
                    }
                }
            },
            {
                $group: {
                    "_id": "$_id",
                    tolls_total: { $sum: { $sum: "$tolls.amount" } },
                    expense_total: { $sum: { $sum: "$additional_expenses.total_cost" } }
                }
            }
        ])

        let transactionDetails = await Transaction.aggregate([
            {
                $match: {
                    truck: mongoose.Types.ObjectId(args._id),
                    created: {
                        $gt: lastMonth,
                        $lte: today
                    },
                    transaction_status: 'completed'
                }
            },
            {
                $project: {
                    _id: 1,
                    amount_to_send: 1,
                    consignment: 1
                }
            },
            {
                $group: {
                    "_id": "$consignment",
                    "transactions_count": { $sum: 1 },
                    "total_transaction_amount": { $sum: { $toInt: "$amount_to_send" } }

                }
            },
            {
                $lookup: {
                    from: "consignments",
                    localField: "_id",
                    foreignField: "_id",
                    as: "consignmentData"
                }
            },
            {
                $unwind: "$consignmentData"
            },
            {
                $project: {
                    transactions_count: 1,
                    total_transaction_amount: 1,
                    _id: 0,
                    location: { $concat: ["$consignmentData.start_location_name", " -> ", "$consignmentData.destination_name"] },
                }
            }
        ])

        const fuelDetails = await Fuel.aggregate([
            {
                $match: {
                    truck: mongoose.Types.ObjectId(args._id),
                    created: {
                        $gt: lastMonth,
                        $lte: today
                    },
                    
                }
            },
            {
                $project:{
                    _id:1,
                    truck:1,
                    consignment:1,
                    cost:1,
                    petrol_pump_name:1,
                    location:1
                }
            },
            {
                $group:{
                    "_id":'$consignment',
                    total_cost:{$sum:"$cost"},
                    times_fuel_filled:{$sum:1}
                }
            },
            {
                $lookup:{
                    from:'consignments',
                    localField:'_id',
                    foreignField:'_id',
                    as:'consignmentData'
                }
            },
            {
                $unwind:'$consignmentData'
            },
            {
                $project:{
                    _id:0,
                    total_cost:1,
                    times_fuel_filled:1,
                    location:{$concat:["$consignmentData.start_location_name"," -> ","$consignmentData.destination_name"]}
                }
            }
        ])

        console.log(consignmentDetails, fuelDetails)

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch truck details for some unknown reason'
        }
    }
}

const checkPendingTruckExists = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let isExists = await Consignment.findOne({ truck: args._id, delivery_status: "pending" });

        if (isExists) {
            return {
                error: true,
                message: 'The truck already has a pending entry'
            }
        }

        return {
            error: false,
            message: "No Entries Found"
        }

    } catch (error) {
        return {
            error: true,
            message: 'Some Error Occurred'
        }
    }
}

module.exports = {
    addNewTruck,
    getAllTrucks,
    getTruckByID,
    updateTruckByID,
    getAllVehicleRepairByID,
    addVehicleRepairByID,
    getAllDeliveryRouteByID,
    addDeliveryRouteByID,
    getAllTrucksFull,
    getTruckAnalyticDataByID,
    checkPendingTruckExists
}