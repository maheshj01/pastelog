import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_template/main.dart';
import 'package:flutter_template/utils/settings_service.dart';
import 'package:go_router/go_router.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _toggleTheme() {
    if (Settings.getTheme == ThemeMode.dark) {
      Settings.setTheme(ThemeMode.light);
    } else {
      Settings.setTheme(ThemeMode.dark);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: ListView.builder(
            itemCount: 50,
            itemBuilder: (BuildContext context, int id) {
              return Card(
                child: SizedBox(
                  height: 100,
                  child: ListTile(
                    title: Center(child: Text('item $id')),
                    onTap: () {
                      context.go('/product/$id');
                      // goTo(context, '/detail/$y');
                    },
                  ),
                ),
              );
            }),
        floatingActionButton: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            FloatingActionButton(
              onPressed: _toggleTheme,
              tooltip: 'Increment',
              child: const Icon(Icons.dark_mode),
            ),
            const SizedBox(width: 10),
            FloatingActionButton(
              heroTag: 'something',
              onPressed: () async {
                GoRouter.of(context).go('/login');
              },
              tooltip: 'Navigate',
              child: const Icon(Icons.navigate_next),
            ),
          ],
        ));
  }
}
