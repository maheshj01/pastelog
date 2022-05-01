import 'dart:html' as html;
import 'dart:js' as js;

import 'package:flutter/material.dart';

void save(Object bytes, String fileName) {
  js.context.callMethod("saveAs", <Object>[
    html.Blob(<Object>[bytes]),
    fileName
  ]);
}

void showMessage(BuildContext context, String message,
    {Duration duration = const Duration(seconds: 2),
    bool isRoot = false,
    void Function()? onPressed,
    void Function()? onClosed}) {
  ScaffoldMessenger.of(context)
      .showSnackBar(
        SnackBar(
          content: Text(message),
          duration: duration,
          action: onPressed == null
              ? null
              : SnackBarAction(
                  label: 'ACTION',
                  onPressed: onPressed,
                ),
        ),
      )
      .closed
      .whenComplete(() => onClosed == null ? null : onClosed());
}
