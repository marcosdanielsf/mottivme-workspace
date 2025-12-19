import 'dart:io';

import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:dotenv/dotenv.dart';
import 'package:logging/logging.dart';

import 'package:pocketpub/pocketpub.dart';

void main(List<String> args) async {
  // Configure logging
  Logger.root.level = Level.INFO;
  Logger.root.onRecord.listen((record) {
    stdout.writeln('${record.level.name}: ${record.time}: ${record.message}');
  });
  final log = Logger('PocketPub');

  // Load environment variables
  final env = DotEnv(includePlatformEnvironment: true)
    ..load(['.env', '.env.local']);

  // Initialize storage for package archives
  final storageDir = env['STORAGE_DIR'] ?? 'package_archives';
  await Directory(storageDir).create(recursive: true);

  // Configure PocketBase
  final pocketbaseUrl = env['POCKETBASE_URL'] ?? 'http://localhost:8090';
  final pocketbaseAdmin = env['POCKETBASE_ADMIN'] ?? 'admin@example.com';
  final pocketbasePassword = env['POCKETBASE_PASSWORD'] ?? 'password123';
  final skipPocketbase = env['SKIP_POCKETBASE'] == 'true';

  dynamic pocketbaseClient;

  if (!skipPocketbase) {
    try {
      log.info('Initializing PocketBase connection to $pocketbaseUrl');
      pocketbaseClient = await initPocketBase(
        pocketbaseUrl,
        pocketbaseAdmin,
        pocketbasePassword,
      );
      log.info('PocketBase initialized successfully');
    } catch (e) {
      log.severe('Failed to connect to PocketBase: $e');
      if (env['DEV_MODE'] == 'true') {
        log.warning(
            'Running in DEV_MODE without PocketBase. Data will not be persisted!');
        // In dev mode, we'll continue without PocketBase
      } else {
        rethrow; // In production, we need PocketBase to work
      }
    }
  } else {
    log.warning('PocketBase integration disabled by SKIP_POCKETBASE flag');
  }

  // Initialize our API
  log.info('Creating Pub API');
  final api = createPubApi(pocketbaseClient, storageDir);

  // Create a server
  final ip = InternetAddress.anyIPv4;
  final port = int.parse(env['PORT'] ?? '8080');

  log.info('Starting server on port $port');
  final server = await serve(api, ip, port);
  log.info('Server listening on port ${server.port}');
}
