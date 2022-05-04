import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_template/models/log_model.dart';

class DataBaseService {
  static final DataBaseService _singleton = DataBaseService._internal();

  factory DataBaseService() {
    return _singleton;
  }

  DataBaseService._internal();
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final logRef = _firestore.collection('logs');

  static Future<void> addLog(LogModel model) async {
    // final log = LogModel(
    //   id: model.id,
    //   data: model.data,
    //   expiryDate: model.expiryDate,
    // );
    final json = model.toJson();
    await logRef.doc(model.id).set(json);
    deleteOldLogs();
  }

  static Future<void> deleteOldLogs() async {
    logRef.get().then((snapshot) {
      final length = snapshot.docs.length;
      for (int i = 0; i < length; i++) {
        final id = snapshot.docs[i]['id'];
        final date = snapshot.docs[i]['expiryDate'];
        if (date != null) {
          final expiryDate = DateTime.parse(date);
          final now = DateTime.now();
          if (expiryDate.isBefore(now)) {
            removeLog(id);
          }
        }
      }
    });
  }

  static Future<List<LogModel>> getLogs() async {
    try {
      List<LogModel> logModels = [];
      final querySnapshot = await logRef.get();
      for (var doc in querySnapshot.docs) {
        final log = LogModel.fromJson(doc.data());
        logModels.add(log);
      }
      return logModels;
    } catch (_) {
      return [];
    }
  }

  static Future<LogModel> fetchLogById(String docId) async {
    final snapshot = await logRef.doc(docId).get();

    final doc = snapshot.data();
    final LogModel logModel = LogModel.fromJson(doc!);
    return logModel;
  }

  static Future<void> removeLog(String docId) async {
    await logRef.doc(docId).delete();
  }
}
