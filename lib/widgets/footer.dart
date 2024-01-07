import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:pastelog/constants/constants.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/extensions.dart';
import 'package:pastelog/widgets/alert.dart';
import 'package:url_launcher/url_launcher.dart';

class Footer extends StatelessWidget {
  const Footer({Key? key}) : super(key: key);

  void _openCustomDialog(BuildContext context) {
    showGeneralDialog(
        barrierColor: Colors.black.withOpacity(0.5),
        transitionBuilder: (context, a1, a2, widget) {
          return ScaleTransition(
              scale: Tween<double>(begin: 0.5, end: 1.0).animate(a1),
              child: FadeTransition(
                opacity: Tween<double>(begin: 0.5, end: 1.0).animate(a1),
                child: const AboutPasteLog(
                  title: 'About',
                ),
              ));
        },
        transitionDuration: const Duration(milliseconds: 300),
        barrierDismissible: true,
        barrierLabel: '',
        context: context,
        pageBuilder: (context, animation1, animation2) {
          return Container();
        });
  }

  Widget linkWidget(String text, Function onTap) {
    return TextButton(
        onPressed: () => onTap(),
        child: Text(
          text,
          style: AppTheme.textTheme.titleMedium!.copyWith(
              fontWeight: FontWeight.bold,
              decoration: TextDecoration.underline),
        ));
  }

  Future<DateTime> getLastUpdateDateTime() async {
    try {
      final response = await http.get(Uri.parse(lastCommitApi));
      final json = jsonDecode(response.body);
      final date = DateTime.parse(json['commit']['commit']['author']['date']);
      return date;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        alignment: Alignment.center,
        padding: const EdgeInsets.symmetric(vertical: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Row(
              children: [
                linkWidget('About', () => _openCustomDialog(context)),
                const SizedBox(
                  width: 20,
                ),
                // linkWidget('Privacy Policy', () => launchLink(privacyPolicyUrl)),
                linkWidget(
                    'Source Code', () => launchUrl(Uri.parse(sourceCodeUrl))),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Copyright © 2022 Widget Media Labs ',
                    style: Theme.of(context).textTheme.bodyMedium!),
              ],
            ),
            const SizedBox(
              height: 8,
            ),
            FutureBuilder(
              builder:
                  (BuildContext context, AsyncSnapshot<DateTime> snapshot) {
                if (snapshot.hasData) {
                  return Text(
                    'Last Updated: ${snapshot.data?.toLocal().formatDateTime()}',
                    style: Theme.of(context).textTheme.titleSmall!,
                  );
                }
                return const SizedBox();
              },
              future: getLastUpdateDateTime(),
            ),
          ],
        ));
  }
}
