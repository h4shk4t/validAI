# 🏗️ Customizing Your Phat Contract

> For detailed docs on `phat_js` , go [here](https://bit.ly/phat\_js) for the latest.

## What Can You Do With Your Phat Contract? <a href="#user-content-what-can-you-do-with-your-function" id="user-content-what-can-you-do-with-your-function"></a>

In the `README.md` [link](https://github.com/Phala-Network/phat-contract-starter-kit/blob/main/GETTING\_STARTED.md), you learned how to generate a new default function template and execute the 3 separate ways to test and validate your the results of the function. Now we will dive into what you can do with your function to extend the capabilities.

What you will learn:

* Available Capabilities of `@phala/pink-env`
  * Call into a contract (Phat Contract).
  * Invoke a delegate call on a contract code by a code hash (Phat Contract).
  * Send an HTTP request and returns the response as either a Uint8Array or a string.
    * Single HTTP request
    * Batch HTTP requests
    * Error Handling
  * Derive a secret key from a salt.
  * Hash a message using the specified algorithm.
    * blake2b128
    * blake2b256
    * sha256
    * keccak256
* Customize Your Default Function and Test Locally.
* Handle the abi encoding/decoding with [`viem`](https://viem.sh/).

## Getting Started <a href="#user-content-getting-started" id="user-content-getting-started"></a>

First you will need to install the `@phala/fn` CLI tool using your node package manager (`npm`) or use node package execute (`npx`). In this tutorial we use `npx`.

Now create your first template with the CLI tool command:

```sh
npx @phala/fn init example
```

We currently have only one template. Just press enter to see something similar to the example below:

```
npx @phala/fn init example
# ? Please select one of the templates for your "example" project: phala-oracle-consumer-contract. Polygon Consumer Contract for LensAPI Oracle
# Downloading the template: https://github.com/Phala-Network/phala-oracle-consumer-contract... ✔
# The project is created in ~/Projects/Phala/example
```

`cd` into the newly created template and `ls` the directory which will look similar to below.

```sh
cd example
ls                                                                                                                      ~/Projects/Phala/example
# total 736
# drwxr-xr-x  18 hashwarlock  staff   576B Sep  6 15:32 .
# drwxr-xr-x  35 hashwarlock  staff   1.1K Sep  6 15:32 ..
# -rw-r--r--   1 hashwarlock  staff   2.1K Sep  6 15:32 .env.local
# -rw-r--r--   1 hashwarlock  staff   227B Sep  6 15:32 .gitignore
# -rw-r--r--   1 hashwarlock  staff    34K Sep  6 15:32 LICENSE
# -rw-r--r--   1 hashwarlock  staff   8.9K Sep  6 15:32 README.md
# drwxr-xr-x   5 hashwarlock  staff   160B Sep  6 15:32 abis
# drwxr-xr-x   4 hashwarlock  staff   128B Sep  6 15:32 assets
# drwxr-xr-x   5 hashwarlock  staff   160B Sep  6 15:32 contracts
# -rw-r--r--   1 hashwarlock  staff   1.3K Sep  6 15:32 hardhat.config.ts
# -rw-r--r--   1 hashwarlock  staff    95B Sep  6 15:32 mumbai.arguments.ts
# -rw-r--r--   1 hashwarlock  staff   2.6K Sep  6 15:32 package.json
# -rw-r--r--   1 hashwarlock  staff    96B Sep  6 15:32 polygon.arguments.ts
# drwxr-xr-x   5 hashwarlock  staff   160B Sep  6 15:32 scripts
# drwxr-xr-x   3 hashwarlock  staff    96B Sep  6 15:32 src
# drwxr-xr-x   3 hashwarlock  staff    96B Sep  6 15:32 test
# -rw-r--r--   1 hashwarlock  staff   201B Sep  6 15:32 tsconfig.json
# -rw-r--r--   1 hashwarlock  staff   290K Sep  6 15:32 package-lock.json
```

Lastly, we will `cd` into `./src` where the `index.ts` file resides. This file will be where we customize our function logic.

```sh
cd src
```

## Available Capabilities of `@phala/pink-env` <a href="#user-content-available-capabilities-of-phalapink-env" id="user-content-available-capabilities-of-phalapink-env"></a>

In the `GETTING_STARTED.md` we introduced the basic functionality of making a single HTTP request to Lens API. The example code can be seen below:

```typescript
function fetchApiStats(lensApi: string, profileId: string): any {
  // profile_id should be like 0x0001
  let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
  };
  let query = JSON.stringify({
    query: `query Profile {
      profile(request: { forProfileId: "0x01" }) {
        stats {
            followers
            following
            comments
            countOpenActions
            posts
            quotes
            mirrors
            publications
            reacted
            reactions
        }
      }
    }`,
  });
  let body = stringToHex(query);
  //
  // In Phat Function runtime, we not support async/await, you need use `pink.batchHttpRequest` to
  // send http request. The function will return an array of response.
  //
  let response = pink.batchHttpRequest(
    [
      {
        url: lensApi,
        method: "POST",
        headers,
        body,
        returnTextBody: true,
      },
    ],
    2000
  )[0];
  if (response.statusCode !== 200) {
    console.log(
      `Fail to read Lens api with status code: ${response.statusCode}, error: ${
        response.error || response.body
      }}`
    );
    throw Error.FailedToFetchData;
  }
  let respBody = response.body;
  if (typeof respBody !== "string") {
    throw Error.FailedToDecode;
  }
  return JSON.parse(respBody);
}
```

Here we utilize the `pink.batchHttpRequest()` function, but we only use a single HTTP request. Before going any further, let's clarify what is available with `@phala/pink-env`.

### `pink.invokeContract()` & `pink.invokeContractDelegate()` <a href="#user-content-pinkinvokecontract--pinkinvokecontractdelegate" id="user-content-pinkinvokecontract--pinkinvokecontractdelegate"></a>

* `pink.invokeContract()` allows for a call to a specified address of a Phat contract deployed on Phala's Mainnet or PoC6 Testnet depending on where you deploy your function.
* `pink.invokeContractDelegate()` is similar but instead the call on a Phat Contract is targeted by the code hash.

```typescript
// Delegate calling
const delegateOutput = pink.invokeContractDelegate({
  codeHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  selector: 0xdeadbeef,
  input: "0x00",
});

// Instance calling
const contractOutput = pink.invokeContract({
  callee: "0x0000000000000000000000000000000000000000000000000000000000000000",
  input: "0x00",
  selector: 0xdeadbeef,
  gasLimit: 0n,
  value: 0n,
});
```

This is the low-level API for cross-contract call. If you have the contract metadata file, there is a [script](https://bit.ly/phat-js-meta2js) to help generate the high-level API for cross-contract call. For example run the following command:

```bash
python meta2js.py --keep System::version /path/to/system.contract
```

Would generate the following code:

```typescript
function invokeContract(callee, selector, args, metadata, registry) {
    const inputCodec = pink.SCALE.codec(metadata.inputs, registry);
    const outputCodec = pink.SCALE.codec(metadata.output, registry);
    const input = inputCodec.encode(args ?? []);
    const output = pink.invokeContract({ callee, selector, input });
    return outputCodec.decode(output);
}
class System {
    constructor(address) {
        this.typeRegistryRaw = '#u16\n(0,0,0)\n<CouldNotReadInput::1>\n<Ok:1,Err:2>'
        this.typeRegistry = pink.SCALE.parseTypes(this.typeRegistryRaw);
        this.address = address;
    }
   
    system$Version() {
        const io = {"inputs": [], "output": 3};
        return invokeContract(this.address, 2278132365, [], io, this.typeRegistry);
    }
}
```

Then you can use the high-level API to call the contract:

```typescript
const system = new System(systemAddress);
const version = system.system$Version();
console.log("version:", version);
```

### `pink.httpRequest()` <a href="#user-content-pinkhttprequest" id="user-content-pinkhttprequest"></a>

> HTTP request is supported in the JS environment. However, the API is **sync** rather than **async**. This is different from other JavaScript engines.

The `pink.httpRequest()` allows for you to make a single HTTP request from your function to an HTTP endpoint. You will have to define your args:

* `url: string` – The URL to send the request to.
* `method?: string` – (Optional) The HTTP method to use for the request (e.g. GET, POST, PUT). Defaults to GET.
* `headers?: Headers` – (Optional) An map-like object containing the headers to send with the request.
* `body?: Uint8Array | string` – (Optional) The body of the request, either as a Uint8Array or a string.
* `returnTextBody?: boolean` – (Optional) A flag indicating whether the response body should be returned as a string (true) or a Uint8Array (false).

Returned is the `Object` response from the HTTP request containing the following fields:

* `{number} statusCode` - The HTTP status code of the response.
* `{string} reasonPhrase` - The reason phrase of the response.
* `{Headers} headers` - An object containing the headers of the response.
* `{(Uint8Array|string)} body` - The response body, either as a `Uint8Array` or a string depending on the value of `args.returnTextBody`.

Here is an example:

```typescript
const response = pink.httpRequest({
  url: "https://httpbin.org/ip",
  method: "GET",
  returnTextBody: true,
});
console.log(response.body);
```

### `pink.batchHttpRequest()` <a href="#user-content-pinkbatchhttprequest" id="user-content-pinkbatchhttprequest"></a>

Now you may need to call multiple APIs at once, this would require you to use the `pink.batchHttpRequest()` function to ensure you do not timeout (timeouts for Phat Contract is 10 seconds) on your response. The `args` and returned `Object` are the same as `pink.httpRequest()`, but instead you can create an array of HTTP requests within the function. Since we have an example above of how to use a `pink.batchHttpRequest()`, before an examples let's look at the syntax. You will have to define your **array** of args:

* `url: string` – The URL to send the request to.
* `method?: string` – (Optional) The HTTP method to use for the request (e.g. GET, POST, PUT). Defaults to GET.
* `headers?: Headers` – (Optional) An map-like object containing the headers to send with the request.
* `body?: Uint8Array | string` – (Optional) The body of the request, either as a Uint8Array or a string.
* `returnTextBody?: boolean` – (Optional) A flag indicating whether the response body should be returned as a string (true) or a Uint8Array (false).
* `[x]` - this value is what you will see below as `[0]` which points to index `0` in the array of HTTP requests.
* `timeout_ms?: number` - (Optional) a number representing the number of milliseconds before the batch HTTP requests timeout. Returned is the `Object` response from the HTTP request containing the following fields:
* `{number} statusCode` - The HTTP status code of the response.
* `{string} reasonPhrase` - The reason phrase of the response.
* `{Headers} headers` - An object containing the headers of the response.
* `{(Uint8Array|string)} body` - The response body, either as a `Uint8Array` or a string depending on the value of `args.returnTextBody`.
* `error?: string` - (Optional) The `error` string that will be mapped to the error corresponding to the index of the HTTP request in the batch HTTP requests.
* `[x]` - this value is what you will see below as `[0]` which points to index `0` in the array of HTTP requests.

Let's create a unique example. In this example, we will:

* Use `pink.batchHttpRequest()` to:
  * Query [The Odds API](https://the-odds-api.com) for MLB games today
  * Set Hello World in Key Value DB on [kvdb.io](https://kvdb.io)
* Take response body of The Odds API query and send to a [Telegram Group](https://api.telegram.org) in a single `pink.httpRequest()`

```typescript
const sportName = 'baseball_mlb'
const odds_http_endpoint = `https://api.the-odds-api.com/v4/sports/${sportName}/scores/?apiKey=37af51c4c3d1823308ae2966bcfe7`;
const kvdb_http_endpoint = `https://kvdb.io/AwA4DS6fJN69q4erVyjKzY`;
const tg_bot_http_endpoint = `https://api.telegram.org/bot4876363250:A1W7F0jeyMmvJAGd7K_12y_5qFjbXwPgpTQ/sendMessage?chat_id=-1001093498619&text=`;
// headers for the HTTP request args
let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
};
// Create body for updating kvdb.io
const kvdbUpdate = JSON.stringify({
    "txn": [
        {"set": "hello", "value": "world"}
    ]
});
const body2 = stringToHex(kvdbUpdate);
// Notice that depending on the number of queries, you will define and array of responses from the response.
const [res1, res2] = pink.batchHttpRequest([
    {
        url: odds_http_endpoint,
        method: "GET",
        headers,
        returnTextBody: true,
    },
    {
        url: `${kvdb_http_endpoint}/hello`,
        method: "POST",
        headers: headers2,
        body: body2,
        returnTextBody: true,
    }
]);
// Notice that the single HTTP request uses the response data from the first HTTP request in the batchHttpRequest function.
const res3 = pink.httpRequest({
    url: `${tg_bot_http_endpoint}${res1.body}`,
    method: "POST",
    headers,
    returnTextBody: true,
});
```

Here are the expected result of executing this:

*   KV DB on kvdb.io&#x20;

    <figure><img src="https://github.com/Phala-Network/phat-contract-starter-kit/raw/main/assets/KVDB-hw.png" alt=""><figcaption></figcaption></figure>
*   Telegram Bot Updates Telegram Group&#x20;

    <figure><img src="https://github.com/Phala-Network/phat-contract-starter-kit/raw/main/assets/TG-Bot.png" alt=""><figcaption></figcaption></figure>

Pretty nifty, right? This is the power of the customized function with the ability to make single or batch HTTP requests. However, this example is missing some error handling which is our next topic.

### Error Handling <a href="#user-content-error-handling" id="user-content-error-handling"></a>

To add some error handling to an HTTP request, you can check the default example with the query to Lens API above.

A simple example can be defined:

```typescript
try {
  const response = pink.httpReqeust({
    url: "https://httpbin.org/ip",
    method: 42,
    returnTextBody: true,
  });
  console.log(response.body);
} catch (err) {
  console.log("Some error ocurred:", err);
}
```

This would send an error to the logserver:

```
JS: Some error ocurred: TypeError: invalid value for field 'method'
```

### `pink.deriveSecret()` <a href="#user-content-pinkderivesecret" id="user-content-pinkderivesecret"></a>

`pink.deriveSecret()` takes in a salt of either `UInt8Array | string` and generates a secret key response of type `UInt8Array`.

Let's build an example that will derive a secret from a salt `howdy` and update the Telegram group from above about the secret.

```typescript
const tg_bot_http_endpoint = `https://api.telegram.org/bot4876363250:A1W7F0jeyMmvJAGd7K_12y_5qFjbXwPgpTQ/sendMessage?chat_id=-1001093498619&text=`;
// headers for the HTTP request args
let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
};
const res3 = pink.httpRequest({
    url: `${tg_bot_http_endpoint}shhhhhhh\nthis_is_a_secret:\n[${secret}]`,
    method: "POST",
    headers,
    returnTextBody: true,
});
```

Here is the result :stuck\_out\_tongue\_winking\_eye:

<figure><img src="https://github.com/Phala-Network/phat-contract-starter-kit/raw/main/assets/Secret-TG.png" alt=""><figcaption></figcaption></figure>

### `pink.hash()` <a href="#user-content-pinkhash" id="user-content-pinkhash"></a>

`pink.hash()` generates a hash based on the following params:

* `algorithm`- the hash algorithm to use. Supported values are “blake2b128”, “blake2b256”, “sha256”, “keccak256”.
* `message` – The message to hash, either as a `Uint8Array` or a `string`.

Let's create an example to hash the values of `hello` and `world` to store in the KVDB we used earlier. We can also send the mapping to Telegram group to show a `pink.batchHttpRequest()`.

```typescript
const kvdb_http_endpoint = `https://kvdb.io/AwA4DS6fJN69q4erVyjKzY`;
const tg_bot_http_endpoint = `https://api.telegram.org/bot4876363250:A1W7F0jeyMmvJAGd7K_12y_5qFjbXwPgpTQ/sendMessage?chat_id=-1001093498619&text=`;
// headers for the HTTP request args
let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
};
// Generate a hash for each algorithm for hello
const blake2b128Hello = pink.hash('blake2b128', 'hello');
const blake2b256Hello = pink.hash('blake2b256', 'hello');
const sha256Hello = pink.hash('sha256', 'hello');
const keccak256Hello = pink.hash('keccak256', 'hello');
const tgText = JSON.stringify({
    blake2b128Hello: blake2b128Hello,
    blake2b256Hello: blake2b256Hello,
    sha256Hello: sha256Hello,
    keccak256Hello: keccak256Hello
});
// KV Update Body
const kvdbUpdate = JSON.stringify({
    "txn": [
        {"set": "blake2b128Hello", "value": `${blake2b128Hello}`},
        {"set": "blake2b256Hello", "value": `${blake2b256Hello}`},
        {"set": "sha256Hello", "value": `${sha256Hello}`},
        {"set": "keccak256Hello", "value": `${keccak256Hello}`}
    ]
});
const body2 = stringToHex(kvdbUpdate);
// Batch HTTP request
const [res1, res2] = pink.batchHttpRequest([
    {
        url: `${kvdb_http_endpoint}/hello`,
        method: "POST",
        headers: headers2,
        body: body2,
        returnTextBody: true,
    },
    {
        url: `${tg_bot_http_endpoint}\n${tgText}`,
        method: "POST",
        headers,
        returnTextBody: true,
    }
]);
```

Let's see how the results look.

*   KVDB hashes for `hello`&#x20;

    <figure><img src="https://github.com/Phala-Network/phat-contract-starter-kit/raw/main/assets/KVDB-hashes.png" alt=""><figcaption></figcaption></figure>
*   Telegram bot sends hashes for `hello`&#x20;

    <figure><img src="https://github.com/Phala-Network/phat-contract-starter-kit/raw/main/assets/TG-hashes.png" alt=""><figcaption></figcaption></figure>

## SCALE Codec

Let’s introduce the details of the SCALE codec API which is not documented in the above link.

The SCALE codec API is mounted on the global object `pink.SCALE` which contains the following functions:

* `pink.SCALE.parseTypes(types: string): TypeRegistry`
* `pink.SCALE.codec(type: string | number | number[], typeRegistry?: TypeRegistry): Codec`

Let’s make a basice example to show how to use the SCALE codec API:

```
const types = `
  Hash=[u8;32]
  Info={hash:Hash,size:u32}
`;
const typeRegistry = pink.SCALE.parseTypes(types);
const infoCodec = pink.SCALE.codec(`Info`, typeRegistry);
const encoded = infoCodec.encode({
 hash: "0x1234567890123456789012345678901234567890123456789012345678901234",
 size: 1234,
});
console.log("encoded:", encoded);
const decoded = infoCodec.decode(encoded);
pink.inspect("decoded:", decoded);
```

The above code will output:

```
JS: encoded: 18,52,86,120,144,18,52,86,120,144,18,52,86,120,144,18,52,86,120,144,18,52,86,120,144,18,52,86,120,144,18,52,210,4,0,0
JS: decoded: {
JS: hash: 0x1234567890123456789012345678901234567890123456789012345678901234,
JS: size: 1234
JS: }
```

Or using the direct encode/decode api which support literal type definition as well as a typename or id, for example:

```
const data = { name: "Alice", age: 18 };
const encoded = pink.SCALE.encode(data, "{ name: str, age: u8 }");
const decoded = pink.SCALE.decode(encoded, "{ name: str, age: u8 }");
```

### Grammar of The Type Definition

In the above example, we use the following type definition:

```
Hash=[u8;32]
Info={hash:Hash,size:u32}
```

where we define a type `Hash` which is an array of 32 bytes, and a type `Info` which is a struct containing a `Hash` and a `u32`.

The grammar is defined as follows:

Each entry is type definition, which is of the form `name=type`. Where name must be a valid identifier, and type is a valid type expression described below.

Type expression can be one of the following:

<table data-full-width="true"><thead><tr><th>Type Expression</th><th>Description</th><th>Example</th><th>JS type</th></tr></thead><tbody><tr><td><code>bool</code></td><td>Primitive type bool</td><td></td><td><code>true</code>, <code>false</code></td></tr><tr><td><code>u8</code>, <code>u16</code>, <code>u32</code>, <code>u64</code>, <code>u128</code>, <code>i8</code>, <code>i16</code>, <code>i32</code>, <code>i64</code>, <code>i128</code></td><td>Primitive number types</td><td></td><td>number or bigint</td></tr><tr><td><code>str</code></td><td>Primitive type str</td><td></td><td>string</td></tr><tr><td><code>[type;size]</code></td><td>Array type with element type <code>type</code> and size <code>size</code>.</td><td><code>[u8; 32]</code></td><td>Array of elements. (Uint8Array or <code>0x</code> prefixed hex string is allowed for [u8; N])</td></tr><tr><td><code>[type]</code></td><td>Sequence type with element type <code>type</code>.</td><td><code>[u8]</code></td><td>Array of elements. (Uint8Array or <code>0x</code> prefixed hex string is allowed for <a href="https://doc.rust-lang.org/nightly/std/primitive.u8.html">u8</a>)</td></tr><tr><td><code>(type1, type2, ...)</code></td><td>Tuple type with elements of type <code>type1</code>, <code>type2</code>, …</td><td><code>(u8, str)</code></td><td>Array of value for inner type. (e.g. <code>[42, 'foobar']</code>)</td></tr><tr><td><code>{field1:type1, field2:type2, ...}</code></td><td>Struct type with fields and types.</td><td><code>{age:u32, name:str}</code></td><td>Object with field name as key</td></tr><tr><td><code>&#x3C;variant1:type1, variant2:type2, ...></code></td><td>Enum type with variants and types. if the variant is a unit variant, then the type expression can be omitted.</td><td><code>&#x3C;Success:i32, Error:str></code>, <code>&#x3C;None,Some:u32></code></td><td>Object with variant name as key. (e.g. <code>{Some: 42}</code>)</td></tr><tr><td><code>@type</code></td><td>Compact number types. Only unsigned number types is supported</td><td><code>@u64</code></td><td>number or bigint</td></tr></tbody></table>

### Generic Type Support

Generic parameters can be added to the type definition, for example:

```
Vec<T>=[T]
```

### Option Type

The Option type is not a special type, but a vanilla enum type. It is needed to be defined by the user explicitly. Same for the Result type.

```
Option<T>=<None,Some:T>
Result<T,E>=<Ok:T,Err:E>
```

There is one special syntax for the Option type:

```
Option<T>=<_None,_Some:T>
```

If the Option type is defined in this way, then the `None` variant would be decoded as `null` instead of `{None: null}` and the `Some` variant would be decoded as the inner value directly instead of `{Some: innerValue}`. For example:

```
const encoded = pink.SCALE.encode(42, "<_None,_Some:u32>");
const decoded = pink.SCALE.decode(encoded, "<_None,_Some:u32>");
console.log(decoded); // 42
```

### Nested Type Definition

Type definition can be nested, for example:

```
Block={header:{hash:[u8;32],size:u32}}
```

## Handle EVM Smart Contract Encoding & Decoding

> For TypeScript/JavaScript example scripts, check out [`@phala/pink-env` examples](https://bit.ly/phala-fn-ex-scripts).
>
> \
> **Note**: `@phala/ethers` will be no longer be maintained in favor of native support of [`viem`](https://viem.sh/).

{% tabs %}
{% tab title="viem" %}
#### Why viem

`viem` is a TypeScript Interface for Ethereum that provides low-level stateless primitives for interacting with Ethereum. An alternative to ethers.js and web3.js with a focus on reliability, efficiency, and excellent developer experience.

Using native `viem` in Phat Contract 2.0 to handle EVM Smart Contract encoding/decoding helps reduce the friction of maintaining custom code. For more information on the `viem`'s why, check out the link below.

{% embed url="https://viem.sh/docs/introduction.html" fullWidth="true" %}
Why viem
{% endembed %}

For docs on how to use `viem`, check out the [ABI section](https://viem.sh/docs/abi/decodeAbiParameters.html) of the `viem` docs.&#x20;
{% endtab %}

{% tab title="@phala/ethers" %}
> **Note**: `@phala/ethers` is no longer being maintained. Instead use the latest version of `viem` to handle the EVM Smart Contract ABI encoding/decoding.

In the `index.ts` file of your Phat Contract starter kit, there is an npm package available called `@phala/ethers` and your file will import `Coders` which has the following types available.

```typescript
// From https://github.com/Phala-Network/phat-contract-starter-kit/blob/37e7ee2fa96c42f90f4418d45a9c47be570d59f5/src/index.ts#L6
import { AddressCoder } from "./coders/address.js";
import { ArrayCoder } from "./coders/array.js";
import { BooleanCoder } from "./coders/boolean.js";
import { BytesCoder } from "./coders/bytes.js";
import { FixedBytesCoder } from "./coders/fixed-bytes.js";
import { NullCoder } from "./coders/null.js";
import { NumberCoder } from "./coders/number.js";
import { StringCoder } from "./coders/string.js";
import { TupleCoder } from "./coders/tuple.js";
```

As a developer you can utilize these types in many ways. Here are some examples of how to handle each type with the TypeScript `EncodeReply()` function on the Phat Contract side and `_onMessageReceived()`on the Solidity Smart Contract side.

`AddressCoder` Example

`index.ts`

```typescript
// ...
// Encode Address
const addressCoder = new Coders.AddressCoder("address");
// uint Coder
const uintCoder = new Coders.NumberCoder(32, false, "uint256");
function encodeReply(reply: [uint, uint, string]): HexString {
  return Coders.encode([uintCoder, uintCoder, addressCoder], reply) as HexString;
}
// Defined in OracleConsumerContract.sol
const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

// main entry function
export default function main(request: HexString, settings: string): HexString {
  //...
   let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = Coders.decode([uintCoder, bytesCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    return encodeReply([TYPE_ERROR, 0, errorToCode(error as Error)]);
  }
  //...
  try {
    const response = "0x0e9e628d715003ff5045fc92002c67ddab364683";
    return encodeReply([TYPE_RESPONSE, requestId, response]);
  } catch (error) {
    // Define error logic
    // otherwise tell client we cannot process it
    console.log("error:", [TYPE_ERROR, requestId, "0x0"]);
    return encodeReply([TYPE_ERROR, requestId, "0x0"]);
  }
}
// ...
```

`OracleConsumerContract.sol`

```solidity
event ResponseReceived(uint reqId, string reqStr, address memory value);
event ErrorReceived(uint reqId, string reqStr, address memory errno);
// ...
// request action request for Phat Contract to respond to
function request(string calldata reqData) public {
    // assemble the request
    uint id = nextRequest;
    requests[id] = reqData;
    _pushMessage(abi.encode(id, reqData));
    nextRequest += 1;
}
//...
// _onMessageReceived response from Phat Contract
function _onMessageReceived(bytes calldata action) internal override {
    // Optional to check length of action
    // require(action.length == 32 * 3, "cannot parse action");
    (uint respType, uint id, address memory addr) = abi.decode(
        action,
        (uint, uint, address)
    );
    if (respType == TYPE_RESPONSE) {
        emit ResponseReceived(id, requests[id], addr);
        delete requests[id];
    } else if (respType == TYPE_ERROR) {
        emit ErrorReceived(id, requests[id], addr);
        delete requests[id];
    }
}
// ...
```

`BooleanCoder` Example

`index.ts`

```typescript
// ...
// bool Coder
const booleanCoder = new Coders.BooleanCoder("bool");
// uint Coder
const uintCoder = new Coders.NumberCoder(32, false, "uint256");
function encodeReply(reply: [uint, uint, bool]): HexString {
  return Coders.encode([uintCoder, uintCoder, booleanCoder], reply) as HexString;
}
// Defined in OracleConsumerContract.sol
const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

// main entry function
export default function main(request: HexString, settings: string): HexString {
  //...
   let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = Coders.decode([uintCoder, bytesCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    return encodeReply([TYPE_ERROR, 0, errorToCode(error as Error)]);
  }
  //...
  try {
    const response = true;
    return encodeReply([TYPE_RESPONSE, requestId, response]);
  } catch (error) {
    // Define error logic
    // otherwise tell client we cannot process it
    console.log("error:", [TYPE_ERROR, requestId, error]);
    return encodeReply([TYPE_ERROR, requestId, errorToCode(error as Error)]);
  }
}
// ...
```

`OracleConsumerContract.sol`

```solidity
event ResponseReceived(uint reqId, string reqStr, bool value);
event ErrorReceived(uint reqId, string reqStr, bool errno);
// ...
// request action request for Phat Contract to respond to
function request(string calldata reqData) public {
    // assemble the request
    uint id = nextRequest;
    requests[id] = reqData;
    _pushMessage(abi.encode(id, reqData));
    nextRequest += 1;
}
//...
// _onMessageReceived response from Phat Contract
function _onMessageReceived(bytes calldata action) internal override {
    // Optional to check length of action
    // require(action.length == 32 * 3, "cannot parse action");
    (uint respType, uint id, bool data) = abi.decode(
        action,
        (uint, uint, bool)
    );
    if (respType == TYPE_RESPONSE) {
        emit ResponseReceived(id, requests[id], data);
        delete requests[id];
    } else if (respType == TYPE_ERROR) {
        emit ErrorReceived(id, requests[id], data);
        delete requests[id];
    }
}
// ...
```

`NumberCoder`Example

`index.ts`

```typescript
// ...
// Encode number
const uintCoder = new Coders.NumberCoder(32, false, "uint256");
function encodeReply(reply: [number, number, number]): HexString {
  return Coders.encode([uintCoder, uintCoder, uintCoder], reply) as HexString;
}
// Defined in OracleConsumerContract.sol
const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

// main entry function
export default function main(request: HexString, settings: string): HexString {
  //...
   let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = Coders.decode([uintCoder, bytesCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    return encodeReply([TYPE_ERROR, 0, errorToCode(error as Error)]);
  }
  //...
  try {
    const response = 2813308004;
    return encodeReply([TYPE_RESPONSE, requestId, stats]);
  } catch (error) {
    // Define error logic
    // otherwise tell client we cannot process it
    console.log("error:", [TYPE_ERROR, requestId, error]);
    return encodeReply([TYPE_ERROR, requestId, errorToCode(error as Error)]);
  }
}
// ...
```

`OracleConsumerContract.sol`

```solidity
event ResponseReceived(uint reqId, string reqData, uint256 value);
event ErrorReceived(uint reqId, string reqData, uint256 errno);
// ...
// request action request for Phat Contract to respond to
function request(string calldata reqData) public {
    // assemble the request
    uint id = nextRequest;
    requests[id] = reqData;
    _pushMessage(abi.encode(id, reqData));
    nextRequest += 1;
}
//...
// _onMessageReceived response from Phat Contract
function _onMessageReceived(bytes calldata action) internal override {
    // Optional to check length of action
    // require(action.length == 32 * 3, "cannot parse action");
    (uint respType, uint id, uint256 data) = abi.decode(
        action,
        (uint, uint, uint256)
    );
    if (respType == TYPE_RESPONSE) {
        emit ResponseReceived(id, requests[id], data);
        delete requests[id];
    } else if (respType == TYPE_ERROR) {
        emit ErrorReceived(id, requests[id], data);
        delete requests[id];
    }
}
// ...
```

`StringCoder` Example

`index.ts`

```typescript
// ...
// Encode String
const stringCoder = new Coders.StringCoder("string");
const uintCoder = new Coders.NumberCoder(32, false, "uint256");
function encodeReply(reply: [number, number, string]): HexString {
  return Coders.encode([uintCoder, uintCoder, stringCoder], reply) as HexString;
}
// Defined in OracleConsumerContract.sol
const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

// main entry function
export default function main(request: HexString, settings: string): HexString {
  //...
   let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = Coders.decode([uintCoder, bytesCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    return encodeReply([TYPE_ERROR, 0, errorToCode(error as Error)]);
  }
  //...
  try {
    const response = "hello";
    return encodeReply([TYPE_RESPONSE, requestId, response]);
  } catch (error) {
    // Define error logic
    // otherwise tell client we cannot process it
    console.log("error:", [TYPE_ERROR, requestId, error]);
    return encodeReply([TYPE_ERROR, requestId, errorToCode(error as Error)]);
  }
}
// ...
```

`OracleConsumerContract.sol`

```solidity
event ResponseReceived(uint reqId, string reqStr, string memory value);
event ErrorReceived(uint reqId, string reqStr, string memory errno);
// ...
// request action request for Phat Contract to respond to
function request(string calldata reqData) public {
    // assemble the request
    uint id = nextRequest;
    requests[id] = reqData;
    _pushMessage(abi.encode(id, reqData));
    nextRequest += 1;
}
//...
// _onMessageReceived response from Phat Contract
function _onMessageReceived(bytes calldata action) internal override {
    // Optional to check length of action
    // require(action.length == 32 * 3, "cannot parse action");
    (uint respType, uint id, string memory data) = abi.decode(
        action,
        (uint, uint, string)
    );
    if (respType == TYPE_RESPONSE) {
        emit ResponseReceived(id, requests[id], data);
        delete requests[id];
    } else if (respType == TYPE_ERROR) {
        emit ErrorReceived(id, requests[id], data);
        delete requests[id];
    }
}
// ...
```

`ArrayCoder` Static Array Example

> Static arrays can be created by defining a `number` > 0. as the `length` parameter in the `Coders.ArrayCoder(coder: Coder, length: number, localName: string)` function.

`index.ts`

```typescript
// ...
// Encode String
const stringCoder = new Coders.StringCoder("string");
const stringArrayCoder = new Coders.ArrayCoder(stringCoder, 3, "string[]");
function encodeReply(reply: [number, number, string[]]): HexString {
  return Coders.encode([uintCoder, uintCoder, stringArrayCoder], reply) as HexString;
}
// Defined in OracleConsumerContract.sol
const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

// main entry function
export default function main(request: HexString, settings: string): HexString {
  //...
   let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = Coders.decode([uintCoder, bytesCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    // ...
  }
  //...
  try {
    const response = ["Who?", "Mike", "Jones"];
    return encodeReply([TYPE_RESPONSE, requestId, response]);
  } catch (error) {
    // Define error logic
    // otherwise tell client we cannot process it
    // ...
  }
}
// ...
```

`OracleConsumerContract.sol`

```solidity
// ...
// request action request for Phat Contract to respond to
function request(string calldata reqData) public {
    // assemble the request
    uint id = nextRequest;
    requests[id] = reqData;
    _pushMessage(abi.encode(id, reqData));
    nextRequest += 1;
}
//...
// _onMessageReceived response from Phat Contract
function _onMessageReceived(bytes calldata action) internal override {
    // Optional to check length of action
    // require(action.length == 32 * 3, "cannot parse action");
    (uint respType, uint id, string [3] memory data) = abi.decode(
        action,
        (uint, uint, string[3])
    );
    // ...
}
// ...
```

`ArrayCoder` Dynamic Array Example

> Dynamic arrays can be created by using `-1` as the `length` parameter in the `Coders.ArrayCoder(coder: Coder, length: number, localName: string)` function.

`index.ts`

```typescript
// ...
// Encode String
const stringCoder = new Coders.StringCoder("string");
// Dynamic arrays just put `-1` for the length parameter
const stringArrayCoder = new Coders.ArrayCoder(stringCoder, -1, "string[]");
function encodeReply(reply: [number, number, string[]]): HexString {
  return Coders.encode([uintCoder, uintCoder, stringArrayCoder], reply) as HexString;
}
// Defined in OracleConsumerContract.sol
const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

// main entry function
export default function main(request: HexString, settings: string): HexString {
  //...
   let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = Coders.decode([uintCoder, bytesCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    // ...
  }
  //...
  try {
    const response = ["Who?", "Mike", "Jones", "is", "dynamic"];
    return encodeReply([TYPE_RESPONSE, requestId, response]);
  } catch (error) {
    // Define error logic
    // otherwise tell client we cannot process it
    // ...
  }
}
// ...
```

`OracleConsumerContract.sol`

```solidity
// ...
// request action request for Phat Contract to respond to
function request(string calldata reqData) public {
    // assemble the request
    uint id = nextRequest;
    requests[id] = reqData;
    _pushMessage(abi.encode(id, reqData));
    nextRequest += 1;
}
//...
// _onMessageReceived response from Phat Contract
function _onMessageReceived(bytes calldata action) internal override {
    (uint respType, uint id, string[] memory data) = abi.decode(
        action,
        (uint, uint, string[3])
    );
    // ...
}
// ...
```

Complex example using

* `BytesCoder`
* `FixedBytesCoder`
* `NullCoder`
* `TupleCoder`

`index.ts`

```typescript
// ...
// Encode Address
import { Coders } from "@phala/ethers";

const bytesCoder = new Coders.BytesCoder('bytes');
const fixedCoder = new Coders.FixedBytesCoder(16, 'bytes')
const nullCoder = new Coders.NullCoder('nullCoder')
const tupleCoder = new Coders.TupleCoder([bytesCoder, fixedCoder, nullCoder], 'tupleCoder')

export default function main() {
  return Coders.encode([tupleCoder], [[new Uint8Array(0), new Uint8Array(16), null]])
}
// ...
```

`OracleConsumerContract.sol`

```solidity
// ...
// request action request for Phat Contract to respond to
function request(string calldata reqData) public {
    // assemble the request
    uint id = nextRequest;
    requests[id] = reqData;
    _pushMessage(abi.encode(id, reqData));
    nextRequest += 1;
}
//...
// _onMessageReceived response from Phat Contract
function _onMessageReceived(bytes calldata action) internal override {
    // ...
    (bytes16 bytesResp, bytes16 bytes16Resp, uint null) = abi.decode(
       action,
       (bytes16, bytes16, uint)
    );
    //...
}
// ...
```
{% endtab %}
{% endtabs %}

### Example

In the Phat Contract 2.0 Starter Kit, there is a file in `src/viem/coder.ts` which will look like the following:

```typescript
import {decodeAbiParameters, encodeAbiParameters, parseAbiParameters} from "viem";

export type HexString = `0x${string}`
export const encodeReplyAbiParams = 'uint respType, uint id, uint256 data';
export const decodeRequestAbiParams = 'uint id, string reqData';

export function encodeReply(abiParams: string, reply: [bigint, bigint, bigint]): HexString {
    return encodeAbiParameters(parseAbiParameters(abiParams),
        reply
    );
}

export function decodeRequest(abiParams: string, request: HexString): any {
    return decodeAbiParameters(parseAbiParameters(abiParams),
        request
    );
}
```

The 2 important functions in this file are:

* `decodeRequest(abiParams, request)` - decodes the action `request` `HexString` that is passed into the `main(request, secrets)` entry function of the Phat Contract. You can find the expected encoded `HexString` in the `OracleConsumerContract.sol` `request(string calldata reqData)` function where the action is encoded with a `uint id` and `string reqData` in the `_pushMessage(abi.encode(id, reqData))` function.
* `encodeReply(abiParams, reply)` - encodes the action reply to be sent back to the Consumer Contract on the EVM change. The Consumer Contract consumes the action reply via the `_onMessageReceived(bytes calldata action)` function where data encoded can be decoded and handled based on the Consumer Contract logic. The default example encodes a tuple of `uint respType`, `uint id`, and `uint256 data` that in turn gets decoded in  `OracleConsumerContract.sol`  `_onMessageReceived(bytes calldata action)` function with `(uint respType, uint id, uint256 data) = abi.decode(action, (uint, uint, uint256)`.

Let's breakdown the example and step through the process.

1. encode action request in `request(string calldata)` of `OracleConsumerContract.sol`
2. decode action request when parsing the encoded action in the Phat Contract 2.0 `main(request, secrets)` entry function in the `src/index.ts` file.
3. encode the action reply in the Phat Contract to send to the `OracleConsumerContract.sol`
4. decode the action reply in the `OracleConsumerContract.sol` function `_onMessageReceived(bytes calldata action)`

{% tabs %}
{% tab title="Step 1" %}
Here is a snippet of the code to encode a tuple that includes the `uint id` representing the request id and `string calldata reqData` that is the request data string.

For the example, we will pass in:

* `id` = `1`
* `reqData` = `"0x01"`

`OracleConsumerContract.sol`

<pre class="language-solidity"><code class="lang-solidity">function request(string calldata reqData) public {
   // assemble the request
<strong>   uint id = nextRequest;
</strong>   requests[id] = reqData;
   _pushMessage(abi.encode(id, reqData));
   nextRequest += 1;
}
   
</code></pre>

This will produce a `HexString` `0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000043078303100000000000000000000000000000000000000000000000000000000` representing `(1, "0x01")`
{% endtab %}

{% tab title="Step 2" %}
In the `src/index.ts` file, we handle the decoding by calling the `decodeRequest(abiParams, request)` to parse the expected variables of `id` equal to `1` and `reqData` equal to `"0x01"`.

`src/main.ts`

```typescript
export default function main(request: HexString, secrets: string): HexString {
  console.log(`handle req: ${request}`);
  let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = decodeRequest(decodeRequestAbiParams, request);
    console.log(`[${requestId}]: ${encodedReqStr}`);
  } catch (error) {
    console.info("Malformed request received");
    return encodeReply(encodeReplyAbiParams, [BigInt(TYPE_ERROR), 0n, BigInt(errorToCode(error as Error))]);
  }
```

You will see logs that will look like the following when printing the encoded `request` and decoded values into `requestId` and `encodedReqStr`.

```bash
handle req: 0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000043078303100000000000000000000000000000000000000000000000000000000
[1]: 0x01
```

Notice that we have error handling to ensure that the `request` can be decoded or else the error will be sent back to the Consumer Contract with `encodeReply(abiParams, reply)`.
{% endtab %}

{% tab title="Step 3" %}
Once the results are computed in the Phat Contract, the action reply is composed and sent via the `encodeReply(abiParams, reply)` function. In this example, we query the Lens v2 API to get profile id `"0x01"` and returns the total posts back as part of the encoded reply.

`src/index.ts`

```typescript
try {
    const respData = fetchApiStats(secrets, encodedReqStr);
    let stats = respData.data.profile.stats.posts;
    console.log("response:", [TYPE_RESPONSE, requestId, stats]);
    return encodeReply(encodeReplyAbiParams, [BigInt(TYPE_RESPONSE), requestId, stats]);
  } catch (error) {
    if (error === Error.FailedToFetchData) {
      throw error;
    } else {
      // otherwise tell client we cannot process it
      console.log("error:", [TYPE_ERROR, requestId, error]);
      return encodeReply(encodeReplyAbiParams, [BigInt(TYPE_ERROR), requestId, BigInt(errorToCode(error as Error))]);
    }
  }
```

The expected posts count at the time of writing was `201` so the logs should print something similar to below where `0` equals `TYPE_RESPONSE`, `1` equals to the request id, and `201` is the total posts from profile `"0x01"`

```bash
response: 0,1,201
{"output":"0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c9"}
```
{% endtab %}

{% tab title="Step 4" %}
The encoded action reply is lastly handled by the `OracleconsumerContract.sol` in the `_onMessageReceived(bytes calldata action)` with the expected value of action being `0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c9` which is decoded to equal `(0, 1, 201)`. This can be seen with the example below.

`OracleConsumerContract.sol`

```solidity
function _onMessageReceived(bytes calldata action) internal override {
    // Optional to check length of action
    // require(action.length == 32 * 3, "cannot parse action");
    (uint respType, uint id, uint256 data) = abi.decode(
        action,
        (uint, uint, uint256)
    );
    if (respType == TYPE_RESPONSE) {
        emit ResponseReceived(id, requests[id], data);
        delete requests[id];
    } else if (respType == TYPE_ERROR) {
        emit ErrorReceived(id, requests[id], data);
        delete requests[id];
    }
}
```
{% endtab %}
{% endtabs %}

## [Closing](https://github.com/Phala-Network/phat-contract-starter-kit/blob/main/src/JS\_API\_DOC.md#closing) <a href="#user-content-closing" id="user-content-closing"></a>

Congratulations! You now possess the power to extend the functionality of your functions in many unique ways. If this sparks some ideas that require some extensive functionality that is not supported in `@phala/pink-env`, jump in our [discord](https://discord.gg/dB4AuP4Q), and we can help you learn a little rust to build some Phat Contracts with the Rust SDK then leverage the functions `pink.invokeContract()` & `pink.invokeContractDelegate()` to make calls to the Rust SDK deployed Phat Contracts.
