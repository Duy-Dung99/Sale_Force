import { LightningElement, api, track, wire } from 'lwc';
import getTotalMembers from '@salesforce/apex/AccountCreate.getTotalMembers'


export default class Panigation extends LightningElement {
    @api pagesize
    @api pagenumber



    @track totalMembers;
    @track status = null;
    @track pageSizeChild = 10;


    connectedCallback() {
        console.log('connectedCallback-panigation');
    }


    get pageSize() {
        return this.pagesize;
    }

    get pageNumber() {
        return this.pagenumber;
    }




    handleOnselectLitmit(event) {
        this.pageSizeChild = event.detail.value;
        this.dispatchEvent(new CustomEvent('renderdata', { detail: this.pageSizeChild }));
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
        this.dispatchEvent(new CustomEvent('previous'));
    }

    goToNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }

    goToFirst() {
        this.dispatchEvent(new CustomEvent('first'));
    }

    goToLast() {
        this.dispatchEvent(new CustomEvent('last'));
    }
}