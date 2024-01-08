import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pastelog/exports.dart';
import 'package:pastelog/main.dart';
import 'package:pastelog/models/log_model.dart';
import 'package:pastelog/pages/error.dart';
import 'package:pastelog/services/api_service.dart';
import 'package:pastelog/services/text_service.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/extensions.dart';
import 'package:pastelog/utils/navigator.dart';
import 'package:pastelog/utils/utility.dart';
import 'package:pastelog/widgets/LogField.dart';
import 'package:pastelog/widgets/footer.dart';
import 'package:pastelog/widgets/titlebar.dart';
import 'package:pastelog/widgets/widgets.dart';
import 'package:uuid/uuid.dart';

class LogsPage extends ConsumerStatefulWidget {
  final String? id;

  const LogsPage({Key? key, this.id}) : super(key: key);

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _LogsPageState();
}

class _LogsPageState extends ConsumerState<LogsPage> {
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
        logs = await _strategy.fetchLogById(uuid);
      }
      return logs;
    } catch (_) {
      throw 'Logs Not found';
    }
  }

  LogModel logs = LogModel(
      type: LogType.text,
      title: '',
      id: '',
      data: '',
      expiryDate: null,
      createdDate: DateTime.now());
  final ContentUploadStrategy _strategy =
      ContentUploadStrategy(TextApiServiceImpl());
  final TextEditingController controller = TextEditingController();
  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(settingsNotifierProvider).isDark;
    final size = MediaQuery.of(context).size;
    return Scaffold(
        appBar: TitleBar(
          title: appTitle,
          onTap: () {
            context.push('/');
          },
        ),
        body: FutureBuilder<LogModel?>(
            future: fetchLogs(),
            builder: (BuildContext context, AsyncSnapshot<LogModel?> snapshot) {
              if (snapshot.hasError) {
                return const ErrorPage();
              } else if (snapshot.data == null) {
                return Container(
                  decoration: isDark
                      ? null
                      : const BoxDecoration(
                          gradient: AppTheme.gradient,
                        ),
                  child: const LoadingWidget(),
                );
              } else {
                final log = snapshot.data;
                return SingleChildScrollView(
                  child: Container(
                    decoration: isDark
                        ? null
                        : const BoxDecoration(
                            gradient: AppTheme.gradient,
                          ),
                    alignment: Alignment.center,
                    child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 1024),
                        child: Column(
                          children: [
                            const SizedBox(
                              height: 16,
                            ),
                            LogPublishDetails(logModel: log!),
                            log.title.isNotEmpty
                                ? Container(
                                    alignment: Alignment.centerLeft,
                                    padding: const EdgeInsets.all(16),
                                    child: Text(
                                      log.title,
                                      style: Theme.of(context)
                                          .textTheme
                                          .headlineMedium,
                                    ),
                                  )
                                : const SizedBox.shrink(),
                            ConstrainedBox(
                              constraints:
                                  BoxConstraints(maxHeight: size.height * 0.8),
                              child: LogInputField(
                                controller: controller,
                                data: snapshot.data!.data,
                                isReadOnly: true,
                              ),
                            ),
                            Container(
                              height: 100,
                              alignment: Alignment.center,
                              padding: const EdgeInsets.all(16),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  LogButton(
                                    onTap: () {
                                      saveTextFile(
                                          controller.text, 'logs.text');
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
                                                  url: Uri.base.toString());
                                            });
                                      },
                                      iconData: Icons.share,
                                      label: 'Share'),
                                ],
                              ),
                            ),
                            const SizedBox(
                              height: 200,
                            ),
                            const Footer()
                          ],
                        )),
                  ),
                );
              }
            }));
  }
}

class LogPublishDetails extends StatelessWidget {
  final LogModel logModel;

  const LogPublishDetails({Key? key, required this.logModel}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final String creationDate = logModel.createdDate!.formatDate();
    DateTime? expiryDate = logModel.expiryDate;
    return Align(
      alignment: Alignment.centerLeft,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            RichText(
                text: TextSpan(children: [
              TextSpan(
                  style: Theme.of(context).textTheme.titleSmall,
                  text: "Created:"),
              creationDate == "Today"
                  ? TextSpan(
                      style: Theme.of(context).textTheme.titleLarge,
                      text: "Today")
                  : TextSpan(text: "on $creationDate")
            ])),
            const SizedBox(
              height: 16,
            ),
            RichText(
                text: TextSpan(children: [
              expiryDate == null
                  ? TextSpan(
                      children: [
                        TextSpan(
                          text: "Expiry Date:",
                          style: Theme.of(context).textTheme.titleSmall,
                        ),
                        TextSpan(
                            style: Theme.of(context).textTheme.titleLarge,
                            text: 'This log will last forever 😉')
                      ],
                    )
                  : TextSpan(
                      children: [
                        TextSpan(
                            style: Theme.of(context).textTheme.titleSmall,
                            text: "Expires:"),
                        TextSpan(
                            style: Theme.of(context).textTheme.titleLarge,
                            text: expiryDate.formatDate() == "Today"
                                ? "Today"
                                : "on ${expiryDate.formatDate()}"),
                      ],
                    ),
            ])),
          ],
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
              style: AppTheme.textTheme.headlineMedium,
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
                            style: AppTheme.textTheme.titleMedium!
                                .copyWith(color: AppTheme.themeTextColor),
                          ))),
                  IconButton(
                      onPressed: () async {
                        await Clipboard.setData(
                            ClipboardData(text: widget.url));
                        showMessage(context, " copied to clipboard!");
                        popView(context);
                      },
                      icon: Icon(
                        Icons.copy,
                        color: AppTheme.themeTextColor,
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
              style: AppTheme.textTheme.bodyMedium!,
            ),
            SizedBox(
              width: iconData != null ? 8 : 0,
            ),
            iconData != null
                ? Icon(
                    iconData,
                    size: 16,
                  )
                : const SizedBox.shrink(),
          ],
        ));
  }
}
