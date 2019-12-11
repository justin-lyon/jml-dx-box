public with sharing class AuthTokenService implements AuthTokenServiceI {
	private static final Integer MAX_TIMEOUT = 120000;
	public AuthTokenService() {}

	public AuthTokenService.Response requestTokenByClient(AuthClient clientType) {

		// Make a request for an auth token based on clientType
		return null;
	}

	public class Request {
		public String client_id;
		public String client_secret;
		public String audience;
		public String grant_type;
	}

	public class Response {
		public String expires_in;
		public String access_token;
		public String token_type;
	}

	public class Mock {
		public Boolean IsSuccess = true;

		public HttpResponse respond(HttpRequest req) {
			if (!IsSuccess) throw new CalloutException('Forced Exception from AuthZeroService.Mock.');

			HttpResponse res = new HttpResponse();
			Response payload = new Response();
			payload.expires_in = '86400';
			payload.access_token = '';
			payload.token_type = '?';

			res.setBody(JSON.serialize(payload));
			res.setStatusCode(IsSuccess ? 200 : 500);
			return res;
		}
	}
}
