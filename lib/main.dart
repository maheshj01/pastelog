import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:go_router/go_router.dart';
import 'package:pastelog/constants/strings.dart';
import 'package:pastelog/models/log_model.dart';
import 'package:pastelog/pages/error.dart';
import 'package:pastelog/pages/home.dart';
import 'package:pastelog/pages/log_detail.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/firebase_options.dart';
import 'package:pastelog/utils/settings_notifier.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  usePathUrlStrategy();
  final sharedPrefs = await SharedPreferences.getInstance();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(
    ProviderScope(
      overrides: [
        sharedPreferences.overrideWithValue(sharedPrefs),
      ],
      child: App(),
    ),
  );
}

final sharedPreferences =
    Provider<SharedPreferences>((_) => throw UnimplementedError());

final settingsNotifierProvider =
    StateNotifierProvider<SettingsNotifier, Settings>((ref) {
  final prefs = ref.watch(sharedPreferences);
  return SettingsNotifier(prefs);
});

class App extends ConsumerWidget {
  App({super.key});
  final title = 'PasteLog Web';
  final _router = GoRouter(
    errorBuilder: (context, error) {
      return const ErrorPage();
    },
    routes: [
      GoRoute(
        path: '/',
        pageBuilder: (context, state) {
          LogModel? log = state.extra as LogModel?;
          return CustomTransitionPage<void>(
            key: state.pageKey,
            child: HomePage(
              log: log,
            ),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) =>
                    FadeTransition(opacity: animation, child: child),
          );
        },
      ),
      GoRoute(
        path: '/logs/:id',
        pageBuilder: (context, state) {
          return CustomTransitionPage<void>(
            key: state.pageKey,
            child: LogsPage(id: state.pathParameters['id']),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) =>
                    FadeTransition(opacity: animation, child: child),
          );
        },
      ),
    ],
  );
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bool isDark = ref.watch(settingsNotifierProvider).isDark;

    return MaterialApp.router(
      title: appTitle,
      debugShowCheckedModeBanner: !kDebugMode,
      supportedLocales: const [
        Locale('en', ''), // English, no country code
      ],
      theme: AppTheme.blueThemeData.copyWith(
          scaffoldBackgroundColor: AppTheme.blueColorScheme.background),
      darkTheme: AppTheme.darkThemeData.copyWith(
          scaffoldBackgroundColor: AppTheme.darkColorScheme.background),
      themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
      routeInformationParser: _router.routeInformationParser,
      routerDelegate: _router.routerDelegate,
    );
  }
}
