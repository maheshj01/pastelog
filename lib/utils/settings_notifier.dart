import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// A service that stores and retrieves user settings.
///
/// By default, this class does not persist user settings. If you'd like to
/// persist the user settings locally, use the shared_preferences package. If
/// you'd like to store settings on a web server, use the http package.
class SettingsNotifier extends StateNotifier<Settings> {
  final SharedPreferences prefs;

  SettingsNotifier(this.prefs)
      : super(
          Settings(
            isDark: false,
          ),
        ) {
    loadTheme();
  }

  static const String _themeModeKey = 'themeMode';

  void setTheme(ThemeMode theme) {
    final isDark = theme == ThemeMode.dark;
    prefs.setBool(_themeModeKey, isDark);
    state = state.copyWith(isDark: isDark);
  }

  Future<void> loadTheme() async {
    final bool isDark = prefs.getBool(_themeModeKey) ?? false;
    final _theme = isDark == true ? ThemeMode.dark : ThemeMode.light;
    state = state.copyWith(isDark: isDark);
  }

  void clear() {
    prefs.clear();
  }
}

class Settings {
  final bool isDark;
  Settings({
    required this.isDark,
  });

  Settings copyWith({
    bool? isDark,
  }) {
    return Settings(
      isDark: isDark ?? this.isDark,
    );
  }

  Map<String, dynamic> toMap() {
    final result = <String, dynamic>{};

    result.addAll({'isDark': isDark});

    return result;
  }

  factory Settings.fromMap(Map<String, dynamic> map) {
    return Settings(
      isDark: map['isDark'] ?? false,
    );
  }

  String toJson() => json.encode(toMap());

  factory Settings.fromJson(String source) =>
      Settings.fromMap(json.decode(source));

  @override
  String toString() => 'Settings(isDark: $isDark)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Settings && other.isDark == isDark;
  }

  @override
  int get hashCode => isDark.hashCode;
}
