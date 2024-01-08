import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:rive/rive.dart';

class ErrorPage extends StatefulWidget {
  final String errorMessage;
  const ErrorPage({Key? key, this.errorMessage = "Logs not found"})
      : super(key: key);

  @override
  State<ErrorPage> createState() => _ErrorPageState();
}

class _ErrorPageState extends State<ErrorPage> {
  RiveAnimationController _controller = OneShotAnimation('Animation 1');

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              height: size.height * 0.6,
              child: RiveAnimation.asset(
                'assets/error.riv',
                fit: BoxFit.fitHeight,
                controllers: [_controller],
              ),
            ),
            // Text(
            //   '404',
            //   textAlign: TextAlign.center,
            //   style: AppTheme.textTheme.displayLarge,
            // ),
            const SizedBox(
              height: 12,
            ),
            Text(
              widget.errorMessage,
              textAlign: TextAlign.center,
              style: AppTheme.textTheme.headlineMedium,
            ),
            const SizedBox(
              height: 32,
            ),
            TextButton(
                style: ButtonStyle(
                  maximumSize: MaterialStateProperty.all(const Size(150, 54)),
                  minimumSize: MaterialStateProperty.all(const Size(150, 54)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Go Home'),
                    SizedBox(
                      width: 8,
                    ),
                    Icon(Icons.home)
                  ],
                ),
                onPressed: () => context.push('/')),
          ],
        ),
      ),
    );
  }
}
