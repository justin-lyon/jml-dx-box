@IsTest
private class RecentContactsMapAuraServiceTest {
  @TestSetup
  static void setupContacts() {
    List<Contact> contacts = new List<Contact>();
    contacts.add(
      new Contact(
        FirstName = 'Joe',
        LastName = 'Contact1',
        MailingCity = 'Dallas',
        MailingLatitude = 41,
        MailingLongitude = 81
      )
    );
    contacts.add(
      new Contact(
        FirstName = 'Joe',
        LastName = 'Contact2',
        MailingCity = 'Dallas',
        MailingLatitude = 41,
        MailingLongitude = 81
      )
    );
    contacts.add(
      new Contact(
        FirstName = 'Joe',
        LastName = 'Contact3',
        MailingCity = 'Dallas',
        MailingLatitude = 41,
        MailingLongitude = 81
      )
    );
    contacts.add(
      new Contact(
        FirstName = 'Joe',
        LastName = 'Contact4',
        MailingCity = 'Dallas',
        MailingLatitude = 41,
        MailingLongitude = 81
      )
    );
    contacts.add(
      new Contact(
        FirstName = 'Joe',
        LastName = 'Contact5',
        MailingCity = 'Dallas',
        MailingLatitude = 41,
        MailingLongitude = 81
      )
    );
    contacts.add(
      new Contact(
        FirstName = 'Joe',
        LastName = 'Contact6',
        MailingCity = 'Dallas',
        MailingLatitude = 41,
        MailingLongitude = 81
      )
    );

    insert contacts;

    // mark contacts as RecentlyViewed
    List<Contact> unused = [
      SELECT Id
      FROM Contact
      LIMIT 5
      FOR VIEW
    ];
  }

  @IsTest
  static void getRecentContacts_givenDefault_shouldGet5Contacts() {
    Test.startTest();

    List<RecentContactsMapAuraService.ViewModel> contacts = RecentContactsMapAuraService.getRecentContacts();

    Test.stopTest();

    System.Assert.areEqual(5, contacts.size());
  }
}
