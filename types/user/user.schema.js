const {gql} = require('apollo-server-express');


const typeDefs = gql`

    type Query{

        getAllUsers:AllUserDataOutput
        getUserByID:UserOutput
        getAllDrivers(status:String,pageNumber:Int,pageSize:Int):AllUserDataOutput
        getAllDriversFull:AllUserDataOutput
        getDriverByID(user_id:ID):UserOutput
        getAllContacts(status:String,pageNumber:Int,pageSize:Int):AllUserDataOutput
        getContactByID(user_id:ID):UserOutput
        getDashboardData:DashboardOutput
        getAnalyticsDataByUser:AnalyticsOutput
        getDriverAnalyticDataByID(_id:ID):UserOutput
    }

    type Mutation{

        addNewUser(UserInput:NewUserInput):UserOutput
        updateUser(UserUpdateInput:UpdateUserInput):UserOutput
        addNewDriver(UserInput:NewUserInput):UserOutput
        addNewContact(UserInput:NewUserInput):UserOutput
        updateContactByID(UpdateInput:UpdateUserInput):UserOutput
        updateDriverByID(UpdateInput:UpdateUserInput):UserOutput
    }

    type UserOutput{
        error:Boolean
        message:String
        data:UserData
    }

    type AnalyticsOutput {
        error:Boolean
        message:String
        data:AnalyticData
    }

    type AllUserDataOutput{
        error:Boolean
        message:String
        data:[UserData]
        totalDocs: Int
        limit: Int
        totalPages: Int
        page: Int
    }

    type DashboardOutput {
        error:Boolean
        message:String
        data:DashboardData
    }

    type UserData{
        _id:ID
        name:String
        email:String
        created:String
        user_type:String
        mobile:String
        aadhar_card_no:String
        pan_card_no:String
        profile_photo:String
        joined_company:String
        truck_managed:TruckData
        address:String
        home_town:String
        recovery_number:String
        isWorking:Boolean
        driving_license_no:String
        bank_account_no:String
        bank_ifsc_code:String
    }

    input NewUserInput{
        name:String
        email:String
        password:String
        user_type:String
        mobile:String
        aadhar_card_no:String
        pan_card_no:String
        profile_photo:String
        joined_company:String
        truck_managed:ID
        address:String
        home_town:String
        recovery_number:String
        isWorking:Boolean
        driving_license_no:String
        bank_account_no:String
        bank_ifsc_code:String

    }

    input UpdateUserInput{
        _id:ID
        name:String
        email:String
        password:String
        mobile:String
        aadhar_card_no:String
        pan_card_no:String
        profile_photo:String
        joined_company:String
        truck_managed:ID
        address:String
        home_town:String
        recovery_number:String
        isWorking:Boolean
        driving_license_no:String
        bank_account_no:String
        bank_ifsc_code:String
    }

    type DashboardData {
        delivery_status_update:DeliveryStatusUpdate
        total_consignments:Int
        total_consignments_this_month:Int
        consignments_frequency_by_location:[ConsignmentFrequencyData]
        truck_count:Int
        company_count:Int
        userTypes:UserTypeData
        recent_bills:[RecentBillsData]
        total_bills:Int
        recent_transactions:[RecentTransactionData]
        total_transactions:Int
        total_fuel:Int
    }

    type DeliveryStatusUpdate {
        pending:String
        delivered:String
        rejected:String
        cancelled:String
    }

    type ConsignmentFrequencyData {
        location_count:Int
        start_location_name:String
        destination_name:String
    }

    type UserTypeData {
        contact:Int
        driver:Int
    }

    type RecentBillsData {
        gc_no:String
        total_amount:Float
    }

    type RecentTransactionData {
        transaction_id:String
        amount_to_send:String
    }

    type AnalyticData {
        consignment:[SingleAnalyticData]
        consignments_by_truck:[SingleAnalyticData]
        transactions:[SingleAnalyticData]
        transaction_amount_by_trucks:[SingleAnalyticData]
        fuels:[SingleAnalyticData]
        fuel_amount_by_trucks:[SingleAnalyticData]
        tolls_by_truck:[SingleAnalyticData]
    }

    type SingleAnalyticData {
        _id:String
        count:Int
        tolls_count:Int
        expense_count:Int
        amount:Int
        truck:TruckData
    }

`

module.exports = typeDefs;