import 'package:flutter/material.dart';
import 'package:pastelog/pages/log_detail.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/navigator.dart';

class ImportDialog extends StatefulWidget {
  final Function(String) onImport;
  final Function? onCancel;
  const ImportDialog({Key? key, required this.onImport, this.onCancel})
      : super(key: key);

  @override
  State<ImportDialog> createState() => _ImportDialogState();
}

class _ImportDialogState extends State<ImportDialog> {
  final controller = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Theme.of(context).colorScheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        width: 400,
        padding: const EdgeInsets.symmetric(vertical: 16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Import Logs',
              style: AppTheme.textTheme.headlineMedium,
            ),
            const SizedBox(
              height: 8,
            ),
            Container(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                color: Theme.of(context).colorScheme.surface,
                child: TextField(
                  controller: controller,
                  decoration: const InputDecoration(
                      hintText: 'Enter Pastelog or Github gist url'),
                )),
            const SizedBox(
              height: 12,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                LogButton(
                  onTap: () async {
                    if (widget.onCancel == null) {
                      popView(context);
                      return;
                    }
                    widget.onCancel!();
                  },
                  // iconData: Icons.share,
                  label: 'Cancel',
                ),
                LogButton(
                  onTap: () => widget.onImport(controller.text),
                  // iconData: Icons.share,
                  label: 'Import',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
