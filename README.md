# Bundle Builder

This is a simple aura component I built a while back.  In combination with the 3rd party package RS Fax it allows the user to easily fax multiple documents with a single click. 
The component can be dropped on any record page and will allow you to bundle up to 10 attachments (I've added a few pdf files to use if you need in the documents/attachments folder).

The purpose of the repository is to demonstrate a 1 to 1 rebuild of an exisiting aura component to an LWC component.  


![Aura Bundle Builder UI](https://github.com/JDX-DD/sf-fax-bundle-builder/blob/master/documents/images/aruabundleui.png?raw=true)
![LWC Bundle Builder UI](https://github.com/JDX-DD/sf-fax-bundle-builder/blob/master/documents/images/lwcbundleui.png?raw=true)
## Setup

1.  Once you have created a new scratch org install the RS Fax package
```
sf package install --package 04t1Y000000gfhVQAQ
```
2. You should now be good to deploy
```
sf project deploy start
```
3. Once finished you can assign yourself the Bundle Builder Permission Set
```
sf org assign permset --name Bundle_Builder_Permission_Set
```
4. Next you will need to do some configuration
* Go to the Auth Settings custom setting and create a new default org level value (This is the phone number the fax will be sent from)  
![Auth Settings](https://github.com/JDX-DD/sf-fax-bundle-builder/blob/master/documents/images/authsettings.png)
* You can drop this component on any record page, however i did provide account and contact lightning pages that you can activate  
![Lightning Pages](https://github.com/JDX-DD/sf-fax-bundle-builder/blob/master/documents/images/lightningpages.png)
5. You should now be good to navigate to the Bundle Builder Demo App, create an Account and or Contact record, add Attachments and GO!  
![Lightning Pages](https://github.com/JDX-DD/sf-fax-bundle-builder/blob/master/documents/images/bundlebuilderdemoapp.png)


A Few Notes:
- To send a fax with RS Fax a Sent Fax record needs to be created
- Bundle Builder first creates a Bundle record to hold all attachments and information about Sent Fax, the Sent Fax record is then created as a child record of the Bundle
- Don't worry creating the Sent Fax record will not actually send the fax (I would use fake numbers even so)
- The Sent Fax record does allow for sending multiple documents by using the efaxapp__Attachment_ID2__c through efaxapp__Attachment_ID10__c fields however these are not available 
in their scratch org package so the code that refrences them is commented out

