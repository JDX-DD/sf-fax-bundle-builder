import { LightningElement, wire, api } from 'lwc';
import getAllAttachments from '@salesforce/apex/BundleBuilderController.getAllAttachments';
import getFaxNumbersCached from '@salesforce/apex/BundleBuilderController.getFaxNumbersCached';
import faxBundle from '@salesforce/apex/BundleBuilderController.faxBundle';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const ERROR_VARIANT = 'error';
const SUCCESS_VARIANT = 'success';

export default class BundleBuilderComponent extends LightningElement {
    @api recordId;
    fileOptions = [];
    selectedFileOptions = [];
    faxNumberOptions = [];
    selectedFaxNumberOption;
    subject;
    isFaxDisabled = false;

    connectedCallback() {
        this.buildAttachmentOptions(); 
    }

    buildAttachmentOptions(){
        getAllAttachments({recordId: this.recordId})
        .then((result) => {
            this.fileOptions = result.map(conDoc => {
                return { label: conDoc.Title, value: conDoc.Id }
            });
        })
        .catch((error) => {
            this.showToast('Error fetching Attachments', error.message, ERROR_VARIANT);
        })
    }

    @wire(getFaxNumbersCached)
    faxNumbers({ error, data }) {
        if (data) {
            this.faxNumberOptions = data.map(faxNumber => {
                return { label: faxNumber.Label, value: faxNumber.Phone_Number__c }
            });
            this.faxNumberOptions.unshift({ label: '--Select a Recipient--', value: "" });
        } else if (error) {
            this.showToast('Error fetching Fax Numbers', error.message, ERROR_VARIANT);
        }
    }

    handleFileSelection(event){
        this.selectedFileOptions = event.detail.value;
    }

    handleFaxNumberChange(event){
        this.selectedFaxNumberOption = event.detail.value;
    }

    sendFax(){
        this.isFaxDisabled = true;
        let subjectInput = this.template.querySelector(".subject_input");        
        this.subject = subjectInput.value;
        if(this.selectedFaxNumberOption && this.selectedFileOptions && this.selectedFileOptions.length > 0 && this.subject){
            faxBundle({recordId: this.recordId, selectedFaxPhoneNumber: this.selectedFaxNumberOption, selectedAttachmentIds: this.selectedFileOptions, subject: this.subject})
            .then((result) => {
                this.showToast('Success!', 'Bundle successfully created!', SUCCESS_VARIANT);
                this.selectedFaxPhoneNumber = "";
                this.selectedFileOptions = [];                
                this.subject = '';
                
            })
            .catch((error) => {
                this.showToast('Error creating Bundle', error.message, ERROR_VARIANT);
            })
            .finally(() => {
                this.isFaxDisabled = false;
            })
        }
        else{
            this.showToast('Fax Bundle Builder Error', 'All fields are required', ERROR_VARIANT);
            this.isFaxDisabled = false;
        }
    }

    showToast(title, message, variant){
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,                
        });
        this.dispatchEvent(event); 
    }
}