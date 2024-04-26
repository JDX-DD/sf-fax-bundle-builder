({
    doInit : function(component, event, helper) {
        helper.getAllAttachments(component, helper);
        helper.getFaxNumbers(component, helper);
    },
    handleChange : function(component, event, helper) {
        var selectedOptionValue = event.getParam("value");
        if(selectedOptionValue.length > 0){
            component.set("v.selectedOptions", selectedOptionValue);
        }        
    },
    faxNumChange : function(component, event, helper) {
        var selected = component.find('fax_number').get('v.value');
        component.set("v.selectedFaxOption", selected);
    }, 
    faxBun : function(component, event, helper) {
        helper.sendTheFax(component, helper);
    }
})
