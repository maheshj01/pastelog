import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pastelog/main.dart';
import 'package:pastelog/utils/extensions.dart';

class LogsHistory extends ConsumerStatefulWidget {
  AnimationController? controller;
  LogsHistory({Key? key, this.controller}) : super(key: key);

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _LogsHistoryState();
}

class _LogsHistoryState extends ConsumerState<LogsHistory> {
  @override
  Widget build(BuildContext context) {
    final logs = ref.watch(settingsNotifierProvider).logs;
    return Drawer(
      shape: 0.0.rounded,
      child: Column(
        children: [
          Container(
            padding: 16.0.allPadding,
            margin: EdgeInsets.zero,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Logs History',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                GestureDetector(
                  onTap: () {
                    Navigator.of(context).pop();
                  },
                  child: AnimatedIcon(
                    icon: AnimatedIcons.menu_close,
                    progress: widget.controller!,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: logs.isEmpty
                ? const Center(child: Text('No logs yet'))
                : ListView.builder(
                    padding: EdgeInsets.zero,
                    itemCount: logs.length,
                    itemBuilder: (context, index) {
                      final log = logs[index];
                      int length =
                          log.title.length > 25 ? 25 : log.title.length;
                      final title = log.title.isEmpty
                          ? 'Log ${log.id}'
                          : log.title.substring(0, length) + '...';
                      return ListTile(
                        title: Text('$title'),
                        subtitle: Text(
                          log.createdDate!.standardDateTime(),
                          style: const TextStyle(fontSize: 12),
                        ),
                        onTap: () {
                          context.push('/logs/${log.id}');
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
