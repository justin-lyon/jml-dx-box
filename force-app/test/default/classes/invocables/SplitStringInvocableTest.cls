@IsTest
private class SplitStringInvocableTest {
  private static final String INPUT_TEXT_SEMICOLONS = 'monday;tuesday;wednesday;thursday;friday';
  private static final String INPUT_TEXT_COMMAS = 'monday,tuesday,wednesday,thursday,friday';
  private static final List<String> WEEK_DAYS;

  static {
    WEEK_DAYS = INPUT_TEXT_SEMICOLONS.split(';');
  }

  @IsTest
  static void it_should_return_list_of_string_given_a_semi_colon_delimited_string() {
    List<SplitStringInvocable.Request> requests = new List<SplitStringInvocable.Request>();
    SplitStringInvocable.Request request = new SplitStringInvocable.Request();
    request.inputText = INPUT_TEXT_SEMICOLONS;
    request.delimiter = ';';
    requests.add(request);

    Test.startTest();

    List<List<String>> result = SplitStringInvocable.execute(requests);

    Test.stopTest();

    System.Assert.isFalse(result.isEmpty());
    System.Assert.areEqual(1, result.size());

    List<String> stringList = result.get(0);
    System.Assert.isFalse(stringList.isEmpty());
    System.Assert.areEqual(5, stringList.size());
    System.Assert.areEqual(WEEK_DAYS, stringList);
  }

  @IsTest
  static void it_should_return_list_of_string_given_a_comma_delimited_string() {
    List<SplitStringInvocable.Request> requests = new List<SplitStringInvocable.Request>();
    SplitStringInvocable.Request request = new SplitStringInvocable.Request();
    request.inputText = INPUT_TEXT_COMMAS;
    request.delimiter = ',';
    requests.add(request);

    Test.startTest();

    List<List<String>> result = SplitStringInvocable.execute(requests);

    Test.stopTest();

    System.Assert.isFalse(result.isEmpty());
    System.Assert.areEqual(1, result.size());

    List<String> stringList = result.get(0);
    System.Assert.isFalse(stringList.isEmpty());
    System.Assert.areEqual(5, stringList.size());
    System.Assert.areEqual(WEEK_DAYS, stringList);
  }

  @IsTest
  static void it_should_handle_multiple_requests() {
    List<SplitStringInvocable.Request> requests = new List<SplitStringInvocable.Request>();
    SplitStringInvocable.Request r1 = new SplitStringInvocable.Request();
    r1.inputText = INPUT_TEXT_SEMICOLONS;
    r1.delimiter = ';';
    requests.add(r1);
    SplitStringInvocable.Request r2 = new SplitStringInvocable.Request();
    r2.inputText = INPUT_TEXT_COMMAS;
    r2.delimiter = ',';
    requests.add(r2);

    Test.startTest();

    List<List<String>> result = SplitStringInvocable.execute(requests);

    Test.stopTest();

    System.Assert.isFalse(result.isEmpty());
    System.Assert.areEqual(2, result.size());

    List<String> listOne = result.get(0);
    System.Assert.isFalse(listOne.isEmpty());
    System.Assert.areEqual(5, listOne.size());
    System.Assert.areEqual(WEEK_DAYS, listOne);

    List<String> listTwo = result.get(1);
    System.Assert.isFalse(listTwo.isEmpty());
    System.Assert.areEqual(5, listTwo.size());
    System.Assert.areEqual(WEEK_DAYS, listTwo);
  }
}
