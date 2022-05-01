import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_template/exports.dart';
import 'package:flutter_template/main.dart';
import 'package:flutter_template/models/log_model.dart';
import 'package:flutter_template/pages/home.dart';
import 'package:flutter_template/services/database.dart';
import 'package:flutter_template/themes/themes.dart';
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
    if (logs.data.isEmpty) {
      logs = await DataBaseService.fetchLogById(uuid);
    }
    return logs;
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
                return snapshot.data == null
                    ? LoadingWidget()
                    : Column(
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
                                          await Clipboard.setData(ClipboardData(
                                              text: controller.text));
                                          showMessage(
                                              context, " copied to clipboard!");
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
              }),
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
