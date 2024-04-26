({
    getAllAttachments : function(component, helper) {
        let action = component.get("c.getAllAttachments");
		action.setParams({
			"recordId": component.get("v.recordId")
		});
		
		action.setCallback(this, function(response){
			let contentDocuments = response.getReturnValue();
			let results = [];
			let i;
			for (i = 0; i < contentDocuments.length; i++) {
				results[i] = { label: contentDocuments[i].Title, value: contentDocuments[i].Id }
			}			
			component.set("v.availableOptions", results);		
		});
		$A.enqueueAction(action);
	},

    getFaxNumbers : function(component){		
		let action = component.get("c.getFaxNumbers");
		action.setCallback(this, function(response){
			let results = response.getReturnValue();
            let phoneOptions = [];
            phoneOptions.push({ value: null, label: "--Select a Recipient--"});
            for(const phoneRecord of results) {
                phoneOptions.push({ value: phoneRecord.Phone_Number__c, label: phoneRecord.Label});
            }
			component.set("v.faxOptions", phoneOptions);
			component.set("v.selectedFaxOption", phoneOptions[0]);
		});
		$A.enqueueAction(action);
    },

    sendTheFax : function(component, helper){
		let action = component.get("c.faxBundle");
		let recordId = component.get("v.recordId");
		let phoneNumber = component.get("v.selectedFaxOption");
        let contentDocs = component.get("v.selectedOptions");
		let subject = component.get("v.subject");
        if(phoneNumber && contentDocs && contentDocs.length > 0 && subject){
            console.log(phoneNumber);
            console.log(contentDocs);
            console.log(subject);
            action.setParams({
                "recordId": recordId,
                "selectedFaxPhoneNumber":phoneNumber,
                "selectedAttachmentIds": contentDocs,		
                "subject" : subject
            });
            action.setCallback(this, function(response){
                let state = response.getState();	
                if (state === "SUCCESS") {
                    let result = response.getReturnValue();
                    component.set("v.selectedFaxOption", null);
                    component.set("v.selectedOptions", []);
                    component.set("v.subject", "");
                    this.throwToast("success", "Success!", "Bundle successfully created!");
                }
                else{
                    let errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + errors[0].message);
                            this.throwToast("error", "Error creating Bundle", errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                        this.throwToast("error", "Error creating Bundle", "Unknown Error");
                    }
                }					
            });
            $A.enqueueAction(action);
        }
        else{
            this.throwToast("error", "Fax Bundle Builder Error", "All fields are required");
        }		
	}, 

    throwToast: function(type, title, message){
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": type,
            "title": title,
            "message": message
        });
        toastEvent.fire();
    }
    
})
