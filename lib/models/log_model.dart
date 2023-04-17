import 'package:json_annotation/json_annotation.dart';

// import 'LogModel_model.dart';
part 'log_model.g.dart';
// part 'LogModel_model.g.dart';

///
///
/// define a schema for your class and annotate
/// and then run
///
/// ```flutter pub run build_runner build --delete-conflicting-outputs```
///
/// to watch the file changes and generate the outputs run
///
/// ```flutter pub run build_runner watch ```
enum LogType {
  text,
  file,
}

@JsonSerializable()
class LogModel {
  final String id;
  final String data;
  final DateTime? expiryDate;
  final LogType type;
  final DateTime? createdDate;

  LogModel(
      {required this.id,
      required this.data,
      this.type = LogType.text,
      this.expiryDate,
      required this.createdDate});
  factory LogModel.fromJson(Map<String, dynamic> json) =>
      _$LogModelFromJson(json);
  Map<String, dynamic> toJson() => _$LogModelToJson(this);
}
