public with sharing class AuthTokenSingleton {
  private static final String PARTITION_NAME = 'AuthToken';

  private Cache.OrgPartition authPartition = Cache.Org.getPartition(
    PARTITION_NAME
  );

  public AuthTokenServiceI authService = new AuthTokenService();

  private static AuthTokenSingleton INSTANCE = new AuthTokenSingleton();
  private AuthTokenSingleton() {
  }

  public static AuthTokenSingleton get() {
    return INSTANCE;
  }

  public String getToken(AuthClient clientType) {
    Token token = (Token) authPartition.get(String.valueOf(clientType));

    if (token == null || token.expiresAt <= DateTime.now()) {
      token = fetchNewToken(clientType);
      authPartition.put(String.valueOf(clientType), token);
    }

    return token.value;
  }

  private Token fetchNewToken(AuthClient clientType) {
    try {
      AuthTokenService.Response res = authService.requestTokenByClient(
        clientType
      );
      Token token = new Token(res.access_token, res.token_type, res.expires_in);
      return token;
    } catch (Exception exc) {
      // Handle Exception
      throw exc;
    }
  }

  public class Token {
    public String value;
    public String type;
    public DateTime expiresAt;

    public Token(String v, String t, String expiresIn) {
      this.value = v;
      this.type = t;
      if (expiresIn != null) {
        this.expiresAt = DateTime.now().addSeconds(Integer.valueOf(expiresIn));
      }
    }
  }
}
