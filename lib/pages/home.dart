import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pastelog/constants/constants.dart';
import 'package:pastelog/main.dart';
import 'package:pastelog/models/log_model.dart';
import 'package:pastelog/services/api.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/extensions.dart';
import 'package:pastelog/utils/navigator.dart';
import 'package:pastelog/utils/settings_service.dart';
import 'package:pastelog/utils/utility.dart';
import 'package:go_router/go_router.dart';
import 'package:pastelog/widgets/alert.dart';
import 'package:pastelog/widgets/import.dart';
import 'package:pastelog/widgets/widgets.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:uuid/uuid.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  String generateUuid() {
    var uuid = const Uuid();
    return uuid.v1();
  }

  late String uuid;

  LogModel logs = LogModel(
    id: '',
    data: '',
    createdDate: DateTime.now(),
    expiryDate: null,
  );

  final TextEditingController controller = TextEditingController();
  DateTime? expiryDate;

  Future<void> _selectExpiryDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
        context: context,
        initialDate: DateTime.now(),
        firstDate: DateTime.now(),
        lastDate: DateTime(2025));
    if (picked != null && picked != expiryDate) {
      setState(() {
        expiryDate = picked;
      });
    }
  }

  Future<void> showImportDialog() async {
    String text = '';
    await showDialog(
        context: context,
        builder: (_) {
          return ImportDialog(
            onCancel: () {
              popView(context);
            },
            onImport: (url) async {
              if (url.isEmpty) return;
              try {
                final id = url.split('/').last;
                if (url.contains(hostUrl)) {
                  final model = await ApiService.fetchLogById(id);
                  text = model.data;
                } else if (url.contains('gist.github.com')) {
                  text = await ApiService.getGist(gistId(url));
                }
                controller.text = text;
                popView(context);
                showMessage(context, 'Import successful');
              } catch (_) {
                showMessage(context, 'Failed to fetch logs');
                popView(context);
              }
            },
          );
        });
    stopCircularIndicator(context);
  }

  String gistId(String url) {
    final String id = url.split('/').last;
    return id;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        floatingActionButton: FloatingActionButton(
          tooltip: 'Import Logs',
          onPressed: () async {
            showCircularIndicator(context);
            showImportDialog();
          },
          child: const Icon(Icons.file_upload),
        ),
        appBar: TitleBar(
          title: appTitle,
          onTap: () {
            context.go('/');
          },
        ),
        body: SingleChildScrollView(
          child: Align(
            alignment: Alignment.center,
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 1024),
              child: Column(
                children: [
                  LogBuilder(
                    controller: controller,
                    data: logs.data,
                  ),
                  Container(
                    height: 150,
                    alignment: Alignment.center,
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text(
                              "This Log should Expire",
                              style: Theme.of(context)
                                  .textTheme
                                  .subtitle2!
                                  .copyWith(color: AppTheme.themeTextColor),
                            ),
                            Stack(
                              children: [
                                TextButton(
                                    onPressed: () {
                                      _selectExpiryDate(context);
                                    },
                                    child: Row(
                                      children: [
                                        Text(
                                          expiryDate == null
                                              ? "Never"
                                              : expiryDate!.formatDate(),
                                          style: Theme.of(context)
                                              .textTheme
                                              .headline6!
                                              .copyWith(
                                                  color: AppTheme
                                                      .colorScheme.primary),
                                        ),
                                        const SizedBox(
                                          width: 8,
                                        ),
                                        Icon(Icons.calendar_today,
                                            color: AppTheme.colorScheme.primary,
                                            size: 20),
                                      ],
                                    )),
                                Positioned(
                                    bottom: 0,
                                    left: 4,
                                    right: 2,
                                    child: Container(
                                        height: 2,
                                        width: double.infinity,
                                        color: AppTheme.themeTextColor)),
                              ],
                            ),
                            const SizedBox(
                              width: 50,
                            ),
                            ElevatedButton(
                              onPressed: () async {
                                if (controller.text.isEmpty) {
                                  showMessage(context, logsEmptyMessage);
                                  return;
                                }
                                uuid = generateUuid();
                                final log = LogModel(
                                  id: uuid,
                                  data: controller.text,
                                  expiryDate: expiryDate,
                                  createdDate: DateTime.now(),
                                );
                                await ApiService.addLog(log);
                                context.push('/logs/$uuid', extra: log);
                              },
                              child: Text(
                                'Publish',
                                style: AppTheme.textTheme.bodyText2!
                                    .copyWith(color: Colors.white),
                              ),
                            ),
                            const SizedBox(
                              width: 40,
                            )
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 200,
                  ),
                  const Footer()
                ],
              ),
            ),
          ),
        ));
  }
}

class Footer extends StatelessWidget {
  const Footer({Key? key}) : super(key: key);

  void _openCustomDialog(BuildContext context) {
    showGeneralDialog(
        barrierColor: Colors.black.withOpacity(0.5),
        transitionBuilder: (context, a1, a2, widget) {
          return Transform.scale(
              scale: a1.value,
              child: const AboutPasteLog(
                title: 'About',
              ));
        },
        transitionDuration: const Duration(milliseconds: 300),
        barrierDismissible: true,
        barrierLabel: '',
        context: context,
        pageBuilder: (context, animation1, animation2) {
          return Container();
        });
  }

  Widget linkWidget(String text, Function onTap) {
    return TextButton(
        onPressed: () => onTap(),
        child: Text(
          text,
          style: AppTheme.textTheme.subtitle2!.copyWith(color: Colors.blue),
        ));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        alignment: Alignment.center,
        padding: const EdgeInsets.symmetric(vertical: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Row(
              children: [
                linkWidget('About', () => _openCustomDialog(context)),
                const SizedBox(
                  width: 20,
                ),
                // linkWidget('Privacy Policy', () => launchLink(privacyPolicyUrl)),
                linkWidget(
                    'Source Code', () => launchUrl(Uri.parse(sourceCodeUrl))),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Copyright © 2022 Widget Media Labs ',
                    style: Theme.of(context)
                        .textTheme
                        .bodyText2!
                        .copyWith(color: AppTheme.themeTextColor)),
              ],
            ),
          ],
        ));
  }
}

class TitleBar extends StatefulWidget with PreferredSizeWidget {
  final String title;
  final Function? onTap;
  final bool? hasAction;
  const TitleBar(
      {Key? key, required this.title, this.onTap, this.hasAction = true})
      : super(key: key);

  @override
  State<TitleBar> createState() => TitleBarState();

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class TitleBarState extends State<TitleBar> {
  @override
  Widget build(BuildContext context) {
    final bool isDark = Settings.getTheme == ThemeMode.dark;
    return InkWell(
      onTap: () => widget.onTap!(),
      child: AppBar(
        backgroundColor: Theme.of(context).colorScheme.background,
        automaticallyImplyLeading: false,
        actions: [
          !widget.hasAction!
              ? const SizedBox.shrink()
              : IconButton(
                  onPressed: () {
                    isDark
                        ? Settings.setTheme(ThemeMode.light)
                        : Settings.setTheme(ThemeMode.dark);
                  },
                  icon: Icon(!isDark ? Icons.dark_mode : Icons.sunny))
        ],
        title: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Icon(
              Icons.format_align_left,
              size: 36,
              color: AppTheme.colorScheme.primary,
            ),
            const SizedBox(
              width: 8,
            ),
            Text(appTitle,
                style: GoogleFonts.anticSlab(
                  textStyle: Theme.of(context)
                      .textTheme
                      .headline3!
                      .copyWith(color: AppTheme.colorScheme.primary),
                )),
          ],
        ),
      ),
    );
  }
}
