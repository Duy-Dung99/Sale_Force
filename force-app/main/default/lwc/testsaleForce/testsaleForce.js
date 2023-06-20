import { LightningElement, api, track } from 'lwc';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import ACCOUNT_SITE from '@salesforce/schema/Account.Site';
import ACCOUNT_EMAIL from '@salesforce/schema/Account.Email__c';
import USER_OBJECT from '@salesforce/schema/User';
import USER_ADDRESS from '@salesforce/schema/User.Address';
// import signIn from './signIn.html';
// import signUp from './signUp.html';
export default class TestsaleForce extends LightningElement {

    accountObject = ACCOUNT_OBJECT;
    nameField = NAME_FIELD;
    websiteField = WEBSITE_FIELD;
    phoneField = PHONE_FIELD;
    accountSite = ACCOUNT_SITE;
    userObject = USER_OBJECT;
    userAddress = USER_ADDRESS;
    accountEmail = ACCOUNT_EMAIL;

    @track showEditModal = false;
    @track showDelModal = false;
    @track selectedIndex = null;

    clickedButtonLabel;
    click;
    a = 0;
    b = false;
    myInputValue;
    firstName = "";
    lastName = ''
    greeting = '';
    @track test = true;
    // @api itemName;
    @track listAccount = [
        { name: 'dũng', phone: '099999999' },
        { name: 'mạnh', phone: '099999999' },
        { name: 'kiên', phone: '099999999' },
    ];

    @track newList = {
        name: '',
        phone: '',
    };


    click() {
        this.test = !this.test;
    }

    handleAccountCreated() {
        alert('Account success')
    }


    getValue() {
        const selectedRadio = this.template.querySelector('.raido-group');
        this.selectedGender = selectedRadio.value;
        alert("Selected gender: " + this.selectedGender);
    }


    handleClick(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this[NavigationMixin.Navigate](this.accountHomePageRef);
    }

    handleChange1(event) {
        this.greeting = event.target.value;
    }

    handleClick(event) {
        this.clickedButtonLabel = event.target.label;
        this.myInputValue = document.getElementById("myInput").value;
        // console.log('event--', event.target.label);
        // console.log('click--', this.a);
        // console.log('click--', this.b);
        console.log('a', event);
        console.log('b', 1);
        console.log('c', this.myInputValue);
    }

    handleValue(event) {
        // var myInputValue = document.querySelector("myInput").value;
        console.log(event);
    }

    handleChangeFullName(event) {
        const field = event.target.name;
        // console.log('field', field);
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        }
    }

    _uppercaseItemName = 'a';

    @api
    get itemName() {
        return this._uppercaseItemName;
    }

    set itemName(value) {
        this._uppercaseItemName = value.toUpperCase();
    }



    get uppercasedFullName() {
        return `${this.firstName} ${this.lastName}`.toUpperCase();
    }

    areDetailsVisible = false;

    handleChange(event) {
        this.areDetailsVisible = !this.areDetailsVisible
        console.log(event.target.checked);
    }

    contacts = [
        {
            Id: 1,
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
        },
        {
            Id: 2,
            Name: 'Michael Jones',
            Title: 'VP of Sales',
        },
        {
            Id: 3,
            Name: 'Jennifer Wu',
            Title: 'CEO',
        },
    ];

    handleAddNewOk() {
        alert('thêm thành công')
        this.showModalAddNew = true;
        location.reload();
    }
    handleCancelAddNew() {
        this.showModalAddNew = true;
    }

    clickEditIcon(event) {
        this.showEditModal = true;
        this.selectedIndex = event.target.dataset.index       // lấy ra vị trí index
        this.newList.name = this.listAccount[this.selectedIndex].name;
        this.newList.phone = this.listAccount[this.selectedIndex].phone
    }

    clickDelIcon(event) {
        this.selectedIndex = event.target.dataset.index
        console.log(this.selectedIndex);
        this.showDelModal = true;
    }

    handleCancel() {
        this.showEditModal = false;
        this.showDelModal = false;
        this.newList.name = '';
        this.newList.phone = '';
    }

    accountNew() {
        this.showEditModal = true;
    }

    handleAdd(event) {
        let nameEdit = this.template.querySelector('.edit-name').value;
        let phoneEdit = this.template.querySelector('.edit-phone').value;
        // console.log(event.keyCode);
        if (event.keyCode == 13) {
            this.listAccount.push({ name: nameEdit, phone: phoneEdit })
            this.showEditModal = false;
        }
    }

    handleClickAdd() {
        let nameEdit = this.template.querySelector('.edit-name').value;
        let phoneEdit = this.template.querySelector('.edit-phone').value;
        this.listAccount.push({ name: nameEdit, phone: phoneEdit })
        this.showEditModal = false;
    }

    handleSave(event) {
        let nameEdit = this.template.querySelector('.edit-name').value;
        let phoneEdit = this.template.querySelector('.edit-phone').value;
        this.listAccount.splice(this.selectedIndex, 1, { name: nameEdit, phone: phoneEdit })
        this.showEditModal = false;
    }

    handleDelete(event) {
        this.listAccount.splice(this.selectedIndex, 1)
        this.showDelModal = false;
    }

    //------------------------------------------
    selected = null;
    // render() {
    //     return this.selected === 'Sign Up' ? signUp :
    //         this.selected === 'Sign In' ? signIn :
    //             defaultTemplate
    // }
    // handleClickMutilpleTeamplate(event) {
    //     this.selected = event.target.label
    // }
}