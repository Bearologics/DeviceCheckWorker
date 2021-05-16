# DeviceCheck

You may use this tiny module to validate Apple DeviceCheck tokens with the Apple DeviceCheck API.

## Worker implementation

```javascript
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

## Client-side implementation

Generating a DeviceCheck token, as of writing this, only works on a real iOS / iPadOS device. You should import and use the `DeviceCheck.framework` for this.

We'll now generate a device token and send it to our Worker using a custom header, which is called `X-Apple-Device-Token`, this header is parsed by the Worker and sent to the Apple Server for verification.

When using a development certificate, you also want to set the header `X-Apple-Device-Development: true` for the Worker to target Apple's Development Server rather than the production one.

```swift
import DeviceCheck

guard DCDevice.current.isSupported else {
  fatalError("Device not supported") // todo: handle error
}

DCDevice.current.generateToken { data, error in
  guard let data = data else {
    fatalError("Could not generate device token") // todo: handle error
  }

  let tokenString = data.base64EncodedString() // going to use this in our header

  let request = URLRequest(url: "https://my-worker.my-handle.workers.dev")
  request.setValue(tokenString, forHTTPHeaderField: "X-Apple-Device-Token")

  // optional when signing using a development certificate
  // this will use the development DeviceCheck server
  request.setValue("true", forHTTPHeaderField: "X-Apple-Device-Development")

  let config = URLSessionConfiguration.default
  let session = URLSession(configuration: config)

  let task = session.dataTask(with: request, completionHandler: { data, response, error in
    // handle result
  }

  task.resume()
}
```

## License

[See LICENSE.md](LICENSE.md)
