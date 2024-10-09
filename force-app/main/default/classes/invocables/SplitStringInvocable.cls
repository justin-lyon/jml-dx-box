public with sharing class SplitStringInvocable {
  @InvocableMethod(
    label='Split String'
    description='Given a string and a delimiter, return a collection of strings'
  )
  public static List<List<String>> execute(List<Request> requests) {
    List<List<String>> output = new List<List<String>>();
    for (Request req : requests) {
      output.add(req.inputText.split(req.delimiter));
    }
    return output;
  }

  public class Request {
    @InvocableVariable(required=true label='Input Text')
    public String inputText;
    @InvocableVariable(
      required=true
      label='Separator'
      description='The delimiter that separates blocks of text inside your Input Text.'
    )
    public String delimiter = ';';
  }
}
