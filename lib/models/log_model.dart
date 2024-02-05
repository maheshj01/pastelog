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
  final String title;
  final String data;
  final bool isMarkDown;
  final DateTime? expiryDate;
  final LogType type;
  final DateTime? createdDate;

  factory LogModel.fromJson(Map<String, dynamic> json) =>
      _$LogModelFromJson(json);

  LogModel(
      {required this.id,
      required this.data,
      required this.title,
      required this.expiryDate,
      required this.type,
      this.isMarkDown = false,
      required this.createdDate});
  Map<String, dynamic> toJson() => _$LogModelToJson(this);

  LogModel copyWith({
    String? id,
    String? data,
    DateTime? expiryDate,
    String? title,
    LogType? type,
    bool? isMarkDown,
    DateTime? createdDate,
  }) {
    return LogModel(
      id: id ?? this.id,
      title: title ?? this.title,
      data: data ?? this.data,
      isMarkDown: isMarkDown ?? this.isMarkDown,
      expiryDate: expiryDate ?? this.expiryDate,
      type: type ?? this.type,
      createdDate: createdDate ?? this.createdDate,
    );
  }

  Map<String, dynamic> toMap() {
    final result = <String, dynamic>{};

    result.addAll({'id': id});
    result.addAll({'data': data});
    result.addAll({'title': title});
    result.addAll({'isMarkDown': isMarkDown});
    if (expiryDate != null) {
      result.addAll({'expiryDate': expiryDate!.millisecondsSinceEpoch});
    }
    result.addAll({'type': type.name});
    if (createdDate != null) {
      result.addAll({'createdDate': createdDate!.millisecondsSinceEpoch});
    }

    return result;
  }

  factory LogModel.fromMap(Map<String, dynamic> map) {
    return LogModel(
      id: map['id'] ?? '',
      data: map['data'] ?? '',
      title: map['title'] ?? '',
      isMarkDown: map['isMarkDown'] ?? false,
      expiryDate: map['expiryDate'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['expiryDate'])
          : null,
      type: map['type'] == 'text' ? LogType.text : LogType.file,
      createdDate: map['createdDate'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['createdDate'])
          : null,
    );
  }

  @override
  String toString() {
    return 'LogModel(id: $id, title: $title, data: $data, isMarkDown: $isMarkDown ,expiryDate: $expiryDate, type: $type, createdDate: $createdDate)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is LogModel &&
        other.id == id &&
        other.title == title &&
        other.data == data &&
        other.isMarkDown == isMarkDown &&
        other.expiryDate == expiryDate &&
        other.type == type &&
        other.createdDate == createdDate;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        title.hashCode ^
        isMarkDown.hashCode ^
        data.hashCode ^
        expiryDate.hashCode ^
        type.hashCode ^
        createdDate.hashCode;
  }
}
