# Client-Salesforce

The `client-salesforce` package is a lightweight and easy-to-use library to interact with Salesforce APIs. It handles authentication and provides a simple interface for querying, creating, updating, and deleting data from Salesforce. This package ensures automatic access token management so you can focus on your application logic.

---

## Features

- **Easy Authentication:** Initialize the client with your Salesforce credentials.
- **Token Management:** Automatically fetches and refreshes access tokens when needed.
- **SOQL Query Support:** Execute SOQL queries effortlessly and retrieve Salesforce data.
- **CRUD Operations:** Create, update, and delete Salesforce records with simple methods.
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
  "<USERNAME>",
  "<PASSWORD>",
  "<CLIENT_ID>",
  "<CLIENT_SECRET>",
  "<LOGIN_URL>",
  "<GRANT_TYPE>"
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

### Create Salesforce Record

Use the `create` method to add new records:

```typescript
(async () => {
  try {
    const newAccount = await client.create("Account", { Name: "New Account" });
    console.log("Created Account:", newAccount);
  } catch (error) {
    console.error("Creation failed:", error.message);
  }
})();
```

### Update Salesforce Record

Use the `update` method to modify existing records:

```typescript
(async () => {
  try {
    const isUpdated = await client.update("Account", "001XXXXXXXXXXXXXXX", {
      Name: "Updated Account",
    });
    console.log("Update Successful:", isUpdated);
  } catch (error) {
    console.error("Update failed:", error.message);
  }
})();
```

### Delete Salesforce Record

Use the `delete` method to remove records:

```typescript
(async () => {
  try {
    const isDeleted = await client.delete("Account", "001XXXXXXXXXXXXXXX");
    console.log("Deletion Successful:", isDeleted);
  } catch (error) {
    console.error("Deletion failed:", error.message);
  }
})();
```

---

## API Reference

### `SalesforceClient`

#### Constructor

```typescript
new SalesforceClient(username: string, password: string, clientId: string, clientSecret: string, loginUrl: string, grant_type: string);
```

- **`username`**: Your Salesforce username.
- **`password`**: Your Salesforce password.
- **`clientId`**: The Salesforce client ID.
- **`clientSecret`**: The Salesforce client secret.
- **`loginUrl`**: The Salesforce login URL.
- **`grant_type`**: The OAuth grant type.

#### Methods

##### `query(soql: string): Promise<any>`

Executes a SOQL query and returns the result.

- **`soql`**: The SOQL query string to execute.

Example:

```typescript
const result = await client.query("SELECT Id, Name FROM Contact");
console.log(result);
```

##### `create(objectType: string, data: Record<string, any>): Promise<any>`

Creates a new Salesforce record.

- **`objectType`**: The Salesforce object type (e.g., `Account`, `Contact`).
- **`data`**: The data to create the record with.

Example:

```typescript
const newContact = await client.create("Contact", {
  FirstName: "John",
  LastName: "Doe",
});
console.log(newContact);
```

##### `update(objectType: string, objectId: string, data: Record<string, any>): Promise<boolean>`

Updates an existing Salesforce record.

- **`objectType`**: The Salesforce object type.
- **`objectId`**: The ID of the record to update.
- **`data`**: The updated data.

Example:

```typescript
const isUpdated = await client.update("Contact", "003XXXXXXXXXXXXXXX", {
  LastName: "Smith",
});
console.log(isUpdated);
```

##### `delete(objectType: string, objectId: string): Promise<boolean>`

Deletes a Salesforce record.

- **`objectType`**: The Salesforce object type.
- **`objectId`**: The ID of the record to delete.

Example:

```typescript
const isDeleted = await client.delete("Contact", "003XXXXXXXXXXXXXXX");
console.log(isDeleted);
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
        "url": "/services/data/v62.0/sobjects/Account/001XXXXXXXXXXXXXXX"
      },
      "Id": "001XXXXXXXXXXXXXXX",
      "Name": "Edge Communications"
    }
  ]
}
```

---

## Error Handling

Errors are thrown for failed authentication, token refresh issues, or failed operations. Use `try-catch` blocks to handle these errors.

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
