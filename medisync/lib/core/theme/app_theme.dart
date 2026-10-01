import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Tailwind Colors
  static const Color primary = Color(0xFF6f5673);
  static const Color primaryContainer = Color(0xFFbc9ebf);
  static const Color background = Color(0xFFfaf9fa);
  static const Color surface = Color(0xFFfaf9fa);
  static const Color surfaceContainerLow = Color(0xFFf7f2fa);
  static const Color surfaceContainerHigh = Color(0xFFece6f0);
  static const Color onSurface = Color(0xFF1a1c1d);
  static const Color onSurfaceVariant = Color(0xFF49454f);
  static const Color secondaryContainer = Color(0xFFe9d7f1);

  static ThemeData get lightTheme {
    final baseTextTheme = GoogleFonts.interTextTheme();
    final headlineTextTheme = GoogleFonts.manropeTextTheme();

    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: background,
      colorScheme: const ColorScheme.light(
        primary: primary,
        primaryContainer: primaryContainer,
        secondaryContainer: secondaryContainer,
        surface: surface,
        surfaceContainerHighest: surfaceContainerHigh,
        onSurface: onSurface,
        onSurfaceVariant: onSurfaceVariant,
      ),
      textTheme: baseTextTheme.copyWith(
        displayLarge: headlineTextTheme.displayLarge?.copyWith(color: onSurface),
        displayMedium: headlineTextTheme.displayMedium?.copyWith(color: onSurface),
        displaySmall: headlineTextTheme.displaySmall?.copyWith(color: onSurface),
        headlineLarge: headlineTextTheme.headlineLarge?.copyWith(color: onSurface),
        headlineMedium: headlineTextTheme.headlineMedium?.copyWith(color: onSurface),
        headlineSmall: headlineTextTheme.headlineSmall?.copyWith(color: onSurface),
        titleLarge: headlineTextTheme.titleLarge?.copyWith(color: onSurface),
        titleMedium: headlineTextTheme.titleMedium?.copyWith(color: onSurface),
        titleSmall: headlineTextTheme.titleSmall?.copyWith(color: onSurface),
      ),
    );
  }
}
