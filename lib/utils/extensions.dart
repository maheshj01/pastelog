import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:pastelog/constants/constants.dart';

const String dateFormatter = 'MMMM dd, y';
const String dateTimeFormatter = 'MMMM dd, y HH:mm';

extension DateHelper on DateTime {
  String formatDate() {
    final now = DateTime.now();
    final differenceInDays = getDifferenceInDaysWithNow();

    if (isSameDate(now)) {
      return 'Today';
    } else if (differenceInDays == 1) {
      return 'Yesterday';
    } else {
      final formatter = DateFormat(Constants.dateFormatter);
      return formatter.format(this);
    }
  }

  //
  String formatDateTime() {
    final formatter = DateFormat(dateTimeFormatter);
    return formatter.format(this);
  }

  bool isSameDate(DateTime other) {
    return year == other.year && month == other.month && day == other.day;
  }

  int getDifferenceInDaysWithNow() {
    final now = DateTime.now();
    return now.difference(this).inDays;
  }

  String standardTime() {
    final formatter = DateFormat(Constants.timeFormatter);
    return formatter.format(this);
  }

  String standardDate() {
    final formatter = DateFormat(Constants.dateFormatter);
    return formatter.format(this);
  }

  String standardDateTime() {
    final formatter = DateFormat(Constants.dateTimeFormatter);
    return formatter.format(this);
  }
}

extension ContainerBorderRadius on double {
  BorderRadiusGeometry get allRadius => BorderRadius.circular(this);

  BorderRadiusGeometry get topLeftRadius =>
      BorderRadius.only(topLeft: Radius.circular(this));

  BorderRadiusGeometry get topRightRadius =>
      BorderRadius.only(topRight: Radius.circular(this));

  BorderRadiusGeometry get bottomLeftRadius =>
      BorderRadius.only(bottomLeft: Radius.circular(this));

  BorderRadiusGeometry get bottomRightRadius =>
      BorderRadius.only(bottomRight: Radius.circular(this));

  BorderRadiusGeometry get verticalRadius => BorderRadius.vertical(
      top: Radius.circular(this), bottom: Radius.circular(this));

  BorderRadiusGeometry get horizontalRadius => BorderRadius.horizontal(
      left: Radius.circular(this), right: Radius.circular(this));

  BorderRadiusGeometry get topRadius =>
      BorderRadius.vertical(top: Radius.circular(this));

  BorderRadiusGeometry get bottomRadius =>
      BorderRadius.vertical(bottom: Radius.circular(this));

  BorderRadiusGeometry get leftRadius =>
      BorderRadius.horizontal(left: Radius.circular(this));

  BorderRadiusGeometry get rightRadius =>
      BorderRadius.horizontal(right: Radius.circular(this));

  BorderRadiusGeometry get topLeftBottomRightRadius => BorderRadius.only(
      topLeft: Radius.circular(this), bottomRight: Radius.circular(this));

  BorderRadiusGeometry get topRightBottomLeftRadius => BorderRadius.only(
      topRight: Radius.circular(this), bottomLeft: Radius.circular(this));
}

extension ContainerPadding on double {
  EdgeInsetsGeometry get allPadding => EdgeInsets.all(this);

  EdgeInsetsGeometry get topPadding => EdgeInsets.only(top: this);

  EdgeInsetsGeometry get bottomPadding => EdgeInsets.only(bottom: this);

  EdgeInsetsGeometry get leftPadding => EdgeInsets.only(left: this);

  EdgeInsetsGeometry get rightPadding => EdgeInsets.only(right: this);

  EdgeInsetsGeometry get bottomRightPadding =>
      EdgeInsets.only(bottom: this, right: this);

  EdgeInsetsGeometry get bottomLeftPadding =>
      EdgeInsets.only(bottom: this, left: this);

  EdgeInsetsGeometry get topRightPadding =>
      EdgeInsets.only(top: this, right: this);

  EdgeInsetsGeometry get topLeftPadding =>
      EdgeInsets.only(top: this, left: this);

  EdgeInsetsGeometry get topHorizontalPadding =>
      EdgeInsets.only(top: this, left: this, right: this);

  EdgeInsetsGeometry get bottomHorizontalPadding =>
      EdgeInsets.only(bottom: this, left: this, right: this);

  EdgeInsetsGeometry get leftVerticalPadding =>
      EdgeInsets.only(left: this, top: this, bottom: this);

  EdgeInsetsGeometry get rightVerticalPadding =>
      EdgeInsets.only(right: this, top: this, bottom: this);

  EdgeInsetsGeometry get verticalPadding =>
      EdgeInsets.symmetric(vertical: this);

  EdgeInsetsGeometry get horizontalPadding =>
      EdgeInsets.symmetric(horizontal: this);
}

// add two ContainerPadding using +
extension ContainerPaddingAddition on EdgeInsetsGeometry {
  //  16.0.horizontalPadding + 8.0.topPadding,
  EdgeInsetsGeometry operator +(EdgeInsetsGeometry other) {
    return this.add(other);
  }

  EdgeInsetsGeometry operator -(EdgeInsetsGeometry other) {
    return this.subtract(other);
  }

  EdgeInsetsGeometry operator *(double other) {
    return this * other;
  }

  EdgeInsetsGeometry operator /(double other) {
    return this / other;
  }
}

extension RoundedShape on double {
  ShapeBorder get rounded =>
      RoundedRectangleBorder(borderRadius: BorderRadius.circular(this));

  ShapeBorder get roundedTop => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
          topLeft: Radius.circular(this), topRight: Radius.circular(this)));

  ShapeBorder get roundedBottom => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(this),
          bottomRight: Radius.circular(this)));

  ShapeBorder get roundedLeft => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
          topLeft: Radius.circular(this), bottomLeft: Radius.circular(this)));

  ShapeBorder get roundedRight => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
          topRight: Radius.circular(this), bottomRight: Radius.circular(this)));

  ShapeBorder get roundedTopLeft => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(topLeft: Radius.circular(this)));

  ShapeBorder get roundedTopRight => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(topRight: Radius.circular(this)));

  ShapeBorder get roundedBottomLeft => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(bottomLeft: Radius.circular(this)));

  ShapeBorder get roundedBottomRight => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(bottomRight: Radius.circular(this)));

  ShapeBorder get roundedTopBottom => RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(
          top: Radius.circular(this), bottom: Radius.circular(this)));

  ShapeBorder get roundedLeftRight => RoundedRectangleBorder(
      borderRadius: BorderRadius.horizontal(
          left: Radius.circular(this), right: Radius.circular(this)));

  ShapeBorder get roundedTopLeftBottomRight => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
          topLeft: Radius.circular(this), bottomRight: Radius.circular(this)));

  ShapeBorder get roundedTopRightBottomLeft => RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
          topRight: Radius.circular(this), bottomLeft: Radius.circular(this)));
}

extension SizedBoxSpacer on double {
  SizedBox vSpacer() => SizedBox(height: this);

  SizedBox hSpacer() => SizedBox(width: this);
}
