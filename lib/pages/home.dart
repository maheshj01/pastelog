import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pastelog/constants/constants.dart';
import 'package:pastelog/main.dart';
import 'package:pastelog/models/log_model.dart';
import 'package:pastelog/pages/logs_history.dart';
import 'package:pastelog/services/api_service.dart';
import 'package:pastelog/services/text_service.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/extensions.dart';
import 'package:pastelog/utils/navigator.dart';
import 'package:pastelog/utils/utility.dart';
import 'package:pastelog/widgets/LogField.dart';
import 'package:pastelog/widgets/date_picker.dart';
import 'package:pastelog/widgets/footer.dart';
import 'package:pastelog/widgets/gradientButton.dart';
import 'package:pastelog/widgets/import.dart';
import 'package:pastelog/widgets/titlebar.dart';
import 'package:uuid/uuid.dart';

class HomePage extends ConsumerStatefulWidget {
  final LogModel? log;
  const HomePage({super.key, this.log});

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage>
    with SingleTickerProviderStateMixin {
  String generateUuid() {
    var uuid = const Uuid();
    return uuid.v1();
  }

  late AnimationController iconController;
  late String uuid;

  LogModel logs = LogModel(
    id: '',
    title: '',
    data: '',
    type: LogType.text,
    createdDate: DateTime.now(),
    expiryDate: null,
  );

  final TextEditingController controller = TextEditingController();
  final TextEditingController titleController = TextEditingController();
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
                final domain = Uri.base.host;
                if (url.contains(domain)) {
                  final model = await _contentUploadStrategy.fetchLogById(id);
                  text = model.data;
                } else if (url.contains('gist.github.com')) {
                  text = await _contentUploadStrategy.getGist(gistId(url));
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
    // stopCircularIndicator(context);
  }

  String gistId(String url) {
    final String id = url.split('/').last;
    return id;
  }

  @override
  void dispose() {
    controller.dispose();
    iconController.dispose();
    titleController.dispose();
    _isLoading.dispose();
    super.dispose();
  }

  final ContentUploadStrategy _contentUploadStrategy = ContentUploadStrategy(
    TextApiServiceImpl(),
  );
  final ValueNotifier<bool> _isLoading = ValueNotifier<bool>(false);

  @override
  void initState() {
    super.initState();
    iconController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 500));
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.log != null) {
        logs = widget.log!;
        controller.text = logs.data;
        titleController.text = logs.title;
        expiryDate = logs.expiryDate;
      }
    });
  }

  void _openEndDrawer() {
    _scaffoldKey.currentState!.openEndDrawer();
  }

  void _closeEndDrawer() {
    Navigator.of(context).pop();
  }

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Widget animatedIcon() {
    return GestureDetector(
      onTap: () {
        if (iconController.isCompleted) {
          iconController.reverse();
          _closeEndDrawer();
        } else {
          iconController.forward();
          _openEndDrawer();
        }
      },
      child: AnimatedIcon(
          icon: AnimatedIcons.menu_close, progress: iconController),
    );
  }

  bool isPreview = false;
  bool isMarkdown = false;
  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(settingsNotifierProvider).isDark;
    final size = MediaQuery.of(context).size;
    final settings = ref.watch(settingsNotifierProvider.notifier);
    return Scaffold(
        key: _scaffoldKey,
        onEndDrawerChanged: (open) {
          if (!open) {
            iconController.reverse();
          }
        },
        endDrawer: LogsHistory(
          controller: iconController,
        ),
        appBar: TitleBar(
          title: appTitle,
          onTap: () {
            context.go('/');
          },
          actions: [
            IconButton(
                onPressed: () {
                  settings.setTheme(isDark ? ThemeMode.light : ThemeMode.dark);
                },
                icon: Icon(!isDark ? Icons.dark_mode : Icons.sunny)),
            20.0.hSpacer(),
            animatedIcon(),
            20.0.hSpacer()
          ],
        ),
        floatingActionButton: FloatingActionButton(
          tooltip: 'Import Logs',
          onPressed: () async {
            // showCircularIndicator(context);
            showImportDialog();
          },
          child: const Icon(Icons.file_upload),
        ),
        body: SingleChildScrollView(
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
                  Padding(
                    padding: 8.0.horizontalPadding,
                    child: LogInputField(
                      maxLines: 1,
                      minLines: 1,
                      controller: titleController,
                      hint: 'Description of the log (optional)',
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.all(8),
                    width: double.infinity,
                    decoration: BoxDecoration(
                        border: Border.all(
                            width: 2, color: Theme.of(context).dividerColor),
                        borderRadius: BorderRadius.circular(12)),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Align(
                              alignment: Alignment.centerLeft,
                              child: ToggleButtons(
                                borderRadius: const BorderRadius.only(
                                  topLeft: Radius.circular(12),
                                ),
                                onPressed: (i) {
                                  setState(() {
                                    isPreview = i == 1;
                                  });
                                },
                                isSelected: [!isPreview, isPreview],
                                children: [
                                  Padding(
                                    padding: 24.0.horizontalPadding,
                                    child: const Text('Edit'),
                                  ),
                                  Padding(
                                    padding: 24.0.horizontalPadding,
                                    child: const Text('Preview'),
                                  ),
                                ],
                              ),
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                const Text('Markdown'),
                                16.0.hSpacer(),
                                CupertinoSwitch(
                                    value: isMarkdown,
                                    onChanged: (x) {
                                      setState(() {
                                        isMarkdown = x;
                                      });
                                    }),
                              ],
                            )
                          ],
                        ),
                        ConstrainedBox(
                          constraints:
                              BoxConstraints(maxHeight: size.height * 0.8),
                          child: AnimatedSwitcher(
                            duration: const Duration(milliseconds: 300),
                            child: LogInputField(
                                controller: controller,
                                isMarkDown: isPreview && isMarkdown,
                                isReadOnly: isPreview,
                                data: controller.text,
                                hint: hint),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    height: 150,
                    alignment: Alignment.center,
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            ExpiryDateSelector(
                              value: expiryDate,
                              onExpirySet: (expiry) {
                                setState(() {
                                  expiryDate = expiry;
                                });
                              },
                            ),
                            const SizedBox(
                              width: 50,
                            ),
                            ValueListenableBuilder<bool>(
                                valueListenable: _isLoading,
                                builder: (BuildContext context, bool isLoading,
                                    Widget? child) {
                                  return GradientButton(
                                    isLoading: isLoading,
                                    onPressed: () async {
                                      if (_isLoading.value) {
                                        return;
                                      }
                                      if (controller.text.isEmpty) {
                                        showMessage(context, logsEmptyMessage);
                                        return;
                                      }
                                      _isLoading.value = true;
                                      uuid = generateUuid();
                                      final log = LogModel(
                                        id: uuid,
                                        title: titleController.text.trim(),
                                        type: LogType.text,
                                        isMarkDown: isMarkdown,
                                        data: controller.text,
                                        expiryDate: expiryDate,
                                        createdDate: DateTime.now(),
                                      );
                                      await _contentUploadStrategy.addLog(log);
                                      settings.addLog(log);
                                      controller.clear();
                                      titleController.clear();
                                      _isLoading.value = false;
                                      context.push('/logs/$uuid', extra: log);
                                    },
                                    text: 'Publish',
                                  );
                                }),
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
