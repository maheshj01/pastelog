import 'dart:html' as html;
import 'dart:js' as js;

void save(Object bytes, String fileName) {
  js.context.callMethod("saveAs", <Object>[
    html.Blob(<Object>[bytes]),
    fileName
  ]);
}
