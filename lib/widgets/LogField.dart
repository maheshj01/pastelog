import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pastelog/constants/strings.dart';
import 'package:pastelog/main.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/utility.dart';

class LogInputField extends ConsumerStatefulWidget {
  final String? data;
  final TextEditingController? controller;
  final int minLines;
  final int maxLines;
  final bool isReadOnly;
  final String? hint;
  final bool isMarkDown;
  const LogInputField(
      {super.key,
      this.isMarkDown = false,
      this.controller,
      this.minLines = 20,
      this.maxLines = 40,
      this.data,
      this.hint,
      this.isReadOnly = false});

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
  void didUpdateWidget(covariant LogInputField oldWidget) {
    if (oldWidget.data != widget.data) {
      controller.text = widget.data ?? '';
    }
    super.didUpdateWidget(oldWidget);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(settingsNotifierProvider).isDark;
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Stack(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          width: double.infinity,
          decoration: BoxDecoration(
            // border: Border.all(color: colorScheme.surface),
            color: isDark
                ? colorScheme.surface
                : AppTheme.gradient.colors[0].withOpacity(0.5),
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(12),
              bottomRight: Radius.circular(12),
            ),
          ),
          child: widget.isMarkDown
              ? Markdown(
                  selectable: true,
                  data: widget.data ?? '',
                )
              : TextField(
                  cursorHeight: 20,
                  controller: controller,
                  readOnly: widget.isReadOnly,
                  style: textTheme.titleMedium!,
                  decoration: InputDecoration(
                    hintStyle: textTheme.titleMedium!.copyWith(
                        fontStyle: FontStyle.italic,
                        color: isDark
                            ? colorScheme.onSurface.withOpacity(0.5)
                            : colorScheme.onSurface.withOpacity(0.5)),
                    border: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    disabledBorder: InputBorder.none,
                    errorBorder: InputBorder.none,
                    hintText: widget.hint ?? hint,
                  ),
                  minLines: widget.minLines,
                  maxLines: widget.maxLines,
                ),
        ),
        widget.isReadOnly && !widget.isMarkDown
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
