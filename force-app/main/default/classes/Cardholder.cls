public with sharing class Cardholder {
  @AuraEnabled
  public static Boolean addCardholder(String name, String cardId) {
    try {
      Cardholder__c cardholder = new Cardholder__c(
        Name = name,
        Card_ID__c = cardId
      );
      insert cardholder;
      return true;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
