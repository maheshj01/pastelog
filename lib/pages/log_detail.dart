import 'dart:html';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_template/exports.dart';
import 'package:flutter_template/main.dart';
import 'package:flutter_template/models/log_model.dart';
import 'package:flutter_template/pages/error.dart';
import 'package:flutter_template/pages/home.dart';
import 'package:flutter_template/services/database.dart';
import 'package:flutter_template/themes/themes.dart';
import 'package:flutter_template/utils/navigator.dart';
import 'package:flutter_template/utils/utility.dart';
import 'package:flutter_template/widgets/widgets.dart';
import 'package:uuid/uuid.dart';

class LogsPage extends StatefulWidget {
  final String? id;

  const LogsPage({Key? key, this.id}) : super(key: key);

  @override
  State<LogsPage> createState() => _LogsPageState();
}

class _LogsPageState extends State<LogsPage> {
  String generateUuid() {
    var uuid = const Uuid();
    return uuid.v1();
  }

  late String uuid;

  @override
  void initState() {
    super.initState();
    uuid = widget.id ?? '';
  }

  Future<LogModel> fetchLogs() async {
    /// prevnt  unecessary requestes created on logs tap
    try {
      if (logs.data.isEmpty) {
        logs = await DataBaseService.fetchLogById(uuid);
      }
      return logs;
    } catch (_) {
      throw 'Logs Not found';
    }
  }

  LogModel logs = LogModel(
    id: '',
    data: '',
    expiryDate: null,
  );

  final TextEditingController controller = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const TitleBar(
        title: appTitle,
      ),
      body: Align(
        alignment: Alignment.center,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1024),
          child: FutureBuilder<LogModel?>(
              future: fetchLogs(),
              builder:
                  (BuildContext context, AsyncSnapshot<LogModel?> snapshot) {
                if (snapshot.hasError) {
                  return ErrorPage(errorMessage: snapshot.error.toString());
                } else if (snapshot.data == null) {
                  return const LoadingWidget();
                } else {
                  return Column(
                    children: [
                      Expanded(
                          child: LogBuilder(
                        controller: controller,
                        data: snapshot.data!.data,
                        isReadOnly: true,
                      )),
                      Container(
                        height: 150,
                        alignment: Alignment.center,
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                LogButton(
                                  onTap: () {
                                    save(controller.text, 'logs.text');
                                  },
                                  label: 'Download',
                                ),
                                const SizedBox(
                                  width: 24,
                                ),
                                LogButton(
                                    onTap: () async {
                                      showDialog(
                                          context: context,
                                          builder: (_) {
                                            return ShareDialog(
                                                url: window.location.href);
                                          });
                                    },
                                    iconData: Icons.share,
                                    label: 'Share'),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                }
              }),
        ),
      ),
    );
  }
}

class ShareDialog extends StatefulWidget {
  final String url;
  const ShareDialog({Key? key, required this.url}) : super(key: key);

  @override
  State<ShareDialog> createState() => _ShareDialogState();
}

class _ShareDialogState extends State<ShareDialog> {
  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppTheme.colorScheme.background,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        width: 400,
        padding: const EdgeInsets.symmetric(vertical: 16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Share',
              style: AppTheme.textTheme.headline4,
            ),
            const SizedBox(
              height: 8,
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              color: AppTheme.colorScheme.surface,
              child: Row(
                children: [
                  Expanded(
                      child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: SelectableText(
                            widget.url,
                            style: AppTheme.textTheme.subtitle1!
                                .copyWith(color: Colors.white),
                          ))),
                  IconButton(
                      onPressed: () async {
                        await Clipboard.setData(
                            ClipboardData(text: widget.url));
                        showMessage(context, " copied to clipboard!");
                        popView(context);
                      },
                      icon: const Icon(
                        Icons.copy,
                        color: Colors.white,
                      ))
                ],
              ),
              alignment: Alignment.center,
            ),
            const SizedBox(
              height: 12,
            ),
            Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                LogButton(
                  onTap: () async {
                    popView(context);
                  },
                  // iconData: Icons.share,
                  label: 'Cancel',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class LogButton extends StatelessWidget {
  final String label;
  final Function onTap;
  final IconData? iconData;
  const LogButton(
      {Key? key, required this.label, required this.onTap, this.iconData})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
        style: ButtonStyle(
          minimumSize: MaterialStateProperty.all(const Size(100, 42)),
        ),
        onPressed: () => onTap(),
        child: Row(
          children: [
            Text(
              label,
              style:
                  AppTheme.textTheme.bodyText2!.copyWith(color: Colors.white),
            ),
            SizedBox(
              width: iconData != null ? 8 : 0,
            ),
            iconData != null
                ? Icon(
                    iconData,
                    size: 16,
                    color: Colors.white,
                  )
                : const SizedBox.shrink(),
          ],
        ));
  }
}
