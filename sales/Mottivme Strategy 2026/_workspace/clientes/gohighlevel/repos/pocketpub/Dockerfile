FROM dart:stable AS build

WORKDIR /app

# Copy pubspec files
COPY pubspec.* ./
RUN dart pub get

# Copy the rest of the application
COPY . .

# Ensure dependencies are up-to-date
RUN dart pub get --offline

# Build the server executable
RUN dart compile exe bin/server.dart -o bin/server

# Build a minimal runtime image
FROM debian:bullseye-slim

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create directory for package archives
RUN mkdir -p /app/package_archives/temp

# Copy the executable and necessary directories
COPY --from=build /app/bin/server /app/bin/
COPY --from=build /app/.env* /app/

# Set executable permissions
RUN chmod +x /app/bin/server

# Set the entrypoint
ENTRYPOINT ["/app/bin/server"] 