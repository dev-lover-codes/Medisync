# Medisync Flutter App

This is the Flutter implementation of the Medisync healthcare application.

## Prerequisites

- Flutter SDK (Installed via `.idx/dev.nix`)
- Supabase project

## Getting Started

1.  **Initialize dependencies**:
    ```bash
    flutter pub get
    ```

2.  **Configure Supabase**:
    Update `lib/main.dart` with your Supabase URL and Anon Key.

3.  **Run the app**:
    - For Web:
      ```bash
      flutter run -d chrome
      ```
    - For Android/iOS (if configured in IDX):
      ```bash
      flutter run
      ```

## Project Structure

- `lib/src/features`: Functional modules of the app.
- `lib/src/shared`: Common widgets and logic.
- `lib/src/routing`: Navigation logic.
- `lib/src/services`: API and external service integrations (e.g., Supabase).
- `lib/src/utils`: Constants and helper functions.
