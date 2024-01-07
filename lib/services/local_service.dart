import 'package:pastelog/models/log_model.dart';
import 'package:pastelog/services/api_service.dart';

class LocalService extends ApiStrategy {
  @override
  Future<void> addLog(LogModel log) {
    // TODO: implement addLog
    throw UnimplementedError();
  }

  @override
  Future<void> deleteOldLogs() {
    // TODO: implement deleteOldLogs
    throw UnimplementedError();
  }

  @override
  Future<LogModel> fetchLogById(String docId) {
    // TODO: implement fetchLogById
    throw UnimplementedError();
  }

  @override
  Future<String> getGist(String gistId) {
    // TODO: implement getGist
    throw UnimplementedError();
  }

  @override
  Future<List<LogModel>> getLogs() {
    // TODO: implement getLogs
    throw UnimplementedError();
  }

  @override
  // TODO: implement type
  LogType get type => throw UnimplementedError();
}
