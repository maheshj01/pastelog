import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:go_router/go_router.dart';
import 'package:pastelog/constants/strings.dart';
import 'package:pastelog/pages/error.dart';
import 'package:pastelog/pages/home.dart';
import 'package:pastelog/pages/log_detail.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/firebase_options.dart';
import 'package:pastelog/utils/settings_service.dart';
import 'package:pastelog/utils/utility.dart';

Future<void> main() async {
  usePathUrlStrategy();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  Settings.init();
  runApp(App());
}

class App extends StatelessWidget {
  App({Key? key}) : super(key: key);
  static const title = 'PasteLog Web';
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
        animation: Settings(),
        builder: (BuildContext context, Widget? child) {
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
            themeMode: Settings.getTheme,
            routeInformationParser: _router.routeInformationParser,
            routerDelegate: _router.routerDelegate,
          );
        });
  }

  final _router = GoRouter(
    errorBuilder: (context, error) {
      return const ErrorPage();
    },
    routes: [
      GoRoute(
        path: '/',
        pageBuilder: (context, state) {
          return CustomTransitionPage<void>(
            key: state.pageKey,
            child: const HomePage(),
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
}

class UrlBuilder extends StatefulWidget {
  final String url;
  final Function onTap;

  const UrlBuilder({Key? key, required this.url, required this.onTap})
      : super(key: key);

  @override
  State<UrlBuilder> createState() => _UrlBuilderState();
}

class _UrlBuilderState extends State<UrlBuilder> {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        RichText(text: const TextSpan(text: 'Your file is available at ')),
        TextButton(
            onPressed: () => widget.onTap(),
            child: Text(
              widget.url,
              style: AppTheme.textTheme.bodyMedium!
                  .copyWith(color: Colors.blueAccent),
            )),
      ],
    );
  }
}

class LogBuilder extends StatefulWidget {
  final String? data;
  final TextEditingController? controller;
  final bool isReadOnly;
  const LogBuilder(
      {Key? key, this.controller, this.data, this.isReadOnly = false})
      : super(key: key);

  @override
  State<LogBuilder> createState() => _LogBuilderState();
}

class _LogBuilderState extends State<LogBuilder> {
  @override
  void initState() {
    super.initState();
    controller = widget.controller ?? TextEditingController();
    controller.text = widget.data ?? '';
  }

  late final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          margin: const EdgeInsets.all(8),
          width: double.infinity,
          decoration: BoxDecoration(
              color: AppTheme.colorScheme.surface,
              borderRadius: BorderRadius.circular(12)),
          child: TextField(
            cursorHeight: 20,
            controller: controller,
            readOnly: widget.isReadOnly,
            style: AppTheme.textTheme.titleMedium!
                .copyWith(color: AppTheme.themeTextColor),
            decoration: InputDecoration(
              hintStyle: AppTheme.textTheme.titleMedium!.copyWith(
                  color:
                      AppTheme.isDark ? Colors.grey : AppTheme.themeTextColor),
              border: InputBorder.none,
              focusedBorder: InputBorder.none,
              enabledBorder: InputBorder.none,
              disabledBorder: InputBorder.none,
              errorBorder: InputBorder.none,
              hintText: hint,
            ),
            minLines: 20,
            maxLines: 40,
          ),
        ),
        widget.isReadOnly
            ? Positioned(
                right: 10,
                top: 6,
                child: IconButton(
                    onPressed: () async {
                      await Clipboard.setData(
                          ClipboardData(text: controller.text));
                      showMessage(context, " copied to clipboard!");
                    },
                    icon: const Icon(
                      Icons.copy,
                    )))
            : const SizedBox.shrink(),
      ],
    );
  }
}
