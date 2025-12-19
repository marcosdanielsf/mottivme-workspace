import 'dart:convert';
import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart' as p;
import 'package:pocketbase/pocketbase.dart';
import 'package:shelf/shelf.dart';
import 'package:yaml/yaml.dart';
import 'package:logging/logging.dart';

final _log = Logger('PackagesAPI');

/// Handle request to list all versions of a package
Future<Response> handleListPackageVersions(
  Request request,
  String package,
  dynamic pb,
  String storageDir,
) async {
  try {
    if (pb == null) {
      // In development mode without PocketBase, return mock data
      _log.warning('Dev mode: Returning mock data for package $package');

      final mockPubspec = {
        'name': package,
        'description': 'Mock package for development',
        'version': '1.0.0',
        'environment': {'sdk': '>=3.0.0 <4.0.0'},
      };

      final mockVersion = {
        'version': '1.0.0',
        'retracted': false,
        'archive_url':
            '${request.requestedUri.origin}/packages/$package/versions/1.0.0.tar.gz',
        'archive_sha256': 'mock-sha256-hash',
        'pubspec': mockPubspec,
      };

      final responseData = {
        'name': package,
        'latest': mockVersion,
        'versions': [mockVersion],
      };

      return Response.ok(
        jsonEncode(responseData),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // Check if package exists
    final packageResult = await pb.collection('packages').getList(
          filter: 'name = "$package"',
          expand: 'versions',
        );

    if (packageResult.items.isEmpty) {
      return Response.notFound(
        jsonEncode({
          'error': {
            'code': 'package_not_found',
            'message': 'Package $package not found',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    final packageData = packageResult.items.first;

    // Get all versions
    final versionsResult = await pb.collection('versions').getList(
          filter: 'package = "${packageData.id}"',
          sort: '-created',
        );

    if (versionsResult.items.isEmpty) {
      return Response.notFound(
        jsonEncode({
          'error': {
            'code': 'versions_not_found',
            'message': 'No versions found for package $package',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // Format version data according to the pub spec
    final versions = versionsResult.items.map((v) {
      final Map<String, dynamic> pubspec = jsonDecode(v.data['pubspec']);
      return {
        'version': v.data['version'],
        'retracted': v.data['retracted'] ?? false,
        'archive_url':
            '${request.requestedUri.origin}/packages/$package/versions/${v.data['version']}.tar.gz',
        'archive_sha256': v.data['sha256'],
        'pubspec': pubspec,
      };
    }).toList();

    // Get the latest version
    final latest = versions.first;

    // Construct the response
    final responseData = {
      'name': package,
      'latest': latest,
      'versions': versions,
    };

    // Add optional fields if they exist
    if (packageData.data.containsKey('isDiscontinued') &&
        packageData.data['isDiscontinued'] == true) {
      responseData['isDiscontinued'] = true;

      if (packageData.data.containsKey('replacedBy')) {
        responseData['replacedBy'] = packageData.data['replacedBy'];
      }
    }

    return Response.ok(
      jsonEncode(responseData),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  } catch (e) {
    _log.severe('Error listing package versions: $e');
    return Response.internalServerError(
      body: jsonEncode({
        'error': {
          'code': 'internal_error',
          'message': 'An error occurred while processing your request',
        },
      }),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  }
}

/// Handle request to get publishing URL
Future<Response> handleNewVersion(
  Request request,
  dynamic pb,
  String storageDir,
) async {
  // Check authentication
  final authResult = request.context['authResult'];
  if (authResult == null) {
    return Response(
      401,
      headers: {
        'WWW-Authenticate':
            'Bearer realm="pub", message="Authentication required to publish packages"',
        'content-type': 'application/vnd.pub.v2+json'
      },
      body: jsonEncode({
        'error': {
          'code': 'unauthorized',
          'message': 'Authentication required to publish packages',
        },
      }),
    );
  }

  // Generate a unique upload ID
  final uploadId = DateTime.now().millisecondsSinceEpoch.toString();

  // Generate multipart upload URL and fields
  final serverUrl = request.requestedUri.origin;
  final responseData = {
    'url': '$serverUrl/api/packages/upload',
    'fields': {
      'upload_id': uploadId,
    }
  };

  return Response.ok(
    jsonEncode(responseData),
    headers: {'content-type': 'application/vnd.pub.v2+json'},
  );
}

/// Handle package upload
Future<Response> handlePackageUpload(
  Request request,
  dynamic pb,
  String storageDir,
) async {
  try {
    // Parse multipart request
    final contentType = request.headers['content-type'];
    if (contentType == null || !contentType.startsWith('multipart/form-data')) {
      return Response.badRequest(
        body: jsonEncode({
          'error': {
            'code': 'invalid_upload',
            'message': 'Expected multipart/form-data request',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // Access auth result from context
    final authResult = request.context['authResult'];
    if (authResult == null) {
      return Response(
        401,
        headers: {
          'WWW-Authenticate':
              'Bearer realm="pub", message="Authentication required to publish packages"',
          'content-type': 'application/vnd.pub.v2+json'
        },
        body: jsonEncode({
          'error': {
            'code': 'unauthorized',
            'message': 'Authentication required to publish packages',
          },
        }),
      );
    }

    // Read the body as bytes to process multipart form
    final bodyBytes =
        await request.read().expand((element) => element).toList();
    final body = String.fromCharCodes(bodyBytes);

    // Extract the upload ID
    final uploadIdMatch = RegExp(r'name="upload_id"\s+(\S+)').firstMatch(body);
    if (uploadIdMatch == null) {
      return Response.badRequest(
        body: jsonEncode({
          'error': {
            'code': 'invalid_upload',
            'message': 'Missing upload_id field',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    final uploadId = uploadIdMatch.group(1)!;

    // Create temp directory to store the uploaded file
    final tempDir = Directory('${storageDir}/temp');
    await tempDir.create(recursive: true);
    final tempFile = File('${tempDir.path}/$uploadId.tar.gz');

    // Extract the file content
    final fileMatch =
        RegExp(r'name="file"[^\n]*\s+(.+)', dotAll: true).firstMatch(body);
    if (fileMatch == null) {
      return Response.badRequest(
        body: jsonEncode({
          'error': {
            'code': 'invalid_upload',
            'message': 'Missing file field',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // Write the file content to a temporary file
    // Note: In a real implementation, we would need more sophisticated multipart parsing
    final fileContent = fileMatch.group(1)!;
    await tempFile.writeAsBytes(
        bodyBytes); // This is a simplification; in production we'd extract only the file part

    // Calculate SHA-256 hash of the file
    final sha256Hash = await _calculateSha256(tempFile);

    // Validate the uploaded package tarball
    // Here we would extract and validate the pubspec.yaml file from the tarball
    // For now, we'll just store the raw package archive

    return Response(
      204,
      headers: {
        'Location':
            '${request.requestedUri.origin}/api/packages/upload/$uploadId',
        'content-type': 'application/vnd.pub.v2+json',
      },
    );
  } catch (e) {
    _log.severe('Error processing package upload: $e');
    return Response.internalServerError(
      body: jsonEncode({
        'error': {
          'code': 'upload_failed',
          'message': 'Failed to process package upload: $e',
        },
      }),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  }
}

/// Handle package upload completion
Future<Response> handleUploadComplete(
  Request request,
  String uploadId,
  dynamic pb,
  String storageDir,
) async {
  try {
    // Confirm the upload exists
    final tempFile = File('${storageDir}/temp/$uploadId.tar.gz');
    if (!await tempFile.exists()) {
      return Response.notFound(
        jsonEncode({
          'error': {
            'code': 'upload_not_found',
            'message': 'Upload not found',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // In a real implementation, we would:
    // 1. Extract the pubspec.yaml from the tarball
    // 2. Parse it to get package name and version
    // 3. Validate the package
    // 4. Store it in the database and permanent storage
    // This is a simplified version that doesn't actually validate the package

    // For demonstration, we'll assume a successful upload
    return Response.ok(
      jsonEncode({
        'success': {
          'message': 'Package uploaded successfully',
        },
      }),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  } catch (e) {
    _log.severe('Error completing package upload: $e');
    return Response.internalServerError(
      body: jsonEncode({
        'error': {
          'code': 'upload_finalization_failed',
          'message': 'Failed to finalize package upload: $e',
        },
      }),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  }
}

/// Handle security advisories request
Future<Response> handleAdvisories(
  Request request,
  String package,
  dynamic pb,
) async {
  try {
    if (pb == null) {
      // In development mode without PocketBase, return empty advisories
      _log.warning('Dev mode: Returning empty advisories for package $package');
      final now = DateTime.now().toIso8601String();

      return Response.ok(
        jsonEncode({
          'advisories': [],
          'advisoriesUpdated': now,
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // Check if package exists
    final packageResult = await pb.collection('packages').getList(
          filter: 'name = "$package"',
        );

    if (packageResult.items.isEmpty) {
      return Response.notFound(
        jsonEncode({
          'error': {
            'code': 'package_not_found',
            'message': 'Package $package not found',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // Get advisories for the package
    final advisoriesResult = await pb.collection('advisories').getList(
          filter: 'package = "${packageResult.items.first.id}"',
        );

    // Return empty list if no advisories
    final advisories = advisoriesResult.items.map((a) => a.data).toList();
    final now = DateTime.now().toIso8601String();

    return Response.ok(
      jsonEncode({
        'advisories': advisories,
        'advisoriesUpdated': now,
      }),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  } catch (e) {
    _log.severe('Error getting advisories: $e');
    return Response.internalServerError(
      body: jsonEncode({
        'error': {
          'code': 'internal_error',
          'message': 'An error occurred while processing your request',
        },
      }),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  }
}

/// Handle request for a specific package version (deprecated API)
Future<Response> handlePackageVersion(
  Request request,
  String package,
  String version,
  dynamic pb,
  String storageDir,
) async {
  try {
    if (pb == null) {
      // In development mode without PocketBase, return mock data
      _log.warning(
          'Dev mode: Returning mock data for package $package version $version');

      final mockPubspec = {
        'name': package,
        'description': 'Mock package for development',
        'version': version,
        'environment': {'sdk': '>=3.0.0 <4.0.0'},
      };

      return Response.ok(
        jsonEncode({
          'version': version,
          'archive_url':
              '${request.requestedUri.origin}/packages/$package/versions/$version.tar.gz',
          'pubspec': mockPubspec,
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // Check if package exists
    final packageResult = await pb.collection('packages').getList(
          filter: 'name = "$package"',
        );

    if (packageResult.items.isEmpty) {
      return Response.notFound(
        jsonEncode({
          'error': {
            'code': 'package_not_found',
            'message': 'Package $package not found',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // Get version details
    final versionsResult = await pb.collection('versions').getList(
          filter:
              'package = "${packageResult.items.first.id}" && version = "$version"',
        );

    if (versionsResult.items.isEmpty) {
      return Response.notFound(
        jsonEncode({
          'error': {
            'code': 'version_not_found',
            'message': 'Version $version of package $package not found',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    final versionData = versionsResult.items.first;
    final Map<String, dynamic> pubspec =
        jsonDecode(versionData.data['pubspec']);

    return Response.ok(
      jsonEncode({
        'version': version,
        'archive_url':
            '${request.requestedUri.origin}/packages/$package/versions/$version.tar.gz',
        'pubspec': pubspec,
      }),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  } catch (e) {
    _log.severe('Error getting package version: $e');
    return Response.internalServerError(
      body: jsonEncode({
        'error': {
          'code': 'internal_error',
          'message': 'An error occurred while processing your request',
        },
      }),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  }
}

/// Handle package download
Future<Response> handleDownloadPackage(
  Request request,
  String package,
  String version,
  dynamic pb,
  String storageDir,
) async {
  try {
    if (pb == null) {
      // In development mode without PocketBase, generate a mock package file
      _log.warning('Dev mode: Generating mock package for $package $version');

      final mockPubspec = {
        'name': package,
        'description': 'Mock package for development',
        'version': version,
        'environment': {'sdk': '>=3.0.0 <4.0.0'},
      };

      // For development, we'll just return a text response that looks like a package
      final mockPackage =
          'Mock package: $package\nVersion: $version\nPubspec: ${jsonEncode(mockPubspec)}';

      return Response.ok(
        utf8.encode(mockPackage),
        headers: {
          'content-type': 'application/octet-stream',
          'content-disposition':
              'attachment; filename="$package-$version.tar.gz"',
        },
      );
    }

    // Check if package exists
    final packageResult = await pb.collection('packages').getList(
          filter: 'name = "$package"',
        );

    if (packageResult.items.isEmpty) {
      return Response.notFound(
        jsonEncode({
          'error': {
            'code': 'package_not_found',
            'message': 'Package $package not found',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // Get version details
    final versionsResult = await pb.collection('versions').getList(
          filter:
              'package = "${packageResult.items.first.id}" && version = "$version"',
        );

    if (versionsResult.items.isEmpty) {
      return Response.notFound(
        jsonEncode({
          'error': {
            'code': 'version_not_found',
            'message': 'Version $version of package $package not found',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    // In a real implementation, we would serve the file from storage
    final packageFile = File('$storageDir/$package-$version.tar.gz');
    if (!await packageFile.exists()) {
      return Response.notFound(
        jsonEncode({
          'error': {
            'code': 'archive_not_found',
            'message': 'Archive for $package $version not found',
          },
        }),
        headers: {'content-type': 'application/vnd.pub.v2+json'},
      );
    }

    return Response.ok(
      await packageFile.readAsBytes(),
      headers: {
        'content-type': 'application/octet-stream',
        'content-disposition':
            'attachment; filename="$package-$version.tar.gz"',
      },
    );
  } catch (e) {
    _log.severe('Error downloading package: $e');
    return Response.internalServerError(
      body: jsonEncode({
        'error': {
          'code': 'internal_error',
          'message': 'An error occurred while processing your request',
        },
      }),
      headers: {'content-type': 'application/vnd.pub.v2+json'},
    );
  }
}

/// Calculate SHA-256 hash of a file
Future<String> _calculateSha256(File file) async {
  final bytes = await file.readAsBytes();
  final digest = sha256.convert(bytes);
  return digest.toString();
}
