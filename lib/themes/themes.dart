import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pastelog/utils/settings_service.dart';

class AppTheme {
  static final AppTheme _singleton = AppTheme._internal();

  factory AppTheme() {
    return _singleton;
  }

  AppTheme._internal();

  static final Color bottomSheetBackgroundColor = Colors.grey.shade800;
  static final Color scaffoldBackgroundColor = Colors.grey.shade900;
  static final Color navbarBackground = Colors.indigo.shade100;

  static TextStyle inputTextStyle = const TextStyle(
    fontSize: 25,
  );
  static TextStyle rupeeStyle = const TextStyle(
    fontSize: 18,
  );

  bool _isDark = false;

  static bool get isDark => _singleton._isDark;

  static set isDark(bool value) {
    _singleton._isDark = value;
  }

  static const _lightFillColor = Colors.black;
  static const _darkFillColor = Colors.white;

  static Color get themeTextColor => !isDark ? _lightFillColor : _darkFillColor;
  static Color get themeTextContrastColor =>
      isDark ? _lightFillColor : _darkFillColor;

  static final Color _lightFocusColor = Colors.black.withOpacity(0.12);
  static final Color _darkFocusColor = Colors.white.withOpacity(0.12);

  static ThemeData lightThemeData =
      _themeData(lightColorScheme, _lightFocusColor);
  static ThemeData darkThemeData = _themeData(darkColorScheme, _darkFocusColor);

  static ThemeData _themeData(ColorScheme colorScheme, Color focusColor) {
    return ThemeData(
      colorScheme: colorScheme,
      textTheme: textTheme,
      // Matches manifest.json colors and background color.
      primaryColor: const Color(0xFF030303),
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.background,
        elevation: 0,
        iconTheme: IconThemeData(color: colorScheme.primary),
      ),

      iconTheme: IconThemeData(color: colorScheme.onPrimary),
      canvasColor: colorScheme.background,
      scaffoldBackgroundColor: const Color(0xFF241E30),
      highlightColor: Colors.transparent,
      focusColor: focusColor,
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor: Color.alphaBlend(
          _lightFillColor.withOpacity(0.80),
          _darkFillColor,
        ),
        contentTextStyle: textTheme.subtitle1!.apply(color: _darkFillColor),
      ),
    );
  }

  Settings appSettings = Settings();

  static ColorScheme get colorScheme =>
      Settings.getTheme == ThemeMode.light ? lightColorScheme : darkColorScheme;

  static ColorScheme lightColorScheme = ColorScheme(
      brightness: Brightness.light,
      // seedColor: const Color.fromARGB(255, 126, 120, 211),
      primary: const Color.fromARGB(255, 87, 138, 206),
      primaryContainer: const Color(0xFF117378),
      secondary: const Color(0xFFEFF3F3),
      secondaryContainer: const Color(0xFFFAFBFB),
      background: const Color(0XFFFFFFFF),
      surface: Colors.grey[100]!,
      onBackground: Colors.white,
      error: Colors.red,
      onError: _lightFillColor,
      onPrimary: _lightFillColor,
      onSecondary: const Color(0xFF322942),
      onSurface: _lightFillColor);

  static ColorScheme darkColorScheme = const ColorScheme(
    primary: Color(0xFFFF8383),
    primaryContainer: Color(0xFF1CDEC9),
    secondary: Color(0xFF4D1F7C),
    secondaryContainer: Color(0xFF451B6F),
    background: Color(0xFF241E30),
    surface: Color(0xFF1F1929),
    onBackground: Color(0x0DFFFFFF), // White with 0.05 opacity
    error: Colors.red,
    onError: _darkFillColor,
    onPrimary: _darkFillColor,
    onSecondary: _darkFillColor,
    onSurface: _darkFillColor,
    brightness: Brightness.dark,
  );

  static FontWeight get regular => _regular;
  static FontWeight get medium => _medium;
  static FontWeight get semiBold => _semiBold;
  static FontWeight get bold => _bold;

  static const _regular = FontWeight.normal;
  static const _medium = FontWeight.w500;
  static const _semiBold = FontWeight.w600;
  static const _bold = FontWeight.w700;

  static TextTheme textTheme = GoogleFonts.anticSlabTextTheme(const TextTheme(
    headline1: TextStyle(fontWeight: _bold, fontSize: 56.0),
    headline2: TextStyle(fontWeight: _bold, fontSize: 48.0),
    headline3: TextStyle(fontWeight: _bold, fontSize: 32.0),
    headline4: TextStyle(fontWeight: _bold, fontSize: 20.0),
    headline5: TextStyle(fontWeight: _bold, fontSize: 16.0),
    headline6: TextStyle(fontWeight: _bold, fontSize: 16.0),
    caption: TextStyle(fontWeight: _semiBold, fontSize: 16.0),
    subtitle1: TextStyle(fontWeight: _medium, fontSize: 16.0),
    subtitle2: TextStyle(fontWeight: _medium, fontSize: 14.0),
    overline: TextStyle(fontWeight: _medium, fontSize: 12.0),
    bodyText1: TextStyle(fontWeight: _regular, fontSize: 14.0),
    bodyText2: TextStyle(fontWeight: _regular, fontSize: 16.0),
    button: TextStyle(fontWeight: _semiBold, fontSize: 14.0),
  ));
}
