import 'package:flutter/material.dart';
import 'package:flutter_template/constants/constants.dart';
import 'package:flutter_template/main.dart';
import 'package:flutter_template/models/log_model.dart';
import 'package:flutter_template/services/database.dart';
import 'package:flutter_template/themes/themes.dart';
import 'package:flutter_template/utils/extensions.dart';
import 'package:flutter_template/utils/settings_service.dart';
import 'package:flutter_template/utils/utility.dart';
import 'package:go_router/go_router.dart';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: const TitleBar(
          title: appTitle,
        ),
        body: Align(
          alignment: Alignment.center,
          child: SingleChildScrollView(
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
                                  showMessage(
                                      context, 'Cannot Publish empty logs!');
                                  return;
                                }
                                ;
                                uuid = generateUuid();
                                final log = LogModel(
                                  id: uuid,
                                  data: controller.text,
                                  expiryDate: expiryDate,
                                  createdDate: DateTime.now(),
                                );
                                await DataBaseService.addLog(log);
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
                ],
              ),
            ),
          ),
        ));
  }
}

class TitleBar extends StatefulWidget with PreferredSizeWidget {
  final String title;
  final String? publishDate;
  const TitleBar({Key? key, required this.title, this.publishDate})
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
    return AppBar(
      backgroundColor: Theme.of(context).colorScheme.background,
      automaticallyImplyLeading: false,
      actions: [
        IconButton(
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
          Text(
            appTitle,
            style: Theme.of(context)
                .textTheme
                .headline3!
                .copyWith(color: AppTheme.themeTextColor),
          ),
        ],
      ),
    );
  }
}
