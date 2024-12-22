const { gql } = require('apollo-server-express');


const typeDefs = gql`

    type Query{
        getAllBills(start_time:String,end_time:String,vehicle:ID,company:ID,status:String,pageNumber:Int,pageSize:Int):MultipleBillOutput
        getAllBillsFull:MultipleBillOutput
        getBillByID(bill_id:ID):SingleBillOutput
        getBillTemplateByUser:MultipleBillOutput
        getLRTemplateByUser:MultipleBillOutput
        getLoadingSlipTemplateByUser:MultipleBillOutput
        checkBillNumberExists(bill_no:String):SingleBillOutput
        
    }

    type Mutation{

        addNewBill(BillInput:NewBillInput):SingleBillOutput
        updateBillByID(BillInput:UpdateBillInput):SingleBillOutput
        deleteBillByID(bill_id:ID):SingleBillOutput
    }

    input NewBillInput {
        created:String
        user:ID
        header_company_name:String
        bill_no:String
        ho_address:String
        bo_address:String
        gc_no:String
        gc_date:String
        unload_date:String
        bill_date:String
        start_location:String
        destination_location:String
        vehicle_no:String
        vehicle_type:String
        branch:String
        invoice_no:String
        invoice_date:String
        consignee_name:String
        consignee_address:String
        consignee_gst:String
        consignee_state_code:String
        consignor_name:String
        consignor_address:String
        consignor_gst:String
        consignor_state_code:String
        entries:[EntriesInput]
        sub_total:String
        lr_charge:String
        labour_charge:String
        waiting_charge:String
        total_amount:String
        amount_in_words:String
        bill_for_company_name:String
        optional_signature_text:String
        bank_name:String
        bank_branch:String
        bank_account_no:String
        bank_ifsc_code:String
        gst_in:String
        pan_no:String
        gst_paid_by:String
        bill_type:String
        doc_type:String
        bill_created_date:String
        lr_created_date:String
        company:ID
        truck:ID
        consignment:ID
        bill_name:String
        lr_no:String
        value_rs:String
        lr_entries:[LREntriesInput]
        delivery_address:String
        delivery_number:String
        shipment_number:String
        office_number:String
        consignee_gst_check:Boolean
        consignor_gst_check:Boolean
        transporter_gst_check:Boolean
        hamali_charge:String
        dd_charge:String
        local_charge:String
        bilty_charge:String
        service_charge:String
        contact_no_1:String
        contact_no_2:String
        load_tonnes:String
        rate_per_tonne:String
        advance_amount:String
        lorry_freight:String
        ms_company_name:String
        balance:String
        payable:String
        bill_images:[String]
        remarks:String
        delivery_charge:String
    
    }
    input UpdateBillInput {
        _id:ID
        created:String
        user:ID
        header_company_name:String
        bill_no:String
        ho_address:String
        bo_address:String
        gc_no:String
        gc_date:String
        unload_date:String
        bill_date:String
        start_location:String
        destination_location:String
        vehicle_no:String
        vehicle_type:String
        branch:String
        invoice_no:String
        invoice_date:String
        consignee_name:String
        consignee_address:String
        consignee_gst:String
        consignee_state_code:String
        consignor_name:String
        consignor_address:String
        consignor_gst:String
        consignor_state_code:String
        entries:[EntriesInput]
        sub_total:String
        lr_charge:String
        labour_charge:String
        waiting_charge:String
        total_amount:String
        amount_in_words:String
        bill_for_company_name:String
        optional_signature_text:String
        bank_name:String
        bank_branch:String
        bank_account_no:String
        bank_ifsc_code:String
        gst_in:String
        pan_no:String
        gst_paid_by:String
        bill_type:String
        doc_type:String
        bill_created_date:String
        lr_created_date:String
        company:ID
        truck:ID
        consignment:ID
        bill_name:String
        lr_no:String
        value_rs:String
        lr_entries:[LREntriesInput]
        delivery_address:String
        delivery_number:String
        shipment_number:String
        office_number:String
        consignee_gst_check:Boolean
        consignor_gst_check:Boolean
        transporter_gst_check:Boolean
        hamali_charge:String
        dd_charge:String
        local_charge:String
        bilty_charge:String
        service_charge:String
        contact_no_1:String
        contact_no_2:String
        load_tonnes:String
        rate_per_tonne:String
        advance_amount:String
        lorry_freight:String
        ms_company_name:String
        balance:String
        payable:String
        bill_images:[String]
        remarks:String
        delivery_charge:String
    
    }

    input OtherChargeBill{
        charge_type:String
        amount:Float
    }

    input EntriesInput {
        description:String
        weight:String
        freight:String
        total:String
    }

    input LREntriesInput {
        no_of_articles:String
        description:String
        weight_actual:String
        weight_charged:String
        amount_to_pay:String
        amount_paid:String
    }

    type SingleBillOutput{
        error:Boolean
        message:String
        data:BillData
    }
    type MultipleBillOutput{
        error:Boolean
        message:String
        data:[BillData]
        totalDocs: Int
        limit: Int
        totalPages: Int
        page: Int
    }

    type BillData {
        _id:ID
        created:String
        user:ID
        header_company_name:String
        bill_no:String
        ho_address:String
        bo_address:String
        gc_no:String
        gc_date:String
        unload_date:String
        bill_date:String
        start_location:String
        destination_location:String
        vehicle_no:String
        vehicle_type:String
        branch:String
        invoice_no:String
        invoice_date:String
        consignee_name:String
        consignee_address:String
        consignee_gst:String
        consignee_state_code:String
        consignor_name:String
        consignor_address:String
        consignor_gst:String
        consignor_state_code:String
        entries:[EntriesOutput]
        sub_total:String
        lr_charge:String
        labour_charge:String
        waiting_charge:String
        total_amount:String
        amount_in_words:String
        bill_for_company_name:String
        optional_signature_text:String
        bank_name:String
        bank_branch:String
        bank_account_no:String
        bank_ifsc_code:String
        gst_in:String
        pan_no:String
        gst_paid_by:String
        bill_type:String
        doc_type:String
        bill_created_date:String
        lr_created_date:String
        company:CompanyData
        truck:TruckData
        consignment:ConsignmentData
        bill_name:String
        lr_no:String
        value_rs:String
        lr_entries:[LREntriesOutput]
        delivery_address:String
        delivery_number:String
        shipment_number:String
        office_number:String
        consignee_gst_check:Boolean
        consignor_gst_check:Boolean
        transporter_gst_check:Boolean
        hamali_charge:String
        dd_charge:String
        local_charge:String
        bilty_charge:String
        service_charge:String
        contact_no_1:String
        contact_no_2:String
        load_tonnes:String
        rate_per_tonne:String
        advance_amount:String
        lorry_freight:String
        ms_company_name:String
        balance:String
        payable:String
        bill_images:[String]
        remarks:String
        delivery_charge:String
    
        
    }

    type EntriesOutput {
        description:String
        weight:String
        freight:String
        total:String
    }

    type LREntriesOutput {
        no_of_articles:String
        description:String
        weight_actual:String
        weight_charged:String
        amount_to_pay:String
        amount_paid:String
    }

    type OtherChargeBillOutput{
        charge_type:String
        amount:Float
    }
    


`

module.exports = typeDefs;