const { getToken } = require("@sagi.io/workers-jwt");

module.exports = async function (request, credentials) {
  const { headers } = request;
  const { iss, kid, privateKeyPEM } = credentials;

  const jwtPayload = {
    iss,
    iat: Math.floor(Date.now() / 1000),
  };

  const jwt = await getToken({
    privateKeyPEM,
    payload: jwtPayload,
    alg: "ES256",
    headerAdditions: {
      kid,
    },
  });

  const isDevelopment = headers.get("X-Apple-Device-Development") == "true";
  const deviceToken = headers.get("X-Apple-Device-Token");
  const environment = isDevelopment ? "api.development" : "api";

  const response = await fetch(
    `https://${environment}.devicecheck.apple.com/v1/validate_device_token`,
    {
      method: "POST",
      body: JSON.stringify({
        device_token: deviceToken,
        transaction_id: `trns-${Date.now()}`,
        timestamp: Math.floor(Date.now()),
      }),
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  return response.status == 200;
};
