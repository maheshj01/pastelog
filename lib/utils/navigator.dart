import 'package:flutter/material.dart';

enum SlideTransitionType {
  /// Navigation transition from left to right
  ltr,

  /// Navigation transition from right to left
  rtl,

  /// Navigation transition from top to bottom
  ttb,

  /// Navigation transition from bottom to top
  btt,

  /// Navigation transition from bottom left
  bl,

  /// Navigation transition from bottom right
  br,

  /// Navigation transition from top left
  tl,

  /// Navigation transition from top right
  tr
}

Future<void> navigateReplace(BuildContext context, Widget widget,
        {bool isDialog = false,
        bool isRootNavigator = true,
        SlideTransitionType type = SlideTransitionType.rtl}) async =>
    await Navigator.of(context, rootNavigator: isRootNavigator)
        .pushReplacement(PageRoute(widget, type: type));

/// navigator to push a new route in the Navigator Stack
/// the default transition is right to left which can be changed transition animation
Future<void> navigate(BuildContext context, Widget widget,
        {bool isDialog = false,
        bool isRootNavigator = true,
        SlideTransitionType type = SlideTransitionType.rtl}) =>
    Navigator.of(context, rootNavigator: isRootNavigator)
        .push(PageRoute(widget, type: type));

/// pop all Routes except first
void popToFirst(BuildContext context, {bool isRootNavigator = true}) =>
    Navigator.of(context, rootNavigator: isRootNavigator)
        .popUntil((route) => route.isFirst);

void popView(BuildContext context, {bool isRootNavigator = true}) async =>
    Navigator.of(context, rootNavigator: isRootNavigator).pop();

navigateAndPopAll(BuildContext context, Widget widget,
        {bool isRootNavigator = true}) =>
    Navigator.of(context, rootNavigator: isRootNavigator).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => widget),
        (Route<dynamic> route) => false);

Offset getTransitionOffset(SlideTransitionType type) {
  switch (type) {
    case SlideTransitionType.ltr:
      return const Offset(-1.0, 0.0);
    case SlideTransitionType.rtl:
      return const Offset(1.0, 0.0);
    case SlideTransitionType.ttb:
      return const Offset(0.0, -1.0);
    case SlideTransitionType.btt:
      return const Offset(0.0, 1.0);
    case SlideTransitionType.bl:
      return const Offset(-1.0, 1.0);
    case SlideTransitionType.br:
      return const Offset(1.0, 1.0);
    case SlideTransitionType.tl:
      return const Offset(-1.0, -1.0);
    case SlideTransitionType.tr:
      return const Offset(1.0, 1.0);
    default:
      return const Offset(1.0, 0.0);
  }
}

class PageRoute extends PageRouteBuilder {
  final Widget widget;
  final bool? rootNavigator;
  final SlideTransitionType type;
  PageRoute(this.widget, {this.rootNavigator, required this.type})
      : super(
          pageBuilder: (context, animation, secondaryAnimation) => widget,
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            var begin = getTransitionOffset(type);
            var end = Offset.zero;
            var curve = Curves.ease;
            var tween =
                Tween(begin: begin, end: end).chain(CurveTween(curve: curve));

            return SlideTransition(
              position: animation.drive(tween),
              child: child,
            );
          },
        );
}
