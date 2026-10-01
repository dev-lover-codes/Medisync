import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:medisync/core/router/app_router.dart';
import 'package:medisync/core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: 'https://zvyhmmotpzpsppbdycos.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWhtbW90cHpwc3BwYmR5Y29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNDYyMzEsImV4cCI6MjA5MTgyMjIzMX0.9aL4lWKsP2YId5VUpUOLn-myhWk2VNM8qPL_Symp_Rk',
  );

  runApp(const ProviderScope(child: MediSyncApp()));
}

class MediSyncApp extends ConsumerWidget {
  const MediSyncApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    return MaterialApp.router(
      title: 'MediSync',
      theme: AppTheme.lightTheme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
