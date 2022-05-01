import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_template/constants/strings.dart';
import 'package:flutter_template/pages/error.dart';
import 'package:flutter_template/pages/home.dart';
import 'package:flutter_template/pages/log_detail.dart';
import 'package:flutter_template/themes/themes.dart';
import 'package:flutter_template/utils/firebase_options.dart';
import 'package:flutter_template/utils/settings_service.dart';
import 'package:flutter_template/utils/utility.dart';
import 'package:go_router/go_router.dart';

Future<void> main() async {
  GoRouter.setUrlPathStrategy(UrlPathStrategy.path);
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
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
            debugShowCheckedModeBanner: kDebugMode,
            supportedLocales: const [
              Locale('en', ''), // English, no country code
            ],
            theme: AppTheme.lightThemeData,
            darkTheme: AppTheme.darkThemeData,
            themeMode: Settings.getTheme,
            routeInformationParser: _router.routeInformationParser,
            routerDelegate: _router.routerDelegate,
          );
        });
  }

  final _router = GoRouter(
    navigatorBuilder:
        (BuildContext context, GoRouterState state, Widget widget) {
      if (state.location == '/') return widget;
      return Overlay(
        initialEntries: [
          OverlayEntry(
            builder: (context) => LogsPage(
              id: state.location,
              // log: log,
            ),
          )
        ],
      );
    },
    errorBuilder: (context, error) {
      return ErrorPage(
        errorMessage: 'Error: $error',
      );
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
        RichText(
            text: const TextSpan(
                // style: TextStyle(color: Colors.black),
                text: 'Your file is available at ')),
        TextButton(
            onPressed: () => widget.onTap(),
            child: Text(
              widget.url,
              style: AppTheme.textTheme.bodyText2!
                  .copyWith(color: Colors.blueAccent),
            )),
      ],
    );
  }
}

class LogBuilder extends StatefulWidget {
  String? data;
  final TextEditingController? controller;
  bool isReadOnly;
  LogBuilder({Key? key, this.controller, this.data, this.isReadOnly = false})
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
  String hint =
      '''Publish your logs to the cloud,\nAnd access them from anywhere via a unique link.

      \nNo Sign in required!''';
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          margin: const EdgeInsets.all(8),
          width: double.infinity,
          decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(12)),
          child: widget.isReadOnly
              ? SingleChildScrollView(child: SelectableText(widget.data!))
              : TextField(
                  cursorHeight: 20,
                  controller: controller,
                  decoration: InputDecoration(
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
                      color: Colors.black,
                    )))
            : const SizedBox.shrink(),
      ],
    );
  }
}
