({
    doInit : function(component, event, helper) {
        helper.getAllAttachments(component, helper);
        helper.getFaxNumbers(component, helper);
    },
    handleFileSelection : function(component, event, helper) {
        var selectedOptionValue = event.getParam("value");
        if(selectedOptionValue.length > 0){
            component.set("v.selectedFileOptions", selectedOptionValue);
        }        
    },
    faxNumChange : function(component, event, helper) {
        var selected = component.find('fax_number').get('v.value');
        component.set("v.selectedFaxOption", selected);
    }, 
    faxBun : function(component, event, helper) {
        component.set("v.isFaxDisabled", true);
        helper.sendTheFax(component, helper);
    },
    refreshFileOptions :function(component, event, helper) {
        component.set("v.selectedFileOptions", []);
        helper.getAllAttachments(component, helper);
    }
})
