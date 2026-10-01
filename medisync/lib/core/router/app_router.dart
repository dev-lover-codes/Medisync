import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:medisync/core/providers/auth_provider.dart';

import 'package:medisync/features/landing/landing_page.dart';
import 'package:medisync/features/auth/login_page.dart';
import 'package:medisync/features/shared/widgets/app_layout.dart';
import 'package:medisync/features/patient/dashboard_page.dart';

final appRouterProvider = Provider<GoRouter>((ref) {

  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const LandingPage(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      ShellRoute(
        builder: (context, state, child) {
          return AppLayout(child: child);
        },
        routes: [
          GoRoute(
            path: '/patient/dashboard',
            builder: (context, state) => const PatientDashboardPage(),
          ),
          // TODO: Map out remaining routes (Appointments, Prescriptions, Admin, Doctor)
          GoRoute(
            path: '/placeholder',
            builder: (context, state) => const Center(child: Text("Page under construction")),
          ),
        ],
      ),
    ],
    redirect: (context, state) {
      // Very basic auth guard (will expand later)
      final isAuthenticated = ref.read(currentUserProvider) != null;
      
      if (!isAuthenticated && state.uri.path.startsWith('/patient')) {
        return '/login';
      }
      return null;
    },
  );
});
