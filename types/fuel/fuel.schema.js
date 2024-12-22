const { gql } = require('apollo-server-express');


const typeDefs = gql`

    type Query{

       getFuelByID(_id:ID):SingleFuelOutput
       getAllFuelsFull:MultipleFuelOutput
       getAllFuels(pageNumber:Int,pageSize:Int,driver:ID,consignment:ID,truck:ID,transaction:ID,start_time:String,end_time:String):PaginationFuelOutput
    }

    type Mutation{

        addNewFuel(FuelInput:NewFuelInput):SingleFuelOutput
        updateFuelByID(FuelUpdate:FuelUpdateInput):SingleFuelOutput
        deleteFuelByID(_id:ID):SingleFuelOutput
    }

    type SingleFuelOutput {
        error:Boolean
        message:String
        data:FuelData
    }

    type PaginationFuelOutput {
        error:Boolean
        message:String
        data:[FuelData]
        totalDocs:Int
        limit:Int
        totalPages:Int
        page:Int
    }

    type MultipleFuelOutput {
        error:Boolean
        message:String
        data:[FuelData]
    }

    input NewFuelInput {
        quantity:Float
        cost:Float
        petrol_pump_name:String
        location:String
        truck:ID
        driver:ID
        petrol_rate_by_location:Float
        optional_driver_name:String
        transaction:ID
        consignment:ID
        note:String
        created:String
        fuel_created_date:String
    }

    input FuelUpdateInput {
        _id:ID
        quantity:Float
        cost:Float
        petrol_pump_name:String
        location:String
        truck:ID
        driver:ID
        petrol_rate_by_location:Float
        optional_driver_name:String
        transaction:ID
        consignment:ID
        note:String
        created:String
        fuel_created_date:String
    }

    type FuelData {
        _id:ID
        quantity:Float
        cost:Float
        petrol_pump_name:String
        location:String
        truck:TruckData
        driver:UserData
        petrol_rate_by_location:Float
        optional_driver_name:String
        transaction:TransactionData
        consignment:ConsignmentData
        note:String
        created:String
        fuel_created_date:String
    }
   
    


`

module.exports = typeDefs;