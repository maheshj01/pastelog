import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:pastelog/models/log_model.dart';
import 'package:pastelog/services/api_service.dart';

class FileApiServiceImpl implements ApiStrategy {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final logRef = _firestore.collection('logs');
  @override
  Future<void> addLog(LogModel log) async {
    // upload file to firebase storage
    throw UnimplementedError();
  }

  @override
  Future<void> deleteOldLogs() {
    // delete old files from firebase storage
    throw UnimplementedError();
  }

  @override
  Future<List<LogModel>> getLogs() {
    // fetch all files from firebase storage
    throw UnimplementedError();
  }

  @override
  LogType get type => LogType.file;

  @override
  Future<LogModel> fetchLogById(String docId) {
    // TODO: fetch File by Id
    throw UnimplementedError();
  }

  @override
  Future<String> getGist(String gistId) {
    throw UnimplementedError();
  }
}
