import 'package:flutter/material.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/widgets/widgets.dart';

class GradientButton extends StatefulWidget {
  final Widget? child;
  final String? text;
  final Function()? onPressed;
  final bool isLoading;
  const GradientButton(
      {super.key,
      this.text,
      this.child,
      this.isLoading = false,
      this.onPressed})
      : assert(text != null || child != null);

  @override
  State<GradientButton> createState() => _GradientButtonState();
}

class _GradientButtonState extends State<GradientButton> {
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
        onPressed: widget.onPressed,
        style: ButtonStyle(
            minimumSize: MaterialStateProperty.resolveWith(
                (states) => const Size(120, 45))),
        child: AnimatedCrossFade(
            duration: const Duration(milliseconds: 600),
            firstChild: widget.child ??
                Text(
                  widget.text!,
                  style: AppTheme.textTheme.bodyMedium!,
                ),
            secondChild: const Padding(
              padding: EdgeInsets.all(1.0),
              child: LoadingWidget(
                width: 2.5,
              ),
            ),
            crossFadeState: widget.isLoading
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst));
  }
}
