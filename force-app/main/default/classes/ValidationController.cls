public with sharing class ValidationController {

    @AuraEnabled(cacheable=true)
    public static Boolean validationName(String userName) {
        return String.isBlank(userName);
    }
  
    @AuraEnabled(cacheable=true)
    public static Boolean validationGender(String gender) {
        return String.isBlank(gender);
    }

    @AuraEnabled(cacheable=true)
    public static Boolean validationStatus(String status) {
        return String.isBlank(status);
    }

    @AuraEnabled(cacheable=true)
    public static Boolean validationBirthday(Integer year) {
        return year >= 1900 && year <= 2000;
    }

    @AuraEnabled(cacheable=true)
    public static Boolean validatePhone(String phone) {
        Boolean res = true;
        String phoneRegex = '^\\d{10}$'; 
        Pattern MyPattern = Pattern.compile(phoneRegex);
        Matcher MyMatcher = MyPattern.matcher(phone);
        if (!MyMatcher.matches()) 
            res = false;
        return res;	
    }

    @AuraEnabled(cacheable=true)
    public static Boolean validateEmail(String email) {
        Boolean res = true;
        String emailRegex = '^[a-zA-Z0-9._|\\\\%#~`=?&/$^*!}{+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'; 
        Pattern MyPattern = Pattern.compile(emailRegex);
        Matcher MyMatcher = MyPattern.matcher(email);
        if (!MyMatcher.matches()) 
            res = false;
        return res;	
    }
    
}