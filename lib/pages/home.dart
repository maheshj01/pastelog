import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:pastelog/constants/constants.dart';
import 'package:pastelog/main.dart';
import 'package:pastelog/models/log_model.dart';
import 'package:pastelog/services/api_service.dart';
import 'package:pastelog/services/text_service.dart';
import 'package:pastelog/themes/themes.dart';
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
  const HomePage({super.key});

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  String generateUuid() {
    var uuid = const Uuid();
    return uuid.v1();
  }

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
    _isLoading.dispose();
    super.dispose();
  }

  final ContentUploadStrategy _contentUploadStrategy = ContentUploadStrategy(
    TextApiServiceImpl(),
  );
  final ValueNotifier<bool> _isLoading = ValueNotifier<bool>(false);
  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(settingsNotifierProvider).isDark;
    final size = MediaQuery.of(context).size;
    return Scaffold(
        appBar: TitleBar(
          title: appTitle,
          onTap: () {
            context.go('/');
          },
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
                  ConstrainedBox(
                    constraints: BoxConstraints(maxHeight: size.height * 0.8),
                    child: LogInputField(
                      controller: controller,
                      data: logs.data,
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
                                        title: '',
                                        type: LogType.text,
                                        data: controller.text,
                                        expiryDate: expiryDate,
                                        createdDate: DateTime.now(),
                                      );
                                      await _contentUploadStrategy.addLog(log);
                                      controller.clear();
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
