import 'dart:convert' show utf8;
import 'dart:html' as html;

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

// void save(Object bytes, String fileName) {
//   context.callMethod("saveAs", <Object>[
//     html.Blob(<Object>[bytes]),
//     fileName
//   ]);
// }

void saveTextFile(String text, String filename) {
  html.AnchorElement()
    ..href =
        '${Uri.dataFromString(text, mimeType: 'text/plain', encoding: utf8)}'
    ..download = filename
    ..style.display = 'none'
    ..click();
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

Future<void> launchLink(String url, {bool isNewTab = true}) async {
  await launchUrl(
    Uri.parse(url),
    webOnlyWindowName: isNewTab ? '_blank' : '_self',
  );
}
