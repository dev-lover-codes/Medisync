import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:medisync/core/providers/auth_provider.dart';
import 'package:medisync/core/theme/app_theme.dart';

class AppSidebar extends ConsumerWidget {
  const AppSidebar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userRole = ref.watch(userRoleProvider);

    return Container(
      width: 280,
      color: AppTheme.surface,
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppTheme.primary,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(Icons.medical_services, color: Colors.white),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('MediSync', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
                  Text('CLINICAL NETWORK V2.0', style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: AppTheme.onSurfaceVariant.withOpacity(0.5))),
                ],
              )
            ],
          ),
          const SizedBox(height: 32),
          // User Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.surfaceContainerLow,
              borderRadius: BorderRadius.circular(32),
            ),
            child: Column(
              children: [
                const CircleAvatar(
                  radius: 40,
                  backgroundImage: NetworkImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAwfI3BpPZZmY1N3tcehtrjKSKIf1Xkkkpi9jZJyB-W3q6gR2bPOw-CMgIA1uz24qxl3V-5zoz2z_T-WCp90dSrqHm9DheCqZDTkItCwPUnzbFexOXFJ16XllIY2zXsrZnGSaxHn2JQ5fQPoTIrEmC32PcXnfTsBby7Lw9YcRIw-xeNafycMF21Hf_22S5Rj-k8XQlFUEIlEzPFTy9SfYiOkH2ffa0f88nUFanmaIKQC9tPsqfvulYeUHoIOFhEYLVEQ5abLwD6cQw'),
                ),
                const SizedBox(height: 16),
                Text('User Profile', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900)),
                Text(userRole.value?.toUpperCase() ?? 'PATIENT', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.primary)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: ListView(
              children: [
                _NavItem(icon: Icons.dashboard, label: 'Dashboard', to: '/patient/dashboard'),
                _NavItem(icon: Icons.calendar_month, label: 'Appointments', to: '/placeholder'),
                _NavItem(icon: Icons.history, label: 'History', to: '/placeholder'),
                _NavItem(icon: Icons.medical_information, label: 'Prescriptions', to: '/placeholder'),
                _NavItem(icon: Icons.payments, label: 'Bills', to: '/placeholder'),
                _NavItem(icon: Icons.psychology, label: 'AI Checker', to: '/placeholder'),
                _NavItem(icon: Icons.settings, label: 'Settings', to: '/placeholder'),
              ],
            ),
          ),
          TextButton.icon(
            onPressed: () async {
              await ref.read(supabaseProvider).auth.signOut();
              if (context.mounted) context.go('/login');
            },
            icon: const Icon(Icons.logout, color: Colors.red),
            label: const Text('TERMINAL OUTPUT', style: TextStyle(color: Colors.red, fontWeight: FontWeight.w900, fontSize: 10)),
          )
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String to;

  const _NavItem({required this.icon, required this.label, required this.to});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.onSurfaceVariant.withOpacity(0.5)),
      title: Text(label.toUpperCase(), style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
      onTap: () => context.go(to),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      hoverColor: AppTheme.surfaceContainerLow,
    );
  }
}
