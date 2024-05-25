import 'package:flutter/material.dart';

class LoadingWidget extends StatelessWidget {
  final Color? color;
  final double width;
  const LoadingWidget({super.key, this.color, this.width = 4.0});

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

Widget hLine({Color? color, double height = 0.4}) {
  return Container(
    height: height,
    color: color ?? Colors.grey.withOpacity(0.5),
  );
}

Widget vLine({Color? color, double width = 0.4, double height = 0.0}) {
  return Container(
    width: width,
    height: height,
    color: color ?? Colors.grey.withOpacity(0.5),
  );
}
