import 'package:logging/logging.dart';
import 'package:pocketbase/pocketbase.dart';

final _log = Logger('PocketBaseClient');

/// Initialize PocketBase collections needed for the pub server
Future<void> initializeCollections(PocketBase pb) async {
  _log.info('Initializing PocketBase collections');

  try {
    // Check if collections exist and create them if needed
    await _ensurePackagesCollection(pb);
    await _ensureVersionsCollection(pb);
    await _ensureAdvisoriesCollection(pb);
    await _ensureTokensCollection(pb);

    _log.info('Collections initialized successfully');
  } catch (e) {
    _log.severe('Failed to initialize collections: $e');
    rethrow;
  }
}

/// Ensure the packages collection exists
Future<void> _ensurePackagesCollection(PocketBase pb) async {
  const collectionName = 'packages';

  try {
    // Check if collection exists
    await pb.collections.getOne(collectionName);
    _log.info('Packages collection already exists');
  } catch (e) {
    // Create collection
    _log.info('Creating packages collection');

    final collectionData = {
      'name': collectionName,
      'type': 'base',
      'schema': [
        {
          'name': 'name',
          'type': 'text',
          'required': true,
          'options': {
            'min': 1,
            'max': 100,
          },
        },
        {
          'name': 'description',
          'type': 'text',
          'required': false,
        },
        {
          'name': 'isDiscontinued',
          'type': 'bool',
          'required': false,
          'default': false,
        },
        {
          'name': 'replacedBy',
          'type': 'text',
          'required': false,
        },
        {
          'name': 'repository',
          'type': 'url',
          'required': false,
        },
        {
          'name': 'homepage',
          'type': 'url',
          'required': false,
        },
      ],
    };

    await pb.collections.create(body: collectionData);

    // Create index for package name (for faster lookups)
    final indexData = {
      'name': 'name_unique',
      'type': 'unique',
      'options': {
        'fields': ['name'],
      },
    };

    await pb.send('/api/collections/$collectionName/indexes',
        method: 'POST', body: indexData);
  }
}

/// Ensure the versions collection exists
Future<void> _ensureVersionsCollection(PocketBase pb) async {
  const collectionName = 'versions';

  try {
    // Check if collection exists
    await pb.collections.getOne(collectionName);
    _log.info('Versions collection already exists');
  } catch (e) {
    // Create collection
    _log.info('Creating versions collection');

    final collectionData = {
      'name': collectionName,
      'type': 'base',
      'schema': [
        {
          'name': 'package',
          'type': 'relation',
          'required': true,
          'options': {
            'collectionId': 'packages',
            'cascadeDelete': true,
          },
        },
        {
          'name': 'version',
          'type': 'text',
          'required': true,
        },
        {
          'name': 'pubspec',
          'type': 'json',
          'required': true,
        },
        {
          'name': 'sha256',
          'type': 'text',
          'required': true,
        },
        {
          'name': 'retracted',
          'type': 'bool',
          'required': false,
          'default': false,
        },
        {
          'name': 'published',
          'type': 'date',
          'required': true,
        },
      ],
    };

    await pb.collections.create(body: collectionData);

    // Create index for package+version (for uniqueness)
    final indexData = {
      'name': 'package_version_unique',
      'type': 'unique',
      'options': {
        'fields': ['package', 'version'],
      },
    };

    await pb.send('/api/collections/$collectionName/indexes',
        method: 'POST', body: indexData);
  }
}

/// Ensure the security advisories collection exists
Future<void> _ensureAdvisoriesCollection(PocketBase pb) async {
  const collectionName = 'advisories';

  try {
    // Check if collection exists
    await pb.collections.getOne(collectionName);
    _log.info('Advisories collection already exists');
  } catch (e) {
    // Create collection
    _log.info('Creating advisories collection');

    final collectionData = {
      'name': collectionName,
      'type': 'base',
      'schema': [
        {
          'name': 'package',
          'type': 'relation',
          'required': true,
          'options': {
            'collectionId': 'packages',
            'cascadeDelete': true,
          },
        },
        {
          'name': 'id',
          'type': 'text',
          'required': true,
        },
        {
          'name': 'details',
          'type': 'json',
          'required': true,
        },
        {
          'name': 'affected_versions',
          'type': 'json',
          'required': true,
        },
        {
          'name': 'pub_display_url',
          'type': 'url',
          'required': false,
        },
        {
          'name': 'published',
          'type': 'date',
          'required': true,
        },
        {
          'name': 'modified',
          'type': 'date',
          'required': true,
        },
      ],
    };

    await pb.collections.create(body: collectionData);
  }
}

/// Ensure the tokens collection exists
Future<void> _ensureTokensCollection(PocketBase pb) async {
  const collectionName = 'tokens';

  try {
    // Check if collection exists
    await pb.collections.getOne(collectionName);
    _log.info('Tokens collection already exists');
  } catch (e) {
    // Create collection
    _log.info('Creating tokens collection');

    final collectionData = {
      'name': collectionName,
      'type': 'base',
      'schema': [
        {
          'name': 'token',
          'type': 'text',
          'required': true,
        },
        {
          'name': 'user',
          'type': 'relation',
          'required': true,
          'options': {
            'collectionId': '_pb_users_auth_',
            'cascadeDelete': true,
          },
        },
        {
          'name': 'name',
          'type': 'text',
          'required': false,
        },
        {
          'name': 'expires',
          'type': 'date',
          'required': false,
        },
        {
          'name': 'lastUsed',
          'type': 'date',
          'required': false,
        },
      ],
    };

    await pb.collections.create(body: collectionData);

    // Create index for token uniqueness
    final indexData = {
      'name': 'token_unique',
      'type': 'unique',
      'options': {
        'fields': ['token'],
      },
    };

    await pb.send('/api/collections/$collectionName/indexes',
        method: 'POST', body: indexData);
  }
}
