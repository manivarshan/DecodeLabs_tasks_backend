# config — Database Connection

This folder contains the database connection configuration.

---

## File: `db.js`

Creates a MySQL connection pool connected to **TiDB Cloud** using the `mysql2` driver.

### Key Design Decisions

| Decision | Reason |
|---|---|
| Connection Pool | Reuses connections instead of creating a new one per request — much faster |
| `mysql2/promise` | Allows `async/await` syntax throughout the application |
| SSL required | TiDB Cloud mandates TLS 1.2+ for all connections |
| `connectionLimit: 10` | Limits max concurrent DB connections to prevent overload |

### Usage

```js
const db = require('../config/db');

// In any model — uses async/await
const [rows] = await db.execute('SELECT * FROM patients WHERE id = ?', [id]);
```

### TiDB Cloud vs Local MySQL

| Feature | Local MySQL | TiDB Cloud |
|---|---|---|
| Port | 3306 | 4000 |
| SSL required | No | Yes |
| Setup | Local install | Browser-based |
| Scaling | Manual | Automatic (serverless) |
