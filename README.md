# DeviceCheck

You may use this tiny module to validate Apple DeviceCheck tokens with the Apple DeviceCheck API.

## Usage

````javascript
const deviceCheck = require("@bearologics/devicecheck");

const deviceCheckPassed = await deviceCheck(request, {
    iss: APPLE_JWT_ISS,
    kid: APPLE_JWT_KID,
    privateKeyPEM: APPLE_JWT_PRIVATE_KEY,
});

if (!deviceCheckPassed) {
    return new Response("Unauthorized", { status: 401 });
}
…
```

## License

[See LICENSE.md](LICENSE.md)
````
