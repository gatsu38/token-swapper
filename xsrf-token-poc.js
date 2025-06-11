var ScriptVars = org.zaproxy.zap.extension.script.ScriptVars;
var cookieType = org.parosproxy.paros.network.HtmlParameter.Type.cookie;

// --- Before sending each request ---
function sendingRequest(msg, initiator, helper) {
    var xsrf    = ScriptVars.getGlobalVar("token.XSRF-TOKEN");
    var session = ScriptVars.getGlobalVar("token.laravel_session");

    // Use a TreeSet so ZAP will accept it:
    var newCookies = new java.util.TreeSet();
    var existing   = msg.getCookieParams().iterator();
    while (existing.hasNext()) {
        var p = existing.next();
        if (p.getName().equals("XSRF-TOKEN") && xsrf) {
            newCookies.add(new org.parosproxy.paros.network.HtmlParameter(cookieType, "XSRF-TOKEN", xsrf));
        }
        else if (p.getName().equals("laravel_session") && session) {
            newCookies.add(new org.parosproxy.paros.network.HtmlParameter(cookieType, "laravel_session", session));
        }
        else {
            newCookies.add(p);
        }
    }
    msg.setCookieParams(newCookies);

    if (xsrf)    print("Injected XSRF-TOKEN: " + xsrf);
    if (session) print("Injected laravel_session: " + session);
}

// --- After receiving each response ---
function responseReceived(msg, initiator, helper) {
    // Use getHeaderValues to get plain strings:
    var cookieHeaders = msg.getResponseHeader().getHeaderValues("Set-Cookie");
    for (var i = 0; i < cookieHeaders.size(); i++) {
        var header = cookieHeaders.get(i);
        if (header.indexOf("XSRF-TOKEN=") === 0) {
            var token = header.match(/XSRF-TOKEN=([^;]+)/)[1];
            ScriptVars.setGlobalVar("token.XSRF-TOKEN", token);
            print("Captured new XSRF-TOKEN: " + token);
        }
        else if (header.indexOf("laravel_session=") === 0) {
            var sess = header.match(/laravel_session=([^;]+)/)[1];
            ScriptVars.setGlobalVar("token.laravel_session", sess);
            print("Captured new laravel_session: " + sess);
        }
    }
}
