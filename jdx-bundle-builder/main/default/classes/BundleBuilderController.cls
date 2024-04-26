public with sharing class BundleBuilderController {
    @AuraEnabled
    public static List<ContentDocument> getAllAttachments(Id recordId){
        List<ContentDocument> cds = new List<ContentDocument>();
        if(recordId != null){
            List<ContentDocumentLink> cdls = [Select ContentDocumentId from ContentDocumentLink where LinkedEntityId =: recordId WITH SECURITY_ENFORCED];
            Set<Id> conDocIds = new Set<Id>();
            for(ContentDocumentLink cdl : cdls){
                conDocIds.add(cdl.ContentDocumentId);
            }
            cds = [Select Id, Title, CreatedDate from ContentDocument where ID in: conDocIds  WITH SECURITY_ENFORCED order by CreatedDate DESC ];
            
        }
        return cds;
    }

    @AuraEnabled
    public static List<Fax_Phone_Number__mdt> getFaxNumbers(){
        return [Select Label, Phone_Number__c, Order__c from Fax_Phone_Number__mdt WITH SECURITY_ENFORCED order by Order__c ASC];
    }

    @AuraEnabled
    public static Boolean faxBundle(Id recordId, String selectedFaxPhoneNumber, List<String> selectedAttachmentIds, String subject){
        Boolean success = false;
        Savepoint sp = Database.setSavepoint();
        try{
            Bundle__c bun = new Bundle__c();
            bun.Subject__c = subject;
            bun.Recipient_Phone_Number__c = selectedFaxPhoneNumber;
            Map<Id, ContentDocument> contentDocs = new Map<Id, ContentDocument>([Select Id, LatestPublishedVersionId from ContentDocument where Id in: selectedAttachmentIds WITH SECURITY_ENFORCED]);
            List<ContentDocument> orderedConDocs = new List<ContentDocument>();
            //forces content docs to be in selected order
            for(String conId : selectedAttachmentIds){
                orderedConDocs.add(contentDocs.get(conId));
            }            
            for(Integer i = 1; i <= orderedConDocs.size(); i++){
                bun.put('Attachment_' + i + '__c', orderedConDocs.get(i - 1).LatestPublishedVersionId);
            }
            insert bun;
            List<ContentDocumentLink> conDocLinks = new List<ContentDocumentLink>();
            for(Integer i = 0; i < orderedConDocs.size(); i++){
                ContentDocumentLink conDocLink = new ContentDocumentLink();
                    conDocLink.ContentDocumentId = orderedConDocs.get(i).Id;
                    conDocLink.LinkedEntityId = bun.Id;
                    conDocLink.ShareType = 'I';
                    conDocLinks.add(conDocLink);
            }
            insert conDocLinks;

            //Create Sent Fax Record
            FaxUtil.sendFax(bun.Recipient_Phone_Number__c, null, bun.Subject__c, selectedAttachmentIds, bun.Id);

            success = true;
        }catch(Exception e){
            Database.rollback(sp);
            System.debug(e.getMessage());
            System.debug(e.getStackTraceString());
            throw new AuraHandledException(e.getMessage());
        }
        return success;
    }

}