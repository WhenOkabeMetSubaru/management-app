const User = require('../../models/user.model');
const Bill = require('../../models/bill.model')
const Truck = require('../../models/truck.model')
const Company = require('../../models/company.model')
const Consignment = require('../../models/consignment.model');
const Transaction = require('../../models/transaction.model');
const Fuel = require('../../models/fuel.model')
const extend = require('lodash/extend');
const { findByIdAndUpdate } = require('../../models/user.model');
const { default: mongoose } = require('mongoose');


const addNewUser = async (root, args, context) => {


    const user = new User(args.UserInput);



    try {
        let isfound = await User.findOne({ email: user.email });
        
        if (isfound) {
            return {
                error: true,
                message: "User Already exists"
            }
        }
        user.user_type="admin";
        await user.save();
        return {
            error: false,
            message: "User Created Successfully",
            data: user
        }
    } catch (err) {
        console.log(err)
        return {
            error: true,
            message: 'Could not create a user',

        }
    }
}

const getAllUsers = async (req, res) => {
    try {

        let users = await User.find().sort({ 'created': -1 });
        // console.log(users)
        return {
            error: false,
            message: "User retrieved Successfully",
            data: users
        }


    } catch (err) {
        return {
            error: true,
            message: 'Could not retrieve User'
        }
    }
}

const getUserByID = async (_, args, context) => {
    if (!context.user_id && !context.type) {
        return {
            error: true,
            message: "Login is required"
        }
    }
    try {



        let user = await User.findById(context.user_id);
        if (!user) {
            return {
                error: true,
                message: "No User Found"
            }
        }

        user.hashed_password = undefined;
        user.salt = undefined;
        return {
            error: false,
            message: "User Successfully Retrieved",
            data: user
        }
    } catch (err) {
        return {
            error: true,
            message: "Could not retrieve User"
        }
    }
}

const read = async (req, res) => {


    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    return res.json({
        error: false,
        message: 'Data retrieving Successful',
        data: req.profile
    });
}

const updateUser = async (_, args, context) => {

    if (!context.user_id && !context.type) {
        return {
            error: true,
            message: 'Login is required'
        }
    }

    try {
        if (context.user_id !== args.UserUpdateInput._id) {
            return {
                error: true,
                message: 'User not authorized'
            }
        }

        // let user = args.UserUpdateInput._id;
        // user = extend(user, args.UserUpdateInput);
        // user.updated = Date.now();
        // await user.save();
        let user = await User.findById(args.UserUpdateInput._id);
        delete args.UserUpdateInput._id;
        user = extend(user, args.UserUpdateInput)

        user.updated = Date.now();
        // let user = await User.findByIdAndUpdate({_id:args.UserUpdateInput._id},args.UserUpdateInput,{new:true});
        await user.save();


        return {
            error: false,
            message: 'User updated Successfully',
            data: user
        }

    } catch (err) {
        return {
            error: true,
            message: 'Could not update user'
        }
    }
}

const remove = async (req, res) => {
    try {
        let user = req.profile;
        let deletedUser = user.remove();
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;
        return res.json({
            error: false,
            message: 'Delete Successfully',
            data: deletedUser
        });

    } catch (err) {
        res.status(400).json({
            error: true,
            message: 'Could not delete user'
        })
    }
}


const addNewDriver = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {
        args.UserInput.user = context.user_id;
        if (!args.UserInput.name) {
            return {
                error: true,
                message: 'Some Fields are missing'
            }
        }
        if (!args.UserInput.password) args.UserInput.password = 'truckdriver';

        let isFound = await User.findOne({ 'name': args.UserInput.name });
        if (isFound) {
            return {
                error: true,
                message: 'User with Name or Email Already Exists'
            }
        }

        let newDriver = new User(args.UserInput);

        let result = await newDriver.save();

        return {
            error: false,
            message: 'User Successfully Created',
            data: result
        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not create a driver'
        }
    }
}

const getAllDrivers = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let query = {
            user_type: "driver",
            user:context.user_id
        };

        if (args.status != '') {
            query = {
                status: args.status
            }
        }

        let options = {
            page: args.pageNumber || 0,
            limit: args.pageSize || 5,
            populate: [{ path: 'truck_managed', select: '_id vehicle_no' }],
            sort: {
                'created': -1
            }
        }

        // let drivers = await User.find({user_type:'driver'}).sort({'created':-1})
        let driversData = await User.paginate(query, options);

        if (!driversData?.docs?.length > 0) {
            return {
                error: true,
                message: 'No Drivers Found'
            }
        }

        return {
            error: false,
            message: 'Drivers Found',
            data: driversData.docs,
            totalDocs: driversData.totalDocs,
            limit: driversData.limit,
            totalPages: driversData.totalPages,
            page: driversData.page
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch Driver Details'
        }
    }
}

const getAllDriversFull = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {



        let drivers = await User.find({ user_type: 'driver',user:context.user_id }).sort({ 'created': -1 })


        if (!drivers?.length > 0) {
            return {
                error: true,
                message: 'No Drivers Found'
            }
        }

        return {
            error: false,
            message: 'Drivers Found',
            data: drivers,

        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not fetch Driver Details'
        }
    }
}

const getDriverByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        if (!args.user_id) {
            return {
                error: true,
                message: 'User ID is not supplied'
            }
        }

        let driverDetails = await User.findById({ _id: args.user_id });

        if (!driverDetails) {
            return {
                error: true,
                message: 'Driver does not exist'
            }
        }

        return {
            error: false,
            message: 'Driver Found',
            data: driverDetails
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not find the driver'
        }
    }
}

const updateDriverByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }

    try {

        let _id = args.UpdateInput._id;
        delete args.UpdateInput._id
        let updatedContact = await User.findByIdAndUpdate({ _id }, args.UpdateInput, { new: true });

        if (!updatedContact) {
            return {
                error: true,
                message: 'Could not update the User'
            }
        }

        return {
            error: true,
            message: 'User Updated Successfully',
            data: updatedContact
        }


    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Updating User Failed'
        }
    }
}



const addNewContact = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        args.UserInput.user = context.user_id;
        if (!args.UserInput.name) {
            return {
                error: true,
                message: 'Some Fields are missing'
            }
        }
        if (!args.UserInput.password) args.UserInput.password = 'contact';

        let isFound = await User.findOne({ 'name': args.UserInput.name });
        if (isFound) {
            return {
                error: true,
                message: 'User with Name or Email Already Exists'
            }
        }

        let newContact = new User(args.UserInput);

        let result = await newContact.save();

        return {
            error: false,
            message: 'Contact Successfully Created',
            data: result
        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not create a driver'
        }
    }
}

const getAllContacts = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        let query = {
            user_type: "contact",
            user:context.user_id
        };

        if (args.status != '') {
            query = {
                status: args.status
            }
        }

        let options = {
            page: args.pageNumber || 0,
            limit: args.pageSize || 5,
            sort: {
                'created': -1
            }
        }

        let contactPaginationData = await User.paginate(query, options)

        // let contacts = await User.find({user_type:'contact'}).sort({'created':-1})

        if (!contactPaginationData?.docs?.length > 0) {
            return {
                error: true,
                message: 'No Contacts Found'
            }
        }

        return {
            error: false,
            message: 'Contacts Found',
            data: contactPaginationData.docs,
            totalDocs: contactPaginationData.totalDocs,
            limit: contactPaginationData.limit,
            totalPages: contactPaginationData.totalPages,
            page: contactPaginationData.page
        }

    } catch (error) {

        return {
            error: true,
            message: 'Could not fetch Contact Details'
        }
    }
}

const getContactByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }
    try {

        if (!args.user_id) {
            return {
                error: true,
                message: 'User ID is not supplied'
            }
        }

        let contactDetails = await User.findById({ _id: args.user_id });

        if (!contactDetails) {
            return {
                error: true,
                message: 'Contact does not exist'
            }
        }

        return {
            error: false,
            message: 'Driver Found',
            data: contactDetails
        }

    } catch (error) {
        return {
            error: true,
            message: 'Could not find the contact'
        }
    }
}

const updateContactByID = async (_, args, context) => {
    if (!context.user_id && context.type !== 'admin') {
        return {
            error: true,
            message: 'Admin Login Required'
        }
    }

    try {

        let _id = args.UpdateInput._id;
        delete args.UpdateInput._id
        let updatedContact = await User.findByIdAndUpdate({ _id }, args.UpdateInput, { new: true });

        if (!updatedContact) {
            return {
                error: true,
                message: 'Could not update the User'
            }
        }

        return {
            error: true,
            message: 'User Updated Successfully',
            data: updatedContact
        }


    } catch (error) {

        return {
            error: true,
            message: 'Updating User Failed'
        }
    }
}


const getDashboardData = async (_, args, context) => {
    console.log(context)
    try {

        const date = new Date(), y = date.getFullYear(), m = date.getMonth()
        const firstDay = new Date(y, m, 1)
        const lastDay = new Date(y, m + 1, 0);

        let outputData = {};

        let consignment = await Consignment.aggregate([
            {
                $facet: {
                    "delivery_status_update": [
                        {
                            $match:{
                                user:mongoose.Types.ObjectId(context.user_id)
                            }
                        },
                        {
                            $group: {
                                "_id": "$final_delivery_status",
                                "status_count": { $sum: 1 }
                            }
                        }
                    ],
                    "total_consignments": [
                        {
                            $match:{
                                user:mongoose.Types.ObjectId(context.user_id)
                            }
                        },
                        {
                            $count: "consignment_count"
                        }
                    ],
                    "total_consignments_this_month": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: firstDay,
                                    $lte: lastDay
                                }
                            }
                        },
                        {
                            $count: "this_month_count"
                        }
                    ],
                    "consignments_frequency_by_location": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: firstDay,
                                    $lte: lastDay
                                }
                            },

                        },
                        {
                            $group: {
                                "_id": {
                                    "start_location_name": "$start_location_name",
                                    "destination_name": "$destination_name"
                                },
                                "location_count": { $sum: 1 }
                            }
                        },
                        {
                            $sort: { 'location_count': -1 }
                        },
                        {
                            $limit: 5
                        }
                        ,
                        {
                            $project: {
                                _id: 0,
                                start_location_name: '$_id.start_location_name',
                                destination_name: '$_id.destination_name',
                                location_count: 1
                            }
                        }
                    ]

                }
            }

        ])

        let deliveryDetails = consignment[0].delivery_status_update
        let deliveryTypes = {};

        for (let i = 0; i < deliveryDetails?.length; i++) {
            deliveryTypes[deliveryDetails[i]._id] = deliveryDetails[i].status_count;
        }

        if (consignment?.length > 0) {
            outputData = {
                ...outputData,
                delivery_status_update: deliveryTypes,
                total_consignments: consignment[0]?.total_consignments?.length > 0 ? consignment[0]?.total_consignments[0]?.consignment_count : 0,
                total_consignments_this_month: consignment[0]?.total_consignments_this_month?.length > 0 ? consignment[0]?.total_consignments_this_month[0]?.this_month_count : 0,
                consignments_frequency_by_location: consignment[0]?.consignments_frequency_by_location?.length > 0 ? consignment[0]?.consignments_frequency_by_location : []
            }
        }



        const truckData = await Truck.aggregate([
            {
                $match:{
                    user:mongoose.Types.ObjectId(context.user_id)
                }
            },
            {
                $count: "truck_count"
            }
        ])

     

      
            outputData = {
                ...outputData,
                truck_count: truckData[0]?.truck_count || 0
            }



        const companyData = await Company.aggregate([
            {
                $match:{
                    user:mongoose.Types.ObjectId(context.user_id)
                }
            },
            {
                $count: "company_count"
            }
        ])

    
          outputData = {
                ...outputData,
                company_count: companyData[0]?.company_count || 0
            }
        


        const allUser = await User.aggregate([
            {
                $match:{
                    user:mongoose.Types.ObjectId(context.user_id)
                }
            },
            {
                $group: {
                    "_id": "$user_type",
                    "user_count": { $sum: 1 }
                }
            }
        ])

        let userData = [...allUser];

        let userTypes = {
            'driver':0,
            'contact':0
        };

        for (let i = 0; i < userData?.length; i++) {
            if (userData[i]._id !== null && userData[i]._id !== 'admin') {
                userTypes[userData[i]._id] = userData[i].user_count
            }
        }

       
            outputData = {
                ...outputData,
                userTypes: userTypes
            }
        




        const billData = await Bill.aggregate([
            {
                $facet: {
                    "recent_bills": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: firstDay,
                                    $lte: lastDay
                                }
                            },
                        },
                        {
                            $sort: { 'created': -1 }
                        },
                        {
                            $limit: 5
                        },
                        {
                            $project: {
                                _id: 0,
                                gc_no: 1,
                                total_amount: 1
                            }
                        },

                    ],
                    "total_bills": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                doc_type: {
                                    $ne: 'saved-doc'
                                }
                            }
                        },
                        {
                            $count: "bill_count"
                        }
                    ]
                }
            }
        ])

     
            outputData = {
                ...outputData,
                recent_bills: billData[0]?.recent_bills?.length > 0 ? billData[0]?.recent_bills : [],
                total_bills: billData[0]?.total_bills?.length > 0 ? billData[0]?.total_bills[0]?.bill_count : 0
            }
        




        const transactionData = await Transaction.aggregate([
            {
                $facet: {
                    "recent_transactions": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: firstDay,
                                    $lte: lastDay
                                }
                            },

                        },
                        {
                            $sort: { 'created': -1 }
                        },
                        {
                            $limit: 5
                        },
                        {
                            $project: {
                                _id: 0,
                                transaction_id: 1,
                                amount_to_send: 1
                            }
                        }
                    ],
                    "total_transactions": [
                        {
                            $match:{
                                user:mongoose.Types.ObjectId(context.user_id)
                            }
                        },
                        {
                            $count: "transaction_count"
                        }
                    ]
                }
            }
        ])

       
            outputData = {
                ...outputData,
                recent_transactions: transactionData[0]?.recent_transactions?.length > 0 ? transactionData[0]?.recent_transactions : [],
                total_transactions: transactionData[0]?.total_transactions?.length > 0 ? transactionData[0]?.total_transactions[0]?.transaction_count : 0
            }
        


        let fuelData = await Fuel.aggregate([
            {
                $facet: {
                    "total_fuel": [
                        {
                            $match:{
                                user:mongoose.Types.ObjectId(context.user_id)
                            }
                        },
                        {
                            $count: "fuel_count"
                        }
                    ]
                }
            }
        ])

        
            outputData = {
                ...outputData,
                total_fuel: fuelData[0]?.total_fuel?.length > 0 ? fuelData[0]?.total_fuel[0]?.fuel_count : 0
            }
        


        return {
            error: false,
            message: 'Data Retrieved',
            data: outputData
        }
    } catch (error) {

        return {
            error: true,
            message: 'Enable to fetch dashboard data for some unknown reason'
        }
    }
}

const getAnalyticsDataByUser = async (_, args, context) => {
    if (!context.user_id || context.type !== 'admin') {
        return {
            error: true,
            message: 'Unauthorized Access'
        }
    }
    try {
        const today = new Date();
        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);;
        let lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30)
        let tempDate = [];
        let temp = new Date();
        temp.setDate(temp.getDate() - 7);

        let tempMonthDate = [];

        let tempMonth = new Date();
        tempMonth.setDate(tempMonth.getDate() - 30);




        for (let i = 0; i < 7; i++) {

            temp.setDate(temp.getDate() + 1)
            tempDate.push(temp?.toISOString().substr(0, 10));
        }

        for (let i = 0; i < 30; i++) {
            tempMonth.setDate(temp.getDate() + 1);
            tempMonthDate.push(temp?.toISOString().substr(0, 10))
        }



        let consignmentDetails = await Consignment.aggregate([
            {
                $facet: {
                    "weekly_consignments": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: lastWeek,
                                    $lte: today
                                }
                            }
                        },
                        {
                            $project: {
                                day: {
                                    $substr: ["$created", 0, 10]
                                },
                                tolls: "$tolls",
                                additional_expense: "$additional_expenses"
                            }
                        },
                        {
                            $group: {
                                "_id": "$day",
                                count: { $sum: 1 },
                                tolls_count: { $sum: { $sum: "$tolls.amount" } },
                                expense_count: { $sum: { $sum: "$additional_expense.total_cost" } }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                stats: { $push: "$$ROOT" }
                            }
                        },
                        {
                            $project: {
                                stats: {
                                    $map: {
                                        input: tempDate,
                                        as: "date",
                                        in: {
                                            $let: {
                                                vars: { dateIndex: { "$indexOfArray": ["$stats._id", "$$date"] } },
                                                in: {
                                                    $cond: {
                                                        if: { $ne: ["$$dateIndex", -1] },
                                                        then: { $arrayElemAt: ["$stats", "$$dateIndex"] },
                                                        else: { _id: "$$date", count: 0, tolls_count: 0, expense_count: 0 }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $unwind: "$stats"
                        },
                        {
                            $replaceRoot: {
                                newRoot: "$stats"
                            }
                        }
                    ],
                    "consignments_by_truck": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: lastMonth,
                                    $lte: today
                                }
                            },

                        },
                        {
                            $group: {
                                "_id": "$truck",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "trucks",
                                localField: "_id",
                                foreignField: "_id",
                                as: 'truck'
                            }
                        },
                        {
                            $unwind: "$truck"
                        },
                        {
                            $project: {
                                _id: 0,
                                truck: 1,
                                count: 1
                            }
                        }


                    ],
                    "tolls_by_truck": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: lastMonth,
                                    $lte: today
                                }
                            },

                        },
                        {
                            $group: {
                                "_id": "$truck",
                                count: { $sum: { $sum: '$tolls.amount' } }
                            }
                        },
                        {
                            $lookup: {
                                from: "trucks",
                                localField: "_id",
                                foreignField: "_id",
                                as: 'truck'
                            }
                        },
                        {
                            $unwind: "$truck"
                        },
                        {
                            $project: {
                                _id: 0,
                                truck: 1,
                                amount: "$count"

                            }
                        }


                    ]
                }
            }
        ])




        let transactionDetails = await Transaction.aggregate([
            {
                $facet: {
                    "weekly_transactions": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: lastWeek,
                                    $lte: today
                                }
                            }
                        },
                        {
                            $project: {
                                day: {
                                    $substr: ["$created", 0, 10]
                                },
                                amount_to_send: { $toInt: "$amount_to_send" }
                            }
                        },
                        {
                            $group: {
                                "_id": "$day",
                                count: { $sum: 1 },
                                amount: { $sum: '$amount_to_send' }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                stats: { $push: "$$ROOT" }
                            }
                        },
                        {
                            $project: {
                                stats: {
                                    $map: {
                                        input: tempDate,
                                        as: "date",
                                        in: {
                                            $let: {
                                                vars: { dateIndex: { "$indexOfArray": ["$stats._id", "$$date"] } },
                                                in: {
                                                    $cond: {
                                                        if: { $ne: ["$$dateIndex", -1] },
                                                        then: { $arrayElemAt: ["$stats", "$$dateIndex"] },
                                                        else: { _id: "$$date", count: 0, amount: 0 }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $unwind: "$stats"
                        },
                        {
                            $replaceRoot: {
                                newRoot: "$stats"
                            }
                        }
                    ],
                    "transaction_amount_by_trucks": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: lastMonth,
                                    $lte: today
                                }
                            },


                        },
                        {
                            $group: {
                                "_id": "$truck",
                                amount: { $sum: { $toInt: "$amount_to_send" } }
                            }
                        },
                        {
                            $lookup: {
                                from: "trucks",
                                localField: "_id",
                                foreignField: "_id",
                                as: 'truck'
                            }
                        },
                        {
                            $unwind: "$truck"
                        },
                        {
                            $project: {
                                _id: 0,
                                truck: 1,
                                amount: 1
                            }
                        }
                    ]
                }
            }
        ])

        let fuelDetails = await Fuel.aggregate([
            {
                $facet: {
                    "weekly_fuels": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: lastWeek,
                                    $lte: today
                                }
                            }
                        },
                        {
                            $project: {
                                day: {
                                    $substr: ["$created", 0, 10]
                                },
                                cost: 1
                            }
                        },
                        {
                            $group: {
                                "_id": "$day",
                                count: { $sum: 1 },
                                amount: { $sum: '$cost' }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                stats: { $push: "$$ROOT" }
                            }
                        },
                        {
                            $project: {
                                stats: {
                                    $map: {
                                        input: tempDate,
                                        as: "date",
                                        in: {
                                            $let: {
                                                vars: { dateIndex: { "$indexOfArray": ["$stats._id", "$$date"] } },
                                                in: {
                                                    $cond: {
                                                        if: { $ne: ["$$dateIndex", -1] },
                                                        then: { $arrayElemAt: ["$stats", "$$dateIndex"] },
                                                        else: { _id: "$$date", count: 0, amount: 0 }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $unwind: "$stats"
                        },
                        {
                            $replaceRoot: {
                                newRoot: "$stats"
                            }
                        }
                    ],
                    "fuel_amount_by_trucks": [
                        {
                            $match: {
                                user:mongoose.Types.ObjectId(context.user_id),
                                'created': {
                                    $gt: lastMonth,
                                    $lte: today
                                }
                            },


                        },
                        {
                            $group: {
                                "_id": "$truck",
                                amount: { $sum: "$cost" }
                            }
                        },
                        {
                            $lookup: {
                                from: "trucks",
                                localField: "_id",
                                foreignField: "_id",
                                as: 'truck'
                            }
                        },
                        {
                            $unwind: "$truck"
                        },
                        {
                            $project: {
                                _id: 0,
                                truck: 1,
                                amount: 1
                            }
                        }
                    ]
                }
            }
        ])




        let outputData = {
            consignment: consignmentDetails[0].weekly_consignments,
            consignments_by_truck: consignmentDetails[0].consignments_by_truck,
            transactions: transactionDetails[0].weekly_transactions,
            transaction_amount_by_trucks: transactionDetails[0].transaction_amount_by_trucks,
            fuels: fuelDetails[0].weekly_fuels,
            fuel_amount_by_trucks: fuelDetails[0].fuel_amount_by_trucks,
            tolls_by_truck: consignmentDetails[0].tolls_by_truck
        }




        return {
            error: false,
            message: 'Data Retrived',
            data: outputData
        }

    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: 'Could not fetch data'
        }
    }
}


const getDriverAnalyticDataByID = async (_, args, context) => {
    if (!context.user_id || context.type !== 'admin') {
        return {
            error: true,
            message: 'Unauthorized Access'
        }
    }
    try {

        const today = new Date();
        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);;
        let lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30)
        let tempDate = [];
        let temp = new Date();
        temp.setDate(temp.getDate() - 7);

        let tempMonthDate = [];

        let tempMonth = new Date();
        tempMonth.setDate(tempMonth.getDate() - 30);




        for (let i = 0; i < 7; i++) {

            temp.setDate(temp.getDate() + 1)
            tempDate.push(temp?.toISOString().substr(0, 10));
        }

        for (let i = 0; i < 30; i++) {
            tempMonth.setDate(temp.getDate() + 1);
            tempMonthDate.push(temp?.toISOString().substr(0, 10))
        }


        let consignmentDetails = await Consignment.aggregate([
            {
                $facet: {
                    "monthly_consignments_by_driver": [
                        {
                            $match:{
                                user:mongoose.Types.ObjectId(context.user_id),
                                created:{
                                    $gt:lastMonth,
                                    $lte:today
                                },
                                primary_driver:mongoose.Types.ObjectId(args._id)
                            }
                        },
                        {
                            $group:{
                                "_id":"$_id",
                                toll_amount:{$sum:{$sum:"$tolls.amount"}},
                                expense_total: { $sum: { $sum: "$additional_expenses.total_cost" } },
                                start_location_name:{$first:"$start_location_name"},
                                destination_name:{$first:"$destination_name"}
                            }
                        },
                        {
                            $project:{
                                _id:0,
                                toll_amount:1,
                                expense_total:1,
                                location:{$concat:["$start_location_name"," -> ","$destination_name"]}
                            }
                        }
                    ]
                }
            }
        ])

        console.log(consignmentDetails[0])
    } catch (error) {
        console.log(error);
        return {
            error: true,
            message: 'Could not fetch driver data for some unknown reason'
        }
    }
}



module.exports = {
    addNewUser,
    read,
    getAllUsers,
    remove,
    updateUser,
    getUserByID,
    addNewDriver,
    getAllDrivers,
    getDriverByID,
    addNewContact,
    getAllContacts,
    getContactByID,
    updateContactByID,
    updateDriverByID,
    getAllDriversFull,
    getDashboardData,
    getAnalyticsDataByUser,
    getDriverAnalyticDataByID
}