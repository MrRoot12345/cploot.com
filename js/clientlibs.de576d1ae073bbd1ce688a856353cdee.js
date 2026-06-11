(function() {

    var init = function() {

        $(".header-purchase-btn a, a.primary-button-js").hover(

            function() {
            	$(this).removeClass("hoverOut").addClass("hover");
            },
            function() {
            	$(this).removeClass("hover").addClass("hoverOut");
            }

        );

    };

    $(init);

})();

/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2012 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 */
(function(factory) {
    "use strict";

    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        var g = window.Granite = window.Granite || {};
        g.Sling = factory();
    }
}(function() {
    "use strict";

    /**
     * A helper class providing a set of Sling-related utilities.
     * @static
     * @singleton
     * @class Granite.Sling
     * @deprecated Using the constants is no longer needed and actually is not a best practice as it is not RESTful,
     *             where the server should drive the client via hypermedia and the client should not make any
     *             assumption about the URL.
     */
    return {
        /**
         * The selector for infinite hierarchy depth when retrieving repository content.
         * @static
         * @final
         * @type String
         */
        SELECTOR_INFINITY: ".infinity",

        /**
         * The parameter name for the used character set.
         * @static
         * @final
         * @type String
         */
        CHARSET: "_charset_",

        /**
         * The parameter name for the status.
         * @static
         * @final
         * @type String
         */
        STATUS: ":status",

        /**
         * The parameter value for the status type "browser".
         * @static
         * @final
         * @type String
         */
        STATUS_BROWSER: "browser",

        /**
         * The parameter name for the operation.
         * @static
         * @final
         * @type String
         */
        OPERATION: ":operation",

        /**
         * The parameter value for the delete operation.
         * @static
         * @final
         * @type String
         */
        OPERATION_DELETE: "delete",

        /**
         * The parameter value for the move operation.
         * @static
         * @final
         * @type String
         */
        OPERATION_MOVE: "move",

        /**
         * The parameter name suffix for deleting.
         * @static
         * @final
         * @type String
         */
        DELETE_SUFFIX: "@Delete",

        /**
         * The parameter name suffix for setting a type hint.
         * @static
         * @final
         * @type String
         */
        TYPEHINT_SUFFIX: "@TypeHint",

        /**
         * The parameter name suffix for copying.
         * @static
         * @final
         * @type String
         */
        COPY_SUFFIX: "@CopyFrom",

        /**
         * The parameter name suffix for moving.
         * @static
         * @final
         * @type String
         */
        MOVE_SUFFIX: "@MoveFrom",

        /**
         * The parameter name for the ordering.
         * @static
         * @final
         * @type String
         */
        ORDER: ":order",

        /**
         * The parameter name for the replace flag.
         * @static
         * @final
         * @type String
         */
        REPLACE: ":replace",

        /**
         * The parameter name for the destination flag.
         * @static
         * @final
         * @type String
         */
        DESTINATION: ":dest",

        /**
         * The parameter name for the save parameter prefix.
         * @static
         * @final
         * @type String
         */
        SAVE_PARAM_PREFIX: ":saveParamPrefix",

        /**
         * The parameter name for input fields that should be ignored by Sling.
         * @static
         * @final
         * @type String
         */
        IGNORE_PARAM: ":ignore",

        /**
         * The parameter name for login requests.
         * @static
         * @final
         * @type String
         */
        REQUEST_LOGIN_PARAM: "sling:authRequestLogin",

        /**
         * The login URL.
         * @static
         * @final
         * @type String
         */
        LOGIN_URL: "/system/sling/login.html",

        /**
         * The logout URL.
         * @static
         * @final
         * @type String
         */
        LOGOUT_URL: "/system/sling/logout.html"
    };
}));

/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2012 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 */
(function(factory) {
    "use strict";

    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        var g = window.Granite = window.Granite || {};
        g.Util = factory();
    }
}(function() {
    "use strict";

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
    var isArray = function(arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
    };

    /**
     * A helper class providing a set of general utilities.
     * @static
     * @singleton
     * @class Granite.Util
     */
    return {
        /**
         * Replaces occurrences of <code>{n}</code> in the specified text with the texts from the snippets.
         *
         * @example
         * var text = Granite.Util.patchText("{0} has signed in.", "Jack");
         * // text = "Jack has signed in."
         * var text2 = Granite.Util.patchText("{0} {1} has signed in from {2}.", ["Jack", "McFarland", "x.x.x.x"]);
         * // text2 = "Jack McFarland has signed in from x.x.x.x."
         *
         * @param {String} text The text.
         * @param {String|String[]} snippets The text(s) replacing <code>{n}</code>.
         * @returns {String} The patched text.
         */
        patchText: function(text, snippets) {
            if (snippets) {
                if (!isArray(snippets)) {
                    text = text.replace("{0}", snippets);
                } else {
                    for (var i = 0; i < snippets.length; i++) {
                        text = text.replace(("{" + i + "}"), snippets[i]);
                    }
                }
            }
            return text;
        },

        /**
         * Returns the top most accessible window.
         * Check {@link .setIFrameMode} to avoid security exception message on WebKit browsers
         * if this method is called in an iFrame included in a window from different domain.
         *
         * @returns {Window} The top window.
         */
        getTopWindow: function() {
            var win = window;
            if (this.iFrameTopWindow) {
                return this.iFrameTopWindow;
            }
            try {
                // try to access parent
                // win.parent.location.href throws an exception if not authorized (e.g. different location in a portlet)
                while (win.parent && win !== win.parent && win.parent.location.href) {
                    win = win.parent;
                }
            } catch (error) {
                // ignored
            }
            return win;
        },

        /**
         * Allows to define if Granite.Util is running in an iFrame and parent window is in another domain
         * (and optionally define what would be the top window in that case.
         * This is necessary to use {@link .getTopWindow} in a iFrame on WebKit based browsers because
         * {@link .getTopWindow} iterates on parent windows to find the top one which triggers a security exception
         * if one parent window is in a different domain. Exception cannot be caught but is not breaking the JS
         * execution.
         *
         * @param {Window} [topWindow=window] The iFrame top window. Must be running on the same host to avoid
         * security exception.
         */
        setIFrameMode: function(topWindow) {
            this.iFrameTopWindow = topWindow || window;
        },

        /**
         * Applies default properties if non-existent into the base object.
         * Child objects are merged recursively.
         * REMARK:
         *   - objects are recursively merged
         *   - simple type object properties are copied over the base
         *   - arrays are cloned and override the base (no value merging)
         *
         * @param {Object} base The object.
         * @param {...Object} pass The objects to be copied onto the base.
         * @returns {Object} The base object with defaults.
         */
        applyDefaults: function() {
            var override;
            var base = arguments[0] || {};

            for (var i = 1; i < arguments.length; i++) {
                override = arguments[i];

                for (var name in override) {
                    var value = override[name];

                    if (override.hasOwnProperty(name) && value !== undefined) {
                        if (value !== null && typeof value === "object" && !(value instanceof Array)) {
                            // nested object
                            base[name] = this.applyDefaults(base[name], value);
                        } else if (value instanceof Array) {
                            // override array
                            base[name] = value.slice(0);
                        } else {
                            // simple type
                            base[name] = value;
                        }
                    }
                }
            }

            return base;
        },

        /**
         * Returns the keycode from the given event.
         * It is a normalized value over variation of browsers' inconsistencies.
         *
         * @param {UIEvent} event The event.
         * @returns {Number} The keycode.
         */
        getKeyCode: function(event) {
            return event.keyCode ? event.keyCode : event.which;
        }
    };
}));

/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2012 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 */
/* global CQURLInfo:false, G_XHR_HOOK:false */
/* eslint strict: 0 */
(function(factory) {
    "use strict";

    if (typeof module === "object" && module.exports) {
        module.exports = factory(require("@granite/util"), require("jquery"));
    } else {
        window.Granite.HTTP = factory(Granite.Util, jQuery);
    }
}(function(util, $) {
    /**
     * A helper class providing a set of HTTP-related utilities.
     * @static
     * @singleton
     * @class Granite.HTTP
     */
    return (function() {
        /**
         * The context path used on the server.
         * May only be set by {@link #detectContextPath}.
         * @type String
         */
        var contextPath = null;

        /**
         * The regular expression to detect the context path used
         * on the server using the URL of this script.
         * @readonly
         * @type RegExp
         */
        // eslint-disable-next-line max-len
        var SCRIPT_URL_REGEXP = /^(?:http|https):\/\/[^/]+(\/.*)\/(?:etc\.clientlibs|etc(\/.*)*\/clientlibs|libs(\/.*)*\/clientlibs|apps(\/.*)*\/clientlibs|etc\/designs).*\.js(\?.*)?$/;

        /**
         * The regular expression to match `#` and other non-ASCII characters in a URI.
         * @readonly
         * @type RegExp
         */
        var ENCODE_PATH_REGEXP = /[^\w-.~%:/?[\]@!$&'()*+,;=]/;

        /**
         * The regular expression to parse URI.
         * @readonly
         * @type RegExp
         * @see https://tools.ietf.org/html/rfc3986#appendix-B
         */
        var URI_REGEXP = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;

        /**
         * Indicates after a session timeout if a refresh has already been triggered
         * in order to avoid multiple alerts.
         * @type String
         */
        var loginRedirected = false;

        var self = {};

        /**
         * Returns the scheme and authority (userinfo, host, port) components of the given URI;
         * or an empty string if the URI does not have the components.
         *
         * This method assumes the URI is valid.
         *
         * e.g. `scheme://userinfo@host:80/path?query#fragment` -> `scheme://userinfo@host:80`
         *
         * @param {String} uri The URI
         * @returns {String} The scheme and authority components
         */
        self.getSchemeAndAuthority = function(uri) {
            if (!uri) {
                return "";
            }

            var result = URI_REGEXP.exec(uri);

            if (result === null) {
                return "";
            }

            return [ result[1], result[3] ].join("");
        };

        /**
         * Returns the context path used on the server.
         *
         * @returns {String} The context path
         */
        self.getContextPath = function() {
            // Keep cache of calculated path.
            if (contextPath === null) {
                contextPath = self.detectContextPath();
            }
            return contextPath;
        };

        /**
         * Detects the context path used on the server.
         *
         * @returns {String} The context path
         * @private
         */
        self.detectContextPath = function() {
            try {
                if (window.CQURLInfo) {
                    contextPath = CQURLInfo.contextPath || "";
                } else {
                    var scripts = document.getElementsByTagName("script");
                    for (var i = 0; i < scripts.length; i++) {
                        var result = SCRIPT_URL_REGEXP.exec(scripts[i].src);
                        if (result) {
                            contextPath = result[1];
                            return contextPath;
                        }
                    }
                    contextPath = "";
                }
            } catch (e) {
                // ignored
            }

            return contextPath;
        };

        /**
         * Makes sure the specified relative URL starts with the context path
         * used on the server. If an absolute URL is passed, it will be returned
         * as-is.
         *
         * @param {String} url The URL
         * @returns {String} The externalized URL
         */
        self.externalize = function(url) {
            try {
                if (url.indexOf("/") === 0 && self.getContextPath() && url.indexOf(self.getContextPath() + "/") !== 0) {
                    url = self.getContextPath() + url;
                }
            } catch (e) {
                // ignored
            }
            return url;
        };

        /**
         * Removes scheme, authority and context path from the specified
         * absolute URL if it has the same scheme and authority as the
         * specified document (or the current one). If a relative URL is passed,
         * the context path will be stripped if present.
         *
         * @param {String} url The URL
         * @param {String} doc (optional) The document
         * @returns {String} The internalized URL
         */
        self.internalize = function(url, doc) {
            if (url.charAt(0) === "/") {
                if (contextPath === url) {
                    return "";
                } else if (contextPath && url.indexOf(contextPath + "/") === 0) {
                    return url.substring(contextPath.length);
                } else {
                    return url;
                }
            }

            if (!doc) {
                doc = document;
            }
            var docHost = self.getSchemeAndAuthority(doc.location.href);
            var urlHost = self.getSchemeAndAuthority(url);
            if (docHost === urlHost) {
                return url.substring(urlHost.length + (contextPath ? contextPath.length : 0));
            } else {
                return url;
            }
        };

        /**
         * Removes all parts but the path from the specified URL.
         * <p>Examples:<pre><code>
         /x/y.sel.html?param=abc => /x/y
         </code></pre>
         * <pre><code>
         http://www.day.com/foo/bar.html => /foo/bar
         </code></pre><p>
         *
         * @param {String} url The URL, may be empty. If empty <code>window.location.href</code> is taken.
         * @returns {String} The path
         */
        self.getPath = function(url) {
            if (!url) {
                if (window.CQURLInfo && CQURLInfo.requestPath) {
                    return CQURLInfo.requestPath;
                } else {
                    url = window.location.pathname;
                }
            } else {
                url = self.removeParameters(url);
                url = self.removeAnchor(url);
            }

            url = self.internalize(url);
            var i = url.indexOf(".", url.lastIndexOf("/"));
            if (i !== -1) {
                url = url.substring(0, i);
            }
            return url;
        };

        /**
         * Removes the fragment component from the given URI.
         *
         * This method assumes the URI is valid.
         *
         * e.g. `scheme://userinfo@host:80/path?query#fragment` -> `scheme://userinfo@host:80/path?query`
         *
         * @param {String} uri The URI
         * @returns {String} The URI without fragment component
         */
        self.removeAnchor = function(uri) {
            var fragmentIndex = uri.indexOf("#");
            if (fragmentIndex >= 0) {
                return uri.substring(0, fragmentIndex);
            } else {
                return uri;
            }
        };

        /**
         * Removes the query component and its subsequent fragment component from the given URI.
         * i.e. When query component exists, the subsequent fragment component is also removed.
         * However, when query component doesn't exist, fragment component is not removed.
         *
         * The assumption here is that the usages of `#` before the `?` are intended as part of the path component
         * that need to be encoded separately.
         * This assumption is made because `c.d.cq.commons.jcr.JcrUtil#isValidName` allows `#`.
         *
         * e.g. `scheme://userinfo@host:80/path#with#hash?query#fragment` -> `scheme://userinfo@host:80/path#with#hash`
         *
         * @param {String} uri The URL
         * @returns {String} The URI without the query component and its subsequent fragment component
         */
        self.removeParameters = function(uri) {
            var queryIndex = uri.indexOf("?");
            if (queryIndex >= 0) {
                return uri.substring(0, queryIndex);
            } else {
                return uri;
            }
        };

        /**
         * Encodes the path component of the given URI if it is not already encoded.
         * See {@link #encodePath} for the details of the encoding.
         *
         * e.g. `scheme://userinfo@host:80/path#with#hash?query#fragment`
         * -> `scheme://userinfo@host:80/path%23with%23hash?query#fragment`
         *
         * @param {String} uri The URI to encode
         * @returns {String} The encoded URI
         */
        self.encodePathOfURI = function(uri) {
            var DELIMS = [ "?", "#" ];

            var parts = [ uri ];
            var delim;
            for (var i = 0, ln = DELIMS.length; i < ln; i++) {
                delim = DELIMS[i];
                if (uri.indexOf(delim) >= 0) {
                    parts = uri.split(delim);
                    break;
                }
            }

            if (ENCODE_PATH_REGEXP.test(parts[0])) {
                parts[0] = self.encodePath(parts[0]);
            }

            return parts.join(delim);
        };

        /**
         * Encodes the given URI using `encodeURI`.
         *
         * This method is used to encode URI components from the scheme component up to the path component (inclusive).
         * Therefore, `?` and `#` are also encoded in addition.
         *
         * However `[` and `]` are not encoded.
         * The assumption here is that the usages of `[` and `]` are only at the host component (for IPv6),
         * not at the path component.
         * This assumption is made because `c.d.cq.commons.jcr.JcrUtil#isValidName` disallows `[` and `]`.
         *
         * Examples
         *
         * * `scheme://userinfo@host:80/path?query#fragment` -> `scheme://userinfo@host:80/path%3Fquery%23fragment`
         * * `http://[2001:db8:85a3:8d3:1319:8a2e:370:7348]/` -> `http://[2001:db8:85a3:8d3:1319:8a2e:370:7348]/`
         *
         * @param {String} uri The URI to encode
         * @returns {String} The encoded URI
         */
        self.encodePath = function(uri) {
            uri = encodeURI(uri);

            // Decode back `%5B` and `%5D`.
            // The `[` and `]` are not valid characters at the path component and need to be encoded,
            // which `encodeURI` does correctly.
            // However as mentioned in the doc, they are assumed to be used for authority component only.
            uri = uri.replace(/%5B/g, "[").replace(/%5D/g, "]");

            uri = uri.replace(/\?/g, "%3F");
            uri = uri.replace(/#/g, "%23");

            return uri;
        };

        /**
         * Handles login redirection if needed.
         */
        self.handleLoginRedirect = function() {
            if (!loginRedirected) {
                loginRedirected = true;
                alert(Granite.I18n.get("Your request could not be completed because you have been signed out."));

                var l = util.getTopWindow().document.location;
                l.href = self.externalize("/") + "?resource=" + encodeURIComponent(l.pathname + l.search + l.hash);
            }
        };

        /**
         * Gets the XHR hooked URL if called in a portlet context
         *
         * @param {String} url The URL to get
         * @param {String} method The method to use to retrieve the XHR hooked URL
         * @param {Object} params The parameters
         * @returns {String} The XHR hooked URL if available, the provided URL otherwise
         */
        self.getXhrHook = function(url, method, params) {
            method = method || "GET";
            if (window.G_XHR_HOOK && typeof G_XHR_HOOK === "function") {
                var p = {
                    "url": url,
                    "method": method
                };
                if (params) {
                    p["params"] = params;
                }
                return G_XHR_HOOK(p);
            }
            return null;
        };

        /**
         * Evaluates and returns the body of the specified response object.
         * Alternatively, a URL can be specified, in which case it will be
         * requested using a synchronous {@link #get} in order to acquire
         * the response object.
         *
         * @param {Object|String} response The response object or URL
         * @returns {Object} The evaluated response body
         * @since 5.3
         */
        self.eval = function(response) {
            if (typeof response !== "object") {
                response = $.ajax({
                    url: response,
                    type: "get",
                    async: false
                });
            }
            try {
                // support responseText for backward compatibility (pre 5.3)
                var text = response.body ? response.body : response.responseText;
                return JSON.parse(text);
            } catch (e) {
                // ignored
            }
            return null;
        };

        return self;
    }());
}));

/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2012 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 */
(function(factory) {
    "use strict";

    if (typeof module === "object" && module.exports) {
        module.exports = factory(require("@granite/http"));
    } else {
        window.Granite.I18n = factory(window.Granite.HTTP);
    }
}(function(HTTP) {
    "use strict";

    /**
     * A helper class providing a set of utilities related to internationalization (i18n).
     *
     * <h3>Locale Priorities</h3>
     * <p>The locale is read based on the following priorities:</p>
     * <ol>
     *   <li>manually specified locale</li>
     *   <li><code>document.documentElement.lang</code></li>
     *   <li><code>Granite.I18n.LOCALE_DEFAULT</code></li>
     * </ol>
     *
     * <h3>Dictionary Priorities</h3>
     * <p>The dictionary URL is read based on the following priorities:</p>
     * <ol>
     *   <li>manually specified URL (<code>urlPrefix</code, <code>urlSuffix</code>)</li>
     *   <li><code>data-i18n-dictionary-src</code> attribute at &lt;html&gt; element,
     *       which has the type of <a href="http://tools.ietf.org/html/rfc6570">URI Template</a> string</li>
     *   <li>The URL resolved from default <code>urlPrefix</code> and <code>urlSuffix</code></li>
     * </ol>
     *
     * <h3>URI Template of data-i18n-dictionary-src</h3>
     * <p>It expects the variable named <code>locale</code>,
     * which will be fetched from the locale (based on priorities above).
     * E.g. <code>&lt;html lang="en" data-i18n-dictionary-src="/libs/cq/i18n/dict.{+locale}.json"&gt;</code>.</p>
     *
     * @static
     * @class Granite.I18n
     */
    return (function() {
        /**
         * The map where the dictionaries are stored under their locale.
         * @type Object
         */
        var dicts = {};

        /**
         * The prefix for the URL used to request dictionaries from the server.
         * @type String
         */
        var urlPrefix = "/libs/cq/i18n/dict.";

        /**
         * The suffix for the URL used to request dictionaries from the server.
         * @type String
         */
        var urlSuffix = ".json";

        /**
         * The manually specified locale as a String or a function that returns the locale as a string.
         * @type String
         */
        var manualLocale = undefined;

        /**
         * If the current locale represents pseudo translations.
         * In that case the dictionary is expected to provide just a special
         * translation pattern to automatically convert all original strings.
         */
        var pseudoTranslations = false;

        var languages = null;

        var self = {};

        /**
         * Indicates if the dictionary parameters are specified manually.
         */
        var manualDictionary = false;

        var getDictionaryUrl = function(locale) {
            if (manualDictionary) {
                return urlPrefix + locale + urlSuffix;
            }

            var dictionarySrc;
            var htmlEl = document.querySelector("html");
            if (htmlEl) {
                dictionarySrc = htmlEl.getAttribute("data-i18n-dictionary-src");
            }

            if (!dictionarySrc) {
                return urlPrefix + locale + urlSuffix;
            }

            // dictionarySrc is a URITemplate
            // Use simple string replacement for now; for more complicated scenario, please use Granite.URITemplate
            return dictionarySrc.replace("{locale}", encodeURIComponent(locale)).replace("{+locale}", locale);
        };

        var patchText = function(text, snippets) {
            if (snippets) {
                if (Array.isArray(snippets)) {
                    for (var i = 0; i < snippets.length; i++) {
                        text = text.replace("{" + i + "}", snippets[i]);
                    }
                } else {
                    text = text.replace("{0}", snippets);
                }
            }
            return text;
        };

        /**
         * The default locale (en).
         * @readonly
         * @type String
         */
        self.LOCALE_DEFAULT = "en";

        /**
         * The language code for pseudo translations.
         * @readonly
         * @type String
         */
        self.PSEUDO_LANGUAGE = "zz";

        /**
         * The dictionary key for pseudo translation pattern.
         * @readonly
         * @type String
         */
        self.PSEUDO_PATTERN_KEY = "_pseudoPattern_";

        /**
         * Initializes I18n with the given config options:
         * <ul>
         * <li>locale: the current locale (defaults to "en")</li>
         * <li>urlPrefix: the prefix for the URL used to request dictionaries from
         * the server (defaults to "/libs/cq/i18n/dict.")</li>
         * <li>urlSuffix: the suffix for the URL used to request dictionaries from
         * the server (defaults to ".json")</li>
         * </ul>
         * Sample config. The dictionary would be requested from
         * "/apps/i18n/dict.fr.json":
         <code><pre>{
         "locale": "fr",
         "urlPrefix": "/apps/i18n/dict.",
         "urlSuffix": ".json"
         }</pre></code>
         *
         * @param {Object} config The config
         */
        self.init = function(config) {
            config = config || {};

            this.setLocale(config.locale);
            this.setUrlPrefix(config.urlPrefix);
            this.setUrlSuffix(config.urlSuffix);
        };

        /**
         * Sets the current locale.
         *
         * @param {String|Function} locale The locale or a function that returns the locale as a string
         */
        self.setLocale = function(locale) {
            if (!locale) {
                return;
            }
            manualLocale = locale;
        };

        /**
         * Returns the current locale based on the priorities.
         *
         * @returns {String} The locale
         */
        self.getLocale = function() {
            if (typeof manualLocale === "function") {
                // execute function first time only and store result in currentLocale
                manualLocale = manualLocale();
            }
            return manualLocale || document.documentElement.lang || self.LOCALE_DEFAULT;
        };

        /**
         * Sets the prefix for the URL used to request dictionaries from
         * the server. The locale and URL suffix will be appended.
         *
         * @param {String} prefix The URL prefix
         */
        self.setUrlPrefix = function(prefix) {
            if (!prefix) {
                return;
            }
            urlPrefix = prefix;
            manualDictionary = true;
        };

        /**
         * Sets the suffix for the URL used to request dictionaries from
         * the server. It will be appended to the URL prefix and locale.
         *
         * @param {String} suffix The URL suffix
         */
        self.setUrlSuffix = function(suffix) {
            if (!suffix) {
                return;
            }
            urlSuffix = suffix;
            manualDictionary = true;
        };

        /**
         * Returns the dictionary for the specified locale. This method
         * will request the dictionary using the URL prefix, the locale,
         * and the URL suffix. If no locale is specified, the current
         * locale is used.
         *
         * @param {String} locale (optional) The locale
         * @returns {Object} The dictionary
         */
        self.getDictionary = function(locale) {
            locale = locale || self.getLocale();

            if (!dicts[locale]) {
                pseudoTranslations = locale.indexOf(self.PSEUDO_LANGUAGE) === 0;

                $.ajax({
                    url: getDictionaryUrl(locale),
                    type: 'GET',
                    async: false,
                    error: function(){
                        return true;
                    },
                    success: function(data){ 
                        dicts[locale] = data;

                        if (!dicts[locale]) {
                            dicts[locale] = {};
                        }
                    }
                });
                //try {

                    /*var xhr = new XMLHttpRequest();
                    xhr.open("GET", HTTP.externalize(getDictionaryUrl(locale)), false); 
                    xhr.send();

                    dicts[locale] = JSON.parse(xhr.responseText);*/


                //} catch (e) {
                    // ignored
                //}
                /*if (!dicts[locale]) {
                    dicts[locale] = {};
                }*/
            }

            return dicts[locale];

        };

        /**
         * Translates the specified text into the current language.
         *
         * @param {String} text The text to translate
         * @param {String[]} snippets The snippets replacing <code>{n}</code> (optional)
         * @param {String} note A hint for translators (optional)
         * @returns {String} The translated text
         */
        self.get = function(text, snippets, note) {
            var dict;
            var newText;
            var lookupText;

            dict = self.getDictionary();

            // note that pseudoTranslations is initialized in the getDictionary() call above
            lookupText = pseudoTranslations ? self.PSEUDO_PATTERN_KEY
                : note ? text + " ((" + note + "))"
                    : text;
            if (dict) {
                newText = dict[lookupText];
            }
            if (!newText) {
                newText = text;
            }
            if (pseudoTranslations) {
                newText = newText.replace("{string}", text).replace("{comment}", note ? note : "");
            }
            return patchText(newText, snippets);
        };

        /**
         * Translates the specified text into the current language. Use this
         * method to translate String variables, e.g. data from the server.
         *
         * @param {String} text The text to translate
         * @param {String} note A hint for translators (optional)
         * @returns {String} The translated text
         */
        self.getVar = function(text, note) {
            if (!text) {
                return null;
            }
            return self.get(text, null, note);
        };

        /**
         * Returns the available languages, including a "title" property with a display name:
         * for instance "German" for "de" or "German (Switzerland)" for "de_ch".
         *
         * @returns {Object} An object with language codes as keys and an object with "title",
         *                  "language", "country" and "defaultCountry" members.
         */
        self.getLanguages = function() {
            if (!languages) {
                try {
                    // use overlay servlet so customers can define /apps/wcm/core/resources/languages
                    // TODO: broken!!!
                    var url = HTTP.externalize("/libs/wcm/core/resources/languages.overlay.infinity.json");
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, false);
                    xhr.send();

                    var json = JSON.parse(xhr.responseText);

                    Object.keys(json).forEach(function(prop) {
                        var lang = json[prop];
                        if (lang.language) {
                            lang.title = self.getVar(lang.language);
                        }
                        if (lang.title && lang.country && lang.country !== "*") {
                            lang.title += " (" + self.getVar(lang.country) + ")";
                        }
                    });
                    languages = json;
                } catch (e) {
                    languages = {};
                }
            }
            return languages;
        };

        /**
         * Parses a language code string such as "de_CH" and returns an object with
         * language and country extracted. The delimiter can be "_" or "-".
         *
         * @param {String} langCode a language code such as "de" or "de_CH" or "de-ch"
         * @returns {Object} an object with "code" ("de_CH"), "language" ("de") and "country" ("CH")
         *                  (or null if langCode was null)
         */
        self.parseLocale = function(langCode) {
            if (!langCode) {
                return null;
            }
            var pos = langCode.indexOf("_");
            if (pos < 0) {
                pos = langCode.indexOf("-");
            }

            var language;
            var country;
            if (pos < 0) {
                language = langCode;
                country = null;
            } else {
                language = langCode.substring(0, pos);
                country = langCode.substring(pos + 1);
            }
            return {
                code: langCode,
                language: language,
                country: country
            };
        };

        return self;
    }());
})); 

/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2012 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 */
(function(factory) {
    "use strict";

    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        var g = window.Granite = window.Granite || {};
        g.TouchIndicator = factory();
    }
}(function() {
    "use strict";

    function createIndicator() {
        var el = document.createElement("div");
        el.style.visibility = "hidden";
        // fixed would be better, but flickers on ipad while scrolling
        el.style.position = "absolute";
        el.style.width = "30px";
        el.style.height = "30px";
        el.style.borderRadius = "20px";
        el.style.border = "5px solid orange";
        el.style.userSelect = "none";
        el.style.opacity = "0.5";
        el.style.zIndex = "2000";
        el.style.pointerEvents = "none";
        return el;
    }

    var used = {};

    var unused = [];

    /**
     * Implements the "Adobe Dynamic Touch Indicator" that tracks touch events and displays a visual indicator for
     * screen sharing and presentation purposes.
     *
     * To enable it, call <code>Granite.TouchIndicator.init()</code> e.g. on document ready:
     * <pre><code>
     * Granite.$(document).ready(function() {
     *     Granite.TouchIndicator.init();
     * });
     * </code></pre>
     *
     * AdobePatentID="2631US01"
     */
    return {
        debugWithMouse: false,

        init: function() {
            var self = this;

            var update = function(e) {
                self.update(e.touches);
                return true;
            };
            document.addEventListener("touchstart", update);
            document.addEventListener("touchmove", update);
            document.addEventListener("touchend", update);

            if (this.debugWithMouse) {
                document.addEventListener("mousemove", function(e) {
                    e.identifer = "fake";
                    self.update([ e ]);
                    return true;
                });
            }
        },

        update: function(touches) {
            // go over all touch events present in the array
            var retained = {};
            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var id = touch.identifier;

                // check if we already have a indicator with the correct id
                var indicator = used[id];
                if (!indicator) {
                    // if not, check if we have an unused one
                    indicator = unused.pop();

                    // if not, create a new one and append it to the dom
                    if (!indicator) {
                        indicator = createIndicator();
                        document.body.appendChild(indicator);
                    }
                }

                retained[id] = indicator;
                indicator.style.left = (touch.pageX - 20) + "px";
                indicator.style.top = (touch.pageY - 20) + "px";
                indicator.style.visibility = "visible";
            }

            // now hide all unused ones and stuff them in the unused array
            for (id in used) {
                if (used.hasOwnProperty(id) && !retained[id]) {
                    indicator = used[id];
                    indicator.style.visibility = "hidden";
                    unused.push(indicator);
                }
            }
            used = retained;
        }
    };
}));

/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2012 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 */
(function(factory) {
    "use strict";

    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        var g = window.Granite = window.Granite || {};
        g.OptOutUtil = factory();
    }
}(function($) {
    "use strict";

    function trim(s) {
        if (String.prototype.trim) {
            return s.trim();
        }
        return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    }

    /**
     * A library to determine whether any opt-out cookie is set and whether a given cookie name is white-listed.
     *
     * The opt-out and white-list cookie names are determined by a server-side configuration
     * (<code>com.adobe.granite.security.commons.OptOutService</code>) and provided to this tool by an optionally
     * included component (<code>/libs/granite/security/components/optout</code>) which provides a global JSON object
     * named <code>GraniteOptOutConfig</code>.
     *
     * @static
     * @class Granite.OptOutUtil
     */
    return (function() {
        var self = {};

        /**
         * The names of cookies the presence of which indicates the user has opted out.
         * @type String[]
         */
        var optOutCookieNames = [];

        /**
         * The names of cookies which may still be set in spite of the user having opted out.
         * @type String[]
         */
        var whitelistedCookieNames = [];

        /**
         * Initializes this tool with an opt-out configuration.
         *
         * The following options are supported:
         * <ul>
         *     <li>cookieNames: an array of cookie names representing opt-out cookies. Defaults to empty.</li>
         *     <li>whitelistCookieNames: an array of cookies representing white-listed cookies. Defaults to empty.</li>
         * </ul>
         *
         * @param {Object} config The opt-out configuration.
         *
         * @example
         * {
         *     "cookieNames": ["omniture_optout","cq-opt-out"],
         *     "whitelistCookieNames": ["someAppCookie", "anotherImportantAppCookie"]
         * }
         */
        self.init = function(config) {
            if (config) {
                optOutCookieNames = config.cookieNames || [];
                whitelistedCookieNames = config.whitelistCookieNames || [];
            } else {
                optOutCookieNames = [];
                whitelistedCookieNames = [];
            }
        };

        /**
         * Returns the array of configured cookie names representing opt-out cookies.
         *
         * @returns {String[]} The cookie names.
         */
        self.getCookieNames = function() {
            return optOutCookieNames;
        };

        /**
         * Returns the array of configured cookie names representing white-listed cookies.
         *
         * @returns {String[]} The cookie names.
         */
        self.getWhitelistCookieNames = function() {
            return whitelistedCookieNames;
        };

        /**
         * Determines whether the user (browser) has elected to opt-out.
         * This is indicated by the presence of one of the cookies retrieved through {@link #getCookieNames()}.
         *
         * @returns {Boolean} <code>true</code> if an opt-cookie was found in the browser's cookies;
         *     <code>false</code> otherwise.
         */
        self.isOptedOut = function() {
            var browserCookies = document.cookie.split(";");
            for (var i = 0; i < browserCookies.length; i++) {
                var cookie = browserCookies[i];
                var cookieName = trim(cookie.split("=")[0]);
                if (self.getCookieNames().indexOf(cookieName) >= 0) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Determines whether the given <code>cookieName</code> may be used to set a cookie.
         * This is the case if either opt-out is inactive (<code>{@link #isOptedOut()} === false</code>) or it is
         * active and the give cookie name was found in the white-list ({@link #getWhitelistCookieNames()}).
         *
         * @param {String} cookieName The name of the cookie to check.
         * @returns {Boolean} <code>true</code> if a cookie of this name may be used with respect to the opt-out status;
         *     <code>false</code> otherwise.
         */
        self.maySetCookie = function(cookieName) {
            return !(self.isOptedOut() && self.getWhitelistCookieNames().indexOf(cookieName) === -1);
        };

        return self;
    }());
}));

/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2012 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 */


//------------------------------------------------------------------------------
// Initialize the Granite utils library

Granite.OptOutUtil.init(window.GraniteOptOutConfig);
Granite.HTTP.detectContextPath();

!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(d){"use strict";var s,l=window.Slick||{};s=0,(l=function(i,e){var t,o=this;o.defaults={adaptiveHeight:!1,appendArrows:d(i),appendDots:d(i),arrows:!0,arrowsPlacement:null,asNavFor:null,prevArrow:'<button class="slick-prev" type="button"><span class="slick-prev-icon" aria-hidden="true"></span><span class="slick-sr-only">Previous</span></button>',nextArrow:'<button class="slick-next" type="button"><span class="slick-next-icon" aria-hidden="true"></span><span class="slick-sr-only">Next</span></button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(i,e){return d('<button type="button"><span class="slick-dot-icon" aria-hidden="true"></span><span class="slick-sr-only">Go to slide '+(e+1)+"</span></button>")},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,infinite:!0,initialSlide:0,instructionsText:null,lazyLoad:"ondemand",mobileFirst:!1,playIcon:'<span class="slick-play-icon" aria-hidden="true"></span>',pauseIcon:'<span class="slick-pause-icon" aria-hidden="true"></span>',pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,regionLabel:"carousel",respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useAutoplayToggleButton:!0,useCSS:!0,useGroupRole:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},o.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,$instructionsText:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$pauseButton:null,$pauseIcon:null,$playIcon:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},d.extend(o,o.initials),o.activeBreakpoint=null,o.animType=null,o.animProp=null,o.breakpoints=[],o.breakpointSettings=[],o.cssTransitions=!1,o.focussed=!1,o.interrupted=!1,o.hidden="hidden",o.paused=!0,o.positionProp=null,o.respondTo=null,o.rowCount=1,o.shouldClick=!0,o.$slider=d(i),o.$slidesCache=null,o.transformType=null,o.transitionType=null,o.visibilityChange="visibilitychange",o.windowWidth=0,o.windowTimer=null,t=d(i).data("slick")||{},o.options=d.extend({},o.defaults,e,t),o.currentSlide=o.options.initialSlide,o.originalSettings=o.options,void 0!==document.mozHidden?(o.hidden="mozHidden",o.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(o.hidden="webkitHidden",o.visibilityChange="webkitvisibilitychange"),o.autoPlay=d.proxy(o.autoPlay,o),o.autoPlayClear=d.proxy(o.autoPlayClear,o),o.autoPlayIterator=d.proxy(o.autoPlayIterator,o),o.autoPlayToggleHandler=d.proxy(o.autoPlayToggleHandler,o),o.changeSlide=d.proxy(o.changeSlide,o),o.clickHandler=d.proxy(o.clickHandler,o),o.selectHandler=d.proxy(o.selectHandler,o),o.setPosition=d.proxy(o.setPosition,o),o.swipeHandler=d.proxy(o.swipeHandler,o),o.dragHandler=d.proxy(o.dragHandler,o),o.instanceUid=s++,o.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,o.registerBreakpoints(),o.init(!0)}).prototype.addSlide=l.prototype.slickAdd=function(i,e,t){var o=this;if("boolean"==typeof e)t=e,e=null;else if(e<0||e>=o.slideCount)return!1;o.unload(),"number"==typeof e?0===e&&0===o.$slides.length?d(i).appendTo(o.$slideTrack):t?d(i).insertBefore(o.$slides.eq(e)):d(i).insertAfter(o.$slides.eq(e)):!0===t?d(i).prependTo(o.$slideTrack):d(i).appendTo(o.$slideTrack),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slides.each(function(i,e){d(e).attr("data-slick-index",i),d(e).attr("role","group"),d(e).attr("aria-label","slide "+i)}),o.$slidesCache=o.$slides,o.reinit()},l.prototype.animateHeight=function(){var i,e=this;1===e.options.slidesToShow&&!0===e.options.adaptiveHeight&&!1===e.options.vertical&&(i=e.$slides.eq(e.currentSlide).outerHeight(!0),e.$list.animate({height:i},e.options.speed))},l.prototype.animateSlide=function(i,e){var t={},o=this;o.animateHeight(),!0===o.options.rtl&&!1===o.options.vertical&&(i=-i),!1===o.transformsEnabled?!1===o.options.vertical?o.$slideTrack.animate({left:i},o.options.speed,o.options.easing,e):o.$slideTrack.animate({top:i},o.options.speed,o.options.easing,e):!1===o.cssTransitions?(!0===o.options.rtl&&(o.currentLeft=-o.currentLeft),d({animStart:o.currentLeft}).animate({animStart:i},{duration:o.options.speed,easing:o.options.easing,step:function(i){i=Math.ceil(i),!1===o.options.vertical?t[o.animType]="translate("+i+"px, 0px)":t[o.animType]="translate(0px,"+i+"px)",o.$slideTrack.css(t)},complete:function(){e&&e.call()}})):(o.applyTransition(),i=Math.ceil(i),!1===o.options.vertical?t[o.animType]="translate3d("+i+"px, 0px, 0px)":t[o.animType]="translate3d(0px,"+i+"px, 0px)",o.$slideTrack.css(t),e&&setTimeout(function(){o.disableTransition(),e.call()},o.options.speed))},l.prototype.getNavTarget=function(){var i=this.options.asNavFor;return i&&null!==i&&(i=d(i).not(this.$slider)),i},l.prototype.asNavFor=function(e){var i=this.getNavTarget();null!==i&&"object"==typeof i&&i.each(function(){var i=d(this).slick("getSlick");i.unslicked||i.slideHandler(e,!0)})},l.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},l.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},l.prototype.autoPlayClear=function(){this.autoPlayTimer&&clearInterval(this.autoPlayTimer)},l.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},l.prototype.autoPlayToggleHandler=function(){var i=this;i.paused?(i.$playIcon.css("display","none"),i.$pauseIcon.css("display","inline"),i.$pauseButton.find(".slick-play-text").attr("style","display: none"),i.$pauseButton.find(".slick-pause-text").removeAttr("style"),i.slickPlay()):(i.$playIcon.css("display","inline"),i.$pauseIcon.css("display","none"),i.$pauseButton.find(".slick-play-text").removeAttr("style"),i.$pauseButton.find(".slick-pause-text").attr("style","display: none"),i.slickPause())},l.prototype.buildArrows=function(){var i=this;if(!0===i.options.arrows)if(i.$prevArrow=d(i.options.prevArrow).addClass("slick-arrow"),i.$nextArrow=d(i.options.nextArrow).addClass("slick-arrow"),i.slideCount>i.options.slidesToShow){if(i.htmlExpr.test(i.options.prevArrow))if(null!=i.options.arrowsPlacement)switch(i.options.arrowsPlacement){case"beforeSlides":case"split":console.log("test"),i.$prevArrow.prependTo(i.options.appendArrows);break;case"afterSlides":i.$prevArrow.appendTo(i.options.appendArrows)}else i.$prevArrow.prependTo(i.options.appendArrows);if(i.htmlExpr.test(i.options.nextArrow))if(null!=i.options.arrowsPlacement)switch(i.options.arrowsPlacement){case"beforeSlides":console.log("test2"),i.$prevArrow.after(i.$nextArrow);break;case"afterSlides":case"split":i.$nextArrow.appendTo(i.options.appendArrows)}else i.$nextArrow.appendTo(i.options.appendArrows);!0!==i.options.infinite&&i.$prevArrow.addClass("slick-disabled").prop("disabled",!0)}else i.$prevArrow.add(i.$nextArrow).addClass("slick-hidden").prop("disabled",!0)},l.prototype.buildDots=function(){var i,e,t=this;if(!0===t.options.dots&&t.slideCount>t.options.slidesToShow){for(t.$slider.addClass("slick-dotted"),e=d("<ul />").addClass(t.options.dotsClass),i=0;i<=t.getDotCount();i+=1)e.append(d("<li />").append(t.options.customPaging.call(this,t,i)));t.$dots=e.appendTo(t.options.appendDots),t.$dots.find("li").first().addClass("slick-active")}},l.prototype.buildOut=function(){var t=this;t.$slides=t.$slider.children(t.options.slide+":not(.slick-cloned)").addClass("slick-slide"),t.slideCount=t.$slides.length,t.$slides.each(function(i,e){d(e).attr("data-slick-index",i).data("originalStyling",d(e).attr("style")||""),t.options.useGroupRole&&d(e).attr("role","group").attr("aria-label","slide "+(i+1))}),t.$slider.addClass("slick-slider"),t.$slider.attr("role","region"),t.$slider.attr("aria-label",t.options.regionLabel),t.$slideTrack=0===t.slideCount?d('<div class="slick-track"/>').appendTo(t.$slider):t.$slides.wrapAll('<div class="slick-track"/>').parent(),t.$list=t.$slideTrack.wrap('<div class="slick-list"/>').parent(),t.$slideTrack.css("opacity",0),!0!==t.options.centerMode&&!0!==t.options.swipeToSlide||(t.options.slidesToScroll=1),d("img[data-lazy]",t.$slider).not("[src]").addClass("slick-loading"),t.setupInfinite(),t.buildArrows(),t.buildDots(),t.updateDots(),t.setSlideClasses("number"==typeof t.currentSlide?t.currentSlide:0),!0===t.options.draggable&&t.$list.addClass("draggable"),t.options.autoplay&&t.options.useAutoplayToggleButton&&(t.$pauseIcon=d(t.options.pauseIcon).attr("aria-hidden",!0),t.$playIcon=d(t.options.playIcon).attr("aria-hidden",!0),t.$pauseButton=d('<button type="button" class="slick-autoplay-toggle-button">'),t.$pauseButton.append(t.$pauseIcon),t.$pauseButton.append(t.$playIcon.css("display","none")),t.$pauseButton.append(d('<span class="slick-pause-text slick-sr-only">Pause</span>')),t.$pauseButton.append(d('<span class="slick-play-text slick-sr-only" style="display: none">Play</span>')),t.$pauseButton.prependTo(t.$slider)),null!=t.options.instructionsText&&""!=t.options.instructionsText&&(t.$instructionsText=d('<p class="slick-instructions slick-sr-only">'+t.options.instructionsText+"</p>"),t.$instructionsText.prependTo(t.$slider))},l.prototype.buildRows=function(){var i,e,t,o=this,s=document.createDocumentFragment(),n=o.$slider.children();if(0<o.options.rows){for(t=o.options.slidesPerRow*o.options.rows,e=Math.ceil(n.length/t),i=0;i<e;i++){for(var l=document.createElement("div"),r=0;r<o.options.rows;r++){for(var a=document.createElement("div"),d=0;d<o.options.slidesPerRow;d++){var p=i*t+(r*o.options.slidesPerRow+d);n.get(p)&&a.appendChild(n.get(p))}l.appendChild(a)}s.appendChild(l)}o.$slider.empty().append(s),o.$slider.children().children().children().css({width:100/o.options.slidesPerRow+"%",display:"inline-block"})}},l.prototype.checkResponsive=function(i,e){var t,o,s,n=this,l=!1,r=n.$slider.width(),a=window.innerWidth||d(window).width();if("window"===n.respondTo?s=a:"slider"===n.respondTo?s=r:"min"===n.respondTo&&(s=Math.min(a,r)),n.options.responsive&&n.options.responsive.length&&null!==n.options.responsive){for(t in o=null,n.breakpoints)n.breakpoints.hasOwnProperty(t)&&(!1===n.originalSettings.mobileFirst?s<n.breakpoints[t]&&(o=n.breakpoints[t]):s>n.breakpoints[t]&&(o=n.breakpoints[t]));null!==o?null!==n.activeBreakpoint&&o===n.activeBreakpoint&&!e||(n.activeBreakpoint=o,"unslick"===n.breakpointSettings[o]?n.unslick(o):(n.options=d.extend({},n.originalSettings,n.breakpointSettings[o]),!0===i&&(n.currentSlide=n.options.initialSlide),n.refresh(i)),l=o):null!==n.activeBreakpoint&&(n.activeBreakpoint=null,n.options=n.originalSettings,!0===i&&(n.currentSlide=n.options.initialSlide),n.refresh(i),l=o),i||!1===l||n.$slider.trigger("breakpoint",[n,l])}},l.prototype.changeSlide=function(i,e){var t,o,s=this,n=d(i.currentTarget);switch(n.is("a")&&i.preventDefault(),n.is("li")||(n=n.closest("li")),t=s.slideCount%s.options.slidesToScroll!=0?0:(s.slideCount-s.currentSlide)%s.options.slidesToScroll,i.data.message){case"previous":o=0==t?s.options.slidesToScroll:s.options.slidesToShow-t,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide-o,!1,e);break;case"next":o=0==t?s.options.slidesToScroll:t,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide+o,!1,e);break;case"index":var l=0===i.data.index?0:i.data.index||n.index()*s.options.slidesToScroll;s.slideHandler(s.checkNavigable(l),!1,e),n.children().trigger("focus");break;default:return}},l.prototype.checkNavigable=function(i){var e=this.getNavigableIndexes(),t=0;if(i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},l.prototype.cleanUpEvents=function(){var i=this;i.options.autoplay&&i.options.useAutoplayToggleButton&&i.$pauseButton.off("click.slick",i.autoPlayToggleHandler),i.options.dots&&null!==i.$dots&&d("li",i.$dots).off("click.slick",i.changeSlide).off("mouseenter.slick",d.proxy(i.interrupt,i,!0)).off("mouseleave.slick",d.proxy(i.interrupt,i,!1)),i.$slider.off("focus.slick blur.slick"),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow&&i.$prevArrow.off("click.slick",i.changeSlide),i.$nextArrow&&i.$nextArrow.off("click.slick",i.changeSlide)),i.$list.off("touchstart.slick mousedown.slick",i.swipeHandler),i.$list.off("touchmove.slick mousemove.slick",i.swipeHandler),i.$list.off("touchend.slick mouseup.slick",i.swipeHandler),i.$list.off("touchcancel.slick mouseleave.slick",i.swipeHandler),i.$list.off("click.slick",i.clickHandler),d(document).off(i.visibilityChange,i.visibility),i.cleanUpSlideEvents(),d(window).off("orientationchange.slick.slick-"+i.instanceUid,i.orientationChange),d(window).off("resize.slick.slick-"+i.instanceUid,i.resize),d("[draggable!=true]",i.$slideTrack).off("dragstart",i.preventDefault),d(window).off("load.slick.slick-"+i.instanceUid,i.setPosition)},l.prototype.cleanUpSlideEvents=function(){var i=this;i.$list.off("mouseenter.slick",d.proxy(i.interrupt,i,!0)),i.$list.off("mouseleave.slick",d.proxy(i.interrupt,i,!1))},l.prototype.cleanUpRows=function(){var i;0<this.options.rows&&((i=this.$slides.children().children()).removeAttr("style"),this.$slider.empty().append(i))},l.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},l.prototype.destroy=function(i){var e=this;e.autoPlayClear(),e.touchObject={},e.cleanUpEvents(),d(".slick-cloned",e.$slider).detach(),e.options.autoplay&&e.options.useAutoplayToggleButton&&e.$pauseButton.remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.$prevArrow.length&&(e.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").prop("disabled",!1).css("display",""),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove()),e.$nextArrow&&e.$nextArrow.length&&(e.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").prop("disabled",!1).css("display",""),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove()),e.$slides&&(e.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){d(this).attr("style",d(this).data("originalStyling"))}),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.detach(),e.$list.detach(),e.$slider.append(e.$slides)),e.cleanUpRows(),e.$slider.removeClass("slick-slider"),e.$slider.removeClass("slick-initialized"),e.$slider.removeClass("slick-dotted"),e.unslicked=!0,i||e.$slider.trigger("destroy",[e])},l.prototype.disableTransition=function(i){var e={};e[this.transitionType]="",!1===this.options.fade?this.$slideTrack.css(e):this.$slides.eq(i).css(e)},l.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},l.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},l.prototype.filterSlides=l.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},l.prototype.focusHandler=function(){var t=this;t.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(i){var e=d(this);setTimeout(function(){t.options.pauseOnFocus&&e.is(":focus")&&(t.focussed=!0,t.autoPlay())},0)}).on("blur.slick","*",function(i){d(this);t.options.pauseOnFocus&&(t.focussed=!1,t.autoPlay())})},l.prototype.getCurrent=l.prototype.slickCurrentSlide=function(){return this.currentSlide},l.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},l.prototype.getLeft=function(i){var e,t,o,s,n=this,l=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),l=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(l=i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,l=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(l=n.slideOffset=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+l,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},l.prototype.getOption=l.prototype.slickGetOption=function(i){return this.options[i]},l.prototype.getNavigableIndexes=function(){for(var i=this,e=0,t=0,o=[],s=!1===i.options.infinite?i.slideCount:(e=-1*i.options.slidesToScroll,t=-1*i.options.slidesToScroll,2*i.slideCount);e<s;)o.push(e),e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;return o},l.prototype.getSlick=function(){return this},l.prototype.getSlideCount=function(){var s,n=this,i=!0===n.options.centerMode?Math.floor(n.$list.width()/2):0,l=-1*n.swipeLeft+i;return!0===n.options.swipeToSlide?(n.$slideTrack.find(".slick-slide").each(function(i,e){var t=d(e).outerWidth(),o=e.offsetLeft;if(!0!==n.options.centerMode&&(o+=t/2),l<o+t)return s=e,!1}),Math.abs(d(s).attr("data-slick-index")-n.currentSlide)||1):n.options.slidesToScroll},l.prototype.goTo=l.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},l.prototype.init=function(i){var e=this;d(e.$slider).hasClass("slick-initialized")||(d(e.$slider).addClass("slick-initialized"),e.buildRows(),e.buildOut(),e.setProps(),e.startLoad(),e.loadSlider(),e.initializeEvents(),e.updateArrows(),e.updateDots(),e.checkResponsive(!0),e.focusHandler()),i&&e.$slider.trigger("init",[e]),e.options.autoplay&&(e.paused=!1,e.autoPlay()),e.updateSlideVisibility(),null!=e.options.accessibility&&console.warn("accessibility setting is no longer supported."),null!=e.options.focusOnChange&&console.warn("focusOnChange is no longer supported."),null!=e.options.focusOnSelect&&console.warn("focusOnSelect is no longer supported.")},l.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide))},l.prototype.initDotEvents=function(){var i=this;!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&d("li",i.$dots).on("click.slick",{message:"index"},i.changeSlide),!0===i.options.dots&&!0===i.options.pauseOnDotsHover&&i.slideCount>i.options.slidesToShow&&d("li",i.$dots).on("mouseenter.slick",d.proxy(i.interrupt,i,!0)).on("mouseleave.slick",d.proxy(i.interrupt,i,!1))},l.prototype.initSlideEvents=function(){var i=this;i.options.pauseOnHover&&(i.$list.on("mouseenter.slick",d.proxy(i.interrupt,i,!0)),i.$list.on("mouseleave.slick",d.proxy(i.interrupt,i,!1)))},l.prototype.initializeEvents=function(){var i=this;i.initArrowEvents(),i.initDotEvents(),i.initSlideEvents(),i.options.autoplay&&i.options.useAutoplayToggleButton&&i.$pauseButton.on("click.slick",i.autoPlayToggleHandler),i.$list.on("touchstart.slick mousedown.slick",{action:"start"},i.swipeHandler),i.$list.on("touchmove.slick mousemove.slick",{action:"move"},i.swipeHandler),i.$list.on("touchend.slick mouseup.slick",{action:"end"},i.swipeHandler),i.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},i.swipeHandler),i.$list.on("click.slick",i.clickHandler),d(document).on(i.visibilityChange,d.proxy(i.visibility,i)),d(window).on("orientationchange.slick.slick-"+i.instanceUid,d.proxy(i.orientationChange,i)),d(window).on("resize.slick.slick-"+i.instanceUid,d.proxy(i.resize,i)),d("[draggable!=true]",i.$slideTrack).on("dragstart",i.preventDefault),d(window).on("load.slick.slick-"+i.instanceUid,i.setPosition),d(i.setPosition)},l.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},l.prototype.lazyLoad=function(){var i,e,t,n=this;function o(i){d("img[data-lazy]",i).each(function(){var i=d(this),e=d(this).attr("data-lazy"),t=d(this).attr("data-srcset"),o=d(this).attr("data-sizes")||n.$slider.attr("data-sizes"),s=document.createElement("img");s.onload=function(){i.animate({opacity:0},100,function(){t&&(i.attr("srcset",t),o&&i.attr("sizes",o)),i.attr("src",e).animate({opacity:1},200,function(){i.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,i,e])})},s.onerror=function(){i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,i,e])},s.src=e})}if(!0===n.options.centerMode?t=!0===n.options.infinite?(e=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(e=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),n.options.slidesToShow/2+1+2+n.currentSlide):(e=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,t=Math.ceil(e+n.options.slidesToShow),!0===n.options.fade&&(0<e&&e--,t<=n.slideCount&&t++)),i=n.$slider.find(".slick-slide").slice(e,t),"anticipated"===n.options.lazyLoad)for(var s=e-1,l=t,r=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)s<0&&(s=n.slideCount-1),i=(i=i.add(r.eq(s))).add(r.eq(l)),s--,l++;o(i),n.slideCount<=n.options.slidesToShow?o(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?o(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&o(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},l.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},l.prototype.next=l.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},l.prototype.orientationChange=function(){this.checkResponsive(),this.setPosition()},l.prototype.pause=l.prototype.slickPause=function(){this.autoPlayClear(),this.paused=!0},l.prototype.play=l.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},l.prototype.postSlide=function(i){var e=this;e.unslicked||(e.$slider.trigger("afterChange",[e,i]),e.animating=!1,e.slideCount>e.options.slidesToShow&&e.setPosition(),e.swipeLeft=null,e.options.autoplay&&e.autoPlay(),e.updateSlideVisibility())},l.prototype.prev=l.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},l.prototype.preventDefault=function(i){i.preventDefault()},l.prototype.progressiveLazyLoad=function(i){i=i||1;var e,t,o,s,n,l=this,r=d("img[data-lazy]",l.$slider);r.length?(e=r.first(),t=e.attr("data-lazy"),o=e.attr("data-srcset"),s=e.attr("data-sizes")||l.$slider.attr("data-sizes"),(n=document.createElement("img")).onload=function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,e,t]),l.progressiveLazyLoad()},n.onerror=function(){i<3?setTimeout(function(){l.progressiveLazyLoad(i+1)},500):(e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,e,t]),l.progressiveLazyLoad())},n.src=t):l.$slider.trigger("allImagesLoaded",[l])},l.prototype.refresh=function(i){var e,t=this,o=t.slideCount-t.options.slidesToShow;!t.options.infinite&&t.currentSlide>o&&(t.currentSlide=o),t.slideCount<=t.options.slidesToShow&&(t.currentSlide=0),e=t.currentSlide,t.destroy(!0),d.extend(t,t.initials,{currentSlide:e}),t.init(),i||t.changeSlide({data:{message:"index",index:e}},!1)},l.prototype.registerBreakpoints=function(){var i,e,t,o=this,s=o.options.responsive||null;if("array"===d.type(s)&&s.length){for(i in o.respondTo=o.options.respondTo||"window",s)if(t=o.breakpoints.length-1,s.hasOwnProperty(i)){for(e=s[i].breakpoint;0<=t;)o.breakpoints[t]&&o.breakpoints[t]===e&&o.breakpoints.splice(t,1),t--;o.breakpoints.push(e),o.breakpointSettings[e]=s[i].settings}o.breakpoints.sort(function(i,e){return o.options.mobileFirst?i-e:e-i})}},l.prototype.reinit=function(){var i=this;i.$slides=i.$slideTrack.children(i.options.slide).addClass("slick-slide"),i.slideCount=i.$slides.length,i.currentSlide>=i.slideCount&&0!==i.currentSlide&&(i.currentSlide=i.currentSlide-i.options.slidesToScroll),i.slideCount<=i.options.slidesToShow&&(i.currentSlide=0),i.registerBreakpoints(),i.setProps(),i.setupInfinite(),i.buildArrows(),i.updateArrows(),i.initArrowEvents(),i.buildDots(),i.updateDots(),i.initDotEvents(),i.cleanUpSlideEvents(),i.initSlideEvents(),i.checkResponsive(!1,!0),i.setSlideClasses("number"==typeof i.currentSlide?i.currentSlide:0),i.setPosition(),i.focusHandler(),i.paused=!i.options.autoplay,i.autoPlay(),i.$slider.trigger("reInit",[i])},l.prototype.resize=function(){var i=this;d(window).width()!==i.windowWidth&&(clearTimeout(i.windowDelay),i.windowDelay=window.setTimeout(function(){i.windowWidth=d(window).width(),i.checkResponsive(),i.unslicked||i.setPosition()},50))},l.prototype.removeSlide=l.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},l.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled||(!(s={})===o.cssTransitions?s[o.animType]="translate("+e+", "+t+")":s[o.animType]="translate3d("+e+", "+t+", 0px)"),o.$slideTrack.css(s)},l.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},l.prototype.setFade=function(){var t,o=this;o.$slides.each(function(i,e){t=o.slideWidth*i*-1,!0===o.options.rtl?d(e).css({position:"relative",right:t,top:0,zIndex:o.options.zIndex-2,opacity:0}):d(e).css({position:"relative",left:t,top:0,zIndex:o.options.zIndex-2,opacity:0})}),o.$slides.eq(o.currentSlide).css({zIndex:o.options.zIndex-1,opacity:1})},l.prototype.setHeight=function(){var i,e=this;1===e.options.slidesToShow&&!0===e.options.adaptiveHeight&&!1===e.options.vertical&&(i=e.$slides.eq(e.currentSlide).outerHeight(!0),e.$list.css("height",i))},l.prototype.setOption=l.prototype.slickSetOption=function(){var i,e,t,o,s,n=this,l=!1;if("object"===d.type(arguments[0])?(t=arguments[0],l=arguments[1],s="multiple"):"string"===d.type(arguments[0])&&(o=arguments[1],l=arguments[2],"responsive"===(t=arguments[0])&&"array"===d.type(arguments[1])?s="responsive":void 0!==arguments[1]&&(s="single")),"single"===s)n.options[t]=o;else if("multiple"===s)d.each(t,function(i,e){n.options[i]=e});else if("responsive"===s)for(e in o)if("array"!==d.type(n.options.responsive))n.options.responsive=[o[e]];else{for(i=n.options.responsive.length-1;0<=i;)n.options.responsive[i].breakpoint===o[e].breakpoint&&n.options.responsive.splice(i,1),i--;n.options.responsive.push(o[e])}l&&(n.unload(),n.reinit())},l.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},l.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},l.prototype.setSlideClasses=function(i){var e,t,o,s,n=this,l=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true").attr("aria-label",function(){return d(this).attr("aria-label").replace(" (centered)","")});n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode?(o=n.options.slidesToShow%2==0?1:0,s=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(s<=i&&i<=n.slideCount-1-s?n.$slides.slice(i-s+o,i+s+1).addClass("slick-active").removeAttr("aria-hidden"):(e=n.options.slidesToShow+i,l.slice(e-s+1+o,e+s+2).addClass("slick-active").removeAttr("aria-hidden")),0===i?l.eq(n.options.slidesToShow+n.slideCount+1).addClass("slick-center").attr("aria-label",function(){return d(this).attr("aria-label")+" (centered)"}):i===n.slideCount-1&&l.eq(n.options.slidesToShow).addClass("slick-center").attr("aria-label",function(){return d(this).attr("aria-label")+" (centered)"})),n.$slides.eq(i).addClass("slick-center").attr("aria-label",function(){return d(this).attr("aria-label")+" (centered)"})):0<=i&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").removeAttr("aria-hidden"):l.length<=n.options.slidesToShow?l.addClass("slick-active").removeAttr("aria-hidden"):(t=n.slideCount%n.options.slidesToShow,e=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?l.slice(e-(n.options.slidesToShow-t),e+t).addClass("slick-active").removeAttr("aria-hidden"):l.slice(e,e+n.options.slidesToShow).addClass("slick-active").removeAttr("aria-hidden")),"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},l.prototype.setupInfinite=function(){var i,e,t,o=this;if(!0===o.options.fade&&(o.options.centerMode=!1),!0===o.options.infinite&&!1===o.options.fade&&(e=null,o.slideCount>o.options.slidesToShow)){for(t=!0===o.options.centerMode?o.options.slidesToShow+1:o.options.slidesToShow,i=o.slideCount;i>o.slideCount-t;--i)e=i-1,d(o.$slides[e]).clone(!0).attr("id","").attr("data-slick-index",e-o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");for(i=0;i<t+o.slideCount;i+=1)e=i,d(o.$slides[e]).clone(!0).attr("id","").attr("data-slick-index",e+o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");o.$slideTrack.find(".slick-cloned").find("[id]").each(function(){d(this).attr("id","")})}},l.prototype.interrupt=function(i){i||this.autoPlay(),this.interrupted=i},l.prototype.selectHandler=function(i){var e=d(i.target).is(".slick-slide")?d(i.target):d(i.target).parents(".slick-slide"),t=(t=parseInt(e.attr("data-slick-index")))||0;this.slideCount<=this.options.slidesToShow?this.slideHandler(t,!1,!0):this.slideHandler(t)},l.prototype.slideHandler=function(i,e,t){var o,s,n,l,r,a,d=this;if(e=e||!1,!(!0===d.animating&&!0===d.options.waitForAnimate||!0===d.options.fade&&d.currentSlide===i))if(!1===e&&d.asNavFor(i),o=i,r=d.getLeft(o),l=d.getLeft(d.currentSlide),d.currentLeft=null===d.swipeLeft?l:d.swipeLeft,!1===d.options.infinite&&!1===d.options.centerMode&&(i<0||i>d.getDotCount()*d.options.slidesToScroll))!1===d.options.fade&&(o=d.currentSlide,!0!==t&&d.slideCount>d.options.slidesToShow?d.animateSlide(l,function(){d.postSlide(o)}):d.postSlide(o));else if(!1===d.options.infinite&&!0===d.options.centerMode&&(i<0||i>d.slideCount-d.options.slidesToScroll))!1===d.options.fade&&(o=d.currentSlide,!0!==t&&d.slideCount>d.options.slidesToShow?d.animateSlide(l,function(){d.postSlide(o)}):d.postSlide(o));else{if(d.options.autoplay&&clearInterval(d.autoPlayTimer),s=o<0?d.slideCount%d.options.slidesToScroll!=0?d.slideCount-d.slideCount%d.options.slidesToScroll:d.slideCount+o:o>=d.slideCount?d.slideCount%d.options.slidesToScroll!=0?0:o-d.slideCount:o,d.animating=!0,d.$slider.trigger("beforeChange",[d,d.currentSlide,s]),n=d.currentSlide,d.currentSlide=s,d.setSlideClasses(d.currentSlide),d.options.asNavFor&&(a=(a=d.getNavTarget()).slick("getSlick")).slideCount<=a.options.slidesToShow&&a.setSlideClasses(d.currentSlide),d.updateDots(),d.updateArrows(),!0===d.options.fade)return!0!==t?(d.fadeSlideOut(n),d.fadeSlide(s,function(){d.postSlide(s)})):d.postSlide(s),void d.animateHeight();!0!==t&&d.slideCount>d.options.slidesToShow?d.animateSlide(r,function(){d.postSlide(s)}):d.postSlide(s)}},l.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},l.prototype.swipeDirection=function(){var i=this,e=i.touchObject.startX-i.touchObject.curX,t=i.touchObject.startY-i.touchObject.curY,o=Math.atan2(t,e),s=Math.round(180*o/Math.PI);return s<0&&(s=360-Math.abs(s)),s<=45&&0<=s||s<=360&&315<=s?!1===i.options.rtl?"left":"right":135<=s&&s<=225?!1===i.options.rtl?"right":"left":!0===i.options.verticalSwiping?35<=s&&s<=135?"down":"up":"vertical"},l.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1;if(o.interrupted=!1,o.shouldClick=!(10<o.touchObject.swipeLength),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},l.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},l.prototype.swipeMove=function(i){var e,t,o,s,n,l=this,r=void 0!==i.originalEvent?i.originalEvent.touches:null;return!(!l.dragging||l.scrolling||r&&1!==r.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==r?r[0].pageX:i.clientX,l.touchObject.curY=void 0!==r?r[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),n=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&4<n?!(l.scrolling=!0):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=n),t=l.swipeDirection(),void 0!==i.originalEvent&&4<l.touchObject.swipeLength&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,(l.touchObject.edgeHit=!1)===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},l.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return!(t.touchObject={});void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},l.prototype.unfilterSlides=l.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},l.prototype.unload=function(){var i=this;d(".slick-cloned",i.$slider).remove(),i.$dots&&i.$dots.remove(),i.$prevArrow&&i.htmlExpr.test(i.options.prevArrow)&&i.$prevArrow.remove(),i.$nextArrow&&i.htmlExpr.test(i.options.nextArrow)&&i.$nextArrow.remove(),i.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},l.prototype.unslick=function(i){this.$slider.trigger("unslick",[this,i]),this.destroy()},l.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2);!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").prop("disabled",!1),i.$nextArrow.removeClass("slick-disabled").prop("disabled",!1),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").prop("disabled",!0),i.$nextArrow.removeClass("slick-disabled").prop("disabled",!1)):(i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode||i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode)&&(i.$nextArrow.addClass("slick-disabled").prop("disabled",!0),i.$prevArrow.removeClass("slick-disabled").prop("disabled",!1)))},l.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").find("button").removeAttr("aria-current").end().end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active").find("button").attr("aria-current",!0).end().end())},l.prototype.updateSlideVisibility=function(){this.$slideTrack.find(".slick-slide").attr("aria-hidden","true").find("a, input, button, select").attr("tabindex","-1"),this.$slideTrack.find(".slick-active").removeAttr("aria-hidden").find("a, input, button, select").removeAttr("tabindex")},l.prototype.visibility=function(){this.options.autoplay&&(document[this.hidden]?this.interrupted=!0:this.interrupted=!1)},d.fn.slick=function(){for(var i,e=this,t=arguments[0],o=Array.prototype.slice.call(arguments,1),s=e.length,n=0;n<s;n++)if("object"==typeof t||void 0===t?e[n].slick=new l(e[n],t):i=e[n].slick[t].apply(e[n].slick,o),void 0!==i)return i;return e}});


(function() {
    
    
    let init = function() {

		//console.log("Init code"); 
        initMobileMenu();
        //$(window).on("load", initBO6PromoDisclaimer);
        initBO6PromoDisclaimer();

    };

    let initMobileMenu = function() {

        let url = window.location.href;

        //If on subpage, have Features mobile drop down menu expanded
        if(url.includes("/campaign") || 
           url.includes("/multiplayer") || 
           url.includes("/zombies") || 
           url.includes("/xbox") || 
           url.includes("/ps5") || 
           url.includes("/pc")) {

               	//Open Features on mobile menu
               	$("#cod-single-header .cod-header_mobile-menu .cod-header_mobile-dropdown .cod-header_mobile-secondary-menu > ul > li").eq(0).attr("aria-expanded", "true");

				//Close Games on mobile menu
               	$("#cod-single-header .cod-header_mobile-menu .cod-header_mobile-dropdown .cod-header_mobile-primary-menu > ul > li").eq(0).attr("aria-expanded", "false");

        }

    };

    let parseRegionStr = function(r) {
        var str = r;
        if (str == null || str == "") str = "en";
        str = str.toLowerCase().replace("-", "_").replace("en_us", "en");

        return str;
    };

    //Show promo disclaimer in legal section
    let initBO6PromoDisclaimer = function() {

        var region = parseRegionStr($('html').attr("lang"));
        Granite.I18n.setLocale(region);
        var disclaimeri18n = "global.promoLegalDisclaimerDiamond";
        var disclaimer = "<p class='promo-legal-line'>" + Granite.I18n.get(disclaimeri18n) + "</p>";

        var promoActive = false;

        var $playNowRetailLinks = $(".cod-play-now-card-container .platform-console-links-list li");

        $playNowRetailLinks.each(function() {

            if($(this).find("a").attr("data-promo-active") == "true") {

                //This is set for global visibility
                promoActive = true;

                //Set parent play now card to have promo active equal true
                $(this).closest(".cod-play-now-card-container").attr("data-promo-active", "true");
            }

        });

        if(promoActive) {

            //Add disclaimer line in the page disclaimers section
            $(".page-disclaimers, #bo6-play-now-main-disclaimer").prepend(disclaimer);

        }

    };

    
    $(init);
    
})();



(function() {


    var init = function() {

        $(window).on("load", function() {

            // Figure out element to scroll to
            var target = $(window.location.hash);
            if(window.location.hash.length > 0) {
            	target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
            }
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();

                //Get fixed header height
				var headerHeight = 180;

                $("html, body").animate(
                    {
                        scrollTop: target.offset().top,
                    },
                    1000,
                    function () {
                        //After scrolling, attemp to focus on element
                        target.focus();
    
                        //If the target was focused
                        if(target.is(":focus")) {
                            return false;
                        } else {
                            target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
                            target.focus(); // Set focus again
                            $(window).scrollTop(target.offset().top - headerHeight - 20); //scroll back up to proper position
                        }
                    }
                );
            }

        });
    }

    $(init);

})();
(function() {

    //Used for resize()
    var mode = "desktop";
    var heightBp = 450;
    var mobileBp = 600;

    var init = function() {
        resize();
        initBO6PlayNowPage();
    };

	var initCarousel = function() {

        //Define parent element
        var $parent = $("#bo6-cards-container");
        
        //RTL
        var rtl = (ATVI.pageLocale == "ar") ? true : false;
        
        //Init carousel
        $parent.slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true, 
            arrows: true,
            rtl: rtl
        }); 

    };

    var resize = function() {

        //On page load, if we are in mobile mode width
        if(window.innerWidth <= mobileBp) {

            //Set mode to mobile
			mode = "mobile";

            //Init carousel
            initCarousel();

        }

        //If we hit below 450 height
        if($(window).height() <= heightBp) {

            //Move Choose Your Platform above the bundle items
            $("#bo6-play-now-hero-title").insertAfter(".section-header");
        }

        //If we hit below 450 height and less than 768 width
        if($(window).height() <= heightBp && window.innerWidth < 768) {

            $("#bo6-play-now-hero-title").appendTo($("#bo6-playnow-hero .atvi-text"));

        }

        //For all platform tags lists
        /*$(".bundle-platforms ul").each(function() {

            //If we hit below 450px and there are no li.break elements
			if($(window).height() <= heightBp && $(this).find("li.break").length <= 0) {

                //Add li.break element after the third list item to force break the rest on another line
                var $items = $(this).find("li");
                $("<li>", { class: "break" }).insertAfter($items.eq(2));
    
            }
    
            else if($(window).height() > heightBp) {

                //Remove the li.break element
                $(this).find("li.break").remove();
            }

        });*/



        $(window).on("resize", function() {

            //If we hit below 769 while coming from desktop
            if(window.innerWidth <= mobileBp && mode == "desktop") {

                //Set mode to mobile
                mode = "mobile";

				//Re-init carousel
                initCarousel();

            }

            //If we hit desktop while coming from mobile
            else if(window.innerWidth > mobileBp && mode == "mobile") {

                //Set mode to desktop
                mode = "desktop";

				//Destroy carousel
				$("#bo6-cards-container").slick('unslick');
            }

            //For all platform tag lists
            /*$(".bundle-platforms ul").each(function() {

				//If we hit below 450 in height
                if($(window).height() <= heightBp && $(this).find("li.break").length <= 0) {

                    //Add li.break element after the third list item to force break the rest on another line
                    var $items = $(this).find("li");
                    $("<li>", { class: "break" }).insertAfter($items.eq(2));
    
                }
                else if($(window).height() > heightBp) {
                    //Remove the li.break element
                    $(this).find("li.break").remove();
    
                }

            });*/

            //If we hit below 450 height
            if($(window).height() <= heightBp) {
    
                //Move Choose Your Platform above the bundle items
                $("#bo6-play-now-hero-title").insertAfter(".section-header");
            }

            else {

                //Move Choose Your Platform back to its original place
				$("#bo6-play-now-hero-title").appendTo(".atvi-card-custom-content .atvi-text");
            }

            //If we hit below 450 height and less than 768 width
            if($(window).height() <= heightBp && window.innerWidth < 768) {
    
                $("#bo6-play-now-hero-title").appendTo($("#bo6-playnow-hero .atvi-text"));
    
            }

        });

    };

    var initBO6PlayNowPage = function() {

        //If we're on the main BO6 Play Now Page
        if($("#bo6-play-now").length > 0) {

            //Update Platform tags to make them shorter
            //$(".bundle-platforms li[data-platform='ps']").text("PSÂ®");
            //$(".bundle-platforms li[data-platform='ms']").text("Xbox");

            // Get the current URL
            var url = new URL(window.location.href);
            
            // Create a URLSearchParams object from the query string
            var params = new URLSearchParams(url.search);
            
            // Check if the parameter exists and has the desired value
            if (params.get('utm_source') === 'wzm' && params.get('utm_medium') === 'referral') {
            	$("body").addClass("mobile-game");
            }

            //Add Close button if we are coming from the game
            if($("body").hasClass("mobile-game")) {
        		$("body#bo6-play-now .bo6-subpage-playnow > .atvi-text").prepend("<button id='mobile-close' aria-label='Back to game'><span>Close</span> <span>&times;</span></button>");

                $("#mobile-close").on('click', function() {
                    console.log("Back to game");
					window.open('codwzm://app', '_blank');
                });
            }

        }


    };

    $(init);

})();

(function() {

    let init = function() {

        var $modal = $("#ve-play-now-modal");

        if($modal.length > 0) {
			$("#ve-play-now-modal").insertAfter($(".atvi-privacy-policy-module"));
        }

    };

    $(init);

})();
