import 'package:flutter/material.dart';
import 'package:flutter_template/themes/themes.dart';
import 'package:go_router/go_router.dart';

class ErrorPage extends StatelessWidget {
  final String errorMessage;
  const ErrorPage({Key? key, this.errorMessage = "Error 404 not found"})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    print('object');
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '$errorMessage',
              style: AppTheme.textTheme.headline4,
            ),
            const SizedBox(
              height: 20,
            ),
            TextButton(
                child: const Text('Go Home'), onPressed: () => context.go('/')),
          ],
        ),
      ),
    );
  }
}
