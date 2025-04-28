@IsTest
public with sharing class TestUtil {
  public static final String EMAIL_SUFFIX = '@test.test';
  public static final String USERNAME_SUFFIX = '.env';
  public static final String TIMEZONE_SID_KEY_NEWYORK = 'America/New_York';
  public static final String TIMEZONE_SID_KEY_SEOUL = 'Asia/Seoul';
  public static final String DEFAULT_LANGUAGE = 'en_US';
  public static final String DEFAULT_ENCODING = 'UTF-8';
  public static final String PROFILE_ADMIN = 'System Administrator';
  public static final String PROFILE_BASE = 'Base';
  public static final String FIRST_NAME = 'joe';

  // QUERY TEST RECORDS
  public static User queryTestUser(String lastName) {
    String likeEmail = '%' + TestUtil.EMAIL_SUFFIX;
    return [
      SELECT Id, ManagerId
      FROM User
      WHERE LastName = :lastName AND Email LIKE :likeEmail
    ];
  }

  public static Profile queryProfileByName(String profileName) {
    return [
      SELECT Id
      FROM Profile
      WHERE Name = :profileName
      LIMIT 1
    ];
  }

  public static PermissionSet queryOnePermissionSetByName(String name) {
    return [
      SELECT Id
      FROM PermissionSet
      WHERE Name = :name
      LIMIT 1
    ];
  }

  // CREATE TEST RECORDS
  public static Account createAccount(final String name) {
    return new Account(Name = name);
  }

  public static Contact createContact(final String lastName) {
    String email = buildEmailFromLastName(lastName);

    return new Contact(
      FirstName = FIRST_NAME,
      LastName = lastName,
      Email = email,
      Phone = '4445551111',
      MobilePhone = '4445552222',
      Title = 'Boss Hoss'
    );
  }

  public static User createUser(String lastName, Id profileId) {
    return createUser(lastName, profileId, TIMEZONE_SID_KEY_NEWYORK);
  }

  public static User createUser(
    String lastName,
    Id profileId,
    String timezone
  ) {
    String email = buildEmailFromLastName(lastName);
    String alias = buildAlias(FIRST_NAME, lastName);

    return new User(
      FirstName = FIRST_NAME,
      LastName = lastName,
      Email = email,
      ProfileId = profileId,
      UserName = email + USERNAME_SUFFIX,
      Alias = alias,
      TimeZoneSidKey = TIMEZONE_SID_KEY_NEWYORK,
      LocaleSidKey = DEFAULT_LANGUAGE,
      LanguageLocaleKey = DEFAULT_LANGUAGE,
      EmailEncodingKey = DEFAULT_ENCODING,
      ManagerId = UserInfo.getUserId()
    );
  }

  private static String buildEmailFromLastName(String lastName) {
    return (lastName.trim().replace(' ', '') + EMAIL_SUFFIX).toLowerCase();
  }

  private static String buildAlias(String firstName, String lastName) {
    String alias = lastName;

    if (!String.isBlank(firstName)) {
      alias = firstName.left(1) + lastName;
    }

    if (alias.length() > 5) {
      alias = alias.substring(0, 5);
    }

    return alias.toLowerCase();
  }
}
