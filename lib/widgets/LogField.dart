import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pastelog/constants/strings.dart';
import 'package:pastelog/main.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/utility.dart';

class LogInputField extends ConsumerStatefulWidget {
  final String? data;
  final TextEditingController? controller;
  final bool isReadOnly;
  const LogInputField(
      {Key? key, this.controller, this.data, this.isReadOnly = false})
      : super(key: key);

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _LogInputFieldState();
}

class _LogInputFieldState extends ConsumerState<LogInputField> {
  @override
  void initState() {
    super.initState();
    controller = widget.controller ?? TextEditingController();
    controller.text = widget.data ?? '';
  }

  late final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(settingsNotifierProvider).isDark;
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Stack(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          margin: const EdgeInsets.all(8),
          width: double.infinity,
          decoration: BoxDecoration(
              border:
                  Border.all(color: isDark ? colorScheme.surface : Colors.grey),
              color: isDark ? colorScheme.surface : null,
              borderRadius: BorderRadius.circular(12)),
          child: TextField(
            cursorHeight: 20,
            controller: controller,
            readOnly: widget.isReadOnly,
            style: textTheme.titleMedium!,
            decoration: InputDecoration(
              hintStyle: textTheme.titleMedium!.copyWith(
                  color: isDark ? Colors.grey : AppTheme.themeTextColor),
              border: InputBorder.none,
              focusedBorder: InputBorder.none,
              enabledBorder: InputBorder.none,
              disabledBorder: InputBorder.none,
              errorBorder: InputBorder.none,
              hintText: hint,
            ),
            minLines: 20,
            maxLines: 40,
          ),
        ),
        widget.isReadOnly
            ? Positioned(
                right: 10,
                top: 6,
                child: IconButton(
                    onPressed: () async {
                      await Clipboard.setData(
                          ClipboardData(text: controller.text));
                      showMessage(context, " copied to clipboard!");
                    },
                    icon: const Icon(
                      Icons.copy,
                    )))
            : const SizedBox.shrink(),
      ],
    );
  }
}
