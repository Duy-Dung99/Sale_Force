import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
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

    connectedCallback() {
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
        console.log(this.full_name, 'connectedCallback');
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