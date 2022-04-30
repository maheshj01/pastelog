import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_template/constants/strings.dart';
import 'package:flutter_template/models/log_model.dart';
import 'package:flutter_template/pages/themes/themes.dart';
import 'package:flutter_template/utils/settings_service.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

Future<void> main() async {
  GoRouter.setUrlPathStrategy(UrlPathStrategy.path);
  // SharedPreferences prefs = await SharedPreferences.getInstance();
  // initScreen = prefs.getString("initScreen") ?? '00';
  print('initScreen ${initScreen}');
  runApp(App());
}

String initScreen = '00';

class App extends StatelessWidget {
  App({Key? key}) : super(key: key);
  static const title = 'GoRouter Example: Custom Transitions';
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
            // home: const MyHomePage(title: 'Flutter Template'),
            routeInformationParser: _router.routeInformationParser,
            routerDelegate: _router.routerDelegate,
          );
        });
  }

  final _router = GoRouter(
    navigatorBuilder:
        (BuildContext context, GoRouterState state, Widget widget) {
      if (state.location == '/') return widget;
      return LogsPage(
        id: state.location,
        isReadMode: true,
        // log: log,
      );
    },
    errorBuilder: (context, error) {
      // final Log log = error.extra as Log;
      return Scaffold(
        body: Center(
          child: Text(
            'Error: ${error}',
            style: Theme.of(context).textTheme.headline4,
          ),
        ),
      );
    },
    routes: [
      GoRoute(
        path: '/',
        pageBuilder: (context, state) {
          return CustomTransitionPage<void>(
            key: state.pageKey,
            child: LogsPage(
              id: state.location,
            ),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) =>
                    FadeTransition(opacity: animation, child: child),
          );
        },
      ),
    ],
  );
}

class LogsPage extends StatefulWidget {
  final String? id;
  final bool isReadMode;

  const LogsPage({Key? key, this.id, this.isReadMode = false})
      : super(key: key);

  @override
  State<LogsPage> createState() => _LogsPageState();
}

class _LogsPageState extends State<LogsPage> {
  Future<void> updateCounter() async {
    counter++;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("initScreen", 'item$counter');
  }

  int counter = 0;
  String generateUuid() {
    var uuid = Uuid();
    return uuid.v1();
  }

  late String uuid;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    uuid = widget.id ?? '';
  }

  Future<LogModel?> fetchLogs() async {
    final model = LogModel(
      id: uuid,
      data: 'Logs',
      expiryDate: DateTime.now(),
    );
    // Future<LogModel>.delayed(
    //     uuid.isEmpty ? Duration.zero : const Duration(seconds: 3), () => model);
    return Future.value(model);
  }

  final TextEditingController controller = TextEditingController();
  @override
  Widget build(BuildContext context) {
    final Widget child = Column(
      children: [
        Expanded(
            child: Container(
          padding: EdgeInsets.all(8),
          margin: EdgeInsets.all(8),
          decoration: BoxDecoration(
              color: Colors.grey, borderRadius: BorderRadius.circular(12)),
          child: TextField(
            cursorHeight: 20,
            controller: controller,
            decoration: const InputDecoration(
              border: InputBorder.none,
              focusedBorder: InputBorder.none,
              enabledBorder: InputBorder.none,
              disabledBorder: InputBorder.none,
              errorBorder: InputBorder.none,
              hintText: 'Enter text',
            ),
            maxLines: 100,
          ),
        )),
        Container(
          height: 200,
          alignment: Alignment.center,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  ElevatedButton(
                      onPressed: () {
                        setState(() {
                          uuid = generateUuid();
                          initScreen = uuid;
                        });
                      },
                      child: const Text('Submit')),
                  const SizedBox(
                    width: 40,
                  ),
                  ElevatedButton(
                      onPressed: () {}, child: const Text('Download')),
                  const SizedBox(
                    width: 40,
                  )
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  RichText(
                      text: const TextSpan(
                          style: TextStyle(color: Colors.white),
                          text: 'Your file is available at ',
                          children: [])),
                  TextButton(
                      onPressed: () {
                        final log = LogModel(
                            id: uuid,
                            data: controller.text,
                            expiryDate: DateTime.now());
                        context.push('/$uuid', extra: log);
                      },
                      child: Text(
                        'http://localhost:30550/#/$uuid',
                        style: AppTheme.textTheme.bodyText2!
                            .copyWith(color: Colors.blueAccent),
                      )),
                ],
              ),
            ],
          ),
        ),
      ],
    );
    return Scaffold(
      body: !widget.isReadMode
          ? child
          : FutureBuilder<LogModel?>(
              future: fetchLogs(),
              builder:
                  (BuildContext context, AsyncSnapshot<LogModel?> snapshot) {
                return snapshot.data == null
                    ? Center(
                        child: Text(
                        'Loading...',
                        style: Theme.of(context).textTheme.headline4,
                      ))
                    : child;
              }),
    );
  }
}
