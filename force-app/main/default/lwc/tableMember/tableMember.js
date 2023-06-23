import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import generateData from './generateData';
import getListMember from '@salesforce/apex/AccountCreate.getListMember'
import updateCheckboxMutipleDeleteFlag from '@salesforce/apex/AccountCreate.updateCheckboxMutipleDeleteFlag'
import updateOwner from '@salesforce/apex/AccountCreate.updateOwner'
import getTotalMembers from '@salesforce/apex/AccountCreate.getTotalMembers'
import getOwner from '@salesforce/apex/AccountCreate.getOwner'
import { RefreshEvent } from 'lightning/refresh';
import { updateRecord } from 'lightning/uiRecordApi';


import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { getRecordNotifyChange } from "lightning/uiRecordApi";

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
    { label: 'Change owner', name: 'change_owner' },
];

const columns = [
    { label: 'FULL NAME', fieldName: 'full_name', type: 'text', sortable: true, },
    { label: 'GENDER', fieldName: 'gender', sortable: true, },
    { label: 'BIRTHDAY', fieldName: 'birthday', type: 'date', sortable: true, },
    { label: 'PHONE', fieldName: 'phone', type: 'phone', sortable: true, },
    { label: 'EMAIL', fieldName: 'email', type: 'email', sortable: true, },
    { label: 'STATUS', fieldName: 'status', sortable: true, },
    { label: 'OWNER', fieldName: 'ownerId', sortable: true, },
    { label: 'DELETE FLAG', fieldName: 'delete_flag' },
    { label: 'OWNER USER', fieldName: 'owner_user', sortable: true, },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class TableMember extends NavigationMixin(LightningElement) {
    @track listAccount = [];
    @track newlistAccount = [];
    @track showAction = false;
    @track selectedIndex = null;
    @track valStatus = 'active';
    @track keyword = '';
    @track status = null;
    @track pageNumber = 1;
    @track pageSize = 10;
    @track valueOwnerModal;
    @track OwnerUser = [];
    @track recordIds;
    @track newOwnerId;
    @track totalMembers;
    @track searchKeyOwner = '';
    @track showDeleteAction = false;
    @track isCheckData = false;


    //---value row acction---
    @track idOnerDeleteFlag;
    @api idOwnerUser;

    //--- value sort datatable---
    @track sortBy;
    @track sortDirection;

    columns = columns;
    record = {};
    rowOffset = 0;

    //----show modal-->
    @track showOwnerModal = false;
    @track showDelModal = false;
    @track showDelModalAcctionDeleteFlag = false;


    //--------->>
    async connectedCallback() {
        try {
            console.log(this.totalPages, 'this.totalPages');
            await getListMember({
                keyword: '',
                status: this.status,
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            })
                .then(result => {
                    console.log(result, 'connectedCallback');
                    if (result <= 0) {
                        this.isCheckData = true
                    } else {
                        // this.newlistAccount = result
                        const data = result
                        this.listAccount = generateData({ data })
                    }
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                })

            await getOwner({ searchKey: this.searchKeyOwner })
                .then((result) => {
                    console.log(result, 'getOwner');
                    this.OwnerUser = result
                }).catch(error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }

    }

    get newGenerateData() {
        return this.newlistAccount.map((value, index) => ({
            full_name: value.NameFull__c,
            gender: value.Gender__c === true ? 'Male' : 'Female',
            birthday: value.Birthday__c,
            phone: value.Phone__c ? `0${value.Phone__c}` : '',
            email: value.Email__c,
            status: value.status__c === true ? 'Inactive' : 'Active',
            ownerId: value.OwnerId,
            delete_flag: value.Delete_Flag__c,
            id: value.Id,
            // owner_user: this.getOwners(value.Owner_User__c),
            owner_user: value.Owner_User__c,
        }))
    }

    getOwners(idOwner) {
        let newOwner = '';
        this.OwnerUser.forEach((element) => {
            if (idOwner === element.Id) {
                newOwner = element.Name;
                return;
            }
        })
        return newOwner;
    }



    search() {
        var SelectorKeyword = this.template.querySelector('[data-search="condition"]').value;
        if (SelectorKeyword) {
            this.keyword = SelectorKeyword;
            getListMember({
                keyword: this.keyword,
                status: this.status,
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            })
                .then(result => {
                    console.log(result);
                    if (result <= 0) {
                        const data = result
                        // this.newlistAccount = result
                        this.listAccount = generateData({ data })
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error',
                                message: 'No matching results found.!',
                                variant: 'error'
                            })
                        );
                    } else {
                        // this.newlistAccount = result
                        const data = result
                        this.listAccount = generateData({ data })
                        console.log(this.listAccount.length);
                    }

                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                })
        }
    }

    //--> render data
    renderData() {
        getListMember({
            keyword: '',
            status: this.status,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
        })
            .then(result => {
                // this.newlistAccount = result;
                this.dispatchEvent(new RefreshEvent());
                const data = result
                this.listAccount = generateData({ data })
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            })
    }

    showToastSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Success..!',
                variant: 'success',
            })
        );
    }

    changeSearch() {
        var condition = this.template.querySelector('[data-search="condition"]').value;
        if (condition === '') {
            this.renderData();
        }
    }

    handleStatus() {
        let status = this.template.querySelector('.lwc-status').value;
        console.log(status);
    }

    handleOwner() {
        let checkBox = this.template.querySelector('lightning-datatable').getSelectedRows()
        console.log(checkBox, 'checkBox');
        if (checkBox == '') {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!',
                message: 'Error Select at least one record and try again.!',
                variant: 'error'
            }),);
        } else {
            this.showOwnerModal = true;
        }
    }

    handleDelete(event) {
        let checkBox = this.template.querySelector('lightning-datatable').getSelectedRows()
        console.log(checkBox, 'checkBox');
        if (checkBox == '') {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!',
                message: 'Error Select at least one record and try again.!',
                variant: 'error'
            }),);
        } else {
            this.showDelModal = true
            this.showDeleteAction = true
        }
    }

    handleCancelModalDelete() {
        this.showDelModal = false;
    }

    async handleDeleteModalDelete() {
        let checkBox = this.template.querySelector('lightning-datatable').getSelectedRows()
        const data = checkBox.map((value) => {
            return value.id
        })
        console.log(JSON.stringify(data), 'Id');
        await updateCheckboxMutipleDeleteFlag({ recordIds: data })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
                this.showDelModal = false;
                this.renderData();
                location.reload();
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            })
    }

    cancelModalOwner() {
        this.showOwnerModal = false
        getOwner({ searchKey: this.searchKeyOwner })
            .then((result) => {
                this.OwnerUser = result
                console.log(result);
            }).catch((error) => {
                console.error(error);
            })
    }

    handleClickOwnerModal(event) {
        const valueName = event.target.innerText;
        this.valueOwnerModal = valueName


        const ownerId = event.target.dataset.itemValue;
        let checkBox = this.template.querySelector('lightning-datatable').getSelectedRows()
        const data = checkBox.map((value) => {
            return value.id
        })
        this.recordIds = data
        this.newOwnerId = ownerId

        console.log(ownerId);
        console.log(JSON.stringify(data));
    }

    submitModalOwner(event) {
        updateOwner({ recordIds: this.recordIds, newOwnerId: this.newOwnerId })
            .then(() => {
                this.showToastSuccess()
                // this.renderData()
                // location.reload()
                this.showOwnerModal = false
            }).catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.message,
                        variant: 'error',
                    })
                );
            })
        console.log(this.recordIds, JSON.stringify(this.newOwnerId));
    }

    changeOwnerUser(event) {
        let searchKey = event.target.value;
        if (searchKey) {
            getOwner({ searchKey: searchKey })
                .then((result) => {
                    this.OwnerUser = result;
                    refreshApex(this.OwnerUser);
                    console.log(result);
                }).catch((error) => {
                    console.error(error);
                })
        } else if (searchKey === '') {
            getOwner({ searchKey: this.searchKeyOwner })
                .then((result) => {
                    this.OwnerUser = result;
                    refreshApex(this.OwnerUser);
                    console.log(result);
                }).catch((error) => {
                    console.error(error);
                })
        }

    }

    accountNewMember(event) {
        this[NavigationMixin.Navigate]({
            // type: 'standard__component',
            type: 'standard__webPage',
            attributes: {
                // componentName: 'c__confirm_form',
                url: 'lightning/n/LwcForm',
            },
        });
    }

    // handleSelectdRows() {
    //     var el = this.template.querySelector('lightning-datatable').getSelectedRows()
    //     console.log(el, 'el');
    // }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            case 'change_owner':
                this.showRowChangeOwner(row)
                break;
            default:
        }
    }

    deleteRow(row) {
        this.showDeleteAction = false;
        this.showDelModal = true;
        const idRecord = row.id
        this.idOnerDeleteFlag = idRecord
        console.log(JSON.stringify(idRecord), 'deleteRow');
    }

    handleCancelModalDeleteFlag() {
        this.showDelModal = false;
    }

    async handleDeleteModalDeleteFlag() {
        try {
            const recordId = this.idOnerDeleteFlag
            console.log(recordId);
            await updateCheckboxMutipleDeleteFlag({ recordIds: recordId })
                .then(() => {
                    this.showToastSuccess()
                    this.showDelModal = false;
                    // this.renderData();
                    location.reload();
                }).catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                })
        } catch (error) {
            console.log(error);
        }
    }

    showRowDetails(row) {
        // this.rowDetails = row;
        console.log(JSON.stringify(row.owner_user), 'showRowDetails');

        let componentDef = {
            componentDef: "c:detailMember",
            attributes: {
                full_name: row.full_name,
                gender: row.gender === true ? 'Male' : 'Female',
                birthday: row.birthday,
                phone: row.phone ? row.phone : '',
                email: row.email,
                status: row.status === true ? 'Inactive' : 'Active',
                ownerId: row.ownerId,
                delete_flag: row.delete_flag,
                id: row.id,
                // owner_user: this.getOwnerId(row.owner_user),
                owner_user: row.owner_user,
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

    getOwnerId(nameOwner) {
        let newOwner = '';
        this.OwnerUser.forEach((element) => {
            if (nameOwner === element.Name) {
                newOwner = element.Id;
                return;
            }
        })
        return newOwner;
    }

    showRowChangeOwner(row) {
        this.showOwnerModal = true;
        const idOwner = row.id
        this.idOwnerUser = idOwner
        console.log(JSON.stringify(idOwner), 'showRowChangeOwner');
    }

    submitModalOwnerAction() {
        console.log(this.idOwnerUser, 'idOwnerUser');
        console.log(this.newOwnerId, 'newOwnerId');
        updateOwner({ recordIds: this.idOwnerUser, newOwnerId: this.newOwnerId })
            .then(() => {
                this.showToastSuccess()
                this.renderData()
                // location.reload()
                // this.dispatchEvent(new RefreshEvent());
                this.showOwnerModal = false
                // this.updateRecordView(this.idOwnerUser)

            }).catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.message,
                        variant: 'error',
                    })
                );
            })
    }

    updateRecordView(recordId) {
        updateRecord({ fields: { Id: recordId } });
    }

    //panigation
    handleOnselectLitmit(event) {
        const pageSizeChild = event.detail;
        this.pageSize = pageSizeChild;
        this.renderData()
    }

    @wire(getTotalMembers)
    wiredTotalAccounts({ error, data }) {
        if (data) {
            this.totalMembers = data
        } else if (error) {
            console.error(error);
        }
    }

    get totalPage() {
        return Math.ceil(this.totalMembers / this.pageSize);
    }


    get disablePrevious() {
        return this.pageNumber === 1
    }

    get disableNext() {
        return this.pageNumber === this.totalPage
    }

    goToPrevious() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.renderData()
        }
    }

    goToNext() {
        if (this.pageNumber < this.totalPage) {
            this.pageNumber++;
            this.renderData()
        }
    }

    goToFirst() {
        this.pageNumber = 1;
        this.renderData()
    }

    goToLast() {
        this.pageNumber = this.totalPage;
        this.renderData()
    }

    //sort data
    onHandleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        console.log(JSON.parse(JSON.stringify(this.newGenerateData)), 'newGenerateData');
        let parseData = JSON.parse(JSON.stringify(this.listAccount));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1 : -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        console.log(parseData, 'parseData');
        this.listAccount = parseData;
    }
}