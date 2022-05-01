import 'package:flutter/material.dart';
import 'package:flutter_template/main.dart';
import 'package:flutter_template/models/log_model.dart';
import 'package:flutter_template/services/database.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  String generateUuid() {
    var uuid = Uuid();
    return uuid.v1();
  }

  late String uuid;

  LogModel logs = LogModel(
    id: '',
    data: '',
    expiryDate: null,
  );

  final TextEditingController controller = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(
      children: [
        Expanded(
            child: LogBuilder(
          controller: controller,
          data: logs.data,
        )),
        Container(
          height: 200,
          alignment: Alignment.center,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  ElevatedButton(
                      onPressed: () async {
                        uuid = generateUuid();
                        final log = LogModel(
                          id: uuid,
                          data: controller.text,
                          expiryDate: DateTime.now(),
                        );
                        await DataBaseService.addLog(log);
                        context.push('/$uuid', extra: log);
                      },
                      child: const Text('Submit')),
                  const SizedBox(
                    width: 40,
                  )
                ],
              ),
            ],
          ),
        ),
      ],
    ));
  }
}
