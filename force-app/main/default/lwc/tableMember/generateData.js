export default function generateData({ data }) {
    return data.map((value, index) => {
        return {
            full_name: value.NameFull__c,
            gender: value.Gender__c === true ? 'Male' : 'Female',
            birthday: value.Birthday__c,
            phone: value.Phone__c ? `0${value.Phone__c}` : '',
            email: value.Email__c,
            status: value.status__c === true ? 'Inactive' : 'Active',
            ownerId: value.OwnerId,
            delete_flag: value.Delete_Flag__c,
            id: value.Id,
            owner_user: value.Owner_User__c,
        };
    });
}




