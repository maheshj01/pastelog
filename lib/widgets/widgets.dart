import 'package:flutter/material.dart';

class LoadingWidget extends StatelessWidget {
  final Color? color;
  final double width;
  const LoadingWidget({Key? key, this.color, this.width = 4.0})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
        child: CircularProgressIndicator(
            strokeWidth: width,
            valueColor: AlwaysStoppedAnimation<Color>(
              color ?? Theme.of(context).colorScheme.primary,
            )));
  }
}

void removeFocus(BuildContext context) => FocusScope.of(context).unfocus();

void showCircularIndicator(BuildContext context, {Color? color}) {
  showDialog<void>(
      barrierColor: color,
      context: context,
      barrierDismissible: false,
      builder: (x) => const LoadingWidget());
}

void stopCircularIndicator(BuildContext context) {
  Navigator.of(context).pop();
}
