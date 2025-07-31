//This script attempts to swap the _token variable inside the POST payload
//To do so it creates a global variable _token that is injected at each POST request
//After each response received the body of is checked for any _token variables
//If present, the global variable is updated.

var Pattern = Java.type("java.util.regex.Pattern");

var tokenPattern = Pattern.compile('<input[^>]+name="_token"[^>]+value="([^"]+)"');

if (typeof global === 'undefined') {
    global = {};
}

if (!global._token) {
    global._token = "";
}

function responseReceived(msg, initiator, helper) {
    var body = msg.getResponseBody().toString();

    if (!msg.getResponseHeader().isHtml()) return;

    var matcher = tokenPattern.matcher(body);
    if (matcher.find()) {
        var token = matcher.group(1);
        if (token !== global._token) {
            print("[+] Updated _token: " + token);
            global._token = token;
        }
    }
}

function responseReceived(msg, initiator, helper) {
    var body = msg.getResponseBody().toString();

    if (!msg.getResponseHeader().isHtml()) return;

    var matcher = tokenPattern.matcher(body);
    if (matcher.find()) {
        var token = matcher.group(1);
        if (token !== global._token) {
            print("[+] Updated _token: " + token);
            global._token = token;
        }
    }
}

