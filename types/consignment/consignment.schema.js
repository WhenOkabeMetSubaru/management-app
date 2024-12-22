const { gql } = require('apollo-server-express');


const typeDefs = gql`

    type Query{
        getAllConsignments(start_location_name:String,destination_name:String,company:ID,primary_driver:ID,truck:ID,start_time:String,end_time:String,status:String,pageNumber:Int,pageSize:Int):MultipleConsignmentOutput
        getAllConsignmentsFull:MultipleConsignmentOutput
        getConsignmentByID(consignment_id:ID):SingleConsignmentOutput
        getFuelFilledLocationByID(consignment_id:ID):MultipleFuelFilledLocationOutput
        getAllStoppagesByID(consignment_id:ID):MultipleStoppageOutput
        getAllTollsByID(consignment_id:ID):MultipleTollOutput
        getAllExpensesByID(consignment_id:ID):MultipleExpenseOutput
        getAllFinesByID(consignment_id:ID):MultipleFineOutput
        getAllVehicleDamagesByID(consignment_id:ID):MultipleVehicleDamageOutput
        getConsignmentExpenseMetrics(_id:ID):ExpenseDataOutput
   
    }

    type Mutation{

        addNewConsignment(ConsignmentInput:NewConsignmentInput):SingleConsignmentOutput
        updateConsignmentByID(ConsignmentInput:UpdateConsignmentInput):SingleConsignmentOutput
        addFuelFilledLocationByID(consignment_id:ID,location:String,amount:Float,fuel_before_filling:Float,fuel_after_filling:Float,time_spent:String):MultipleFuelFilledLocationOutput
        addStoppageByID(consignment_id:ID,location:String,time_spent:String, arrived_at:String,departed_at:String,fuel_on_arrival:Float,fuel_on_departure:Float):MultipleStoppageOutput
        addTollByID(consignment_id:ID,location:String,amount:Float):MultipleTollOutput
        addExpenseByID(consignment_id:ID,expense_info:String,total_cost:Float,paid_to_driver:Float,date:String):MultipleExpenseOutput
        addFineByID(consignment_id:ID,reason:String,date:String,amount:Float,location:String):MultipleFineOutput
        addVehicleDamageByID(consignment_id:ID,damage_type:String,amount_charged:Float,time_to_repair:String,date:String):MultipleVehicleDamageOutput
    }

    type SingleConsignmentOutput {
        error:Boolean
        message:String
        data:ConsignmentData
    }

    type MultipleConsignmentOutput {
        error:Boolean
        message:String
        data:[ConsignmentData]
        totalDocs:Int
        limit:Int
        totalPages:Int
        page:Int
    }

    type ExpenseDataOutput {
        error:Boolean
        message:String
        data:ExpenseData
    }

    type MultipleFuelFilledLocationOutput {
        error:Boolean
        message:String
        data:[FuelFilledLocationOutput]
    }

    type MultipleStoppageOutput {
        error:Boolean
        message:String
        data:[StoppagesDataOutput]
    }

    type MultipleTollOutput {
        error:Boolean
        message:String
        data:[TollsDataOutput]
    }

    type MultipleExpenseOutput {
        error:Boolean
        message:String
        data:[AdditionalExpenseDataOutput]
    }

    type MultipleFineOutput {
        error:Boolean
        message:String
        data:[FineDataOutput]
    }

    type MultipleVehicleDamageOutput {
        error:Boolean
        message:String
        data:[VehicleDamageTypeDataOutput]
    }

    input NewConsignmentInput {
        total_distance:Float
        estimated_time:String
        total_time_taken:String
        delivery_status:String
        truck_image:String
        bill_images:[String]
        bills:[ID]
        start_location_name:String
        destination_name:String
        fine_images:[String]
        fines:[FineDataInput]
        additional_bill_images:[String]
        pickup_type:String
        single_pickup_location:String
        multiple_pickup_location:[String]
        delivery_type:String
        single_delivery_location:String
        multiple_delivery_location:[String]
        primary_driver:ID
        assist_driver:ID
        truck:ID
        goods_type:String
        weight_of_goods_without_truck_before_pickup:Float
        weight_of_goods_with_truck_before_pickup:Float
        weight_of_goods_without_truck_delivered:Float
        weight_of_goods_with_truck_delivered:Float
        fuel_before_pickup:Float
        fuel_after_delivery:Float
        total_amount_used_for_fuel:Float
        additional_expenses:[AdditionalExpenseDataInput]
        total_distance_covered_by_truck:Float
        additional_distance_covered_by_truck:Float
        fuel_filled_location:[FuelFilledLocationInput]
        company:ID
        total_payable_amount_before_pickup:Float
        total_payable_amount_after_delivery:Float
        advance_payment:Float
        estimated_final_payment_time:String
        stoppages:[StoppagesDataInput]
        vehicle_damage:Boolean
        final_delivery_status:String
        vehicle_damage_types:[VehicleDamageTypeDataInput]
        pending_payment:Float
        all_bills_submitted:Boolean
        tolls:[TollsDataInput]
        total_freight:Int
        pod_received_date:String
        pod_submitted_date:String
        balance_receive_date:String
        fuel_reading_on_trip_start:String
        fuel_reading_on_trip_end:String
        note:String
        late_charge_applicable:Boolean
        total_late_charge_amount:Int
        total_late_unloading_days:String
        late_charge_per_day:[String]
        delivery_start_date:String
        delivery_end_date:String
        amount_paid_till_now:Int
        balance_amount_remaining:Int

    }

    input UpdateConsignmentInput {
        _id:ID
        total_distance:Float
        estimated_time:String
        total_time_taken:String
        delivery_status:String
        truck_image:String
        bill_images:[String]
        bills:[ID]
        start_location_name:String
        destination_name:String
        fine_images:[String]
        fines:[FineDataInput]
        additional_bill_images:[String]
        pickup_type:String
        single_pickup_location:String
        multiple_pickup_location:[String]
        delivery_type:String
        single_delivery_location:String
        multiple_delivery_location:[String]
        primary_driver:ID
        assist_driver:ID
        truck:ID
        goods_type:String
        weight_of_goods_without_truck_before_pickup:Float
        weight_of_goods_with_truck_before_pickup:Float
        weight_of_goods_without_truck_delivered:Float
        weight_of_goods_with_truck_delivered:Float
        fuel_before_pickup:Float
        fuel_after_delivery:Float
        total_amount_used_for_fuel:Float
        additional_expenses:[AdditionalExpenseDataInput]
        total_distance_covered_by_truck:Float
        additional_distance_covered_by_truck:Float
        fuel_filled_location:[FuelFilledLocationInput]
        company:ID
        total_payable_amount_before_pickup:Float
        total_payable_amount_after_delivery:Float
        advance_payment:Float
        estimated_final_payment_time:String
        stoppages:[StoppagesDataInput]
        vehicle_damage:Boolean
        final_delivery_status:String
        vehicle_damage_types:[VehicleDamageTypeDataInput]
        pending_payment:Float
        all_bills_submitted:Boolean
        tolls:[TollsDataInput]
        total_freight:Int
        pod_received_date:String
        pod_submitted_date:String
        balance_receive_date:String
        fuel_reading_on_trip_start:String
        fuel_reading_on_trip_end:String
        note:String
        late_charge_applicable:Boolean
        total_late_charge_amount:Int
        total_late_unloading_days:String
        late_charge_per_day:[String]
        delivery_start_date:String
        delivery_end_date:String
        amount_paid_till_now:Int
        balance_amount_remaining:Int

    }

    input FineDataInput{
        location:String
        amount:Float
        reason:String
        date:String
    }

    input AdditionalExpenseDataInput {
        expense_info:String
        total_cost:Float
        paid_to_driver:Float
        date:String
    }

    input FuelFilledLocationInput {
        location:String
        amount:Int
        fuel_before_filling:Int
        fuel_after_filling:Int
        time_spent:String
    }

    input StoppagesDataInput {
        location:String
        time_spent:String
        arrived_at:String
        departed_at:String
        fuel_on_arrival:Float
        fuel_on_departure:Float
    }
    
    input VehicleDamageTypeDataInput {
        damage_type:String
        amount_charged:Float
        time_to_repair:String
        date:String
    }

    input TollsDataInput {
        location:String
        amount:Float
    }

    type ConsignmentData {
        _id:ID
        total_distance:Float
        estimated_time:String
        total_time_taken:String
        delivery_status:String
        truck_image:String
        start_location_name:String
        destination_name:String
        bill_images:[String]
        bills:[ID]
        fine_images:[String]
        fines:[FineDataOutput]
        additional_bill_images:[String]
        pickup_type:String
        single_pickup_location:String
        multiple_pickup_location:[String]
        delivery_type:String
        single_delivery_location:String
        multiple_delivery_location:[String]
        primary_driver:ID
        assist_driver:ID
        truck:TruckData
        goods_type:String
        weight_of_goods_without_truck_before_pickup:Float
        weight_of_goods_with_truck_before_pickup:Float
        weight_of_goods_without_truck_delivered:Float
        weight_of_goods_with_truck_delivered:Float
        fuel_before_pickup:Float
        fuel_after_delivery:Float
        total_amount_used_for_fuel:Float
        additional_expenses:[AdditionalExpenseDataOutput]
        total_distance_covered_by_truck:Float
        additional_distance_covered_by_truck:Float
        fuel_filled_location:[FuelFilledLocationOutput]
        company:ID
        total_payable_amount_before_pickup:Float
        total_payable_amount_after_delivery:Float
        advance_payment:Float
        estimated_final_payment_time:String
        stoppages:[StoppagesDataOutput]
        vehicle_damage:Boolean
        final_delivery_status:String
        vehicle_damage_types:[VehicleDamageTypeDataOutput]
        pending_payment:Float
        all_bills_submitted:Boolean
        tolls:[TollsDataOutput]
        total_freight:Int
        pod_received_date:String
        pod_submitted_date:String
        amount_paid_till_now:Int
        balance_amount_remaining:Int
        balance_receive_date:String
        fuel_reading_on_trip_start:String
        fuel_reading_on_trip_end:String
        note:String
        late_charge_applicable:Boolean
        total_late_charge_amount:Int
        total_late_unloading_days:String
        late_charge_per_day:[String]
        delivery_start_date:String
        delivery_end_date:String

    }

    type FineDataOutput{
        location:String
        amount:Float
        reason:String
        date:String
    }

    type AdditionalExpenseDataOutput {
        expense_info:String
        total_cost:Float
        paid_to_driver:Float
        date:String
    }

    type FuelFilledLocationOutput {
        location:String
        amount:Float
        fuel_before_filling:Float
        fuel_after_filling:Float
        time_spent:String
        created:String
    }

    type StoppagesDataOutput {
        location:String
        time_spent:String
        arrived_at:String
        departed_at:String
        fuel_on_arrival:Float
        fuel_on_departure:Float
        created:String
    }

    type VehicleDamageTypeDataOutput {
        damage_type:String
        amount_charged:Float
        time_to_repair:String
        date:String
    }

    type TollsDataOutput {
        location:String
        amount:Float
        created:String
    }


    type ExpenseData {
        tollExpense:Int
        fuelExpense:Int
        transactionExpense:Int
        additionalExpense:Int
        allTolls:[ChartDataOutput]
        allAdditionalCharges:[ChartDataOutput]
        allTransactions:[ChartDataOutput]
        allFuels:[ChartDataOutput]
        totalAmount:Int
    }

    type ChartDataOutput {
        amount:Int
        name:String
    }

`

module.exports = typeDefs;