/// PocketPub - A Dart Pub Server using PocketBase
library pocketpub;

import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:logging/logging.dart';
import 'package:pocketbase/pocketbase.dart';

import 'src/api/packages_api.dart';
import 'src/api/middleware.dart';
import 'src/db/pocketbase_client.dart';

export 'src/api/packages_api.dart';
export 'src/db/pocketbase_client.dart';

final _log = Logger('PocketPub');

/// Initialize PocketBase client with admin credentials
Future<PocketBase> initPocketBase(
  String url,
  String adminEmail,
  String adminPassword,
) async {
  final client = PocketBase(url);

  try {
    _log.info('Authenticating with PocketBase as admin');
    await client.admins.authWithPassword(adminEmail, adminPassword);

    _log.info('Initializing required collections');
    await initializeCollections(client);

    return client;
  } catch (e) {
    _log.severe('Failed to initialize PocketBase: $e');
    rethrow;
  }
}

/// Create the pub API handler
///
/// The pocketbaseClient parameter can be null when in development mode,
/// in which case mock data will be returned for all endpoints.
Handler createPubApi(dynamic pocketbaseClient, String storageDir) {
  final router = Router();

  if (pocketbaseClient == null) {
    _log.warning(
        'Creating PubAPI without PocketBase client (development mode)');
    _log.warning('All endpoints will return mock data');
  }

  // API endpoints as per the spec

  // List all versions of a package
  router.get('/api/packages/<package>', (Request request, String package) {
    return handleListPackageVersions(
        request, package, pocketbaseClient, storageDir);
  });

  // Get publishing URL
  router.get('/api/packages/versions/new', (Request request) {
    return handleNewVersion(request, pocketbaseClient, storageDir);
  });

  // Package upload handler
  router.post('/api/packages/upload', (Request request) {
    return handlePackageUpload(request, pocketbaseClient, storageDir);
  });

  // Package upload completion
  router.get('/api/packages/upload/<uploadId>',
      (Request request, String uploadId) {
    return handleUploadComplete(
        request, uploadId, pocketbaseClient, storageDir);
  });

  // Security advisories
  router.get('/api/packages/<package>/advisories',
      (Request request, String package) {
    return handleAdvisories(request, package, pocketbaseClient);
  });

  // Deprecated but needed for compatibility
  router.get('/api/packages/<package>/versions/<version>',
      (Request request, String package, String version) {
    return handlePackageVersion(
        request, package, version, pocketbaseClient, storageDir);
  });

  // Package download
  router.get('/packages/<package>/versions/<version>.tar.gz',
      (Request request, String package, String version) {
    return handleDownloadPackage(
        request, package, version, pocketbaseClient, storageDir);
  });

  // Apply middleware
  final handler = Pipeline()
      .addMiddleware(logRequests())
      .addMiddleware(corsMiddleware())
      .addMiddleware(authenticationMiddleware(pocketbaseClient))
      .addHandler(router);

  return handler;
}
