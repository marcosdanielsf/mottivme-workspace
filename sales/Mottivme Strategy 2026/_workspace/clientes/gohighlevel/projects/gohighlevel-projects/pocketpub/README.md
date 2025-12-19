# PocketPub - Dart Pub Server with PocketBase

A custom Pub package repository server built with Dart and using PocketBase as the database backend.

This implementation follows the [Pub Repository Specification v2](https://github.com/dart-lang/pub/blob/master/doc/repository-spec-v2.md).

## Features

- Fully compliant with Pub Repository Specification v2
- Package publishing and version management
- Authentication with Bearer tokens
- Package storage and distribution
- Security advisories support

## Getting Started

### Prerequisites

- Dart SDK 3.0.0 or higher

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/pocketpub.git
   cd pocketpub
   ```

2. Install dependencies:
   ```
   dart pub get
   ```

3. Download PocketBase:
   ```
   # This will download PocketBase and set up the data directory
   ./start_pocketbase.sh
   ```

## Running the Server

### Option 1: With PocketBase (Full Mode)

1. Start PocketBase (in a separate terminal):
   ```
   ./start_pocketbase.sh
   ```

2. Visit http://localhost:8090/_/ to set up your admin account.
   - Default admin email: `admin@example.com`
   - Default admin password: `password123`

3. Start the PocketPub server:
   ```
   ./run_server.sh
   ```

4. The Pub server will be available at http://localhost:8080

### Option 2: Development Mode (Without PocketBase)

For quicker development without dependency on PocketBase:

```
./run_dev_server.sh
```

This runs the server with mock data, making development easier.

## Stopping the Server

- To stop PocketBase:
  ```
  ./stop_pocketbase.sh
  ```

- To stop the Dart server, press Ctrl+C in the terminal where it's running.

## Usage

### Publishing a Package

1. Configure your package to use this server in `pubspec.yaml`:
   ```yaml
   name: your_package
   version: 1.0.0
   publish_to: http://localhost:8080
   ```

2. Generate and add a token:
   ```
   dart pub token add http://localhost:8080
   ```

3. Publish your package:
   ```
   dart pub publish
   ```

### Installing Packages from This Server

Add this to your `pubspec.yaml`:

```yaml
dependencies:
  some_package:
    hosted:
      name: some_package
      url: http://localhost:8080
    version: ^1.0.0
```

## Configuration

You can configure the server using environment variables:

1. Copy the sample environment file:
   ```
   cp sample.env .env
   ```

2. Edit `.env` to customize your settings:
   - `POCKETBASE_URL`: URL of your PocketBase instance
   - `POCKETBASE_ADMIN`: Admin email for PocketBase
   - `POCKETBASE_PASSWORD`: Admin password for PocketBase
   - `STORAGE_DIR`: Directory to store package archives
   - `PORT`: Port for the pub server
   - `DEV_MODE`: Set to `true` for development mode
   - `SKIP_POCKETBASE`: Set to `true` to run without PocketBase

## Project Structure

- `bin/server.dart` - Main server entry point
- `lib/pocketpub.dart` - Core library exports
- `lib/src/api/` - API handlers for pub server endpoints
- `lib/src/db/` - PocketBase database integration
- `pocketbase_data/` - PocketBase data files

## Documentation

See `POCKETBASE_SETUP.md` for details on PocketBase configuration.

## License

MIT 