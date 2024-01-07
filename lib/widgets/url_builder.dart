
import 'package:flutter/material.dart';
import 'package:pastelog/themes/themes.dart';

class UrlBuilder extends StatefulWidget {
  final String url;
  final Function onTap;

  const UrlBuilder({Key? key, required this.url, required this.onTap})
      : super(key: key);

  @override
  State<UrlBuilder> createState() => _UrlBuilderState();
}

class _UrlBuilderState extends State<UrlBuilder> {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        RichText(text: const TextSpan(text: 'Your file is available at ')),
        TextButton(
            onPressed: () => widget.onTap(),
            child: Text(
              widget.url,
              style: AppTheme.textTheme.bodyMedium!
                  .copyWith(color: Colors.blueAccent),
            )),
      ],
    );
  }
}
