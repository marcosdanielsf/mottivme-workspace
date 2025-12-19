import 'dart:convert';

import 'package:logging/logging.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:shelf/shelf.dart';

final _log = Logger('Middleware');

/// Middleware for handling CORS
Middleware corsMiddleware() {
  return (Handler innerHandler) {
    return (Request request) async {
      // Handle OPTIONS requests
      if (request.method == 'OPTIONS') {
        return Response.ok(
          '',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers':
                'Origin, Content-Type, Accept, Authorization',
            'Access-Control-Max-Age': '86400', // 24 hours
          },
        );
      }

      // Handle actual requests
      final response = await innerHandler(request);
      return response.change(headers: {
        ...response.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
            'Origin, Content-Type, Accept, Authorization',
      });
    };
  };
}

/// Middleware for handling authentication
Middleware authenticationMiddleware(dynamic pocketbaseClient) {
  return (Handler innerHandler) {
    return (Request request) async {
      // Extract token from Authorization header if present
      final authHeader = request.headers['authorization'];
      if (authHeader != null && authHeader.startsWith('Bearer ')) {
        final token = authHeader.substring(7);

        try {
          // Using dynamic PocketBase client to handle the case when it's null in development mode
          Map<String, dynamic> authResult;

          if (pocketbaseClient == null) {
            // In development mode without PocketBase, accept any token
            _log.warning('Dev mode: Accepting token without validation');
            authResult = {
              'token': token,
              'user': {'id': 'dev_user_id'},
            };
          } else {
            // In production mode, validate token with PocketBase
            // Here we would query the tokens collection to validate
            // For now, we'll just accept any token
            authResult = {
              'token': token,
              'user': {'id': 'user_id'},
            };
          }

          // Create a new request with auth result in context
          final newRequest = request.change(
            context: {...request.context, 'authResult': authResult},
          );

          return innerHandler(newRequest);
        } catch (e) {
          // Invalid token
          _log.warning('Invalid token: $e');
          return Response(
            401,
            headers: {
              'WWW-Authenticate':
                  'Bearer realm="pub", message="Invalid or expired token"',
              'content-type': 'application/vnd.pub.v2+json',
            },
            body: jsonEncode({
              'error': {
                'code': 'invalid_token',
                'message': 'Invalid or expired token',
              },
            }),
          );
        }
      }

      // No authentication provided, proceed without auth context
      return innerHandler(request);
    };
  };
}
