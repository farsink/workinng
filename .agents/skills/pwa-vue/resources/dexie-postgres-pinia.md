---
name: using-dexiejs-postgresql-pinia
description: Integrates Dexie.js for client-side data management with Pinia for state management in Vue.js applications, and optionally configures Dexie Cloud for synchronization with PostgreSQL backends. Use when building offline-first Vue applications that require robust state management and scalable backend synchronization.
---

# Using Dexie.js, PostgreSQL, and Pinia

> [!NOTE]
> This resource is part of the [architecting-vue-pwa-apps](../SKILL.md) skill. It provides guidance on robust state management and backend sync using Dexie.js and Dexie Cloud (PostgreSQL).

## Quick Start

This example demonstrates setting up a basic Pinia store that uses Dexie.js for IndexedDB operations, enabling reactive updates in your Vue components.

**1. Project Setup:**

Ensure you have a Vue.js project with Pinia and Dexie.js installed:

```bash
npm install pinia dexie
# or
yarn add pinia dexie
```

**2. Initialize Dexie DB:**

Create a `db.js` file to define your Dexie database schema and instance.

```javascript
// src/db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

db.version(1).stores({
  todos: '++id, title, done' // Primary key 'id', indexed fields 'title', 'done'
});
```

**3. Create a Pinia Store:**

Define a Pinia store that interacts with your Dexie database. Use `liveQuery` for automatic reactivity.

```javascript
// src/stores/todoStore.js
import { defineStore } from 'pinia';
import { liveQuery } from 'dexie';
import { db } from '@/db'; // Adjust path as needed

export const useTodoStore = defineStore('todos', {
  state: () => ({
    allTodos: [],
    // other state properties...
  }),
  actions: {
    // Fetches todos from Dexie and updates Pinia state
    async fetchTodos() {
      const query = liveQuery(() => db.todos.toArray());

      query.subscribe({
        next: (todos) => {
          this.allTodos = todos;
          console.log('Todos updated from Dexie:', todos);
        },
        error: (err) => console.error('Live query error:', err),
      });

      // Note: The subscription will keep the store updated.
      // You can store the subscription handle if you need to unsubscribe later.
    },

    // Adds a new todo to Dexie and Pinia state
    async addTodo(title) {
      await db.todos.add({ title, done: false });
      // `fetchTodos` (via liveQuery subscription) will automatically update the state
    },

    // Updates a todo in Dexie and Pinia state
    async toggleTodoDone(id, done) {
      await db.todos.update(id, { done: !done });
      // `fetchTodos` will automatically update the state
    },

    // Deletes a todo from Dexie and Pinia state
    async deleteTodo(id) {
      await db.todos.delete(id);
      // `fetchTodos` will automatically update the state
    }
  },
  // Optional: Getters can be defined here for computed data
  getters: {
    completedTodos: (state) => state.allTodos.filter(todo => todo.done),
    activeTodos: (state) => state.allTodos.filter(todo => !todo.done)
  }
});
```

**4. Integrate in Vue Component:**

Use the store in your Vue components.

```vue
<template>
  <div>
    <h2>My Todos</h2>
    <input v-model="newTodoTitle" @keyup.enter="addTodoItem" placeholder="Add new todo">

    <ul>
      <li v-for="todo in todoStore.allTodos" :key="todo.id">
        <input type="checkbox" :checked="todo.done" @change="toggleTodo(todo.id, todo.done)">
        <span :class="{ completed: todo.done }">{{ todo.title }}</span>
        <button @click="deleteTodoItem(todo.id)">Delete</button>
      </li>
    </ul>

    <p>Completed: {{ todoStore.completedTodos.length }}</p>
    <p>Active: {{ todoStore.activeTodos.length }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todoStore';

const todoStore = useTodoStore();
const newTodoTitle = ref('');

onMounted(() => {
  todoStore.fetchTodos();
});

const addTodoItem = () => {
  if (newTodoTitle.value.trim()) {
    todoStore.addTodo(newTodoTitle.value);
    newTodoTitle.value = '';
  }
};

const toggleTodo = (id, done) => {
  todoStore.toggleTodoDone(id, done);
};

const deleteTodoItem = (id) => {
  todoStore.deleteTodo(id);
};
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  color: grey;
}
</style>
```

**5. Initialize Pinia:**

In your `main.js` or `main.ts`:

```javascript
// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

## Core Concepts

*   **Dexie.js:** A wrapper library for IndexedDB that provides a more convenient API, promises, and features like `liveQuery` for reactive data. It primarily operates on the client-side.
*   **Pinia:** A state management library for Vue.js. It offers a centralized store for managing application state, with features like plugins, devtools integration, and excellent TypeScript support. It excels at managing application-wide state and providing reactive access to it.
*   **Dexie Cloud:** A commercial solution built by the Dexie.js team. It provides backend synchronization services, enabling offline capabilities, user authentication, and data persistence by leveraging a **PostgreSQL** database on the server. It acts as a bridge between your client-side Dexie DB and a remote PostgreSQL instance.
*   **`liveQuery`:** A key feature of Dexie.js that creates an observable query. When the underlying IndexedDB data changes, the `liveQuery` automatically triggers an update, making it ideal for keeping client-side state (like a Pinia store) in sync with the database.
*   **PostgreSQL:** A powerful, open-source relational database system. Dexie Cloud uses PostgreSQL as its backend data store. You can self-hosted Dexie Cloud and connect it to your own PostgreSQL instance.

## Essential Patterns

### 1. Reactive Data Flow with `liveQuery` and Pinia

This pattern ensures that changes in your IndexedDB are automatically reflected in your Pinia store, and subsequently in your Vue components.

**Description:** Use `liveQuery` within your Pinia actions to subscribe to changes in Dexie.js tables. When data is modified (added, updated, deleted), the `liveQuery` callback re-executes, fetches the latest data, and updates the Pinia state.

**Code Example:**

```javascript
// src/stores/productStore.js
import { defineStore } from 'pinia';
import { liveQuery } from 'dexie';
import { db } from '@/db'; // Your Dexie instance

export const useProductStore = defineStore('products', {
  state: () => ({
    items: [],
    loading: true,
    error: null
  }),
  actions: {
    async initializeProducts() {
      const query = liveQuery(() => db.products.orderBy('name').toArray());

      // Subscribe to the liveQuery
      const subscription = query.subscribe({
        next: (products) => {
          this.items = products;
          this.loading = false;
          console.log('Product list updated reactively.');
        },
        error: (err) => {
          this.error = err;
          this.loading = false;
          console.error('Error in liveQuery for products:', err);
        }
      });

      // Store subscription handle if you need to unsubscribe later
      // e.g., this.productSubscription = subscription;
    },
    async addProduct(productData) {
      try {
        await db.products.add(productData);
        // State will update automatically via liveQuery
      } catch (error) {
        console.error('Failed to add product:', error);
        throw error;
      }
    },
    async updateProduct(id, updatedData) {
      try {
        await db.products.update(id, updatedData);
        // State will update automatically via liveQuery
      } catch (error) {
        console.error('Failed to update product:', error);
        throw error;
      }
    },
    async deleteProduct(id) {
      try {
        await db.products.delete(id);
        // State will update automatically via liveQuery
      } catch (error) {
        console.error('Failed to delete product:', error);
        throw error;
      }
    }
  }
});
```

**Expected Output/Behavior:**

-   When the `initializeProducts` action is called, `liveQuery` subscribes to the `products` table.
-   The `items` state property is populated with the current products.
-   Any subsequent additions, updates, or deletions to the `products` table via Dexie will trigger the `next` handler in the subscription, updating `this.items` automatically.
-   Vue components using `useProductStore().items` will re-render reactively.

### 2. Client-Side Only Data Management

When backend synchronization is not immediately required, Dexie.js can fully manage client-side data persistence, with Pinia acting as the reactive state layer.

**Description:** For simpler applications or progressive enhancement, you can use Dexie.js for offline storage and Pinia to hold the application's state, fetching data from Dexie on app load and updating Dexie directly via Pinia actions.

**Code Example:**

```javascript
// src/stores/settingsStore.js
import { defineStore } from 'pinia';
import { db } from '@/db';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    userPreferences: null,
    isLoaded: false
  }),
  actions: {
    async loadPreferences() {
      try {
        const prefs = await db.settings.get('userPreferences');
        this.userPreferences = prefs || { theme: 'light', notifications: true };
        this.isLoaded = true;
      } catch (error) {
        console.error('Error loading settings:', error);
        // Fallback to default preferences if DB read fails
        this.userPreferences = { theme: 'light', notifications: true };
        this.isLoaded = true;
      }
    },
    async savePreferences(prefs) {
      try {
        await db.settings.put(prefs, 'userPreferences'); // Using put for potential updates
        this.userPreferences = prefs;
      } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
      }
    },
    // Example action to toggle dark mode
    async toggleDarkMode() {
      if (!this.isLoaded) await this.loadPreferences();
      const newPrefs = { ...this.userPreferences, theme: this.userPreferences.theme === 'light' ? 'dark' : 'light' };
      await this.savePreferences(newPrefs);
    }
  }
});
```

### 3. Reactive Table Joins in `liveQuery`

This pattern addresses the need to fetch and combine data from multiple related tables reactively.

**Description:** Perform join-like operations directly within the `liveQuery` callback using `async/await`. The approach depends on the size of the related data. For small tables, fetch all records and map. For larger tables, use `where` or `toArray` followed by `bulkGet` to fetch only necessary related items efficiently.

**Code Example (Small Related Tables):**

```typescript
// src/stores/orderStore.js
import { defineStore } from 'pinia';
import { liveQuery } from 'dexie';
import { db } from '@/db';

export const useOrderStore = defineStore('orders', {
  state: () => ({
    detailedOrders: [],
    // ... other state
  }),
  actions: {
    async watchDetailedOrders() {
      const query = liveQuery(async () => {
        const orders = await db.orders.toArray();
        const customers = await db.customers.toArray(); // Assume customers table is small

        return orders.map(order => ({
          ...order,
          customer: customers.find(c => c.id === order.customerId)
        }));
      });

      query.subscribe({
        next: (detailedOrders) => {
          this.detailedOrders = detailedOrders;
          console.log('Detailed orders updated:', detailedOrders);
        },
        error: (err) => console.error('Error watching detailed orders:', err)
      });
    }
  }
});
```

**Code Example (Large Related Tables):**

```typescript
// src/stores/taskStore.js
import { defineStore } from 'pinia';
import { liveQuery } from 'dexie';
import { db } from '@/db';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasksWithUsers: [],
    // ... other state
  }),
  actions: {
    async watchTasksWithUsers() {
      // Example: fetch tasks based on a status criteria
      const query = liveQuery(async () => {
        const pendingTasks = await db.tasks.where('status').equals('pending').toArray();
        
        // Extract unique user IDs from pending tasks
        const userIds = new Set(pendingTasks.map(task => task.assignedUserId));
        
        // Fetch only the required users using bulkGet
        const assignedUsers = await db.users.bulkGet([...userIds]);

        // Filter out any nulls if bulkGet didn't find all users
        const validUsers = assignedUsers.filter(user => user !== undefined);
        
        // Create a map for efficient lookup
        const userMap = validUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        // Combine tasks with their assigned users
        return pendingTasks.map(task => ({
          ...task,
          assignedUser: userMap[task.assignedUserId] || null // Attach user object or null
        }));
      });

      query.subscribe({
        next: (tasksWithUsers) => {
          this.tasksWithUsers = tasksWithUsers;
          console.log('Tasks with assigned users updated:', tasksWithUsers);
        },
        error: (err) => console.error('Error watching tasks with users:', err)
      });
    }
  }
});
```

**Expected Output/Behavior:**

-   `detailedOrders` or `tasksWithUsers` state is updated reactively based on changes in the respective tables and related data.
-   The join logic is executed efficiently, either by fetching all related data for small tables or by using `bulkGet` for targeted fetching with large tables.

### 4. Dexie Cloud Setup for PostgreSQL Synchronization

This pattern involves configuring Dexie Cloud for on-premise deployment, connecting it to a PostgreSQL database, and migrating data.

**Description:** This is for advanced use cases where you need full control over your backend infrastructure. You'll deploy the Dexie Cloud server (Node.js application) and connect it to your own PostgreSQL instance. This allows for custom deployment environments (Azure, AWS, bare metal) and potentially lower costs for large-scale applications.

**Steps & Code Snippets:**

1.  **Set up PostgreSQL Database:**
    *   Create a PostgreSQL database instance (e.g., using Azure Database for PostgreSQL or AWS RDS).

2.  **Deploy Dexie Cloud Server:**
    *   Obtain the Dexie Cloud server software license and clone the repository.
    *   Navigate to `packages/dexie-cloud-server`.
    *   Install dependencies: `npm install`.
    *   Configure your environment (e.g., Azure Web Apps, AWS EC2).

3.  **Configure Connection Strings and Secrets:**
    *   In your cloud provider's application settings, set:
        *   `DEXIE_CLOUD`: Connection string for your PostgreSQL database.
        *   `DXC_SECRET`: A long, random secret string for JWT signing.

4.  **Initialize the Dexie Cloud Database Schema:**
    *   Set environment variables locally:
        ```bash
        export DXC_SECRET=<your-secret>
        export DXC_URL=<your-node-app-url-in-azure>
        ```
    *   Run the initialization command from the `packages/dexie-cloud-server` directory:
        ```bash
        npm run init-cloud
        ```
    *   This creates the necessary SQL schema and tables in your PostgreSQL database and generates `dexie-cloud.json` and `dexie-cloud.key` files.

5.  **Create Logical Databases (Realms):**
    *   To manage multiple logical databases within your installation, run from the directory containing `dexie-cloud.json`/`.key`:
        ```bash
        npx dexie-cloud create
        ```

6.  **Set up Email Channel (Optional for OTP):**
    *   If using email for One-Time Password (OTP) authentication:
        ```bash
        npm run init-email-channel <URL_of_your_email_webhook>
        ```

**Expected Output/Behavior:**

-   The Dexie Cloud server is running and connected to your PostgreSQL database.
-   The database schema is initialized.
-   You can now configure your client-side Dexie DB to sync with this self-hosted backend using:
    ```javascript
    // Client-side (e.g., in your main Dexie setup)
    import Dexie from 'dexie';
    import 'dexie-cloud'; // Import the cloud addon

    const db = new Dexie('myClientDatabase');
    db.version(1).stores({
      items: '++id, name',
      // ... other tables
    });

    db.cloud.configure({
      databaseUrl: '<URL_to_your_self_hosted_dexie_cloud_server>',
      // Other options like requireAuth, userId, etc.
    });
    ```

### 5. Zero Downtime Migration from Hosted to Self-Hosted Dexie Cloud

This workflow outlines the steps to migrate your data from a hosted Dexie Cloud instance to your self-hosted PostgreSQL setup without service interruption.

**Description:** This process involves setting up your self-hosted Dexie Cloud, establishing a replication link, verifying sync, redirecting traffic, and finally decommissioning the old hosted database.

**Worklow Steps:**

1.  **Ensure Self-Hosted Setup:** Have your Dexie Cloud server deployed and connected to your PostgreSQL instance as described in Pattern 4. Ensure `DXC_SECRET` and `DEXIE_CLOUD_URL` are correctly set.
2.  **Start Replication:** Run the replication command from your local machine within the directory containing `dexie-cloud.json`/`.key`:
    ```bash
    npx dexie-cloud start-replication --from <URL_of_hosted_db> --to <URL_of_your_new_db>
    ```
    *   `<URL_of_hosted_db>`: The URL of the hosted Dexie Cloud database you are migrating *from*.
    *   `<URL_of_your_new_db>`: The URL of your self-hosted Dexie Cloud server.
    *   Follow the OTP authorization prompts.
3.  **Monitor Replication Progress:**
    ```bash
    npx dexie-cloud replication-progress
    ```
    Wait until the status shows "in sync".
4.  **Point Web App to New URL:** Update your client-side Dexie configuration to use your new self-hosted `databaseUrl`. Deploy this change.
    ```javascript
    // Client-side Dexie configuration
    db.cloud.configure({
      databaseUrl: '<URL_to_your_self_hosted_dexie_cloud_server>',
      // ... other settings
    });
    ```
5.  **Redirect Users:** Initiate the redirection process from the hosted service to your new server:
    ```bash
    npx dexie-cloud redirect --from <URL_of_hosted_db> --to <URL_of_your_new_dexie_cloud_server_app>
    ```
    *   Follow OTP authorization. This starts redirecting ongoing and incoming connections.
6.  **Verify Connection Drop:** Regularly check the connection stats to ensure traffic to the old hosted database is decreasing.
    ```bash
    npx dexie-cloud stats --db
    ```
7.  **Decommission Hosted Database:** Once connections to the hosted database drop to zero, run the decommission command:
    ```bash
    npx delete-db <URL_of the hosted_database>
    ```
    Confirm via email. The hosted service will continue redirecting for up to 6 months.

## Authentication & Setup

### Dexie Cloud Authentication (Server-Side)

Dexie Cloud supports various authentication methods, often involving One-Time Passwords (OTP) via email or SMS, or token-based authentication for programmatic access.

-   **OTP Setup:** Requires configuring an email channel (Pattern 4, Step 6) or SMS gateway. The server generates OTPs, sends them to the user, and validates the provided code.
-   **JWT Tokens:** Used internally by the Dexie Cloud server and potentially for API access. The `DXC_SECRET` is crucial for signing these tokens securely.

### Client-Side Authentication Integration with Dexie Cloud

When using Dexie Cloud for synchronization, client applications typically authenticate users via the Dexie Cloud server's API.

1.  **Configure `requireAuth`:** To enforce user authentication before any data operations:
    ```javascript
    db.cloud.configure({
      databaseUrl: '<YOUR_DEXIE_CLOUD_URL>',
      requireAuth: true // Default is false, allowing anonymous data creation
    });
    ```
2.  **Login Flow:** Implement a login button or process in your Vue app that interacts with Dexie Cloud's authentication endpoints (e.g., sending credentials to the server, receiving authentication tokens or user IDs).
3.  **Client-Side DB Sync:** Once authenticated, Dexie.js automatically syncs data using the provided credentials/tokens.

#### Anonymous/Offline Data (`requireAuth: false`)

Dexie Cloud allows users to start creating data immediately without logging in.

-   **Configuration:** Set `db.cloud.configure({ requireAuth: false })`.
-   **Behavior:** Data is stored locally in IndexedDB. When the user later logs in, Dexie Cloud attempts to merge this local data with their synced data on the server.

## Common Pitfalls

*   **`liveQuery` Not Updating State:** Ensure the `next` handler correctly modifies Pinia state.
*   **Incorrect `db.cloud.configure` URL:** Verify the URL is correct and the server is running.
*   **Large Data Set Performance Issues with Reactive Joins:** Use optimized patterns with `where` and `bulkGet`.
*   **PostgreSQL Connection Issues (Self-Hosted):** Verify connection string, firewall rules, and server logs.

## Best Practices

*   **Use `liveQuery` for Reactivity:** Always use it for data synchronization.
*   **Separate Concerns:** Keep DB logic in utility files and Pinia logic in stores.
*   **Optimize Queries:** Use indexes and `bulkGet` for large related tables.
*   **Type Safety:** Use TypeScript for schema and stores.

## API Reference

### Dexie.js Core Methods
- `db.version(v).stores({ ... })`: Define schema.
- `table.add/put/update/get/delete`: Core CRUD.
- `liveQuery(queryFn)`: Reactive observable.

### Dexie Cloud
- `db.cloud.configure(options)`: Client-side setup.

## Workflows

### Workflow: Building an Offline-First To-Do App with Pinia and Dexie

**Goal:** Create a Vue application where users can manage to-do items offline, with data persisted locally using Dexie.js and managed reactively via Pinia.

**Steps:**

1.  **Project Setup:** Install Pinia and Dexie.
2.  **Define Dexie Database:** Create `src/db.js` with schema.
3.  **Create Pinia Store:** Use `liveQuery` to sync with Dexie.
4.  **Create Vue Component:** Bind store state to UI.
