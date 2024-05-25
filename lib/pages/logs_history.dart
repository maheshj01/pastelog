import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pastelog/main.dart';
import 'package:pastelog/utils/extensions.dart';
import 'package:pastelog/widgets/widgets.dart';

class LogsHistory extends ConsumerStatefulWidget {
  AnimationController? controller;
  LogsHistory({super.key, this.controller});

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _LogsHistoryState();
}

class _LogsHistoryState extends ConsumerState<LogsHistory> {
  void showClearDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Clear logs'),
          content: const Text('Are you sure you want to clear all logs?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                ref.read(settingsNotifierProvider.notifier).clearLogs();
                Navigator.of(context).pop();
              },
              child: const Text('Clear'),
            ),
          ],
        );
      },
    );
  }

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
                  'History',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                // clear logs
                Row(
                  children: [
                    if (logs.isNotEmpty)
                      InkWell(
                        mouseCursor: WidgetStateMouseCursor.clickable,
                        onTap: () {
                          showClearDialog();
                        },
                        child: const Icon(Icons.delete),
                      ),
                    20.0.hSpacer(),
                    InkWell(
                      mouseCursor: WidgetStateMouseCursor.clickable,
                      onTap: () {
                        Navigator.of(context).pop();
                      },
                      child: AnimatedIcon(
                        icon: AnimatedIcons.menu_close,
                        progress: widget.controller!,
                      ),
                    ),
                  ],
                )
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
                          : '${log.title.substring(0, length)}...';
                      return Column(
                        children: [
                          if (index == 0) hLine(),
                          ListTile(
                            title: Text(title),
                            subtitle: Text(
                              log.createdDate!.standardDateTime(),
                              style: const TextStyle(fontSize: 12),
                            ),
                            onTap: () {
                              context.push('/logs/${log.id}');
                            },
                          ),
                          hLine()
                        ],
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
