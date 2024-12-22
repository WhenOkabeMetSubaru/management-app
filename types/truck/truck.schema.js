const {gql} = require('apollo-server-express');


const typeDefs = gql`

    type Query{
        getAllTrucks(status:String,pageNumber:Int,pageSize:Int):MultipleTruckOutput
        getAllTrucksFull:MultipleTruckOutput
        getTruckByID(truck_id:ID):SingleTruckOutput
        getAllVehicleRepairByID(truck_id:ID):MultipleVehicleRepairOutput
        getAllDeliveryRouteByID(truck_id:ID):MultipleDeliveryRouteOutput
        getTruckAnalyticDataByID(_id:ID):TruckAnalyticDataOutput
        checkPendingTruckExists(_id:ID):TruckInfoOutput
    }

    type Mutation{

        addNewTruck(TruckInput:NewTruckInput):SingleTruckOutput
        updateTruckByID(TruckInput:UpdateTruckInput):SingleTruckOutput
        addVehicleRepairByID(truck_id:ID,repair_type:String,cost:Float,reason:String,repaired_by:String,date_of_submit:String,date_of_return:String):MultipleVehicleRepairOutput
        addDeliveryRouteByID(truck_id:ID,from:String,to:String,start_date:String,end_date:String,cost_incurred:String):MultipleDeliveryRouteOutput
    }

    input NewTruckInput{
        vehicle_no:String
        vehicle_registered_date:String
        vehicle_images:[String]
        vehicle_document_images:[String]
        vehicle_driver:ID
        assist_driver:ID
        previous_drivers:[ID]
        current_location:String
        previous_consignment:ID
        current_consignment:ID
        delivery_status:String
        fuel_tank_capacity:Float
        vehicle_type:String
        total_tyres:Int
        vehicle_dimensions:VehicleDimensionInput
        vehicle_repair_history:[VehicleRepairInput]
        vehicle_deliveries:[ID]
        distance_travelled:String
        vehicle_bills:[ID]
        current_fuel:Int
        delivery_route_history:[DeliveryRouteHistoryInput]
        vehicle_idle_time:[VehicleIdleTimeInput]
        vehicle_current_status:String
        vehicle_insurance_status:VehicleInsuranceStatusInput
        vehicle_buy_date:String
        vehicle_added_to_collection_date:String

    }

    input UpdateTruckInput{
        _id:ID
        vehicle_no:String
        vehicle_registered_date:String
        vehicle_images:[String]
        vehicle_document_images:[String]
        vehicle_driver:ID
        assist_driver:ID
        previous_drivers:[ID]
        current_location:String
        previous_consignment:ID
        current_consignment:ID
        delivery_status:String
        fuel_tank_capacity:Float
        vehicle_type:String
        total_tyres:Int
        vehicle_dimensions:VehicleDimensionInput
        vehicle_repair_history:[VehicleRepairInput]
        vehicle_deliveries:[ID]
        distance_travelled:String
        vehicle_bills:[ID]
        current_fuel:Int
        delivery_route_history:[DeliveryRouteHistoryInput]
        vehicle_idle_time:[VehicleIdleTimeInput]
        vehicle_current_status:String
        vehicle_insurance_status:VehicleInsuranceStatusInput
        vehicle_buy_date:String
        vehicle_added_to_collection_date:String

    }
    
    input VehicleDimensionInput{
        length:String
        breadth:String
        width:String
    }

    input VehicleRepairInput{
        repair_type:String
        cost:Float
        reason:String
        repaired_by:String
        date_of_submit:String
        date_of_return:String
    }

    input DeliveryRouteHistoryInput{
        from:String
        to:String
        start_date:String
        end_date:String
        cost_incurred:String
    }

    input VehicleIdleTimeInput {
        location:String
        idle_time:String
        date:String
    }

    input VehicleInsuranceStatusInput {
        valid_from:String
        valid_till:String
    }

    type TruckData {
        _id:ID
        vehicle_no:String
        vehicle_registered_date:String
        vehicle_images:[String]
        vehicle_document_images:[String]
        vehicle_driver:ID
        assist_driver:ID
        previous_drivers:[ID]
        current_location:String
        previous_consignment:ID
        current_consignment:ID
        delivery_status:String
        fuel_tank_capacity:Float
        vehicle_type:String
        total_tyres:Int
        vehicle_dimensions:VehicleDimensionOutput
        vehicle_repair_history:[VehicleRepairOutput]
        vehicle_deliveries:[ID]
        distance_travelled:String
        vehicle_bills:[ID]
        current_fuel:Int
        delivery_route_history:[DeliveryRouteHistoryOutput]
        vehicle_idle_time:[VehicleIdleTimeOutput]
        vehicle_current_status:String
        vehicle_insurance_status:VehicleInsuranceStatusOutput
        vehicle_buy_date:String
        vehicle_added_to_collection_date:String
    }

    type VehicleDimensionOutput{
        length:String
        breadth:String
        width:String
    }
    
    type VehicleRepairOutput{
        repair_type:String
        cost:Float
        reason:String
        repaired_by:String
        date_of_submit:String
        date_of_return:String
    }

    type DeliveryRouteHistoryOutput{
        from:String
        to:String
        start_date:String
        end_date:String
        cost_incurred:String
    }

    type VehicleIdleTimeOutput {
        location:String
        idle_time:String
        date:String
    }
    
    type VehicleInsuranceStatusOutput {
        valid_from:String
        valid_till:String
    }

    type SingleTruckOutput{
        error:Boolean
        message:String
        data:TruckData
    }

    type MultipleTruckOutput {
        error:Boolean
        message:String
        data:[TruckData]
        totalDocs: Int
        limit: Int
        totalPages: Int
        page: Int
    }

    type TruckAnalyticDataOutput{
        error:Boolean
        message:String
      
    }

    

    type MultipleVehicleRepairOutput {
        error:Boolean
        message:String
        data:[VehicleRepairOutput]
    }
    
    type MultipleDeliveryRouteOutput {
        error:Boolean
        message:String
        data:[DeliveryRouteHistoryOutput]
    }

    type TruckInfoOutput{
        error:Boolean
        message:String
    }

`

module.exports = typeDefs;