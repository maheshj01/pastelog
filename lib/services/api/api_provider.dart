import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter_template/services/api/exception.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_template/constants/constants.dart' as constant
    show baseUrl;

enum HttpMethod { get, post, put, delete, patch }

class ApiProvider {
  static String baseUrl = constant.baseUrl;
  static Duration timeoutDuration = const Duration(seconds: 5);

  FutureOr<void> retryOnTimeOut({required http.Response response}) async {
    try {
      final res = await response.request!.send();
      final newResponse = await http.Response.fromStream(res);
      handleResponse(newResponse);
    } catch (_) {}
  }

  Object? handleResponse(http.Response res) {
    switch (res.statusCode) {
      case 200:
        return json.decode(res.body);
      case 400:
        return BadRequestException();
      case 404:
        return ResourceNotFoundException();
      case 500:
        break;
      default:
        throw FetchDataException(
            'Error occured while Communication with Server with StatusCode : ${res.statusCode}');
    }
  }

  Future<http.Response> getRequest(String endPoint,
      {Map<String, String>? headers}) async {
    var responseJson;
    try {
      final response = await http
          .get(Uri.parse(baseUrl + endPoint), headers: headers)
          .timeout(timeoutDuration);
      responseJson = handleResponse(response);
    } on SocketException catch (_) {
      throw ConnectivityException('No Internet connection');
    } on TimeoutException catch (_) {
      // TODO: how to pass the response object on Timeout
      // retryOnTimeOut(response: http.);
    } catch (_) {}
    return responseJson;
  }

  Future<http.Response> postRequest(String endPoint,
      {Map<String, Object>? body, Map<String, String>? headers}) async {
    var responseJson;
    try {
      final response = await http
          .post(Uri.parse(baseUrl + endPoint), body: body, headers: headers)
          .timeout(timeoutDuration);
      responseJson = handleResponse(response);
    } on SocketException catch (_) {
      throw ConnectivityException('No Internet connection');
    } on TimeoutException catch (_) {
      // TODO: how to pass the response object on Timeout
      // retryOnTimeOut(response: http.);
    } catch (_) {}
    return responseJson;
  }

  Future<http.Response> putRequest(String endPoint,
      {Map<String, Object>? body, Map<String, String>? headers}) async {
    var responseJson;
    try {
      final response = await http
          .put(Uri.parse(baseUrl + endPoint), body: body, headers: headers)
          .timeout(timeoutDuration);
      responseJson = handleResponse(response);
    } on SocketException catch (_) {
      throw ConnectivityException('No Internet connection');
    } on TimeoutException catch (_) {
      // TODO: how to pass the response object on Timeout
      // retryOnTimeOut(response: http.);
    } catch (_) {}
    return responseJson;
  }

  Future<http.Response> deleteRequest(String endPoint,
      {Map<String, Object>? body, Map<String, String>? headers}) async {
    var responseJson;
    try {
      final response = await http
          .delete(Uri.parse(baseUrl + endPoint), headers: headers)
          .timeout(timeoutDuration);
      responseJson = handleResponse(response);
    } on SocketException catch (_) {
      throw ConnectivityException('No Internet connection');
    } on TimeoutException catch (_) {
      // TODO: how to pass the response object on Timeout
      // retryOnTimeOut(response: http.);
    } catch (_) {}
    return responseJson;
  }

  Future<http.Response> patchRequest(String endPoint,
      {Map<String, Object>? body, Map<String, String>? headers}) async {
    final response = await http.patch(Uri.parse(baseUrl + endPoint));
    var responseJson;
    try {
      final response = await http
          .patch(Uri.parse(baseUrl + endPoint), body: body, headers: headers)
          .timeout(timeoutDuration);
      responseJson = handleResponse(response);
    } on SocketException catch (_) {
      throw ConnectivityException('No Internet connection');
    } on TimeoutException catch (_) {
      // TODO: how to pass the response object on Timeout
      // retryOnTimeOut(response: http.);
    } catch (_) {}
    return responseJson;
  }
}
