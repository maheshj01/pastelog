//  create a interface for the api service

import 'package:pastelog/models/log_model.dart';

abstract class ApiStrategy {
  LogType get type;
  Future<void> addLog(LogModel log);

  Future<List<LogModel>> getLogs();

  Future<void> deleteOldLogs();

  Future<LogModel> fetchLogById(String docId);

  Future<String> getGist(String gistId);
}

class ContentUploadStrategy {
  ApiStrategy _apiStrategy;

  ContentUploadStrategy(this._apiStrategy);

  set apiStrategy(ApiStrategy apiStrategy) {
    _apiStrategy = apiStrategy;
  }

  Future<void> addLog(LogModel log) async {
    await _apiStrategy.addLog(log);
  }

  Future<void> deleteOldLog(String id) async {
    await _apiStrategy.deleteOldLogs();
  }

  Future<List<LogModel>> getLogs() async {
    return await _apiStrategy.getLogs();
  }

  Future<LogModel> fetchLogById(String docId) async {
    return await _apiStrategy.fetchLogById(docId);
  }

  Future<String> getGist(String gistId) async {
    return await _apiStrategy.getGist(gistId);
  }
}
