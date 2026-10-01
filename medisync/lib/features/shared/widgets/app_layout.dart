import 'package:flutter/material.dart';
import 'package:medisync/features/shared/widgets/sidebar.dart';

class AppLayout extends StatefulWidget {
  final Widget child;

  const AppLayout({super.key, required this.child});

  @override
  State<AppLayout> createState() => _AppLayoutState();
}

class _AppLayoutState extends State<AppLayout> {
  bool isSidebarOpen = false;

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width > 768;

    return Scaffold(
      body: Stack(
        children: [
          Row(
            children: [
              if (isDesktop || isSidebarOpen)
                const AppSidebar(),
              Expanded(
                child: Column(
                  children: [
                    // Mock Navbar
                    AppBar(
                      leading: !isDesktop 
                        ? IconButton(icon: const Icon(Icons.menu), onPressed: () => setState(() => isSidebarOpen = !isSidebarOpen))
                        : null,
                      title: const Text('MediSync'),
                      elevation: 0,
                      backgroundColor: Colors.transparent,
                    ),
                    Expanded(child: widget.child),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
