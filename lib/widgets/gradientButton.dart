import 'package:flutter/material.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/widgets/widgets.dart';

class GradientButton extends StatefulWidget {
  final Widget? child;
  final String? text;
  final Function()? onPressed;
  final bool isLoading;
  final Gradient? gradient;

  const GradientButton(
      {super.key,
      this.text,
      this.child,
      this.gradient,
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
      clipBehavior:
          Clip.antiAlias, // Buttons don't clip their child by default.
      style: ElevatedButton.styleFrom(
        padding:
            EdgeInsets.zero, // So that the gradient fills the entire button.
        maximumSize: const Size(120, 45),
        minimumSize: const Size(120, 45),
      ),
      child: SizedBox.expand(
          child: Ink(
              decoration: BoxDecoration(
                gradient: widget.gradient ?? AppTheme.gradient,
              ),
              child: Center(
                child: AnimatedCrossFade(
                    duration: const Duration(milliseconds: 600),
                    firstChild: widget.child ??
                        Text(widget.text!,
                            style: const TextStyle(fontSize: 20)),
                    secondChild: const Padding(
                      padding: EdgeInsets.all(1.0),
                      child: LoadingWidget(
                        width: 2.5,
                      ),
                    ),
                    crossFadeState: widget.isLoading
                        ? CrossFadeState.showSecond
                        : CrossFadeState.showFirst),
              ))),
    );
  }
}
