import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pastelog/models/log_model.dart';
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
            logs: [],
          ),
        ) {
    loadTheme();
    loadLogs();
  }

  static const String _themeModeKey = 'themeMode';
  static const String _logsHistoryKey = 'logsHistory';

  void setTheme(ThemeMode theme) {
    final isDark = theme == ThemeMode.dark;
    prefs.setBool(_themeModeKey, isDark);
    state = state.copyWith(isDark: isDark);
  }

  Future<void> loadTheme() async {
    final bool isDark = prefs.getBool(_themeModeKey) ?? false;
    state = state.copyWith(isDark: isDark);
  }

  // Add a log if it doesn't exist, otherwise push the log to the top of the list
  void addLog(LogModel log) {
    final logs = state.logs.where((element) => element.id != log.id).toList();
    logs.insert(0, log);
    setLogs(logs);
  }

  void removeLog(String id) {
    final logs = state.logs.where((element) => element.id != id).toList();
    setLogs(logs);
  }

  void setLogs(List<LogModel> logs) {
    final logsJson = logs.map((e) => e.toJson()).toList();
    prefs.setString(
      _logsHistoryKey,
      json.encode(logsJson),
    );
    state = state.copyWith(logs: logs);
  }

  Future<void> loadLogs() async {
    final logsJson = prefs.getString(_logsHistoryKey);
    if (logsJson == null) {
      state = state.copyWith(logs: []);
      return;
    }
    final _logs = json.decode(logsJson);
    final logs =
        (_logs as List<dynamic>).map((e) => LogModel.fromJson(e)).toList();

    state = state.copyWith(logs: logs);
  }

  void clear() {
    prefs.clear();
  }
}

class Settings {
  final bool isDark;
  final List<LogModel> logs;
  Settings({
    required this.isDark,
    required this.logs,
  });

  Settings copyWith({
    bool? isDark,
    List<LogModel>? logs,
  }) {
    return Settings(
      isDark: isDark ?? this.isDark,
      logs: logs ?? this.logs,
    );
  }

  Map<String, dynamic> toMap() {
    final result = <String, dynamic>{};

    result.addAll({'isDark': isDark});
    result.addAll({'logs': logs.map((x) => x.toMap()).toList()});

    return result;
  }

  factory Settings.fromMap(Map<String, dynamic> map) {
    return Settings(
      isDark: map['isDark'] ?? false,
      logs: List<LogModel>.from(map['logs']?.map((x) => LogModel.fromMap(x))),
    );
  }

  String toJson() => json.encode(toMap());

  factory Settings.fromJson(String source) =>
      Settings.fromMap(json.decode(source));

  @override
  String toString() => 'Settings(isDark: $isDark, logs: $logs)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Settings &&
        other.isDark == isDark &&
        listEquals(other.logs, logs);
  }

  @override
  int get hashCode => isDark.hashCode ^ logs.hashCode;
}
