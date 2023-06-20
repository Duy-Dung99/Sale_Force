import { LightningElement, api, track, wire } from 'lwc';
import { validEmail, validPhone, regexEmaill, regexMobie } from 'c/validate';
import { NavigationMixin } from 'lightning/navigation';
import hasPermission from '@salesforce/customPermission/role_adm';
import validateEmail from '@salesforce/apex/ValidationController.validateEmail';
import ValidationGender from '@salesforce/apex/ValidationController.validationGender';
import validatePhone from '@salesforce/apex/ValidationController.validatePhone';
import ValidationUserName from '@salesforce/apex/ValidationController.validationName';
import validationBirthday from '@salesforce/apex/ValidationController.validationBirthday';
import validationStatus from '@salesforce/apex/ValidationController.validationStatus';

import TEST_OBJECT from '@salesforce/schema/test2__c';
import NAME_FIELD from '@salesforce/schema/test2__c.Name';


export default class LWC_Form extends NavigationMixin(LightningElement) {

    test2Object = TEST_OBJECT;
    nameFile = NAME_FIELD;


    @track birdthdayValue = '1990/1/1';
    @track genderValue = '';
    @track userNamValue = '';
    @track mobieNumberValue = '';
    @track emailValue = '';
    @track selectedGender;
    @track otherValue = '';

    //check valida apex
    @track isEmailValid = false;
    @track isBirthdayValid = false;
    @track isPhoneValid = false;
    @track isUserNameValid = false;
    @track isGenderValid = false;
    @track isStatusValid = false;
    @track isStatusValue = ''
    @track checkEmail = false;
    @track checkBirthday = false;
    @track checkStatus = false;




    //------
    @track url;

    @track genderOptions = [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' },
    ];

    @track statusOptions = [
        { label: 'Inactive', value: 'inactive' },
        { label: 'Active', value: 'active' },
    ]


    constructor() {
        super();
        console.log('hi constructor');
    }

    // renderedCallback() {
    //     loadStyle(this, myCss);
    // }

    // connectedCallback() {
    //     this.accountHomePageRef = {
    //         type: 'standard__objectPage',
    //         attributes: {
    //             objectApiName: 'Account',
    //             actionName: 'home'
    //         }
    //     };
    //     this[NavigationMixin.GenerateUrl](this.accountHomePageRef)
    //         .then(url => this.url = url);
    // }


    get isSetupEnabled() {
        return hasPermission;
    }


    handleChangeValidUser() {
        let userName = this.template.querySelector('.user-name');
        this.userNamValue = userName.value
        ValidationUserName({ userName: userName.value })
            .then(result => {
                if (result === false) {
                    this.isUserNameValid = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    changValueGender(event) {
        const selectedRadio = this.template.querySelector('lightning-radio-group').value;
        this.genderValue = selectedRadio
        ValidationGender({ gender: selectedRadio })
            .then(result => {
                if (result == false) {
                    this.isGenderValid = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    handleChangeValidMobie() {
        let mobieNumber = this.template.querySelector('.mobie-number');
        this.mobieNumberValue = mobieNumber.value;
        validatePhone({ phone: mobieNumber.value })
            .then(result => {
                if (result === true) {
                    this.isPhoneValid = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }


    handleChangeValidEmail() {
        let email = this.template.querySelector('.email');
        this.emailValue = email.value
        validateEmail({ email: email.value })
            .then(result => {
                if (result === true) {
                    this.isEmailValid = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    handleDateChange(event) {
        let birdthDay = this.template.querySelector('.birdthday');
        this.birdthdayValue = birdthDay.value
        const selectedDate = new Date(birdthDay.value);
        const year = selectedDate.getFullYear();
        validationBirthday({ year: year })
            .then(result => {
                if (result === true) {
                    this.isBirthdayValid = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    handleChangeStatus(event) {
        let status = event.target.value;
        console.log(status);
        validationStatus({ status })
            .then(result => {
                if (result !== false) {
                    this.isStatusValid = true;
                } else {
                    this.isStatusValid = false;
                    this.isStatusValue = status
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    handleChangeOther(event) {
        let other = event.target.value;
        this.otherValue = other
    }


    handleAddNew(event) {
        var userName = this.template.querySelector('.user-name');
        var birdthDay = this.template.querySelector('.birdthday');
        var mobieNumber = this.template.querySelector('.mobie-number');
        var email = this.template.querySelector('.email');
        var selectedRadio = this.template.querySelector('lightning-radio-group');
        var status = this.isStatusValue
        var other = this.template.querySelector('.other');

        const selectedDate = new Date(birdthDay.value);
        // Rút trích năm từ ngày
        const year = selectedDate.getFullYear();

        // validate apex
        ValidationUserName({ userName: userName.value })
            .then(result => {
                if (result === true) {
                    this.isUserNameValid = true;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        ValidationGender({ gender: selectedRadio.value })
            .then(result => {
                if (result === true) {
                    this.isGenderValid = true;
                } else {
                    this.isGenderValid = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        validationBirthday({ year: year })
            .then(result => {
                if (result === true) {
                    this.isBirthdayValid = false;
                    this.checkBirthday = result;
                } else {
                    this.isBirthdayValid = true;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        validatePhone({ phone: mobieNumber.value })
            .then(result => {
                if (result == false) {
                    this.isPhoneValid = true;
                } else {
                    this.checkPhone = result
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });


        validateEmail({ email: email.value })
            .then(result => {
                if (result === false) {
                    this.isEmailValid = true;
                } else {
                    this.checkEmail = result
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        validationStatus({ status })
            .then(result => {
                if (result !== false) {
                    this.isStatusValid = true;
                } else {
                    this.isStatusValid = false;
                    this.checkStatus = result
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });


        if (userName.value && this.checkBirthday === true && this.checkEmail === true && selectedRadio.value && this.checkPhone === true && this.checkStatus === false) {
            let componentDef = {
                componentDef: "c:confirm_form",
                attributes: {
                    userName: userName.value,
                    gender: selectedRadio.value,
                    birdthDay: birdthDay.value,
                    mobieNumber: mobieNumber.value,
                    email: email.value,
                    other: other.value,
                    status: status
                }
            };
            // Encode the componentDefinition JS object to Base64 format to make it url addressable
            let encodedComponentDef = btoa(JSON.stringify(componentDef));
            console.log(encodedComponentDef);
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: '/one/one.app#' + encodedComponentDef
                }
            });
        }
    }
    handleNotifyParent(event) {
        // Handle the event here
        console.log('Received event from child component');
        console.log(event);
    }

}