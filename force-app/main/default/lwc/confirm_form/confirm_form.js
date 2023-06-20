import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import LightningAlert from 'lightning/alert';
import LightningConfirm from 'lightning/confirm';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//import apex class
import AccountCreate from '@salesforce/apex/AccountCreate.AccountCreate'

//importing object fields
import CREATEUSER_OBJECT from '@salesforce/schema/Create_User__c';
import fullNameFile from '@salesforce/schema/Create_User__c.NameFull__c';
import phoneFile from '@salesforce/schema/Create_User__c.Phone__c';
import Birthday__c from '@salesforce/schema/Create_User__c.Birthday__c';
import Gender__c from '@salesforce/schema/Create_User__c.Gender__c';
import Email__c from '@salesforce/schema/Create_User__c.Email__c';
import Note__c from '@salesforce/schema/Create_User__c.Note__c';
import status__c from '@salesforce/schema/Create_User__c.status__c';

export default class Confirm_form extends NavigationMixin(LightningElement) {

    createUserObject = CREATEUSER_OBJECT;



    @api userName;
    @api gender;
    @api birdthDay;
    @api mobieNumber;
    @api email;
    @api other
    @api status;
    @track newAccount = {
        userName: fullNameFile,
        gender: Gender__c,
        birdthDay: Birthday__c,
        mobieNumber: phoneFile,
        email: Email__c,
        note: Note__c,
        status: status__c,
    }

    @wire(CurrentPageReference)
    currentPageReference;


    connectedCallback() {
        this.newAccount = {
            userName: this.userName,
            gender: this.gender,
            birdthDay: this.birdthDay,
            mobieNumber: this.mobieNumber,
            email: this.email,
            note: this.other,
            status: this.status,
        }
        console.log(this.birdthDay, 'aaa');
    }

    handleNameChange(event) {
        this.userName = event.target.value;
        console.log(this.userName);
    }
    handlePhoneChange(event) {
        this.mobieNumber = event.target.value;
        console.log(this.mobieNumber);
    }
    handleBirthdayChange(event) {
        this.birdthDay = event.target.value;
        console.log(this.birdthDay);
    }
    handleGenderChange(event) {
        this.gender = event.target.value;
        console.log(this.gender);
    }
    handleEmailChange(event) {
        this.email = event.target.value;
        console.log(this.email);
    }
    handleNoteChange(event) {
        this.note = event.target.value;
        console.log(this.note);
    }
    handleStatusChange(event) {
        this.status = event.target.value;
        console.log(this.status);
    }

    async handleAdd() {
        console.log(this.birdthDay);
        var parts = this.birdthDay.split('/');
        var formattedStr = parts.map(function (part) {
            return part.padStart(2, '0');
        }).join('-');
        console.log(typeof this.mobieNumber);
        AccountCreate({
            fullName: this.userName,
            gender: this.gender === 'male' ? true : false,
            birthday: formattedStr,
            phone: this.mobieNumber,
            email: this.email,
            note: this.other,
            status: this.status === 'inactive' ? true : false,
        }).then(result => {
            console.log(result);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Account Created Successfully!!',
                variant: 'success'
            }),);
            setTimeout(() => {
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {
                        url: 'lightning/n/LwcForm',
                    },
                })
            }, 1000)
        }).catch(err => {
            console.error('err', err);
        })
    }

    async handleCancel() {
        const result = await LightningConfirm.open({
            message: 'Bạn chắc chắn muốn hủy?',
            variant: 'headerless',
            label: 'this is the aria-label value',
            // setting theme would have no effect
        });
        if (result === true) {
            await LightningAlert.open({
                message: `It's fail to regist member. Please try again in later`,
                theme: 'error',
                label: 'Error!',
            });
            this[NavigationMixin.Navigate]({
                // type: 'standard__component',
                type: 'standard__webPage',
                attributes: {
                    // componentName: 'c__confirm_form',
                    url: 'lightning/n/LwcForm',
                },
            });
        }

    }
    handleAccountCreated() {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!!',
            message: 'Account Created Successfully!!',
            variant: 'success'
        }),);
    }

    notifyParentEvent() {
        const event = new CustomEvent('notifyparent');
        this.dispatchEvent(event);
    }

}