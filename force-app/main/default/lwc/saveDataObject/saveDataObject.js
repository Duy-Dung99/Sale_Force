import { LightningElement, track } from 'lwc';
import TEST_OBJECT from '@salesforce/schema/test2__c';
import NAME_FIELD from '@salesforce/schema/test2__c.Name';
import EMAIL_FIELD from '@salesforce/schema/test2__c.Email__c';
import BIRTHDAY_FIELD from '@salesforce/schema/test2__c.Birthday__c';
import PHONE_FIELD from '@salesforce/schema/test2__c.Phone__c';
import OTHER_FIELD from '@salesforce/schema/test2__c.Other__c';
import LightningAlert from 'lightning/alert';

export default class SaveDataObject extends LightningElement {

    test2Object = TEST_OBJECT;
    nameFile = NAME_FIELD;
    emailFile = EMAIL_FIELD;
    birthdatFile = BIRTHDAY_FIELD;
    phoneFile = PHONE_FIELD;
    otherFile = OTHER_FIELD;

    @track birthdayValue = '1990/1/1'
    @track genderOptions = [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' },
    ];


    async handleAccountCreated() {
        const test = this.template.querySelector('.aaa').value
        console.log(test, 'test');
        await LightningAlert.open({
            message: 'It has registed successfully',
            theme: 'success',
            label: 'Success!',
        });
    }
}