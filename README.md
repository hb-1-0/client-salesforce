# Client-Salesforce

The `client-salesforce` package is a lightweight and easy-to-use library to interact with Salesforce APIs. It handles authentication and provides a simple interface for querying data from Salesforce. This package ensures automatic access token management so you can focus on your application logic.

---

## Features

- **Easy Authentication:** Initialize the client with your Salesforce credentials.
- **Token Management:** Automatically fetches and refreshes access tokens when needed.
- **SOQL Query Support:** Execute SOQL queries effortlessly and retrieve Salesforce data.
- **Lightweight:** Built with minimal dependencies.

---

## Installation

Install the package using npm:

```bash
npm install client-salesforce
```

---

## Usage

### Initialization

Import and initialize the `SalesforceClient` with your Salesforce credentials:

```typescript
import { SalesforceClient } from "client-salesforce";

const client = new SalesforceClient(
  "<CLIENT_ID>",
  "<CLIENT_SECRET>",
  "<USERNAME>",
  "<PASSWORD>"
);
```

### Query Salesforce Data

Use the `query` method to run SOQL queries:

```typescript
(async () => {
  try {
    const result = await client.query("SELECT Id, Name FROM Account");
    console.log(result);
  } catch (error) {
    console.error("Query failed:", error.message);
  }
})();
```

---

## API Reference

### `SalesforceClient`

#### Constructor

```typescript
new SalesforceClient(clientId: string, clientSecret: string, username: string, password: string);
```

- **`clientId`**: The Salesforce client ID.
- **`clientSecret`**: The Salesforce client secret.
- **`username`**: Your Salesforce username.
- **`password`**: Your Salesforce password.

#### Methods

##### `query(soql: string): Promise<any>`

Executes a SOQL query and returns the result.

- **`soql`**: The SOQL query string to execute.

Example:

```typescript
const result = await client.query("SELECT Id, Name FROM Contact");
console.log(result);
```

---

## Example Response

Example data returned from a successful query:

```json
{
  "totalSize": 1,
  "done": true,
  "records": [
    {
      "attributes": {
        "type": "Account",
        "url": "/services/data/vXX.X/sobjects/Account/001XXXXXXXXXXXXXXX"
      },
      "Id": "001XXXXXXXXXXXXXXX",
      "Name": "Edge Communications"
    }
  ]
}
```

---

## Error Handling

Errors are thrown for failed authentication, token refresh issues, or failed queries. Use `try-catch` blocks to handle these errors.

Example:

```typescript
try {
  const result = await client.query("SELECT Id, Name FROM InvalidObject");
} catch (error) {
  console.error("Error:", error.message);
}
```

---

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any bugs or feature requests.

---