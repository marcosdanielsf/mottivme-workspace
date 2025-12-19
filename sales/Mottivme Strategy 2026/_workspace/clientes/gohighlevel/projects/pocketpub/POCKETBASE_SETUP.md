# Setting up PocketBase for PocketPub

This guide will help you set up PocketBase for your PocketPub server.

## Starting PocketBase

1. Run the start script:
   ```bash
   ./start_pocketbase.sh
   ```

2. Access the PocketBase Admin UI at http://localhost:8090/_/

3. Create an admin account on first run with these credentials:
   - Email: admin@example.com
   - Password: password123
   
   (or use your own credentials, just remember to update the .env file)

## Required Collections

PocketPub uses the following collections in PocketBase:

1. **packages**
   - Fields:
     - name (text, required, unique)
     - description (text)
     - isDiscontinued (boolean)
     - replacedBy (text)
     - repository (url)
     - homepage (url)

2. **versions**
   - Fields:
     - package (relation to packages, required)
     - version (text, required)
     - pubspec (json, required)
     - sha256 (text, required)
     - retracted (boolean)
     - published (date, required)

3. **advisories**
   - Fields:
     - package (relation to packages, required)
     - id (text, required)
     - details (json, required)
     - affected_versions (json, required)
     - pub_display_url (url)
     - published (date, required)
     - modified (date, required)

4. **tokens**
   - Fields:
     - token (text, required, unique)
     - user (relation to users, required)
     - name (text)
     - expires (date)
     - lastUsed (date)

## Stopping PocketBase

When you're done, you can stop PocketBase by running:
```bash
./stop_pocketbase.sh
```

## Connection from Dart server

1. Copy `sample.env` to `.env`:
   ```bash
   cp sample.env .env
   ```

2. Start the Dart server:
   ```bash
   dart run bin/server.dart
   ```

The Dart server will automatically initialize all required collections in PocketBase on first run.

## Creating tokens for package publishing

1. Create a user in PocketBase Admin UI.
2. Create a token record in the tokens collection.
3. Use the token with `dart pub token add http://localhost:8080` 