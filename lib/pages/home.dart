import 'package:flutter/material.dart';
import 'package:flutter_template/constants/constants.dart';
import 'package:flutter_template/main.dart';
import 'package:flutter_template/models/log_model.dart';
import 'package:flutter_template/services/database.dart';
import 'package:flutter_template/themes/themes.dart';
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
        appBar: const TitleBar(
          title: appTitle,
        ),
        body: SingleChildScrollView(
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
                        ElevatedButton(
                          onPressed: () async {
                            if (controller.text.isEmpty) return;
                            uuid = generateUuid();
                            final log = LogModel(
                              id: uuid,
                              data: controller.text,
                              expiryDate: DateTime.now(),
                            );
                            await DataBaseService.addLog(log);
                            context.push('/$uuid', extra: log);
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
  // TODO: implement preferredSize
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}

class TitleBarState extends State<TitleBar> {
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppTheme.colorScheme.surface,
      title: Text(
        appTitle,
        style: Theme.of(context)
            .textTheme
            .headline3!
            .copyWith(color: Colors.white),
      ),
    );
  }
}
