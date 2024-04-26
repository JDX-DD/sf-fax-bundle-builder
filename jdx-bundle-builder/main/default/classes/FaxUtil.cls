public inherited sharing class FaxUtil {

    public static String getCompanyFaxSendNumber(){
        Auth_Settings__c authSettings = Auth_Settings__c.getOrgDefaults();        
        return authSettings.Organization_Fax_Number__c;
    }

    public static Id sendFax(String recipientNumber, String orgFaxNumber, String subject, List<ID> fileIds, Id bundleID) {
        efaxapp__Sent_Fax__c fax = new efaxapp__Sent_Fax__c();
        fax.efaxapp__Send_Date__c = Datetime.now(); // mandatory,
        fax.efaxapp__Status__c = 'Sending'; // mandatory
        fax.efaxapp__Sent_With_Outbound_Message__c = true; // mandatory
        fax.efaxapp__Fax_Number__c = recipientNumber; // recipient number – mandatory
        if(orgFaxNumber != null){
            fax.efaxapp__Org_Fax_Number__c = orgFaxNumber;// org fax number from which to send, mandatory
        }
        else{
            fax.efaxapp__Org_Fax_Number__c = getCompanyFaxSendNumber();
        }
        fax.efaxapp__Subject__c = subject;  // any text, mandatory
        fax.efaxapp__Attachment_ID__c = fileIds.get(0);
        
        //Up to 10 files, note these additional fiels are not available in scratch so the following is commented out
        /*        
        if(fileIds.size() > 1){
            for(Integer i = 2; i <= fileIds.size() && i <= 10; i++){
                fax.put('efaxapp__Attachment_ID' + i + '__c', fileIds.get(i-1));
            }
        }        
        */

        //Barcode Info
        /*
        fax.efaxapp__Barcode_Position_Top__c = ’30’,
        fax.efaxapp__Barcode_Position_Left__c = ’30’,
        fax.efaxapp__Barcode_Size_Width__c = ’30’
        */
        if(bundleID != null){
            fax.Bundle__c = bundleID;
        }
        insert fax;
        return fax.Id;
    }
}