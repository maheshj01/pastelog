// Widget to pick expiration date

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pastelog/themes/themes.dart';
import 'package:pastelog/utils/extensions.dart';

class ExpiryDateSelector extends ConsumerStatefulWidget {
  final Function(DateTime)? onExpirySet;
  final DateTime? value;
  const ExpiryDateSelector({super.key, this.value, this.onExpirySet});

  @override
  ConsumerState<ConsumerStatefulWidget> createState() =>
      ExpiryDateSelectorState();
}

class ExpiryDateSelectorState extends ConsumerState<ExpiryDateSelector> {
  Future<void> _selectExpiryDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
        context: context,
        initialDate: DateTime.now(),
        firstDate: DateTime.now(),
        lastDate: DateTime(2025));
    if (picked != null && picked != widget.value) {
      widget.onExpirySet?.call(picked);
    }
  }

  @override
  Widget build(BuildContext context) {
    final expiryDate = widget.value;
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Text(
          "This Log expires",
          style: Theme.of(context).textTheme.titleSmall,
        ),
        Stack(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: TextButton(
                  onPressed: () {
                    _selectExpiryDate(context);
                  },
                  child: Row(
                    children: [
                      Text(
                        expiryDate == null ? "Never" : expiryDate!.formatDate(),
                        style: Theme.of(context)
                            .textTheme
                            .titleLarge!
                            .copyWith(color: AppTheme.colorScheme.primary),
                      ),
                      const SizedBox(
                        width: 8,
                      ),
                      Icon(Icons.calendar_today,
                          color: AppTheme.colorScheme.primary, size: 20),
                    ],
                  )),
            ),
            Positioned(
                bottom: 0,
                left: 4,
                right: 2,
                child: Divider(
                  color: AppTheme.colorScheme.primary,
                  thickness: 3,
                )),
          ],
        ),
      ],
    );
  }
}
