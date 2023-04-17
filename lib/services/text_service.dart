import 'dart:convert';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:http/http.dart' as http;
import 'package:pastelog/constants/strings.dart';
import 'package:pastelog/models/log_model.dart';
import 'package:pastelog/services/api_service.dart';

class TextApiServiceImpl implements ApiStrategy {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final logRef = _firestore.collection('logs');
  @override
  Future<void> addLog(LogModel model) async {
    final json = model.toJson();
    await logRef.doc(model.id).set(json);
    deleteOldLogs();
  }

  @override
  Future<void> deleteOldLogs() async {
    logRef.get().then((snapshot) async {
      final length = snapshot.docs.length;
      for (int i = 0; i < length; i++) {
        final id = snapshot.docs[i]['id'];
        final date = snapshot.docs[i]['expiryDate'];
        if (date != null) {
          final expiryDate = DateTime.parse(date);
          final now = DateTime.now();
          if (expiryDate.isBefore(now)) {
            await logRef.doc(id).delete();
          }
        }
      }
    });
  }

  @override
  Future<List<LogModel>> getLogs() async {
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

  @override
  LogType get type => LogType.text;

  @override
  Future<LogModel> fetchLogById(String docId) async {
    try {
      final snapshot = await logRef.doc(docId).get();
      final doc = snapshot.data();
      final LogModel logModel = LogModel.fromJson(doc!);
      return logModel;
    } catch (_) {
      throw 'failed to fetch logs';
    }
  }

  @override
  Future<String> getGist(String gistId) async {
    final url = '$gistApi$gistId';
    try {
      final response = await http.get(Uri.parse(url));
      final json = jsonDecode(response.body);
      final fileName = (json['files'] as Map).keys.toList()[0];
      final content = json['files']['$fileName']['content'];
      return content;
    } catch (_) {
      throw 'failed to fetch gist';
    }
  }
}
