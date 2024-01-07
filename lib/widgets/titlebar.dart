import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pastelog/constants/constants.dart';
import 'package:pastelog/main.dart';
import 'package:pastelog/themes/themes.dart';

class TitleBar extends ConsumerStatefulWidget implements PreferredSizeWidget {
  final String title;
  final Function? onTap;
  final bool? hasAction;

  TitleBar({Key? key, required this.title, this.onTap, this.hasAction = true})
      : super(key: key);

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => TitleBarState();

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class TitleBarState extends ConsumerState<TitleBar> {
  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsNotifierProvider.notifier);
    bool isDark = ref.read(settingsNotifierProvider).isDark;
    return InkWell(
      onTap: () => widget.onTap!(),
      child: AppBar(
        backgroundColor: !isDark ? AppTheme.gradient.colors[2] : null,
        automaticallyImplyLeading: false,
        actions: [
          !widget.hasAction!
              ? const SizedBox.shrink()
              : IconButton(
                  onPressed: () {
                    settings
                        .setTheme(isDark ? ThemeMode.light : ThemeMode.dark);
                  },
                  icon: Icon(!isDark ? Icons.dark_mode : Icons.sunny)),
          const SizedBox(
            width: 20,
          ),
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
            Text(appTitle,
                style: GoogleFonts.anticSlab(
                  textStyle: Theme.of(context).textTheme.displaySmall!,
                )),
          ],
        ),
      ),
    );
  }
}
