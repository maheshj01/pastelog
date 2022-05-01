import 'package:flutter/material.dart';
import 'package:flutter_template/main.dart';
import 'package:flutter_template/models/log_model.dart';
import 'package:flutter_template/services/database.dart';
import 'package:flutter_template/utils/utility.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart';

class LogsPage extends StatefulWidget {
  final String? id;

  const LogsPage({Key? key, this.id}) : super(key: key);

  @override
  State<LogsPage> createState() => _LogsPageState();
}

class _LogsPageState extends State<LogsPage> {
  String generateUuid() {
    var uuid = Uuid();
    return uuid.v1();
  }

  late String uuid;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    print('rebuilding page');
    uuid = widget.id ?? '';
  }

  Future<LogModel> fetchLogs() async {
    print('fetching log from firestore');
    logs = await DataBaseService.fetchLogById(uuid);
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
      body: FutureBuilder<LogModel?>(
          future: fetchLogs(),
          builder: (BuildContext context, AsyncSnapshot<LogModel?> snapshot) {
            return snapshot.data == null
                ? Center(
                    child: Text(
                    'Loading...',
                    style: Theme.of(context).textTheme.headline4,
                  ))
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
                        child: Column(
                          children: [
                            Align(
                              alignment: Alignment.centerRight,
                              child: ElevatedButton(
                                  onPressed: () {
                                    save(controller.text, 'logs.text');
                                  },
                                  child: const Text('Download')),
                            ),
                            UrlBuilder(
                                url: 'http://localhost:30550$uuid',
                                onTap: () {
                                  final log = LogModel(
                                      id: uuid,
                                      data: controller.text,
                                      expiryDate: DateTime.now());
                                  context.push('/$uuid', extra: log);
                                })
                          ],
                        ),
                      ),
                    ],
                  );
          }),
    );
  }
}
