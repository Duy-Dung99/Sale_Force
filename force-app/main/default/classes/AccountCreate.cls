public with sharing class AccountCreate {
    @AuraEnabled
    public static void AccountCreate(String fullName, Boolean gender, Date birthday, Integer phone ,String email, String note, Boolean status){
        Create_User__c newRecord = new Create_User__c();
        newRecord.NameFull__c = fullName;
        newRecord.Gender__c = gender;
        newRecord.Birthday__c = birthday;
        newRecord.Phone__c = phone;
        newRecord.Email__c = email;
        newRecord.Note__c = note;
        newRecord.status__c = status;
        insert newRecord;
    }

  
    @AuraEnabled(cacheable=true)
    public static List<Create_User__c> getListMember(
            String keyword,
            Boolean status,
            Integer pageNumber,
            Integer pageSize
    ){
        Integer mobi;
        String conditions = '\'%' + keyword + '%\'';
        Integer offset = (pageNumber - 1) * pageSize;

        if (String.isNotBlank(keyword) && keyword.isNumeric()) {
            mobi = integer.valueof(keyword);
        }                                                                                                                                   //Delete_Flag__c = true AND   
        String query = 'SELECT ID, NameFull__c, Gender__c, Birthday__c, Phone__c, Email__c, status__c, OwnerId,Delete_Flag__c, Owner_User__c FROM Create_User__c WHERE Delete_Flag__c = false AND (NameFull__c LIKE '
            + conditions + ' OR Phone__c = ' + mobi + ' OR Email__c LIKE ' + conditions + ')';
        if (status != null) {
            query += ' AND status__c = :status';
        }
        query += ' LIMIT :pageSize OFFSET :offset';
        
        List<Create_User__c> retMemberList = Database.query(query);
        return retMemberList;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getTotalMembers() {
        return [SELECT count() FROM Create_User__c WHERE Delete_Flag__c = false ]; //WHERE Delete_Flag__c = true
    }

    @AuraEnabled
    public static void updateCheckboxMutipleDeleteFlag(List<Id> recordIds) {
        List<Create_User__c> recordsToUpdate = new List<Create_User__c>();       
        for (Create_User__c record : [SELECT Id, Delete_Flag__c FROM Create_User__c WHERE Id IN :recordIds]) {
            record.Delete_Flag__c = true;
            recordsToUpdate.add(record);
        }
        update recordsToUpdate;
    }

    @AuraEnabled
    public static List<User> getOwnerUser(){
        List<User> activeUsers = [SELECT Id, Name, Email,Profile.Name FROM User WHERE IsActive = true]; // Profile.Name = 'System Administrator'
        for(User u : activeUsers) {
            System.debug('User ID: ' + u.Id);
            System.debug('User Name: ' + u.Name);
            System.debug('User Email: ' + u.Email);
        }
        return activeUsers;
    }

    @AuraEnabled
    public static void updateOwner(List<Id> recordIds, Id newOwnerId) {
        List<Create_User__c> recordsToUpdate = [SELECT Id, Owner_User__c FROM Create_User__c WHERE Id IN :recordIds];
        for (Create_User__c record : recordsToUpdate) {
            record.Owner_User__c = newOwnerId;
        }
        update recordsToUpdate;
    }

    @AuraEnabled
    public static List<User> getOwner(String searchKey) {
        String searchTerm = '%' + searchKey + '%';
        List<User> lwcList = [SELECT Id, Name,Email FROM User WHERE Name  LIKE :searchTerm AND IsActive = true];        
        return lwcList;
    }
}