import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOwner from '@salesforce/apex/AccountCreate.getOwner'
export default class DetailMember extends NavigationMixin(LightningElement) {
    @api full_name
    @api gender
    @api birthday
    @api phone
    @api email
    @api status
    @api ownerId
    @api delete_flag
    @api id
    @api owner_user
    @track detailMember = {};
    @track OwnerUser = [];


    connectedCallback() {

        getOwner({ searchKey: '' })
            .then((result) => {
                console.log(result, 'getOwner');
                this.OwnerUser = result
            }).catch(error => {
                console.log(error);
            })

        this.detailMember = {
            full_name: this.full_name,
            gender: this.gender,
            birthday: this.birthday,
            phone: this.phone,
            email: this.email,
            status: this.status,
            ownerId: this.ownerId,
            delete_flag: this.delete_flag,
            id: this.id,
            owner_user: this.owner_user,
        }
        // if (this.rowdetails) {
        //     this.detailMember = this.rowdetails
        // }
    }

    handleCancelDetail() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'lightning/n/table_member',
            },
        })
    }






    // testEvent() {
    //     this.dispatchEvent(new CustomEvent('canceldetail'));
    // }
}