// \0rolldown/runtime.js
var e = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), t = /* @__PURE__ */ e(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function ee(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, te || (te = !0, ae());
			else {
				var t = n(l);
				t !== null && ce(ee, t.startTime - e);
			}
		}
	}
	var te = !1, ne = -1, re = 5, x = -1;
	function ie() {
		return g ? !0 : !(e.unstable_now() - x < re);
	}
	function S() {
		if (g = !1, te) {
			var t = e.unstable_now();
			x = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(ne), ne = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && ie());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && ce(ee, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? ae() : te = !1;
			}
		}
	}
	var ae;
	if (typeof y == "function") ae = function() {
		y(S);
	};
	else if (typeof MessageChannel < "u") {
		var oe = new MessageChannel(), se = oe.port2;
		oe.port1.onmessage = S, ae = function() {
			se.postMessage(null);
		};
	} else ae = function() {
		_(S, 0);
	};
	function ce(t, n) {
		ne = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : re = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(ne), ne = -1) : h = !0, ce(ee, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, te || (te = !0, ae()))), r;
	}, e.unstable_shouldYield = ie, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), n = /* @__PURE__ */ e(((e, n) => {
	n.exports = t();
})), r = /* @__PURE__ */ e(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function ee(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var te = ee.prototype = new b();
	te.constructor = ee, _(te, y.prototype), te.isPureReactComponent = !0;
	var ne = Array.isArray;
	function re() {}
	var x = {
		H: null,
		A: null,
		T: null,
		S: null
	}, ie = Object.prototype.hasOwnProperty;
	function S(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function ae(e, t) {
		return S(e.type, t, e.props);
	}
	function oe(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function se(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var ce = /\/+/g;
	function le(e, t) {
		return typeof e == "object" && e && e.key != null ? se("" + e.key) : t.toString(36);
	}
	function ue(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(re, re) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function de(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, de(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + le(e, 0) : a, ne(o) ? (i = "", c != null && (i = c.replace(ce, "$&/") + "/"), de(o, r, i, "", function(e) {
			return e;
		})) : o != null && (oe(o) && (o = ae(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(ce, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (ne(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + le(a, u), c += de(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + le(a, u++), c += de(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return de(ue(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function fe(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return de(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function pe(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var me = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function he(e) {
		var t = x.T, n = {};
		n.types = t === null ? null : t.types, x.T = n;
		try {
			var r = e(), i = x.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(re, me);
		} catch (e) {
			me(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), x.T = t;
		}
	}
	function ge(e) {
		var t = x.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else he(ge.bind(null, e));
	}
	var _e = {
		map: fe,
		forEach: function(e, t, n) {
			fe(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return fe(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return fe(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!oe(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = _e, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = ee, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = x, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return x.H.useMemoCache(e);
		}
	}, e.addTransitionType = ge, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !ie.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return S(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) ie.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return S(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = oe, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: pe
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = he, e.unstable_useCacheRefresh = function() {
		return x.H.useCacheRefresh();
	}, e.use = function(e) {
		return x.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return x.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return x.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return x.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return x.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return x.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return x.H.useEffectEvent(e);
	}, e.useId = function() {
		return x.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return x.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return x.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return x.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return x.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return x.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return x.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return x.H.useRef(e);
	}, e.useState = function(e) {
		return x.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return x.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return x.H.useTransition();
	}, e.version = "19.3.1";
})), i = /* @__PURE__ */ e(((e, t) => {
	t.exports = r();
})), a = /* @__PURE__ */ e(((e) => {
	var t = i();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var a = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, o = Symbol.for("react.portal"), s = Symbol.for("react.recoverable"), c = Symbol.for("react.optimistic_key");
	function l(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: o,
			key: r == null ? null : r === c ? c : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var u = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function d(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = a, e.browser = function(e) {
		return {
			$$typeof: s,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return l(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = u.T, n = a.p;
		try {
			if (u.T = null, a.p = 2, e) return e();
		} finally {
			u.T = t, a.p = n, a.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, a.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && a.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin), i = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? a.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: i,
				fetchPriority: o
			}) : n === "script" && a.d.X(e, {
				crossOrigin: r,
				integrity: i,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = d(t.as, t.crossOrigin);
					a.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? a.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin);
			a.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = d(t.as, t.crossOrigin);
				a.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else a.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		a.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return u.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return u.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), o = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = a();
})), s = /* @__PURE__ */ e(((e) => {
	var t = n(), r = i(), a = o();
	function s(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function c(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function l(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function u(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function d(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function f(e) {
		if (l(e) !== e) throw Error(s(188));
	}
	function p(e) {
		var t = e.alternate;
		if (!t) {
			if (t = l(e), t === null) throw Error(s(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var i = n.return;
			if (i === null) break;
			var a = i.alternate;
			if (a === null) {
				if (r = i.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (i.child === a.child) {
				for (a = i.child; a;) {
					if (a === n) return f(i), e;
					if (a === r) return f(i), t;
					a = a.sibling;
				}
				throw Error(s(188));
			}
			if (n.return !== r.return) n = i, r = a;
			else {
				for (var o = !1, c = i.child; c;) {
					if (c === n) {
						o = !0, n = i, r = a;
						break;
					}
					if (c === r) {
						o = !0, r = i, n = a;
						break;
					}
					c = c.sibling;
				}
				if (!o) {
					for (c = a.child; c;) {
						if (c === n) {
							o = !0, n = a, r = i;
							break;
						}
						if (c === r) {
							o = !0, r = a, n = i;
							break;
						}
						c = c.sibling;
					}
					if (!o) throw Error(s(189));
				}
			}
			if (n.alternate !== r) throw Error(s(190));
		}
		if (n.tag !== 3) throw Error(s(188));
		return n.stateNode.current === n ? e : t;
	}
	function m(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = m(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(s(559));
		}
	}
	var ee = null, te = null;
	function ne(e, t, n) {
		return e === n || e === t && (ee = e, !0);
	}
	function re(e, t, n) {
		return e === n ? (te = e, !1) : e === t && (te !== null && (ee = e), !0);
	}
	function x(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function ie(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var S = Object.assign, ae = Symbol.for("react.element"), oe = Symbol.for("react.transitional.element"), se = Symbol.for("react.portal"), ce = Symbol.for("react.fragment"), le = Symbol.for("react.strict_mode"), ue = Symbol.for("react.profiler"), de = Symbol.for("react.consumer"), fe = Symbol.for("react.context"), pe = Symbol.for("react.forward_ref"), me = Symbol.for("react.suspense"), he = Symbol.for("react.suspense_list"), ge = Symbol.for("react.memo"), _e = Symbol.for("react.lazy"), ve = Symbol.for("react.activity"), ye = Symbol.for("react.legacy_hidden"), be = Symbol.for("react.memo_cache_sentinel"), xe = Symbol.for("react.view_transition"), Se = Symbol.for("react.recoverable"), Ce = Symbol.iterator;
	function we(e) {
		return typeof e != "object" || !e ? null : (e = Ce && e[Ce] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var Te = Symbol.for("react.client.reference");
	function Ee(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === Te ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case ce: return "Fragment";
			case ue: return "Profiler";
			case le: return "StrictMode";
			case me: return "Suspense";
			case he: return "SuspenseList";
			case ve: return "Activity";
			case xe: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case se: return "Portal";
			case fe: return e.displayName || "Context";
			case de: return (e._context.displayName || "Context") + ".Consumer";
			case pe:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case ge: return t = e.displayName || null, t === null ? Ee(e.type) || "Memo" : t;
			case _e:
				t = e._payload, e = e._init;
				try {
					return Ee(e(t));
				} catch {}
		}
		return null;
	}
	var De = Array.isArray, C = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, w = a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Oe = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ke = [], Ae = -1;
	function je(e) {
		return { current: e };
	}
	function Me(e) {
		0 > Ae || (e.current = ke[Ae], ke[Ae] = null, Ae--);
	}
	function T(e, t) {
		Ae++, ke[Ae] = e.current, e.current = t;
	}
	var Ne = je(null), Pe = je(null), Fe = je(null), Ie = je(null);
	function Le(e, t) {
		switch (T(Fe, t), T(Pe, e), T(Ne, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = up(t), e = dp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		Me(Ne), T(Ne, e);
	}
	function Re() {
		Me(Ne), Me(Pe), Me(Fe);
	}
	function ze(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, T(Ie, e)), t = Ne.current;
		var n = dp(t, e.type);
		t !== n && (T(Pe, e), T(Ne, n));
	}
	function Be(e) {
		Pe.current === e && (Me(Ne), Me(Pe)), Ie.current === e && (Me(Ie), sh._currentValue = Oe);
	}
	var Ve, He;
	function Ue(e) {
		if (Ve === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Ve = t && t[1] || "", He = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Ve + e + He;
	}
	var We = !1;
	function Ge(e, t) {
		if (!e || We) return "";
		We = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			We = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Ue(n) : "";
	}
	function Ke(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Ue(e.type);
			case 16: return Ue("Lazy");
			case 13: return e.child !== t && t !== null ? Ue("Suspense Fallback") : Ue("Suspense");
			case 19: return Ue("SuspenseList");
			case 0:
			case 15: return Ge(e.type, !1);
			case 11: return Ge(e.type.render, !1);
			case 1: return Ge(e.type, !0);
			case 31: return Ue("Activity");
			case 30: return Ue("ViewTransition");
			default: return "";
		}
	}
	function qe(e) {
		try {
			var t = "", n = null;
			do
				t += Ke(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Je = Object.prototype.hasOwnProperty, Ye = t.unstable_scheduleCallback, Xe = t.unstable_cancelCallback, Ze = t.unstable_shouldYield, Qe = t.unstable_requestPaint, $e = t.unstable_now, et = t.unstable_getCurrentPriorityLevel, tt = t.unstable_ImmediatePriority, nt = t.unstable_UserBlockingPriority, rt = t.unstable_NormalPriority, it = t.unstable_LowPriority, at = t.unstable_IdlePriority, ot = t.log, st = t.unstable_setDisableYieldValue, ct = null, lt = null;
	function ut(e) {
		if (typeof ot == "function" && st(e), lt && typeof lt.setStrictMode == "function") try {
			lt.setStrictMode(ct, e);
		} catch {}
	}
	var dt = Math.clz32 ? Math.clz32 : mt, ft = Math.log, pt = Math.LN2;
	function mt(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (ft(e) / pt | 0) | 0;
	}
	var ht = 256, gt = 262144, _t = 4194304;
	function vt(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function yt(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = vt(n))) : i = vt(o) : i = vt(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = vt(n))) : i = vt(o)) : i = vt(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function bt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function xt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - dt(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function St(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function Ct() {
		var e = _t;
		return _t <<= 1, !(_t & 62914560) && (_t = 4194304), e;
	}
	function E(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function wt(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function Tt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - dt(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && Et(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function Et(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - dt(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function Dt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - dt(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function Ot(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : kt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function kt(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function At(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function jt() {
		var e = w.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function Mt(e, t) {
		var n = w.p;
		try {
			return w.p = e, t();
		} finally {
			w.p = n;
		}
	}
	var Nt = Math.random().toString(36).slice(2), D = "__reactFiber$" + Nt, Pt = "__reactProps$" + Nt, Ft = "__reactContainer$" + Nt, It = "__reactEvents$" + Nt, O = "__reactListeners$" + Nt, Lt = "__reactHandles$" + Nt, k = "__reactResources$" + Nt, A = "__reactMarker$" + Nt, Rt = "__reactLoad$" + Nt;
	function zt(e) {
		delete e[D], delete e[Pt], delete e[O], delete e[Lt];
	}
	function Bt(e) {
		var t;
		if (t = e[D]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[Ft] || n[D]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[D]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Vt(e) {
		if (e = e[D] || e[Ft]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Ht(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(s(33));
	}
	function Ut(e) {
		var t = e[k];
		return t ||= e[k] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function j(e) {
		e[A] = !0;
	}
	function Wt(e) {
		e[Rt] = void 0;
	}
	var Gt = /* @__PURE__ */ new Set(), Kt = {};
	function qt(e, t) {
		Jt(e, t), Jt(e + "Capture", t);
	}
	function Jt(e, t) {
		for (Kt[e] = t, e = 0; e < t.length; e++) Gt.add(t[e]);
	}
	var Yt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Xt = {}, Zt = {};
	function Qt(e) {
		return Je.call(Zt, e) ? !0 : Je.call(Xt, e) ? !1 : Yt.test(e) ? Zt[e] = !0 : (Xt[e] = !0, !1);
	}
	var M = !1;
	function N() {
		var e = M;
		return M = !1, e;
	}
	function $t(e, t, n) {
		if (Qt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function en(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function tn(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function nn(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function rn(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function P(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function an(e) {
		if (!e._valueTracker) {
			var t = rn(e) ? "checked" : "value";
			e._valueTracker = P(e, t, "" + e[t]);
		}
	}
	function on(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = rn(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var sn = /[\n"\\]/g;
	function cn(e) {
		return e.replace(sn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function ln(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + nn(t)) : e.value !== "" + nn(t) && (e.value = "" + nn(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : dn(e, nn(n)) : o === "number" && e.value == t ? dn(e, nn(e.value)) : dn(e, nn(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + nn(s) : e.removeAttribute("name");
	}
	function un(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				an(e);
				return;
			}
			n = n == null ? "" : "" + nn(n), t = t == null ? n : "" + nn(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), an(e);
	}
	function dn(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function fn(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + nn(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function pn(e, t, n) {
		t != null && (t = "" + nn(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + nn(n);
	}
	function mn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(s(92));
				if (De(r)) {
					if (1 < r.length) throw Error(s(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = nn(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), an(e);
	}
	function hn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var gn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function _n(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || gn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function vn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(s(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", M = !0);
			for (var i in t) r = t[i], t.hasOwnProperty(i) && n[i] !== r && (_n(e, i, r), M = !0);
		} else for (var a in t) t.hasOwnProperty(a) && _n(e, a, t[a]);
	}
	function yn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var bn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), xn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function Sn(e) {
		return xn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function Cn() {}
	var wn = null;
	function Tn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var En = null, Dn = null;
	function On(e) {
		var t = Vt(e);
		if (t && (e = t.stateNode)) {
			var n = e[Pt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (ln(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + cn("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var i = r[Pt] || null;
								if (!i) throw Error(s(90));
								ln(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && on(r);
					}
					break a;
				case "textarea":
					pn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && fn(e, !!n.multiple, t, !1);
			}
		}
	}
	var kn = !1;
	function An(e, t, n) {
		if (kn) return e(t, n);
		kn = !0;
		try {
			return e(t);
		} finally {
			if (kn = !1, (En !== null || Dn !== null) && (zd(), En && (t = En, e = Dn, Dn = En = null, On(t), e))) for (t = 0; t < e.length; t++) On(e[t]);
		}
	}
	function jn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[Pt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(s(231, t, typeof n));
		return n;
	}
	var Mn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Nn = !1;
	if (Mn) try {
		var Pn = {};
		Object.defineProperty(Pn, "passive", { get: function() {
			Nn = !0;
		} }), window.addEventListener("test", Pn, Pn), window.removeEventListener("test", Pn, Pn);
	} catch {
		Nn = !1;
	}
	var Fn = null, In = null, Ln = null;
	function Rn() {
		if (Ln) return Ln;
		var e, t = In, n = t.length, r, i = "value" in Fn ? Fn.value : Fn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Ln = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function zn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Bn() {
		return !0;
	}
	function Vn() {
		return !1;
	}
	function Hn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Bn : Vn, this.isPropagationStopped = Vn, this;
		}
		return S(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Bn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Bn);
			},
			persist: function() {},
			isPersistent: Bn
		}), t;
	}
	var Un = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Wn = Hn(Un), Gn = S({}, Un, {
		view: 0,
		detail: 0
	}), Kn = Hn(Gn), qn, Jn, Yn, Xn = S({}, Gn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: sr,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Yn && (Yn && e.type === "mousemove" ? (qn = e.screenX - Yn.screenX, Jn = e.screenY - Yn.screenY) : Jn = qn = 0, Yn = e), qn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Jn;
		}
	}), Zn = Hn(Xn), Qn = Hn(S({}, Xn, { dataTransfer: 0 })), $n = Hn(S({}, Gn, { relatedTarget: 0 })), er = Hn(S({}, Un, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), tr = Hn(S({}, Un, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), nr = Hn(S({}, Un, { data: 0 })), rr = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, ir = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, ar = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function or(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = ar[e]) ? !!t[e] : !1;
	}
	function sr() {
		return or;
	}
	var cr = Hn(S({}, Gn, {
		key: function(e) {
			if (e.key) {
				var t = rr[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = zn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? ir[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: sr,
		charCode: function(e) {
			return e.type === "keypress" ? zn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? zn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), lr = Hn(S({}, Xn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), ur = Hn(S({}, Un, { submitter: 0 })), dr = Hn(S({}, Gn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: sr
	})), fr = Hn(S({}, Un, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), pr = Hn(S({}, Xn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), mr = Hn(S({}, Un, {
		newState: 0,
		oldState: 0,
		source: 0
	})), hr = [
		9,
		13,
		27,
		32
	], gr = Mn && "CompositionEvent" in window, _r = null;
	Mn && "documentMode" in document && (_r = document.documentMode);
	var vr = Mn && "TextEvent" in window && !_r, yr = Mn && (!gr || _r && 8 < _r && 11 >= _r), br = " ", xr = !1;
	function Sr(e, t) {
		switch (e) {
			case "keyup": return hr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function Cr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var wr = !1;
	function Tr(e, t) {
		switch (e) {
			case "compositionend": return Cr(t);
			case "keypress": return t.which === 32 ? (xr = !0, br) : null;
			case "textInput": return e = t.data, e === br && xr ? null : e;
			default: return null;
		}
	}
	function Er(e, t) {
		if (wr) return e === "compositionend" || !gr && Sr(e, t) ? (e = Rn(), Ln = In = Fn = null, wr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return yr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Dr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Or(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Dr[e.type] : t === "textarea";
	}
	function kr(e, t, n, r) {
		En ? Dn ? Dn.push(r) : Dn = [r] : En = r, t = Jf(t, "onChange"), 0 < t.length && (n = new Wn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Ar = null, jr = null;
	function Mr(e) {
		Vf(e, 0);
	}
	function Nr(e) {
		if (on(Ht(e))) return e;
	}
	function Pr(e, t) {
		if (e === "change") return t;
	}
	var Fr = !1;
	if (Mn) {
		var Ir;
		if (Mn) {
			var Lr = "oninput" in document;
			if (!Lr) {
				var Rr = document.createElement("div");
				Rr.setAttribute("oninput", "return;"), Lr = typeof Rr.oninput == "function";
			}
			Ir = Lr;
		} else Ir = !1;
		Fr = Ir && (!document.documentMode || 9 < document.documentMode);
	}
	function zr() {
		Ar && (Ar.detachEvent("onpropertychange", Br), jr = Ar = null);
	}
	function Br(e) {
		if (e.propertyName === "value" && Nr(jr)) {
			var t = [];
			kr(t, jr, e, Tn(e)), An(Mr, t);
		}
	}
	function Vr(e, t, n) {
		e === "focusin" ? (zr(), Ar = t, jr = n, Ar.attachEvent("onpropertychange", Br)) : e === "focusout" && zr();
	}
	function Hr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Nr(jr);
	}
	function Ur(e, t) {
		if (e === "click") return Nr(t);
	}
	function Wr(e, t) {
		if (e === "input" || e === "change") return Nr(t);
	}
	function Gr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Kr = typeof Object.is == "function" ? Object.is : Gr;
	function qr(e, t) {
		if (Kr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Je.call(t, i) || !Kr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Jr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Yr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Xr(e, t) {
		var n = Yr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Yr(n);
		}
	}
	function Zr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Zr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Qr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Jr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Jr(e.document);
		}
		return t;
	}
	function $r(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var ei = Mn && "documentMode" in document && 11 >= document.documentMode, ti = null, ni = null, ri = null, ii = !1;
	function ai(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		ii || ti == null || ti !== Jr(r) || (r = ti, "selectionStart" in r && $r(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), ri && qr(ri, r) || (ri = r, r = Jf(ni, "onSelect"), 0 < r.length && (t = new Wn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = ti)));
	}
	function oi(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var si = {
		animationend: oi("Animation", "AnimationEnd"),
		animationiteration: oi("Animation", "AnimationIteration"),
		animationstart: oi("Animation", "AnimationStart"),
		transitionrun: oi("Transition", "TransitionRun"),
		transitionstart: oi("Transition", "TransitionStart"),
		transitioncancel: oi("Transition", "TransitionCancel"),
		transitionend: oi("Transition", "TransitionEnd")
	}, ci = {}, li = {};
	Mn && (li = document.createElement("div").style, "AnimationEvent" in window || (delete si.animationend.animation, delete si.animationiteration.animation, delete si.animationstart.animation), "TransitionEvent" in window || delete si.transitionend.transition);
	function ui(e) {
		if (ci[e]) return ci[e];
		if (!si[e]) return e;
		var t = si[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in li) return ci[e] = t[n];
		return e;
	}
	var di = ui("animationend"), fi = ui("animationiteration"), pi = ui("animationstart"), mi = ui("transitionrun"), hi = ui("transitionstart"), gi = ui("transitioncancel"), _i = ui("transitionend"), vi = /* @__PURE__ */ new Map(), yi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	yi.push("scrollEnd");
	function bi(e, t) {
		vi.set(e, t), qt(t, [e]);
	}
	var xi = 0;
	function Si(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = bd.identifierPrefix;
		var n = xi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function Ci(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Od;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function wi(e, t) {
		return e = Ci(e), t = Ci(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var Ti = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, Ei = [], Di = 0, Oi = 0;
	function ki() {
		for (var e = Di, t = Oi = Di = 0; t < e;) {
			var n = Ei[t];
			Ei[t++] = null;
			var r = Ei[t];
			Ei[t++] = null;
			var i = Ei[t];
			Ei[t++] = null;
			var a = Ei[t];
			if (Ei[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Ni(n, i, a);
		}
	}
	function Ai(e, t, n, r) {
		Ei[Di++] = e, Ei[Di++] = t, Ei[Di++] = n, Ei[Di++] = r, Oi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ji(e, t, n, r) {
		return Ai(e, t, n, r), Pi(e);
	}
	function Mi(e, t) {
		return Ai(e, null, null, t), Pi(e);
	}
	function Ni(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - dt(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Pi(e) {
		if (50 < kd) throw kd = 0, Ad = null, Error(s(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Fi = {};
	function Ii(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Li(e, t, n, r) {
		return new Ii(e, t, n, r);
	}
	function Ri(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function zi(e, t) {
		var n = e.alternate;
		return n === null ? (n = Li(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Bi(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Vi(e, t, n, r, i, a) {
		var o = 0;
		if (r = e, typeof r == "function") Ri(r) && (o = 1);
		else if (typeof r == "string") o = qm(e, n, Ne.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case ve: return e = Li(31, n, t, i), e.elementType = ve, e.lanes = a, e;
			case ce: return Hi(n.children, i, a, t);
			case le:
				o = 8, i |= 24;
				break;
			case ue: return e = Li(12, n, t, i | 2), e.elementType = ue, e.lanes = a, e;
			case me: return e = Li(13, n, t, i), e.elementType = me, e.lanes = a, e;
			case he: return e = Li(19, n, t, i), e.elementType = he, e.lanes = a, e;
			case ye:
			case xe: return e = i | 32, e = Li(30, n, t, e), e.elementType = xe, e.lanes = a, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case fe:
						o = 10;
						break a;
					case de:
						o = 9;
						break a;
					case pe:
						o = 11;
						break a;
					case ge:
						o = 14;
						break a;
					case _e:
						o = 16, r = null;
						break a;
				}
				o = 29, n = Error(s(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Li(o, n, t, i), t.elementType = e, t.type = r, t.lanes = a, t;
	}
	function Hi(e, t, n, r) {
		return e = Li(7, e, r, t), e.lanes = n, e;
	}
	function Ui(e, t, n) {
		return e = Li(6, e, null, t), e.lanes = n, e;
	}
	function Wi(e) {
		var t = Li(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Gi(e, t, n) {
		return t = Li(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Ki = /* @__PURE__ */ new WeakMap();
	function qi(e, t) {
		if (typeof e == "object" && e) {
			var n = Ki.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: qe(t)
			}, Ki.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: qe(t)
		};
	}
	var Ji = [], Yi = 0, Xi = null, Zi = 0, Qi = [], $i = 0, ea = null, ta = 1, na = "";
	function ra(e, t) {
		Ji[Yi++] = Zi, Ji[Yi++] = Xi, Xi = e, Zi = t;
	}
	function ia(e, t, n) {
		Qi[$i++] = ta, Qi[$i++] = na, Qi[$i++] = ea, ea = e;
		var r = ta;
		e = na;
		var i = 32 - dt(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - dt(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, ta = 1 << 32 - dt(t) + i | n << i | r, na = a + e;
		} else ta = 1 << a | n << i | r, na = e;
	}
	function aa(e) {
		e.return !== null && (ra(e, 1), ia(e, 1, 0));
	}
	function oa(e) {
		for (; e === Xi;) Xi = Ji[--Yi], Ji[Yi] = null, Zi = Ji[--Yi], Ji[Yi] = null;
		for (; e === ea;) ea = Qi[--$i], Qi[$i] = null, na = Qi[--$i], Qi[$i] = null, ta = Qi[--$i], Qi[$i] = null;
	}
	function sa(e, t) {
		Qi[$i++] = ta, Qi[$i++] = na, Qi[$i++] = ea, ta = t.id, na = t.overflow, ea = e;
	}
	var ca = null, F = null, I = !1, la = null, ua = !1, da = Error(s(519));
	function fa(e) {
		throw va(qi(Error(s(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), da;
	}
	function pa(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[D] = e, t[Pt] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < zf.length; n++) Q(zf[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), un(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), mn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ep(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = Cn), t = !0) : t = !1, t || fa(e, !0);
	}
	function ma(e) {
		for (ca = e.return; ca;) switch (ca.tag) {
			case 5:
			case 31:
			case 13:
				ua = !1;
				return;
			case 27:
			case 3:
				ua = !0;
				return;
			default: ca = ca.return;
		}
	}
	function ha(e) {
		if (e !== ca) return !1;
		if (!I) return ma(e), I = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && F && fa(e), ma(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(s(317));
			F = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(s(317));
			F = dm(e);
		} else t === 27 ? (t = F, Sp(e.type) ? (e = um, um = null, F = e) : F = t) : F = ca ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function ga() {
		F = ca = null, I = !1;
	}
	function _a() {
		var e = la;
		return e !== null && (pd === null ? pd = e : pd.push.apply(pd, e), la = null), e;
	}
	function va(e) {
		la === null ? la = [e] : la.push(e);
	}
	var ya = je(null), ba = null, xa = null;
	function Sa(e, t, n) {
		T(ya, t._currentValue), t._currentValue = n;
	}
	function Ca(e) {
		e._currentValue = ya.current, Me(ya);
	}
	function wa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Ta(e, t, n, r) {
		var i = e.child;
		for (i !== null && (i.return = e); i !== null;) {
			var a = i.dependencies;
			if (a !== null) {
				var o = i.child;
				a = a.firstContext;
				a: for (; a !== null;) {
					var c = a;
					a = i;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						a.lanes |= n, c = a.alternate, c !== null && (c.lanes |= n), wa(a.return, n, e), r || (o = null);
						break a;
					}
					a = c.next;
				}
			} else if (i.tag === 18) {
				if (o = i.return, o === null) throw Error(s(341));
				o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), wa(o, n, e), o = null;
			} else i.tag === 13 && i.memoizedState !== null && i.memoizedState.dehydrated === null ? (i.lanes |= n, o = i.alternate, o !== null && (o.lanes |= n), wa(i.return, n, e), o = i.child, o = o === null ? null : o.sibling) : o = i.child;
			if (o !== null) o.return = i;
			else for (o = i; o !== null;) {
				if (o === e) {
					o = null;
					break;
				}
				if (i = o.sibling, i !== null) {
					i.return = o.return, o = i;
					break;
				}
				o = o.return;
			}
			i = o;
		}
	}
	function Ea(e, t, n, r) {
		e = null;
		for (var i = t, a = !1; i !== null;) {
			if (!a) {
				if (i.flags & 524288) a = !0;
				else if (i.flags & 262144) break;
			}
			if (i.tag === 10) {
				var o = i.alternate;
				if (o === null) throw Error(s(387));
				if (o = o.memoizedProps, o !== null) {
					var c = i.type;
					Kr(i.pendingProps.value, o.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (i === Ie.current) {
				if (o = i.alternate, o === null) throw Error(s(387));
				o.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			i = i.return;
		}
		return e !== null && Ta(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function Da(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Kr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Oa(e) {
		ba = e, xa = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ka(e) {
		return ja(ba, e);
	}
	function Aa(e, t) {
		return ba === null && Oa(e), ja(e, t);
	}
	function ja(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, xa === null) {
			if (e === null) throw Error(s(308));
			xa = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else xa = xa.next = t;
		return n;
	}
	var Ma = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Na = t.unstable_scheduleCallback, Pa = t.unstable_NormalPriority, Fa = {
		$$typeof: fe,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Ia() {
		return {
			controller: new Ma(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function La(e) {
		e.refCount--, e.refCount === 0 && Na(Pa, function() {
			e.controller.abort();
		});
	}
	function Ra(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var za = null;
	function Ba(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Va = null, Ha = 0, Ua = 0, Wa = null;
	function Ga(e, t) {
		if (Va === null) {
			var n = Va = [];
			Ha = 0, Ua = Pf(), Wa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Ha++, t.then(Ka, Ka), t;
	}
	function Ka() {
		if (--Ha === 0 && (za = null, Va !== null)) {
			Wa !== null && (Wa.status = "fulfilled");
			var e = Va;
			Va = null, Ua = 0, Wa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function qa(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ja = C.S;
	C.S = function(e, t) {
		if (gd = $e(), typeof t == "object" && t && typeof t.then == "function" && Ga(e, t), za !== null) for (var n = bf; n !== null;) Ra(n, za), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = bf; r !== null;) Ra(r, n), r = r.next;
			if (Ua !== 0) {
				r = za, r === null && (r = za = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ja !== null && Ja(e, t);
	};
	var Ya = je(null);
	function Xa() {
		var e = Ya.current;
		return e === null ? G.pooledCache : e;
	}
	function Za(e, t) {
		t === null ? T(Ya, Ya.current) : T(Ya, t.pool);
	}
	function Qa() {
		var e = Xa();
		return e === null ? null : {
			parent: Fa._currentValue,
			pool: e
		};
	}
	var $a = Error(s(460)), eo = Error(s(474)), to = Error(s(542)), no = { then: function() {} };
	function ro(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function io(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(Cn, Cn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, co(e), e === void 0 && !("reason" in t) ? Error(s(600)) : e;
			default:
				if (typeof t.status == "string") t.then(Cn, Cn);
				else {
					if (e = G, e !== null && 100 < e.shellSuspendCounter) throw Error(s(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, co(e), e;
				}
				throw oo = t, $a;
		}
	}
	function ao(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (oo = e, $a) : e;
		}
	}
	var oo = null;
	function so() {
		if (oo === null) throw Error(s(459));
		var e = oo;
		return oo = null, e;
	}
	function co(e) {
		if (e === $a || e === to) throw Error(s(483));
	}
	var lo = null, uo = 0;
	function fo(e) {
		var t = uo;
		return uo += 1, lo === null && (lo = []), io(lo, e, t);
	}
	function po(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function mo(e, t) {
		throw t.$$typeof === ae ? Error(s(525)) : (e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function ho(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function i(e, t) {
			return e = zi(e, t), e.index = 0, e.sibling = null, e;
		}
		function a(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function o(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Ui(n, e.mode, r), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var a = n.type;
			return a === ce ? (e = d(e, t, n.props.children, r, n.key), po(e, n), e) : t !== null && (t.elementType === a || typeof a == "object" && a && a.$$typeof === _e && ao(a) === t.type) ? (t = i(t, n.props), po(t, n), t.return = e, t) : (t = Vi(n.type, n.key, n.props, null, e.mode, r), po(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Gi(n, e.mode, r), t.return = e, t) : (t = i(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, a) {
			return t === null || t.tag !== 7 ? (t = Hi(n, e.mode, r, a), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Ui("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case oe: return n = Vi(t.type, t.key, t.props, null, e.mode, n), po(n, t), n.return = e, n;
					case se: return t = Gi(t, e.mode, n), t.return = e, t;
					case _e: return t = ao(t), f(e, t, n);
				}
				if (De(t) || we(t)) return t = Hi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, fo(t), n);
				if (t.$$typeof === fe) return f(e, Aa(e, t), n);
				mo(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case oe: return n.key === i ? l(e, t, n, r) : null;
					case se: return n.key === i ? u(e, t, n, r) : null;
					case _e: return n = ao(n), p(e, t, n, r);
				}
				if (De(n) || we(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, fo(n), r);
				if (n.$$typeof === fe) return p(e, t, Aa(e, n), r);
				mo(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case oe: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case se: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case _e: return r = ao(r), m(e, t, n, r, i);
				}
				if (De(r) || we(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, fo(r), i);
				if (r.$$typeof === fe) return m(e, t, n, Aa(t, r), i);
				mo(t, r);
			}
			return null;
		}
		function h(i, o, s, c) {
			for (var l = null, u = null, d = o, h = o = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), o = a(_, o, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), I && ra(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (o = a(d, o, h), u === null ? l = d : u.sibling = d, u = d);
				return I && ra(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), o = a(g, o, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), I && ra(i, h), l;
		}
		function g(i, o, c, l) {
			if (c == null) throw Error(s(151));
			for (var u = null, d = null, h = o, g = o = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(i, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(i, h), o = a(y, o, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(i, h), I && ra(i, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(i, v.value, l), v !== null && (o = a(v, o, g), d === null ? u = v : d.sibling = v, d = v);
				return I && ra(i, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, i, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), o = a(v, o, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(i, e);
			}), I && ra(i, g), u;
		}
		function _(e, r, a, c) {
			if (typeof a == "object" && a && a.type === ce && a.key === null && a.props.ref === void 0 && (a = a.props.children), typeof a == "object" && a) {
				switch (a.$$typeof) {
					case oe:
						a: {
							for (var l = a.key; r !== null;) {
								if (r.key === l) {
									if (l = a.type, l === ce) {
										if (r.tag === 7) {
											n(e, r.sibling), c = i(r, a.props.children), po(c, a), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === _e && ao(l) === r.type) {
										n(e, r.sibling), c = i(r, a.props), po(c, a), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							a.type === ce ? (c = Hi(a.props.children, e.mode, c, a.key), po(c, a), c.return = e, e = c) : (c = Vi(a.type, a.key, a.props, null, e.mode, c), po(c, a), c.return = e, e = c);
						}
						return o(e);
					case se:
						a: {
							for (l = a.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === a.containerInfo && r.stateNode.implementation === a.implementation) {
										n(e, r.sibling), c = i(r, a.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Gi(a, e.mode, c), c.return = e, e = c;
						}
						return o(e);
					case _e: return a = ao(a), _(e, r, a, c);
				}
				if (De(a)) return h(e, r, a, c);
				if (we(a)) {
					if (l = we(a), typeof l != "function") throw Error(s(150));
					return a = l.call(a), g(e, r, a, c);
				}
				if (typeof a.then == "function") return _(e, r, fo(a), c);
				if (a.$$typeof === fe) return _(e, r, Aa(e, a), c);
				mo(e, a);
			}
			return typeof a == "string" && a !== "" || typeof a == "number" || typeof a == "bigint" ? (a = "" + a, r !== null && r.tag === 6 ? (n(e, r.sibling), c = i(r, a), c.return = e, e = c) : (n(e, r), c = Ui(a, e.mode, c), c.return = e, e = c), o(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				uo = 0;
				var i = _(e, t, n, r);
				return lo = null, i;
			} catch (t) {
				if (t === $a || t === to) throw t;
				var a = Li(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var go = ho(!0), _o = ho(!1), vo = !1;
	function yo(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function bo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function xo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function So(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, W & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Pi(e), Ni(e, null, n), t;
		}
		return Ai(e, r, t, n), Pi(e);
	}
	function Co(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Dt(e, n);
		}
	}
	function wo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var To = !1;
	function Eo() {
		if (To) {
			var e = Wa;
			if (e !== null) throw e;
		}
	}
	function Do(e, t, n, r) {
		To = !1;
		var i = e.updateQueue;
		vo = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (q & f) === f : (r & f) === f) {
					f !== 0 && f === Ua && (To = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = S({}, d, f);
								break a;
							case 2: vo = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), sd |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Oo(e, t) {
		if (typeof e != "function") throw Error(s(191, e));
		e.call(t);
	}
	function ko(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Oo(n[e], t);
	}
	var Ao = je(null), jo = je(0);
	function Mo(e, t) {
		e = od, T(jo, e), T(Ao, t), od = e | t.baseLanes;
	}
	function No() {
		T(jo, od), T(Ao, Ao.current);
	}
	function Po() {
		od = jo.current, Me(Ao), Me(jo);
	}
	var Fo = je(null), Io = null;
	function Lo(e) {
		var t = e.alternate;
		T(Ho, Ho.current & 1), T(Fo, e), Io === null && (t === null || Ao.current !== null || t.memoizedState !== null) && (Io = e);
	}
	function Ro(e) {
		T(Ho, Ho.current), T(Fo, e), Io === null && (Io = e);
	}
	function zo(e) {
		e.tag === 22 ? (T(Ho, Ho.current), T(Fo, e), Io === null && (Io = e)) : Bo();
	}
	function Bo() {
		T(Ho, Ho.current), T(Fo, Fo.current);
	}
	function Vo(e) {
		Me(Fo), Io === e && (Io = null), Me(Ho);
	}
	var Ho = je(0);
	function Uo(e, t) {
		T(Fo, Fo.current), T(Ho, t);
	}
	function Wo(e) {
		Me(Ho), Me(Fo), Io === e && (Io = null);
	}
	function Go(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || om(n) || sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Ko = 0, L = null, R = null, qo = null, Jo = !1, Yo = !1, Xo = !1, Zo = 0, Qo = 0, $o = null, es = 0;
	function z() {
		throw Error(s(321));
	}
	function ts(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Kr(e[n], t[n])) return !1;
		return !0;
	}
	function ns(e, t, n, r, i, a) {
		return Ko = a, L = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, C.H = e === null || e.memoizedState === null ? vc : yc, Xo = !1, a = n(r, i), Xo = !1, Yo && (a = is(t, n, r, i)), rs(e), a;
	}
	function rs(e) {
		C.H = _c;
		var t = R !== null && R.next !== null;
		if (Ko = 0, qo = R = L = null, Jo = !1, Qo = 0, $o = null, t) throw Error(s(300));
		e === null || Ic || (e = e.dependencies, e !== null && Da(e) && (Ic = !0));
	}
	function is(e, t, n, r) {
		L = e;
		var i = 0;
		do {
			if (Yo && ($o = null), Qo = 0, Yo = !1, 25 <= i) throw Error(s(301));
			if (i += 1, qo = R = null, e.updateQueue != null) {
				var a = e.updateQueue;
				a.lastEffect = null, a.events = null, a.stores = null, a.memoCache != null && (a.memoCache.index = 0);
			}
			C.H = bc, a = t(n, r);
		} while (Yo);
		return a;
	}
	function as() {
		var e = C.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? ds(t) : t, e = e.useState()[0], (R === null ? null : R.memoizedState) !== e && (L.flags |= 1024), t;
	}
	function os() {
		var e = Zo !== 0;
		return Zo = 0, e;
	}
	function ss(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function cs(e) {
		if (Jo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Jo = !1;
		}
		Ko = 0, qo = R = L = null, Yo = !1, Qo = Zo = 0, $o = null;
	}
	function ls() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return qo === null ? L.memoizedState = qo = e : qo = qo.next = e, qo;
	}
	function B() {
		if (R === null) {
			var e = L.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = R.next;
		var t = qo === null ? L.memoizedState : qo.next;
		if (t !== null) qo = t, R = e;
		else {
			if (e === null) throw L.alternate === null ? Error(s(467)) : Error(s(310));
			R = e, e = {
				memoizedState: R.memoizedState,
				baseState: R.baseState,
				baseQueue: R.baseQueue,
				queue: R.queue,
				next: null
			}, qo === null ? L.memoizedState = qo = e : qo = qo.next = e;
		}
		return qo;
	}
	function us() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function ds(e) {
		var t = Qo;
		return Qo += 1, $o === null && ($o = []), e = io($o, e, t), t = L, (qo === null ? t.memoizedState : qo.next) === null && (t = t.alternate, C.H = t === null || t.memoizedState === null ? vc : yc), e;
	}
	function fs(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return ds(e);
			if (e.$$typeof === Se) return;
			if (e.$$typeof === fe) return ka(e);
		}
		throw Error(s(438, String(e)));
	}
	function ps(e) {
		var t = null, n = L.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = L.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = us(), L.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = be;
		return t.index++, n;
	}
	function ms(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function hs(e) {
		return gs(B(), R, e);
	}
	function gs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(s(311));
		r.lastRenderedReducer = n;
		var i = e.baseQueue, a = r.pending;
		if (a !== null) {
			if (i !== null) {
				var o = i.next;
				i.next = a.next, a.next = o;
			}
			t.baseQueue = i = a, r.pending = null;
		}
		if (a = e.baseState, i === null) e.memoizedState = a;
		else {
			t = i.next;
			var c = o = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Ko & f) === f : (q & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Ua && (d = !0);
					else if ((Ko & p) === p) {
						u = u.next, p === Ua && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, o = a) : l = l.next = f, L.lanes |= p, sd |= p;
					f = u.action, Xo && n(a, f), a = u.hasEagerState ? u.eagerState : n(a, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, o = a) : l = l.next = p, L.lanes |= f, sd |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? o = a : l.next = c, !Kr(a, e.memoizedState) && (Ic = !0, d && (n = Wa, n !== null))) throw n;
			e.memoizedState = a, e.baseState = o, e.baseQueue = l, r.lastRenderedState = a;
		}
		return i === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function _s(e) {
		var t = B(), n = t.queue;
		if (n === null) throw Error(s(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, i = n.pending, a = t.memoizedState;
		if (i !== null) {
			n.pending = null;
			var o = i = i.next;
			do
				a = e(a, o.action), o = o.next;
			while (o !== i);
			Kr(a, t.memoizedState) || (Ic = !0), t.memoizedState = a, t.baseQueue === null && (t.baseState = a), n.lastRenderedState = a;
		}
		return [a, r];
	}
	function vs(e, t, n) {
		var r = L, i = B(), a = I;
		if (a) {
			if (n === void 0) throw Error(s(407));
			n = n();
		} else n = t();
		var o = !Kr((R || i).memoizedState, n);
		if (o && (i.memoizedState = n, Ic = !0), i = i.queue, Us(xs.bind(null, r, i, e), [e]), e = i.getSnapshot !== t || o || qo !== null && !!(qo.memoizedState.tag & 1), Rs(e ? 9 : 8, { destroy: void 0 }, bs.bind(null, r, i, n, t), null), e) {
			if (r.flags |= 2048, G === null) throw Error(s(349));
			a || Ko & 127 || ys(r, t, n);
		}
		return n;
	}
	function ys(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = L.updateQueue, t === null ? (t = us(), L.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function bs(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Ss(t) && Cs(e);
	}
	function xs(e, t, n) {
		return n(function() {
			Ss(t) && Cs(e);
		});
	}
	function Ss(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Kr(e, n);
		} catch {
			return !0;
		}
	}
	function Cs(e) {
		var t = Mi(e, 2);
		t !== null && Pd(t, e, 2);
	}
	function ws(e) {
		var t = ls();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Xo) {
				ut(!0);
				try {
					n();
				} finally {
					ut(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ms,
			lastRenderedState: e
		}, t;
	}
	function Ts(e, t, n, r) {
		return e.baseState = n, gs(e, R, typeof r == "function" ? r : ms);
	}
	function Es(e, t, n, r, i) {
		if (mc(e)) throw Error(s(485));
		if (e = t.action, e !== null) {
			var a = {
				payload: i,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					a.listeners.push(e);
				}
			};
			C.T === null ? a.isTransition = !1 : n(!0), r(a), n = t.pending, n === null ? (a.next = t.pending = a, Ds(t, a)) : (a.next = n.next, t.pending = n.next = a);
		}
	}
	function Ds(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = C.T, o = {};
			o.types = a === null ? null : a.types, C.T = o;
			try {
				var s = n(i, r), c = C.S;
				c !== null && c(o, s), Os(e, t, s);
			} catch (n) {
				As(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), C.T = a;
			}
		} else try {
			a = n(i, r), Os(e, t, a);
		} catch (n) {
			As(e, t, n);
		}
	}
	function Os(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			ks(e, t, n);
		}, function(n) {
			return As(e, t, n);
		}) : ks(e, t, n);
	}
	function ks(e, t, n) {
		t.status = "fulfilled", t.value = n, js(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Ds(e, n)));
	}
	function As(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, js(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function js(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Ms(e, t) {
		return t;
	}
	function Ns(e, t) {
		if (I) {
			var n = G.formState;
			if (n !== null) {
				a: {
					var r = L;
					if (I) {
						if (F) {
							b: {
								for (var i = F, a = ua; i.nodeType !== 8;) if (!a || (i = lm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								F = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						fa(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = ls(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ms,
			lastRenderedState: t
		}, n.queue = r, n = dc.bind(null, L, r), r.dispatch = n, r = ws(!1), a = pc.bind(null, L, !1, r.queue), r = ls(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Es.bind(null, L, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Ps(e) {
		return Fs(B(), R, e);
	}
	function Fs(e, t, n) {
		if (t = gs(e, t, Ms)[0], e = hs(ms)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = ds(t);
		} catch (e) {
			throw e === $a ? to : e;
		}
		else r = t;
		t = B();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (L.flags |= 2048, Rs(9, { destroy: void 0 }, Is.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Is(e, t) {
		e.action = t;
	}
	function Ls(e) {
		var t = B(), n = R;
		if (n !== null) return Fs(t, n, e);
		B(), t = t.memoizedState, n = B();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Rs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = L.updateQueue, t === null && (t = us(), L.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function zs() {
		return B().memoizedState;
	}
	function Bs(e, t, n, r) {
		var i = ls();
		L.flags |= e, i.memoizedState = Rs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Vs(e, t, n, r) {
		var i = B();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		R !== null && r !== null && ts(r, R.memoizedState.deps) ? i.memoizedState = Rs(t, a, n, r) : (L.flags |= e, i.memoizedState = Rs(1 | t, a, n, r));
	}
	function Hs(e, t) {
		Bs(8390656, 8, e, t);
	}
	function Us(e, t) {
		Vs(2048, 8, e, t);
	}
	function Ws(e) {
		L.flags |= 4;
		var t = L.updateQueue;
		if (t === null) t = us(), L.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Gs(e) {
		var t = B().memoizedState;
		return Ws({
			ref: t,
			nextImpl: e
		}), function() {
			if (W & 2) throw Error(s(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Ks(e, t) {
		return Vs(4, 2, e, t);
	}
	function qs(e, t) {
		return Vs(4, 4, e, t);
	}
	function Js(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Ys(e, t, n) {
		n = n == null ? null : n.concat([e]), Vs(4, 4, Js.bind(null, t, e), n);
	}
	function Xs() {}
	function Zs(e, t) {
		var n = B();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && ts(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Qs(e, t) {
		var n = B();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && ts(t, r[1])) return r[0];
		if (r = e(), Xo) {
			ut(!0);
			try {
				e();
			} finally {
				ut(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function $s(e, t, n) {
		return n === void 0 || Ko & 1073741824 && !(q & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Md(), L.lanes |= e, sd |= e, n);
	}
	function ec(e, t, n, r) {
		return Kr(n, t) ? n : Ao.current === null ? !(Ko & 106) || Ko & 1073741824 && !(q & 261930) ? (Ic = !0, e.memoizedState = n) : (e = Md(), L.lanes |= e, sd |= e, t) : (e = $s(e, n, r), Kr(e, t) || (Ic = !0), e);
	}
	function tc(e, t, n, r, i) {
		var a = w.p;
		w.p = a !== 0 && 8 > a ? a : 8;
		var o = C.T, s = {};
		s.types = o === null ? null : o.types, C.T = s, pc(e, !1, t, n);
		try {
			var c = i(), l = C.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? fc(e, t, qa(c, r), jd(e)) : fc(e, t, r, jd(e));
		} catch (n) {
			fc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, jd());
		} finally {
			w.p = a, o !== null && s.types !== null && (o.types = s.types), C.T = o;
		}
	}
	function nc() {}
	function rc(e, t, n, r) {
		if (e.tag !== 5) throw Error(s(476));
		var i = ic(e).queue;
		tc(e, i, t, Oe, n === null ? nc : function() {
			return ac(e), n(r);
		});
	}
	function ic(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: Oe,
			baseState: Oe,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ms,
				lastRenderedState: Oe
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ms,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function ac(e) {
		var t = ic(e);
		t.next === null && (t = e.alternate.memoizedState), fc(e, t.next.queue, {}, jd());
	}
	function oc() {
		return ka(sh);
	}
	function sc() {
		return B().memoizedState;
	}
	function cc() {
		return B().memoizedState;
	}
	function lc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = jd();
					e = xo(n);
					var r = So(t, e, n);
					r !== null && (Pd(r, t, n), Co(r, t, n)), t = { cache: Ia() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function uc(e, t, n) {
		var r = jd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, mc(e) ? hc(t, n) : (n = ji(e, t, n, r), n !== null && (Pd(n, e, r), gc(n, t, r)));
	}
	function dc(e, t, n) {
		fc(e, t, n, jd());
	}
	function fc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (mc(e)) hc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Kr(s, o)) return Ai(e, t, i, 0), G === null && ki(), !1;
			} catch {}
			if (n = ji(e, t, i, r), n !== null) return Pd(n, e, r), gc(n, t, r), !0;
		}
		return !1;
	}
	function pc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Pf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, mc(e)) {
			if (t) throw Error(s(479));
		} else t = ji(e, n, r, 2), t !== null && Pd(t, e, 2);
	}
	function mc(e) {
		var t = e.alternate;
		return e === L || t !== null && t === L;
	}
	function hc(e, t) {
		Yo = Jo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function gc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Dt(e, n);
		}
	}
	var _c = {
		readContext: ka,
		use: fs,
		useCallback: z,
		useContext: z,
		useEffect: z,
		useImperativeHandle: z,
		useLayoutEffect: z,
		useInsertionEffect: z,
		useMemo: z,
		useReducer: z,
		useRef: z,
		useState: z,
		useDebugValue: z,
		useDeferredValue: z,
		useTransition: z,
		useSyncExternalStore: z,
		useId: z,
		useHostTransitionStatus: z,
		useFormState: z,
		useActionState: z,
		useOptimistic: z,
		useMemoCache: z,
		useCacheRefresh: z,
		useEffectEvent: z
	}, vc = {
		readContext: ka,
		use: fs,
		useCallback: function(e, t) {
			return ls().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ka,
		useEffect: Hs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Bs(4194308, 4, Js.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Bs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Bs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = ls();
			t = t === void 0 ? null : t;
			var r = e();
			if (Xo) {
				ut(!0);
				try {
					e();
				} finally {
					ut(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = ls();
			if (n !== void 0) {
				var i = n(t);
				if (Xo) {
					ut(!0);
					try {
						n(t);
					} finally {
						ut(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = uc.bind(null, L, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = ls();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = ws(e);
			var t = e.queue, n = dc.bind(null, L, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Xs,
		useDeferredValue: function(e, t) {
			return $s(ls(), e, t);
		},
		useTransition: function() {
			var e = ws(!1);
			return e = tc.bind(null, L, e.queue, !0, !1), ls().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = L, i = ls();
			if (I) {
				if (n === void 0) throw Error(s(407));
				n = n();
			} else {
				if (n = t(), G === null) throw Error(s(349));
				q & 127 || ys(r, t, n);
			}
			i.memoizedState = n;
			var a = {
				value: n,
				getSnapshot: t
			};
			return i.queue = a, Hs(xs.bind(null, r, a, e), [e]), r.flags |= 2048, Rs(9, { destroy: void 0 }, bs.bind(null, r, a, n, t), null), n;
		},
		useId: function() {
			var e = ls(), t = G.identifierPrefix;
			if (I) {
				var n = na, r = ta;
				n = (r & ~(1 << 32 - dt(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Zo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = es++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: oc,
		useFormState: Ns,
		useActionState: Ns,
		useOptimistic: function(e) {
			var t = ls();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = pc.bind(null, L, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: ps,
		useCacheRefresh: function() {
			return ls().memoizedState = lc.bind(null, L);
		},
		useEffectEvent: function(e) {
			var t = ls(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (W & 2) throw Error(s(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, yc = {
		readContext: ka,
		use: fs,
		useCallback: Zs,
		useContext: ka,
		useEffect: Us,
		useImperativeHandle: Ys,
		useInsertionEffect: Ks,
		useLayoutEffect: qs,
		useMemo: Qs,
		useReducer: hs,
		useRef: zs,
		useState: function() {
			return hs(ms);
		},
		useDebugValue: Xs,
		useDeferredValue: function(e, t) {
			return ec(B(), R.memoizedState, e, t);
		},
		useTransition: function() {
			var e = hs(ms)[0], t = B().memoizedState;
			return [typeof e == "boolean" ? e : ds(e), t];
		},
		useSyncExternalStore: vs,
		useId: sc,
		useHostTransitionStatus: oc,
		useFormState: Ps,
		useActionState: Ps,
		useOptimistic: function(e, t) {
			return Ts(B(), R, e, t);
		},
		useMemoCache: ps,
		useCacheRefresh: cc,
		useEffectEvent: Gs
	}, bc = {
		readContext: ka,
		use: fs,
		useCallback: Zs,
		useContext: ka,
		useEffect: Us,
		useImperativeHandle: Ys,
		useInsertionEffect: Ks,
		useLayoutEffect: qs,
		useMemo: Qs,
		useReducer: _s,
		useRef: zs,
		useState: function() {
			return _s(ms);
		},
		useDebugValue: Xs,
		useDeferredValue: function(e, t) {
			var n = B();
			return R === null ? $s(n, e, t) : ec(n, R.memoizedState, e, t);
		},
		useTransition: function() {
			var e = _s(ms)[0], t = B().memoizedState;
			return [typeof e == "boolean" ? e : ds(e), t];
		},
		useSyncExternalStore: vs,
		useId: sc,
		useHostTransitionStatus: oc,
		useFormState: Ls,
		useActionState: Ls,
		useOptimistic: function(e, t) {
			var n = B();
			return R === null ? (n.baseState = e, [e, n.queue.dispatch]) : Ts(n, R, e, t);
		},
		useMemoCache: ps,
		useCacheRefresh: cc,
		useEffectEvent: Gs
	};
	function xc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : S({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Sc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = xo(r);
			i.payload = t, n != null && (i.callback = n), t = So(e, i, r), t !== null && (Pd(t, e, r), Co(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = xo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = So(e, i, r), t !== null && (Pd(t, e, r), Co(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = jd(), r = xo(n);
			r.tag = 2, t != null && (r.callback = t), t = So(e, r, n), t !== null && (Pd(t, e, n), Co(t, e, n));
		}
	};
	function Cc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !qr(n, r) || !qr(i, a) : !0;
	}
	function wc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Sc.enqueueReplaceState(t, t.state, null);
	}
	function Tc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = S({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Ec(e) {
		Ti(e);
	}
	function Dc(e) {
		console.error(e);
	}
	function Oc(e) {
		Ti(e);
	}
	function kc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ac(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function jc(e, t, n) {
		return n = xo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			kc(e, t);
		}, n;
	}
	function Mc(e) {
		return e = xo(e), e.tag = 3, e;
	}
	function Nc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Ac(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Ac(t, n, r), typeof i != "function" && (yd === null ? yd = /* @__PURE__ */ new Set([this]) : yd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Pc(e, t, n, r, i) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Ea(t, n, i, !0), n = Fo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Io === null ? Kd() : n.alternate === null && Y === 0 && (Y = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === no ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), mf(e, r, i)), !1;
					case 22: return n.flags |= 65536, r === no ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), mf(e, r, i)), !1;
				}
				throw Error(s(435, n.tag));
			}
			return mf(e, r, i), Kd(), !1;
		}
		if (I) return t = Fo.current, t === null ? (r !== da && (t = Error(s(423), { cause: r }), va(qi(t, n))), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = qi(r, n), i = jc(e.stateNode, r, i), wo(e, i), Y !== 4 && (Y = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== da && (e = Error(s(422), { cause: r }), va(qi(e, n)))), !1;
		var a = Error(s(520), { cause: r });
		if (a = qi(a, n), fd === null ? fd = [a] : fd.push(a), Y !== 4 && (Y = 2), t === null) return !0;
		r = qi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = jc(n.stateNode, r, e), wo(n, e), !1;
				case 1:
					if (t = n.type, a = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || a !== null && typeof a.componentDidCatch == "function" && (yd === null || !yd.has(a)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = Mc(i), Nc(i, e, n, r), wo(n, i), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Fc = Error(s(461)), Ic = !1;
	function Lc(e, t, n, r) {
		t.child = e === null ? _o(t, null, n, r) : go(t, e.child, n, r);
	}
	function Rc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Oa(t), r = ns(e, t, n, o, a, i), s = os(), e !== null && !Ic ? (ss(e, t, i), fl(e, t, i)) : (I && s && aa(t), t.flags |= 1, Lc(e, t, r, i), t.child);
	}
	function zc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Ri(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Bc(e, t, a, r, i)) : (e = Vi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !pl(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? qr : n, n(o, r) && e.ref === t.ref) return fl(e, t, i);
		}
		return t.flags |= 1, e = zi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Bc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (qr(a, r) && e.ref === t.ref) {
				if (Ic = !1, t.pendingProps = r = a, pl(e, i)) e.flags & 131072 && (Ic = !0);
				else return t.lanes = e.lanes, fl(e, t, i);
			}
		}
		return Jc(e, t, n, r, i);
	}
	function Vc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Uc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Za(t, a === null ? null : a.cachePool), a === null ? No() : Mo(t, a), zo(t);
			else return r = t.lanes = 536870912, Uc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Za(t, null), No(), Bo()) : (Za(t, a.cachePool), Mo(t, a), Bo(), t.memoizedState = null);
		return Lc(e, t, i, n), t.child;
	}
	function Hc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Uc(e, t, n, r, i) {
		var a = Xa();
		return a = a === null ? null : {
			parent: Fa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Za(t, null), No(), zo(t), e !== null && Ea(e, t, r, !0), t.childLanes = i, null;
	}
	function Wc(e, t) {
		return t = rl({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Gc(e, t, n) {
		return go(t, e.child, null, n), e = Wc(t, t.pendingProps), e.flags |= 2, Vo(t), t.memoizedState = null, e;
	}
	function Kc(e, t, n) {
		var r = t.pendingProps, i = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (I) {
				if (r.mode === "hidden") return e = Wc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Hc(null, e);
				if (Ro(t), (e = F) ? (e = am(e, ua), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: ea === null ? null : {
						id: ta,
						overflow: na
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Wi(e), n.return = t, t.child = n, ca = t, F = null)) : e = null, e === null) throw fa(t);
				return t.lanes = 536870912, null;
			}
			return Wc(t, r);
		}
		var a = e.memoizedState;
		if (a !== null) {
			var o = a.dehydrated;
			if (Ro(t), i) {
				if (t.flags & 256) t.flags &= -257, t = Gc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(s(558));
			} else if (Ic || Ea(e, t, n, !1), i = (n & e.childLanes) !== 0, Ic || i) {
				if (Ao.current === null) {
					if (r = G, r !== null && (o = Ot(r, n), o !== 0 && o !== a.retryLane)) throw a.retryLane = o, Mi(e, o), Pd(r, e, o), Fc;
					Kd();
				}
				t = Gc(e, t, n);
			} else e = a.treeContext, F = lm(o.nextSibling), ca = t, I = !0, la = null, ua = !1, e !== null && sa(t, e), t = Wc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = zi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function qc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(s(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Jc(e, t, n, r, i) {
		return Oa(t), n = ns(e, t, n, r, void 0, i), r = os(), e !== null && !Ic ? (ss(e, t, i), fl(e, t, i)) : (I && r && aa(t), t.flags |= 1, Lc(e, t, n, i), t.child);
	}
	function Yc(e, t, n, r, i, a) {
		return Oa(t), t.updateQueue = null, n = is(t, r, n, i), rs(e), r = os(), e !== null && !Ic ? (ss(e, t, a), fl(e, t, a)) : (I && r && aa(t), t.flags |= 1, Lc(e, t, n, a), t.child);
	}
	function Xc(e, t, n, r, i) {
		if (Oa(t), t.stateNode === null) {
			var a = Fi, o = n.contextType;
			typeof o == "object" && o && (a = ka(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Sc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, yo(t), o = n.contextType, a.context = typeof o == "object" && o ? ka(o) : Fi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (xc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Sc.enqueueReplaceState(a, a.state, null), Do(t, r, a, i), Eo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Tc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Fi, typeof u == "object" && u && (o = ka(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && wc(t, a, r, o), vo = !1;
			var f = t.memoizedState;
			a.state = f, Do(t, r, a, i), Eo(), l = t.memoizedState, s || f !== l || vo ? (typeof d == "function" && (xc(t, n, d, r), l = t.memoizedState), (c = vo || Cc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, bo(e, t), o = t.memoizedProps, u = Tc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Fi, typeof l == "object" && l && (c = ka(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && wc(t, a, r, c), vo = !1, f = t.memoizedState, a.state = f, Do(t, r, a, i), Eo();
			var p = t.memoizedState;
			o !== d || f !== p || vo || e !== null && e.dependencies !== null && Da(e.dependencies) ? (typeof s == "function" && (xc(t, n, s, r), p = t.memoizedState), (u = vo || Cc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Da(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, qc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = go(t, e.child, null, i), t.child = go(t, null, n, i)) : Lc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = fl(e, t, i), e;
	}
	function Zc(e, t, n, r) {
		return ga(), t.flags |= 256, Lc(e, t, n, r), t.child;
	}
	var Qc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function $c(e) {
		return {
			baseLanes: e,
			cachePool: Qa()
		};
	}
	function el(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ud), e;
	}
	function tl(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Ho.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (I) {
				if (i ? Lo(t) : Bo(), (e = F) ? (e = am(e, ua), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: ea === null ? null : {
						id: ta,
						overflow: na
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Wi(e), n.return = t, t.child = n, ca = t, F = null)) : e = null, e === null) throw fa(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Bo(), i = t.mode, a = rl({
				mode: "hidden",
				children: a
			}, i), r = Hi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = $c(n), r.childLanes = el(e, o, n), t.memoizedState = Qc, Hc(null, r)) : (Lo(t), nl(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return al(e, t, a, o, r, c, s, n);
		}
		return i ? (Bo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = zi(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Hi(i, a, n, null), i.flags |= 2) : i = zi(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Hc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = $c(n) : (a = i.cachePool, a === null ? a = Qa() : (s = Fa._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = el(e, o, n), t.memoizedState = Qc, Hc(e.child, r)) : (Lo(t), n = e.child, e = n.sibling, n = zi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function nl(e, t) {
		return t = rl({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function rl(e, t) {
		return e = Li(22, e, null, t), e.lanes = 0, e;
	}
	function il(e, t, n) {
		return go(t, e.child, null, n), e = nl(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function al(e, t, n, r, i, a, o, c) {
		if (n) return t.flags & 256 ? (Lo(t), t.flags &= -257, il(e, t, c)) : t.memoizedState === null ? (Bo(), a = i.fallback, o = t.mode, i = rl({
			mode: "visible",
			children: i.children
		}, o), a = Hi(a, o, c, null), a.flags |= 2, i.return = t, a.return = t, i.sibling = a, t.child = i, go(t, e.child, null, c), i = t.child, i.memoizedState = $c(c), i.childLanes = el(e, r, c), t.memoizedState = Qc, Hc(null, i)) : (Bo(), t.child = e.child, t.flags |= 128, null);
		if (Lo(t), sm(a)) {
			if (r = a.nextSibling && a.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (i = Error(s(419)), i.stack = "", i.digest = r, va({
				value: i,
				source: null,
				stack: null
			})), il(e, t, c);
		}
		if (Ic || Ea(e, t, c, !1), r = (c & e.childLanes) !== 0, Ic || r) {
			if (Ao.current !== null) return il(e, t, c);
			if (r = G, r !== null && (i = Ot(r, c), i !== 0 && i !== o.retryLane)) throw o.retryLane = i, Mi(e, i), Pd(r, e, i), Fc;
			return om(a) || Kd(), il(e, t, c);
		}
		return om(a) ? (t.flags |= 192, t.child = e.child, null) : (e = o.treeContext, F = lm(a.nextSibling), ca = t, I = !0, la = null, ua = !1, e !== null && sa(t, e), t = nl(t, i.children), t.flags |= 134221824, t);
	}
	function ol(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), wa(e.return, t, n);
	}
	function sl(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Go(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function cl(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function ll(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function ul(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Ho.current;
		if (t.flags & 128) return Uo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Uo(t, o), i === "backwards" && e !== null ? (ll(e), Lc(e, t, r, n), ll(e)) : Lc(e, t, r, n), r = I ? Zi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && ol(e, n, t);
			else if (e.tag === 19) ol(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = sl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, ll(t)), cl(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Go(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				cl(t, !0, n, null, a, r);
				break;
			case "together":
				cl(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = sl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), cl(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function dl(e, t, n) {
		var r = t.pendingProps;
		return Sa(t, t.type, r.value), Lc(e, t, r.children, n), t.child;
	}
	function fl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), sd |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Ea(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(s(153));
		if (t.child !== null) {
			for (e = t.child, n = zi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = zi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function pl(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Da(e)));
	}
	function ml(e, t, n) {
		switch (t.tag) {
			case 3:
				Le(t, t.stateNode.containerInfo), Sa(t, Fa, e.memoizedState.cache), ga();
				break;
			case 27:
			case 5:
				ze(t);
				break;
			case 4:
				Le(t, t.stateNode.containerInfo);
				break;
			case 10:
				Sa(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Ro(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Lo(t), t.flags |= 128, null;
					r = Ea(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? tl(e, t, n) : (Lo(t), e = fl(e, t, n), e === null ? null : e.sibling);
				}
				Lo(t);
				break;
			case 19:
				if (t.flags & 128) return ul(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (Ea(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return ul(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Uo(t, Ho.current), r) break;
				return null;
			case 22: return t.lanes = 0, Vc(e, t, n, t.pendingProps);
			case 24: Sa(t, Fa, e.memoizedState.cache);
		}
		return fl(e, t, n);
	}
	function hl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Ic = !0;
			else {
				if (!pl(e, n) && !(t.flags & 128)) return Ic = !1, ml(e, t, n);
				Ic = !!(e.flags & 131072);
			}
		} else Ic = !1, I && t.flags & 1048576 && ia(t, Zi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = ao(t.elementType), t.type = e, typeof e == "function") Ri(e) ? (r = Tc(e, r), t.tag = 1, t = Xc(null, t, e, r, n)) : (t.tag = 0, t = Jc(null, t, e, r, n));
					else {
						if (e != null) {
							var i = e.$$typeof;
							if (i === pe) {
								t.tag = 11, t = Rc(null, t, e, r, n);
								break a;
							}
							if (i === ge) {
								t.tag = 14, t = zc(null, t, e, r, n);
								break a;
							}
							if (i === fe) {
								t.tag = 10, t.type = e, t = dl(null, t, n);
								break a;
							}
						}
						throw t = Ee(e) || e, Error(s(306, t, ""));
					}
				}
				return t;
			case 0: return Jc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, i = Tc(r, t.pendingProps), Xc(e, t, r, i, n);
			case 3:
				a: {
					if (Le(t, t.stateNode.containerInfo), e === null) throw Error(s(387));
					r = t.pendingProps;
					var a = t.memoizedState;
					i = a.element, bo(e, t), Do(t, r, null, n);
					var o = t.memoizedState;
					if (r = o.cache, Sa(t, Fa, r), r !== a.cache && Ta(t, [Fa], n, !0), Eo(), r = o.element, a.isDehydrated) {
						if (a = {
							element: r,
							isDehydrated: !1,
							cache: o.cache
						}, t.updateQueue.baseState = a, t.memoizedState = a, t.flags & 256) {
							t = Zc(e, t, r, n);
							break a;
						}
						if (r !== i) {
							i = qi(Error(s(424)), t), va(i), t = Zc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (F = lm(e.firstChild), ca = t, I = !0, la = null, ua = !0, n = _o(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (ga(), r === i) {
							t = fl(e, t, n);
							break a;
						}
						Lc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return qc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : I || (t.stateNode = fp(t.type, t.pendingProps, Fe.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return ze(t), e === null && I && (r = t.stateNode = hm(t.type, t.pendingProps, Fe.current), ca = t, ua = !0, i = F, Sp(t.type) ? (um = i, F = lm(r.firstChild)) : F = i), Lc(e, t, t.pendingProps.children, n), qc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && I && ((i = r = F) && (r = rm(r, t.type, t.pendingProps, ua), r === null ? i = !1 : (t.stateNode = r, ca = t, F = lm(r.firstChild), ua = !1, i = !0)), i || fa(t)), ze(t), i = t.type, a = t.pendingProps, o = e === null ? null : e.memoizedProps, r = a.children, pp(i, a) ? r = null : o !== null && pp(i, o) && (t.flags |= 32), t.memoizedState !== null && (i = ns(e, t, as, null, null, n), sh._currentValue = i), qc(e, t), Lc(e, t, r, n), t.child;
			case 6: return e === null && I && ((e = n = F) && (n = im(n, t.pendingProps, ua), n === null ? e = !1 : (t.stateNode = n, ca = t, F = null, e = !0)), e || fa(t)), null;
			case 13: return tl(e, t, n);
			case 4: return Le(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = go(t, null, r, n) : Lc(e, t, r, n), t.child;
			case 11: return Rc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, qc(e, t), Lc(e, t, r, n), t.child;
			case 8: return Lc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Lc(e, t, t.pendingProps.children, n), t.child;
			case 10: return dl(e, t, n);
			case 9: return i = t.type._context, r = t.pendingProps.children, Oa(t), i = ka(i), r = r(i), t.flags |= 1, Lc(e, t, r, n), t.child;
			case 14: return zc(e, t, t.type, t.pendingProps, n);
			case 15: return Bc(e, t, t.type, t.pendingProps, n);
			case 19: return ul(e, t, n);
			case 31: return Kc(e, t, n);
			case 22: return Vc(e, t, n, t.pendingProps);
			case 24: return Oa(t), r = ka(Fa), e === null ? (i = Xa(), i === null && (i = G, a = Ia(), i.pooledCache = a, a.refCount++, a !== null && (i.pooledCacheLanes |= n), i = a), t.memoizedState = {
				parent: r,
				cache: i
			}, yo(t), Sa(t, Fa, i)) : ((e.lanes & n) !== 0 && (bo(e, t), Do(t, null, null, n), Eo()), i = e.memoizedState, a = t.memoizedState, i.parent === r ? (r = a.cache, Sa(t, Fa, r), r !== i.cache && Ta(t, [Fa], n, !0)) : (i = {
				parent: r,
				cache: r
			}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Sa(t, Fa, r))), Lc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : I && aa(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : qc(e, t), Lc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(s(156, t.tag));
	}
	function gl(e) {
		e.flags |= 4;
	}
	function _l(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Ud()) e.flags |= 8192;
				else throw oo = no, eo;
			}
		} else e.flags &= -16777217;
	}
	function vl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Ud()) e.flags |= 8192;
			else throw oo = no, eo;
		}
	}
	function yl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Ct(), e.lanes |= t, dd |= t);
	}
	function bl(e, t) {
		if (!I) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function V(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function xl(e, t, n) {
		var r = t.pendingProps;
		switch (oa(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return V(t), null;
			case 1: return V(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Ca(Fa), Re(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ha(t) ? gl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, _a())), V(t), null;
			case 26:
				var i = t.type, a = t.memoizedState;
				return e === null ? (gl(t), a === null ? (V(t), _l(t, i, null, r, n)) : (V(t), vl(t, a))) : a ? a === e.memoizedState ? (V(t), t.flags &= -16777217) : (gl(t), V(t), vl(t, a)) : (e = e.memoizedProps, e !== r && gl(t), V(t), _l(t, i, e, r, n)), null;
			case 27:
				if (Be(t), n = Fe.current, i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && gl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(s(166));
						return V(t), t.subtreeFlags &= -33554433, null;
					}
					e = Ne.current, ha(t) ? pa(t, e) : (e = hm(i, r, n), t.stateNode = e, gl(t));
				}
				return V(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Be(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && gl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(s(166));
						return V(t), t.subtreeFlags &= -33554433, null;
					}
					if (a = Ne.current, ha(t)) pa(t, a);
					else {
						var o = lp(Fe.current);
						switch (a) {
							case 1:
								a = o.createElementNS("http://www.w3.org/2000/svg", i);
								break;
							case 2:
								a = o.createElementNS("http://www.w3.org/1998/Math/MathML", i);
								break;
							default: switch (i) {
								case "svg":
									a = o.createElementNS("http://www.w3.org/2000/svg", i);
									break;
								case "math":
									a = o.createElementNS("http://www.w3.org/1998/Math/MathML", i);
									break;
								case "script":
									a = o.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild);
									break;
								case "select":
									a = typeof r.is == "string" ? o.createElement("select", { is: r.is }) : o.createElement("select"), r.multiple ? a.multiple = !0 : r.size && (a.size = r.size);
									break;
								default: a = typeof r.is == "string" ? o.createElement(i, { is: r.is }) : o.createElement(i);
							}
						}
						a[D] = t, a[Pt] = r;
						a: for (o = t.child; o !== null;) {
							if (o.tag === 5 || o.tag === 6) a.appendChild(o.stateNode);
							else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
								o.child.return = o, o = o.child;
								continue;
							}
							if (o === t) break a;
							for (; o.sibling === null;) {
								if (o.return === null || o.return === t) break a;
								o = o.return;
							}
							o.sibling.return = o.return, o = o.sibling;
						}
						t.stateNode = a;
						a: switch (np(a, i, r), i) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && gl(t);
					}
				}
				return V(t), t.subtreeFlags &= -33554433, _l(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && gl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(s(166));
					if (e = Fe.current, ha(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, i = ca, i !== null) switch (i.tag) {
							case 27:
							case 5: r = i.memoizedProps;
						}
						e[D] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ep(e.nodeValue, n)), e || fa(t, !0);
					} else e = lp(e).createTextNode(r), e[D] = t, t.stateNode = e;
				}
				return V(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ha(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(s(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(s(557));
							e[D] = t;
						} else ga(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						V(t), e = !1;
					} else n = _a(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Vo(t), t) : (Vo(t), null);
					if (t.flags & 128) throw Error(s(558));
				}
				return V(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (i = ha(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!i) throw Error(s(318));
							if (i = t.memoizedState, i = i === null ? null : i.dehydrated, !i) throw Error(s(317));
							i[D] = t;
						} else ga(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						V(t), i = !1;
					} else i = _a(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
					if (!i) return t.flags & 256 ? (Vo(t), t) : (Vo(t), null);
				}
				return Vo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), a = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (a = r.memoizedState.cachePool.pool), a !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), yl(t, t.updateQueue), V(t), null);
			case 4: return Re(), e === null && Wf(t.stateNode.containerInfo), t.flags |= 67108864, V(t), null;
			case 10: return Ca(t.type), V(t), null;
			case 19:
				if (Wo(t), r = t.memoizedState, r === null) return V(t), null;
				if (i = !!(t.flags & 128), a = r.rendering, a === null) {
					if (i) bl(r, !1);
					else {
						if (Y !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (a = Go(e), a !== null) {
								for (t.flags |= 128, bl(r, !1), e = a.updateQueue, t.updateQueue = e, yl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Bi(n, e), n = n.sibling;
								return Uo(t, Ho.current & 1 | 2), I && ra(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && $e() > _d && (t.flags |= 128, i = !0, bl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!i) {
						if (e = Go(a), e !== null) {
							if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, yl(t, e), bl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !a.alternate && !I) return V(t), null;
						} else 2 * $e() - r.renderingStartTime > _d && n !== 536870912 && (t.flags |= 128, i = !0, bl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (a.sibling = t.child, t.child = a) : (e = r.last, e === null ? t.child = a : e.sibling = a, r.last = a);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = $e(), e.sibling = null, a = Ho.current, a = i ? a & 1 | 2 : a & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || I ? Uo(t, a) : (n = a, T(Fo, t), T(Ho, n), Io === null && (Io = t)), I && ra(t, r.treeForkCount), e;
				}
				return V(t), null;
			case 22:
			case 23: return Vo(t), Po(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (V(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : V(t), n = t.updateQueue, n !== null && yl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && Me(Ya), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Ca(Fa), V(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, V(t), null;
		}
		throw Error(s(156, t.tag));
	}
	function Sl(e, t) {
		switch (oa(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Ca(Fa), Re(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Be(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Vo(t), t.alternate === null) throw Error(s(340));
					ga();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Vo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(s(340));
					ga();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Wo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return Re(), null;
			case 10: return Ca(t.type), null;
			case 22:
			case 23: return Vo(t), Po(), e !== null && Me(Ya), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Ca(Fa), null;
			case 25: return null;
			default: return null;
		}
	}
	function Cl(e, t) {
		switch (oa(t), t.tag) {
			case 3:
				Ca(Fa), Re();
				break;
			case 26:
			case 27:
			case 5:
				Be(t);
				break;
			case 4:
				Re();
				break;
			case 31:
				t.memoizedState !== null && Vo(t);
				break;
			case 13:
				Vo(t);
				break;
			case 19:
				Wo(t);
				break;
			case 10:
				Ca(t.type);
				break;
			case 22:
			case 23:
				Vo(t), Po(), e !== null && Me(Ya);
				break;
			case 24: Ca(Fa);
		}
	}
	function wl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Tl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Z(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function El(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				ko(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function Dl(e, t, n) {
		n.props = Tc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Ol(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = Si(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Fp(e);
							h(e.child, !1, Qp, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Z(e, t, n);
		}
	}
	function kl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Z(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Z(e, t, n);
			}
			else n.current = null;
		}
	}
	function Al(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function jl(e) {
		for (var t = e.return; t !== null && (Pl(t) && em(e.stateNode, t.stateNode), !Nl(t));) t = t.return;
	}
	function Ml(e) {
		for (var t = e.return; t !== null && (Pl(t) && tm(e.stateNode, t.stateNode), !Nl(t));) t = t.return;
	}
	function Nl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Pl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Fl(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Il(e, t, n) {
		try {
			var r = e.stateNode;
			ip(r, e.type, n, t), r[Pt] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Ll(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function Rl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Ll(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function zl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Cn)), Al(e, r), M = !0;
		else if (i !== 4 && (i === 27 && (Al(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (zl(e, t, n, r), e = e.sibling; e !== null;) zl(e, t, n, r), e = e.sibling;
	}
	function Bl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Al(e, r), M = !0;
		else if (i !== 4 && (i === 27 && (Al(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Bl(e, t, n, r), e = e.sibling; e !== null;) Bl(e, t, n, r), e = e.sibling;
	}
	function Vl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			np(t, r, n), t[D] = e, t[Pt] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var Hl = !1, Ul = null;
	function Wl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Hl = !0);
	}
	var Gl = null;
	function Kl() {
		var e = Gl;
		return Gl = null, e;
	}
	var ql = 0;
	function Jl(e, t, n, r, i) {
		return ql = 0, Yl(e.child, t, n, r, i);
	}
	function Yl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				Hl = !0, Tp(o, ql === 0 ? t : t + "_" + ql, n), ql++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Yl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Xl(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Xl(e.child, t), e = e.sibling;
	}
	function Zl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Zl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(s(544));
				var n = t.name;
				t = wi(t.default, t.share), t !== "none" && (Jl(e, n, t, null, !1) || Xl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Ql(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = Si(r, n), a = wi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Zl(e) : Jl(e, i, a, null, !1) ? (Zl(e), n.paired || t || Nd(e, r.onEnter)) : Xl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Ql(e, t), e = e.sibling;
		else Zl(e);
	}
	function $l(e) {
		if (Ul !== null && Ul.size !== 0) {
			var t = Ul;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = wi(n.default, n.share);
								if (a !== "none" && (Jl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Nd(e, n.onShare)) : Xl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					$l(e);
				}
				e = e.sibling;
			}
		}
	}
	function eu(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = Si(t, e.stateNode), r = Ul === null ? void 0 : Ul.get(n), i = wi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Jl(e, n, i, null, !1) ? r === void 0 ? Nd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Ul.delete(n), Nd(e, t.onShare)) : Xl(e.child, !1)), Ul !== null && $l(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) eu(e), e = e.sibling;
		else Ul !== null && $l(e);
	}
	function tu(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = Si(t, e.stateNode);
				t = wi(t.default, t.update), e.flags &= -5, t !== "none" && Jl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && tu(e);
			e = e.sibling;
		}
	}
	function nu(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Xl(e.child, !1));
				}
				nu(e);
			}
			e = e.sibling;
		}
	}
	function ru(e) {
		if (e.tag === 30) e.stateNode.paired = null, Xl(e.child, !1), nu(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ru(e), e = e.sibling;
		else nu(e);
	}
	function iu(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Xl(e.child, !1) : e.subtreeFlags & 33554432 && iu(e), e = e.sibling;
	}
	function au(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && ql < a.length) {
					var l = a[ql], u = Op(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Tp(c, ql === 0 ? n : n + "_" + ql, i), s && e.flags & 4 || (Gl === null && (Gl = []), Gl.push(c, ql === 0 ? r : r + "_" + ql, t.memoizedProps)), ql++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : au(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function ou(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = Si(n, r), a = wi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				ql = 0, i = au(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Nd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && ou(e, t);
			e = e.sibling;
		}
	}
	var su = !1, H = !1, cu = !1, lu = !1, uu = typeof WeakSet == "function" ? WeakSet : Set, du = null, fu = !1, pu = !1, mu = !1, hu = !1;
	function gu(e, t, n) {
		if (e = e.containerInfo, sp = gh, e = Qr(e), $r(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (cp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, du = t, t = n ? 9270 : 1024; du !== null;) {
			if (e = du, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && eu(r[a]);
			if (e.alternate === null && e.flags & 2) n && Wl(e), _u(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && eu(r), _u(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Wl(e), _u(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, du = r) : (n && tu(e), _u(n));
			}
		}
		Ul = null;
	}
	function _u(e) {
		for (; du !== null;) {
			var t = du, n = e, r = t.alternate, i = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (i & 1024 && r !== null) {
						n = void 0, i = r.memoizedProps, r = r.memoizedState;
						var a = t.stateNode;
						try {
							var o = Tc(t.type, i);
							n = a.getSnapshotBeforeUpdate(o, r), a.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							Z(t, t.return, e);
						}
					}
					break;
				case 3:
					if (i & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) nm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								nm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = Si(r.memoizedProps, r.stateNode), i = t.memoizedProps, i = wi(i.default, i.update), i !== "none" && Jl(r, n, i, r.memoizedState = [], !0));
					break;
				default: if (i & 1024) throw Error(s(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, du = r;
				break;
			}
			du = t.return;
		}
	}
	function vu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Lu(e, n), r & 4 && wl(5, n);
				break;
			case 1:
				if (Lu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Z(n, n.return, e);
					}
					else {
						var i = Tc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
				}
				r & 64 && El(n), r & 512 && Ol(n, n.return);
				break;
			case 3:
				if (Lu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						ko(e, t);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Vl(n);
			case 26:
			case 5:
				Lu(e, n), t === null && r & 4 && Fl(n), r & 512 && Ol(n, n.return);
				break;
			case 12:
				Lu(e, n);
				break;
			case 31:
				Lu(e, n), r & 4 && Eu(e, n);
				break;
			case 13:
				Lu(e, n), r & 4 && Du(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = _f.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || su, !r) {
					var a = t !== null && t.memoizedState !== null || H;
					t = su, i = H, su = r, (H = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), zu(e, n, r)) : Lu(e, n), su = t, H = i;
				}
				break;
			case 30:
				Lu(e, n), r & 512 && Ol(n, n.return);
				break;
			case 7: r & 512 && Ol(n, n.return);
			default: Lu(e, n);
		}
	}
	function yu(e, t) {
		for (e = e.child; e !== null;) bu(e, t), e = e.sibling;
	}
	function bu(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					Z(e, e.return, t);
				}
				xu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, M = !0;
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && yu(e, t);
				break;
			default: yu(e, t);
		}
	}
	function xu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						bu(n, r);
						break a;
					case 22:
						n.memoizedState === null && xu(n, r);
						break a;
					default: xu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function Su(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, Su(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && zt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var U = null, Cu = !1;
	function wu(e, t, n) {
		for (n = n.child; n !== null;) Tu(e, t, n), n = n.sibling;
	}
	function Tu(e, t, n) {
		if (lt && typeof lt.onCommitFiberUnmount == "function") try {
			lt.onCommitFiberUnmount(ct, n);
		} catch {}
		switch (n.tag) {
			case 26:
				H || kl(n, t), wu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !H && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				H || kl(n, t), Ml(n);
				var r = U, i = Cu;
				Sp(n.type) && (U = n.stateNode, Cu = !1), wu(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), U = r, Cu = i;
				break;
			case 5: H || kl(n, t), Ml(n);
			case 6:
				if (n.tag === 6 && Ml(n), r = U, i = Cu, U = null, wu(e, t, n), U = r, Cu = i, U !== null) {
					if (Cu) try {
						(U.nodeType === 9 ? U.body : U.nodeName === "HTML" ? U.ownerDocument.body : U).removeChild(n.stateNode), M = !0;
					} catch (e) {
						Z(n, t, e);
					}
					else try {
						U.removeChild(n.stateNode), M = !0;
					} catch (e) {
						Z(n, t, e);
					}
				}
				break;
			case 18:
				U !== null && (Cu ? (e = U, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(U, n.stateNode));
				break;
			case 4:
				r = U, i = Cu, U = n.stateNode.containerInfo, Cu = !0, wu(e, t, n), U = r, Cu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Tl(2, n, t), H || Tl(4, n, t), wu(e, t, n);
				break;
			case 1:
				H || (kl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Dl(n, t, r)), wu(e, t, n);
				break;
			case 21:
				wu(e, t, n);
				break;
			case 22:
				H = (r = H) || n.memoizedState !== null, wu(e, t, n), H = r;
				break;
			case 30:
				kl(n, t), wu(e, t, n);
				break;
			case 7:
				H || kl(n, t), wu(e, t, n);
				break;
			default: wu(e, t, n);
		}
	}
	function Eu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				Z(t, t.return, e);
			}
		}
	}
	function Du(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Ou(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new uu()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new uu()), t;
			default: throw Error(s(435, e.tag));
		}
	}
	function ku(e, t) {
		var n = Ou(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = vf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Au(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var i = 0; i < r.length; i++) {
			var a = r[i], o = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							U = l.stateNode, Cu = !1;
							break a;
						}
						break;
					case 5:
						U = l.stateNode, Cu = !1;
						break a;
					case 3:
					case 4:
						U = l.stateNode.containerInfo, Cu = !0;
						break a;
				}
				l = l.return;
			}
			if (U === null) throw Error(s(160));
			Tu(o, c, a), U = null, Cu = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Mu(t, e, n), t = t.sibling;
	}
	var ju = null;
	function Mu(e, t, n) {
		var r = e.alternate, i = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (i & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var a = 0; a < r.length; a++) {
					var o = r[a];
					o.ref.impl = o.nextImpl;
				}
				Au(t, e, n), Nu(e), i & 4 && (Tl(3, e, e.return), wl(3, e), Tl(5, e, e.return));
				break;
			case 1:
				Au(t, e, n), Nu(e), i & 512 && (H || r === null || kl(r, r.return)), i & 64 && su && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (a = ju, Au(t, e, n), Nu(e), i & 512 && (H || r === null || kl(r, r.return)), i & 4) {
					if (i = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (su) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, i = a.ownerDocument || a;
										b: switch (t) {
											case "title":
												r = i.getElementsByTagName("title")[0], (!r || r[A] || r[D] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = i.createElement(t), i.head.insertBefore(r, i.querySelector("head > title"))), np(r, t, n), r[D] = e, j(r), t = r;
												break a;
											case "link":
												if (a = Gm("link", "href", i).get(t + (n.href || ""))) {
													for (o = 0; o < a.length; o++) if (r = a[o], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														a.splice(o, 1);
														break b;
													}
												}
												r = i.createElement(t), np(r, t, n), i.head.appendChild(r);
												break;
											case "meta":
												if (a = Gm("meta", "content", i).get(t + (n.content || ""))) {
													for (o = 0; o < a.length; o++) if (r = a[o], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														a.splice(o, 1);
														break b;
													}
												}
												r = i.createElement(t), np(r, t, n), i.head.appendChild(r);
												break;
											default: throw Error(s(468, t));
										}
										r[D] = e, j(r), t = r;
									}
									e.stateNode = t;
								}
							} else su || Km(a, e.type, e.stateNode);
						} else e.stateNode = Bm(a, n, e.memoizedProps);
					} else i === n ? n === null && e.stateNode !== null && Il(e, e.memoizedProps, r.memoizedProps) : (i === null ? (t = r.stateNode, t === null || H || t.parentNode.removeChild(t)) : i.count--, n === null ? su || Km(a, e.type, e.stateNode) : Bm(a, n, e.memoizedProps));
				}
				break;
			case 27:
				Au(t, e, n), Nu(e), i & 512 && (H || r === null || kl(r, r.return)), r !== null && i & 4 && Il(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (a = cu, cu = !1, Au(t, e, n), cu = a, Nu(e), i & 512 && (H || r === null || kl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						hn(t, ""), M = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				i & 4 && e.stateNode != null && (t = e.memoizedProps, Il(e, t, r === null ? t : r.memoizedProps)), i & 1024 && (lu = !0);
				break;
			case 6:
				if (Au(t, e, n), Nu(e), i & 4) {
					if (e.stateNode === null) throw Error(s(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, M = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				break;
			case 3:
				if (M = !1, Wm = null, a = ju, ju = bm(t.containerInfo), Au(t, e, n), ju = a, Nu(e), i & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					Z(e, e.return, t);
				}
				lu && (lu = !1, Pu(e)), M = !1;
				break;
			case 4:
				i = cu, cu = su, r = N(), a = ju, ju = bm(e.stateNode.containerInfo), Au(t, e, n), Nu(e), ju = a, M && pu && (mu = !0), M = r, cu = i;
				break;
			case 12:
				Au(t, e, n), Nu(e);
				break;
			case 31:
				Au(t, e, n), Nu(e), i & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, ku(e, t)));
				break;
			case 13:
				Au(t, e, n), Nu(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (hd = $e()), i & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, ku(e, t)));
				break;
			case 22:
				a = e.memoizedState !== null, o = r !== null && r.memoizedState !== null;
				var c = su, l = H, u = cu;
				su = c || a, cu = u || a, H = l || o, Au(t, e, n), H = l, cu = u, su = c, Nu(e), i & 8192 && (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, !a || r === null || o || su || H || (t = o || H, n = su, r = H, su = a || su, H = t, Ru(e, 2), su = n, H = r), !a && cu || yu(e, a)), i & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, ku(e, n))));
				break;
			case 19:
				Au(t, e, n), Nu(e), i & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, ku(e, t)));
				break;
			case 30:
				i & 512 && (H || r === null || kl(r, r.return)), i = N(), a = pu, o = (n & 335544064) === n, c = e.memoizedProps, pu = o && wi(c.default, c.update) !== "none", Au(t, e, n), Nu(e), o && r !== null && M && (e.flags |= 4), pu = a, M = i;
				break;
			case 21: break;
			case 7: i & 512 && (H || r === null || kl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Au(t, e, n), Nu(e);
		}
	}
	function Nu(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Ll(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var i = e.return; i !== null;) {
					if (Pl(i)) {
						var a = i.stateNode;
						r === null ? r = [a] : r.push(a);
					}
					if (Nl(i)) break;
					i = i.return;
				}
				var o = r;
				if (n == null) throw Error(s(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Bl(e, Rl(e), c, o);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (hn(l, ""), n.flags &= -33), Bl(e, Rl(e), l, o);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						zl(e, Rl(e), u, o);
						break;
					default: throw Error(s(161));
				}
			} catch (t) {
				Z(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Pu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Pu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Fu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Iu(t, e), t = t.sibling;
		else ou(t, !1);
	}
	function Iu(e, t) {
		var n = e.alternate;
		if (n === null) Ql(e, !1);
		else switch (e.tag) {
			case 3:
				if (hu = fu = !1, Kl(), Fu(t, e), !fu && !mu) {
					if (e = Gl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Ep(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), hu = !0;
				}
				Gl = null;
				break;
			case 5:
				Fu(t, e);
				break;
			case 4:
				r = fu, fu = !1, Fu(t, e), fu && (mu = !0), fu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Fu(t, e) : Ql(e, !1));
				break;
			case 30:
				r = fu, i = Kl(), fu = !1, Fu(t, e), fu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = Si(a, o), o = Si(n.memoizedProps, o);
				var s = wi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, ql = 0, t = au(e, n, t, o, s, a, !0), ql !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Nd(e, e.memoizedProps.onUpdate), Gl = i) : i !== null && (i.push.apply(i, Gl), Gl = i), fu = e.flags & 32 ? !0 : r;
				break;
			default: Fu(t, e);
		}
	}
	function Lu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) vu(e, t.alternate, t), t = t.sibling;
	}
	function Ru(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Tl(4, n, n.return), Ru(n, r);
					break;
				case 1:
					kl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && Dl(n, n.return, i), Ru(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					kl(n, n.return), n.tag !== 5 && n.tag !== 27 || Ml(n), Ru(n, r);
					break;
				case 6:
					Ml(n);
					break;
				case 26:
					kl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || H || i.parentNode.removeChild(i), Ru(n, r);
					break;
				case 22:
					n.memoizedState === null && Ru(n, r);
					break;
				case 30:
					kl(n, n.return), Ru(n, r);
					break;
				case 7: kl(n, n.return);
				default: Ru(n, r);
			}
			e = e.sibling;
		}
	}
	function zu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					zu(i, a, n), wl(4, a);
					break;
				case 1:
					if (zu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Z(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) Oo(l[i], c);
						} catch (e) {
							Z(r, r.return, e);
						}
					}
					s && o & 64 && El(a), Ol(a, a.return);
					break;
				case 27: n & 2 && Vl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || jl(a), zu(i, a, n), s && r === null && o & 4 && Fl(a), Ol(a, a.return);
					break;
				case 6:
					jl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || su || Km(bm(c.ownerDocument), a.type, c), zu(i, a, n), s && r === null && o & 4 && Fl(a), Ol(a, a.return);
					break;
				case 12:
					zu(i, a, n);
					break;
				case 31:
					zu(i, a, n), s && o & 4 && Eu(i, a);
					break;
				case 13:
					zu(i, a, n), s && o & 4 && Du(i, a);
					break;
				case 22:
					a.memoizedState === null && zu(i, a, n), Ol(a, a.return);
					break;
				case 30:
					zu(i, a, n), Ol(a, a.return);
					break;
				case 7: Ol(a, a.return);
				default: zu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Bu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && La(n));
	}
	function Vu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && La(e));
	}
	function Hu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Uu(e, t, n, r), t = t.sibling;
		else i && iu(t);
	}
	function Uu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && ru(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Hu(e, t, n, r), a & 2048 && wl(9, t);
				break;
			case 1:
				Hu(e, t, n, r);
				break;
			case 3:
				Hu(e, t, n, r), i && hu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && La(a)));
				break;
			case 12:
				if (a & 2048) {
					Hu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						Z(t, t.return, e);
					}
				} else Hu(e, t, n, r);
				break;
			case 31:
				Hu(e, t, n, r);
				break;
			case 13:
				Hu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && ru(t), o._visibility & 2 ? Hu(e, t, n, r) : (o._visibility |= 2, Wu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && ru(s), o._visibility & 2 ? Hu(e, t, n, r) : Gu(e, t)), a & 2048 && Bu(s, t);
				break;
			case 24:
				Hu(e, t, n, r), a & 2048 && Vu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Xl(a.child, !0), Xl(t.child, !0))), Hu(e, t, n, r);
				break;
			default: Hu(e, t, n, r);
		}
	}
	function Wu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Wu(a, o, s, c, i), wl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Wu(a, o, s, c, i)) : u._visibility & 2 ? Wu(a, o, s, c, i) : Gu(a, o), i && l & 2048 && Bu(o.alternate, o);
					break;
				case 24:
					Wu(a, o, s, c, i), i && l & 2048 && Vu(o.alternate, o);
					break;
				default: Wu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Gu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Gu(n, r), i & 2048 && Bu(r.alternate, r);
					break;
				case 24:
					Gu(n, r), i & 2048 && Vu(r.alternate, r);
					break;
				default: Gu(n, r);
			}
			t = t.sibling;
		}
	}
	var Ku = 8192;
	function qu(e, t, n) {
		if (e.subtreeFlags & Ku) for (e = e.child; e !== null;) Ju(e, t, n), e = e.sibling;
	}
	function Ju(e, t, n) {
		switch (e.tag) {
			case 26:
				qu(e, t, n), e.flags & Ku && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, ju, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				qu(e, t, n), e.flags & Ku && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = ju;
				ju = bm(e.stateNode.containerInfo), qu(e, t, n), ju = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Ku, Ku = 16777216, qu(e, t, n), Ku = r) : qu(e, t, n));
				break;
			case 30:
				if ((e.flags & Ku) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Ul === null && (Ul = /* @__PURE__ */ new Map()), Ul.set(r, i);
				}
				qu(e, t, n);
				break;
			default: qu(e, t, n);
		}
	}
	function Yu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Xu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				du = r, $u(r, e);
			}
			Yu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Zu(e), e = e.sibling;
	}
	function Zu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Xu(e), e.flags & 2048 && Tl(9, e, e.return);
				break;
			case 3:
				Xu(e);
				break;
			case 12:
				Xu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Qu(e)) : Xu(e);
				break;
			default: Xu(e);
		}
	}
	function Qu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				du = r, $u(r, e);
			}
			Yu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Tl(8, t, t.return), Qu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Qu(t));
					break;
				default: Qu(t);
			}
			e = e.sibling;
		}
	}
	function $u(e, t) {
		for (; du !== null;) {
			var n = du;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Tl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: La(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, du = r;
			else a: for (n = e; du !== null;) {
				r = du;
				var i = r.sibling, a = r.return;
				if (Su(r), r === n) {
					du = null;
					break a;
				}
				if (i !== null) {
					i.return = a, du = i;
					break a;
				}
				du = a;
			}
		}
	}
	var ed = {
		getCacheForType: function(e) {
			var t = ka(Fa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ka(Fa).controller.signal;
		}
	}, td = typeof WeakMap == "function" ? WeakMap : Map, W = 0, G = null, K = null, q = 0, J = 0, nd = null, rd = !1, id = !1, ad = !1, od = 0, Y = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = 0, fd = null, pd = null, md = !1, hd = 0, gd = 0, _d = Infinity, vd = null, yd = null, X = 0, bd = null, xd = null, Sd = 0, Cd = 0, wd = null, Td = null, Ed = null, Dd = null, Od = null, kd = 0, Ad = null;
	function jd() {
		return W & 2 && q !== 0 ? q & -q : C.T === null ? jt() : Pf();
	}
	function Md() {
		if (ud === 0) {
			if (!(q & 536870912) || I) {
				var e = gt;
				gt <<= 1, !(gt & 3932160) && (gt = 262144), ud = e;
			} else ud = 536870912;
		}
		return e = Fo.current, e !== null && (e.flags |= 32), ud;
	}
	function Nd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(Si(e.memoizedProps, n))), Dd === null && (Dd = []), Dd.push(t.bind(null, r));
		}
	}
	function Pd(e, t, n) {
		(e === G && (J === 2 || J === 9) || e.cancelPendingCommit !== null) && (Vd(e, 0), Rd(e, q, ud, !1)), wt(e, n), W & 2 && e === G || (e === G && (!(W & 2) && (cd |= n), Y === 4 && Rd(e, q, ud, !1)), Ef(e));
	}
	function Fd(e, t, n) {
		if (W & 6) throw Error(s(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || bt(e, t), i = r ? Yd(e, t) : qd(e, t, !0), a = r;
		do {
			if (i === 0) {
				id && !r && Rd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, a && !Ld(n)) i = qd(e, t, !1), a = !1;
			else {
				if (i === 2) {
					if (a = t, e.errorRecoveryDisabledLanes & a) var o = 0;
					else o = e.pendingLanes & -536870913, o = o === 0 ? o & 536870912 ? 536870912 : 0 : o;
					if (o !== 0) {
						t = o;
						a: {
							var c = e;
							i = fd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Vd(c, o).flags |= 256), o = qd(c, o, !1), o !== 2 && o !== 6) {
								if (ad && !l) {
									c.errorRecoveryDisabledLanes |= a, cd |= a, i = 4;
									break a;
								}
								a = pd, pd = i, a !== null && (pd === null ? pd = a : pd.push.apply(pd, a));
							}
							i = o;
						}
						if (a = !1, i !== 2) continue;
					}
				}
				if (i === 1) {
					Vd(e, 0), Rd(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, a = i, a) {
						case 0:
						case 1: throw Error(s(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Rd(r, t, ud, !rd);
							break a;
						case 2:
							pd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(s(329));
					}
					if ((t & 62914560) === t && (i = hd + 300 - $e(), 10 < i)) {
						if (Rd(r, t, ud, !rd), yt(r, 0, !0) !== 0) break a;
						Sd = t, r.timeoutHandle = gp(Id.bind(null, r, n, pd, vd, md, t, ud, cd, dd, rd, a, "Throttled", -0, 0), i);
						break a;
					}
					Id(r, n, pd, vd, md, t, ud, cd, dd, rd, a, null, -0, 0);
				}
				break;
			}
		} while (1);
		Ef(e);
	}
	function Id(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: Cn
		}, Ul = null, Ju(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? hd - $e() : (a & 4194048) === a ? gd - $e() : 0, m = eh(d, m), m !== null) ? (Sd = a, e.cancelPendingCommit = m(nf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Rd(e, a, o, !l)) : nf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Ld(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Kr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Rd(e, t, n, r) {
		t = xt(e, t), t &= ~ld, t &= ~cd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - dt(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && Et(e, n, t);
	}
	function zd() {
		return W & 6 ? !0 : (Df(0, !1), !1);
	}
	function Bd() {
		if (K !== null) {
			if (J === 0) var e = K.return;
			else e = K, xa = ba = null, cs(e), lo = null, uo = 0, e = K;
			for (; e !== null;) Cl(e.alternate, e), e = e.return;
			K = null;
		}
	}
	function Vd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Sd = 0, Bd(), G = e, K = n = zi(e.current, null), q = t, J = 0, nd = null, rd = !1, id = bt(e, t), ad = !1, dd = ud = ld = cd = sd = Y = 0, pd = fd = null, md = !1, od = xt(e, t), ki(), n;
	}
	function Hd(e, t) {
		L = null, C.H = _c, t === $a || t === to ? (t = so(), J = 3) : t === eo ? (t = so(), J = 4) : J = t === Fc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, nd = t, K === null && (Y = 1, kc(e, qi(t, e.current)));
	}
	function Ud() {
		var e = Fo.current;
		return e === null ? !0 : (q & 4194048) === q ? Io === null : (q & 62914560) === q || q & 536870912 ? e === Io : !1;
	}
	function Wd() {
		var e = C.H;
		return C.H = _c, e === null ? _c : e;
	}
	function Gd() {
		var e = C.A;
		return C.A = ed, e;
	}
	function Kd() {
		Y = 4, rd || (q & 4194048) !== q && Fo.current !== null || (id = !0), !(sd & 134217727) && !(cd & 134217727) || G === null || Rd(G, q, ud, !1);
	}
	function qd(e, t, n) {
		var r = W;
		W |= 2;
		var i = Wd(), a = Gd();
		(G !== e || q !== t) && (vd = null, Vd(e, t)), t = !1;
		var o = Y;
		a: do
			try {
				if (J !== 0 && K !== null) {
					var s = K, c = nd;
					switch (J) {
						case 8:
							Bd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Fo.current === null && (t = !0);
							var l = J;
							if (J = 0, nd = null, $d(e, s, c, l), n && id) {
								o = 0;
								break a;
							}
							break;
						default: l = J, J = 0, nd = null, $d(e, s, c, l);
					}
				}
				Jd(), o = Y;
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, xa = ba = null, W = r, C.H = i, C.A = a, K === null && (G = null, q = 0, ki()), o;
	}
	function Jd() {
		for (; K !== null;) Zd(K);
	}
	function Yd(e, t) {
		var n = W;
		W |= 2;
		var r = Wd(), i = Gd();
		G !== e || q !== t ? (vd = null, _d = $e() + 500, Vd(e, t)) : id = bt(e, t);
		a: do
			try {
				if (J !== 0 && K !== null) {
					t = K;
					var a = nd;
					b: switch (J) {
						case 1:
							J = 0, nd = null, $d(e, t, a, 1);
							break;
						case 2:
						case 9:
							if (ro(a)) {
								J = 0, nd = null, Qd(t);
								break;
							}
							t = function() {
								J !== 2 && J !== 9 || G !== e || (J = 7), Ef(e);
							}, a.then(t, t);
							break a;
						case 3:
							J = 7;
							break a;
						case 4:
							J = 5;
							break a;
						case 7:
							ro(a) ? (J = 0, nd = null, Qd(t)) : (J = 0, nd = null, $d(e, t, a, 7));
							break;
						case 5:
							var o = null;
							switch (K.tag) {
								case 26: o = K.memoizedState;
								case 5:
								case 27:
									var c = K;
									if (o ? Ym(o) : c.stateNode.complete) {
										J = 0, nd = null;
										var l = c.sibling;
										if (l !== null) K = l;
										else {
											var u = c.return;
											u === null ? K = null : (K = u, ef(u));
										}
										break b;
									}
							}
							J = 0, nd = null, $d(e, t, a, 5);
							break;
						case 6:
							J = 0, nd = null, $d(e, t, a, 6);
							break;
						case 8:
							Bd(), Y = 6;
							break a;
						default: throw Error(s(462));
					}
				}
				Xd();
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return xa = ba = null, C.H = r, C.A = i, W = n, K === null ? (G = null, q = 0, ki(), Y) : 0;
	}
	function Xd() {
		for (; K !== null && !Ze();) Zd(K);
	}
	function Zd(e) {
		var t = hl(e.alternate, e, od);
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : K = t;
	}
	function Qd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Yc(n, t, t.pendingProps, t.type, void 0, q);
				break;
			case 11:
				t = Yc(n, t, t.pendingProps, t.type.render, t.ref, q);
				break;
			case 5:
				cs(t);
				var r = t;
				r === ca && (I ? (ma(r), r.tag === 5 && r.stateNode != null && (F = r.stateNode)) : (ma(r), I = !0));
			default: Cl(n, t), t = K = Bi(t, od), t = hl(n, t, od);
		}
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : K = t;
	}
	function $d(e, t, n, r) {
		xa = ba = null, cs(t), lo = null, uo = 0;
		var i = t.return;
		try {
			if (Pc(e, i, t, n, q)) {
				Y = 1, kc(e, qi(n, e.current)), K = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw K = i, t;
			Y = 1, kc(e, qi(n, e.current)), K = null;
			return;
		}
		t.flags & 32768 ? (I || r === 1 ? e = !0 : id || q & 536870912 ? e = !1 : (rd = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Fo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), tf(t, e)) : ef(t);
	}
	function ef(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				tf(t, rd);
				return;
			}
			e = t.return;
			var n = xl(t.alternate, t, od);
			if (n !== null) {
				K = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				K = t;
				return;
			}
			K = t = e;
		} while (t !== null);
		Y === 0 && (Y = 5);
	}
	function tf(e, t) {
		do {
			var n = Sl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, K = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				K = e;
				return;
			}
			K = e = n;
		} while (e !== null);
		Y = 6, K = null;
	}
	function nf(e, t, n, r, i, a, o, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			df();
		while (X !== 0);
		if (W & 6) throw Error(s(327));
		if (t !== null) {
			if (t === e.current) throw Error(s(177));
			e === G && (K = G = null, q = 0), xd = t, bd = e, Sd = n, wd = i, Td = r, rf(e, t, n, o, c, l, f);
		}
	}
	function rf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Cd = s, s |= Oi, Tt(e, n, s, r, i, a), Dd = null, (n & 335544064) === n ? (Od = Ba(e), r = 10262) : (Od = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, yf(rt, function() {
			return ff(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Hl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = C.T, C.T = null, i = w.p, w.p = 2, a = W, W |= 4;
			try {
				gu(e, t, n);
			} finally {
				W = a, w.p = i, C.T = r;
			}
		}
		X = 1, Hl ? Ed = Mp(o, e.containerInfo, Od, sf, cf, of, lf, ff, af, null, null) : (sf(), cf(), lf());
	}
	function af(e) {
		if (X !== 0) {
			var t = bd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function of() {
		X === 3 && (X = 0, Iu(xd, bd), X = 4);
	}
	function sf() {
		if (X === 1) {
			X = 0;
			var e = bd, t = xd, n = Sd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = C.T, C.T = null;
				var i = w.p;
				w.p = 2;
				var a = W;
				W |= 4;
				try {
					pu = mu = !1, Mu(t, e, n), n = cp;
					var o = Qr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Zr(s.ownerDocument.documentElement, s)) {
						if (c !== null && $r(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Xr(s, h), v = Xr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					gh = !!sp, cp = sp = null;
				} finally {
					W = a, w.p = i, C.T = r;
				}
			}
			e.current = t, X = 2;
		}
	}
	function cf() {
		if (X === 2) {
			X = 0;
			var e = bd, t = xd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = C.T, C.T = null;
				var r = w.p;
				w.p = 2;
				var i = W;
				W |= 4;
				try {
					vu(e, t.alternate, t);
				} finally {
					W = i, w.p = r, C.T = n;
				}
			}
			X = 3;
		}
	}
	function lf() {
		if (X === 4 || X === 3) {
			X = 0;
			var e = Ed;
			Ed = null, Qe();
			var t = bd, n = xd, r = Sd, i = Td, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? X = 5 : (X = 0, xd = bd = null, uf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (yd = null), At(r), n = n.stateNode, lt && typeof lt.onCommitFiberRoot == "function") try {
				lt.onCommitFiberRoot(ct, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = C.T, a = w.p, w.p = 2, C.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					C.T = n, w.p = a;
				}
			}
			if (i = Dd, o = Od, Od = null, i !== null && (Dd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Sd & 3 && df(), Ef(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Ad ? kd++ : (kd = 0, Ad = t) : (kd = 0, Ad = null), Df(0, !1);
		}
	}
	function uf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, La(t)));
	}
	function df() {
		return Ed !== null && (Ed.skipTransition(), Ed = null), sf(), cf(), lf(), ff();
	}
	function ff() {
		if (X !== 5) return !1;
		var e = bd, t = Cd;
		Cd = 0;
		var n = At(Sd), r = C.T, i = w.p;
		try {
			w.p = 32 > n ? 32 : n, C.T = null, n = wd, wd = null;
			var a = bd, o = Sd;
			if (X = 0, xd = bd = null, Sd = 0, W & 6) throw Error(s(331));
			var c = W;
			if (W |= 4, Zu(a.current), Uu(a, a.current, o, n), W = c, Df(0, !1), lt && typeof lt.onPostCommitFiberRoot == "function") try {
				lt.onPostCommitFiberRoot(ct, a);
			} catch {}
			return !0;
		} finally {
			w.p = i, C.T = r, uf(e, t);
		}
	}
	function pf(e, t, n) {
		t = qi(n, t), t = jc(e.stateNode, t, 2), e = So(e, t, 2), e !== null && (wt(e, 2), Ef(e));
	}
	function Z(e, t, n) {
		if (e.tag === 3) pf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				pf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (yd === null || !yd.has(r))) {
					e = qi(n, e), n = Mc(2), r = So(t, n, 2), r !== null && (Nc(n, r, t, e), wt(r, 2), Ef(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new td();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (ad = !0, i.add(n), e = hf.bind(null, e, t, n), t.then(e, e));
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, G === e && (q & n) === n && (Y === 4 || Y === 3 && (q & 62914560) === q && 300 > $e() - hd ? W & 2 ? ld |= n : Vd(e, 0) : ld |= n, dd === q && (dd = 0)), Ef(e);
	}
	function gf(e, t) {
		t === 0 && (t = Ct()), e = Mi(e, t), e !== null && (wt(e, t), Ef(e));
	}
	function _f(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), gf(e, n);
	}
	function vf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, i = e.memoizedState;
				i !== null && (n = i.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(s(314));
		}
		r !== null && r.delete(t), gf(e, n);
	}
	function yf(e, t) {
		return Ye(e, t);
	}
	var bf = null, xf = null, Sf = !1, Cf = !1, wf = !1, Tf = 0;
	function Ef(e) {
		e !== xf && e.next === null && (xf === null ? bf = xf = e : xf = xf.next = e), Cf = !0, Sf || (Sf = !0, Nf());
	}
	function Df(e, t) {
		if (!wf && Cf) {
			wf = !0;
			do
				for (var n = !1, r = bf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - dt(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Mf(r, a));
						} else a = q, a = yt(r, r === G ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || bt(r, a) || (n = !0, Mf(r, a));
					}
					r = r.next;
				}
			while (n);
			wf = !1;
		}
	}
	function Of() {
		kf();
	}
	function kf() {
		Cf = Sf = !1;
		var e = 0;
		Tf !== 0 && hp() && (e = Tf);
		for (var t = $e(), n = null, r = bf; r !== null;) {
			var i = r.next, a = Af(r, t);
			a === 0 ? (r.next = null, n === null ? bf = i : n.next = i, i === null && (xf = n)) : (n = r, (e !== 0 || a & 3) && (Cf = !0)), r = i;
		}
		X !== 0 && X !== 5 || Df(e, !1), Tf !== 0 && (Tf = 0);
	}
	function Af(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - dt(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = St(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = G, n = q, n = yt(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (J === 2 || J === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Xe(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || bt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Xe(r), At(n)) {
				case 2:
				case 8:
					n = nt;
					break;
				case 32:
					n = rt;
					break;
				case 268435456:
					n = at;
					break;
				default: n = rt;
			}
			return r = jf.bind(null, e), n = Ye(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Xe(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function jf(e, t) {
		if (X !== 0 && X !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (df() && e.callbackNode !== n) return null;
		var r = q;
		return r = yt(e, e === G ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Fd(e, r, t), Af(e, $e()), e.callbackNode != null && e.callbackNode === n ? jf.bind(null, e) : null);
	}
	function Mf(e, t) {
		if (df()) return null;
		Fd(e, t, !0);
	}
	function Nf() {
		bp(function() {
			W & 6 ? Ye(tt, Of) : kf();
		});
	}
	function Pf() {
		if (Tf === 0) {
			var e = Ua;
			e === 0 && (e = ht, ht <<= 1, !(ht & 261888) && (ht = 256)), Tf = e;
		}
		return Tf;
	}
	function Ff(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Sn(e);
	}
	function If(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Ff((i[Pt] || null).action), o = r.submitter;
			o && (t = (t = o[Pt] || null) ? Ff(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Wn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Tf !== 0) {
								var e = new FormData(i, o);
								rc(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), rc(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Lf = 0; Lf < yi.length; Lf++) {
		var Rf = yi[Lf];
		bi(Rf.toLowerCase(), "on" + (Rf[0].toUpperCase() + Rf.slice(1)));
	}
	bi(di, "onAnimationEnd"), bi(fi, "onAnimationIteration"), bi(pi, "onAnimationStart"), bi("dblclick", "onDoubleClick"), bi("focusin", "onFocus"), bi("focusout", "onBlur"), bi(mi, "onTransitionRun"), bi(hi, "onTransitionStart"), bi(gi, "onTransitionCancel"), bi(_i, "onTransitionEnd"), Jt("onMouseEnter", ["mouseout", "mouseover"]), Jt("onMouseLeave", ["mouseout", "mouseover"]), Jt("onPointerEnter", ["pointerout", "pointerover"]), Jt("onPointerLeave", ["pointerout", "pointerover"]), qt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), qt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), qt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), qt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), qt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), qt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var zf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zf));
	function Vf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ti(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ti(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[It];
		n === void 0 && (n = t[It] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Gf(t, e, 2, !1), n.add(r));
	}
	function Hf(e, t, n) {
		var r = 0;
		t && (r |= 4), Gf(n, e, r, t);
	}
	var Uf = "_reactListening" + Math.random().toString(36).slice(2);
	function Wf(e) {
		if (!e[Uf]) {
			e[Uf] = !0, Gt.forEach(function(t) {
				t !== "selectionchange" && (Bf.has(t) || Hf(t, !1, e), Hf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Uf] || (t[Uf] = !0, Hf("selectionchange", !1, t));
		}
	}
	function Gf(e, t, n, r) {
		switch (Ch(t)) {
			case 2:
				var i = _h;
				break;
			case 8:
				i = vh;
				break;
			default: i = yh;
		}
		n = i.bind(null, t, n, e), i = void 0, !Nn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Kf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var o = r.tag;
			if (o === 3 || o === 4) {
				var s = r.stateNode.containerInfo;
				if (s === i) break;
				if (o === 4) for (o = r.return; o !== null;) {
					var c = o.tag;
					if ((c === 3 || c === 4) && o.stateNode.containerInfo === i) return;
					o = o.return;
				}
				for (; s !== null;) {
					if (o = Bt(s), o === null) return;
					if (c = o.tag, c === 5 || c === 6 || c === 26 || c === 27) {
						r = a = o;
						continue a;
					}
					s = s.parentNode;
				}
			}
			r = r.return;
		}
		An(function() {
			var r = a, i = Tn(n), o = [];
			a: {
				var s = vi.get(e);
				if (s !== void 0) {
					var c = Wn, u = e;
					switch (e) {
						case "keypress": if (zn(n) === 0) break a;
						case "keydown":
						case "keyup":
							c = cr;
							break;
						case "focusin":
							u = "focus", c = $n;
							break;
						case "focusout":
							u = "blur", c = $n;
							break;
						case "beforeblur":
						case "afterblur":
							c = $n;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							c = Zn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							c = Qn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							c = dr;
							break;
						case di:
						case fi:
						case pi:
							c = er;
							break;
						case _i:
							c = fr;
							break;
						case "scroll":
						case "scrollend":
							c = Kn;
							break;
						case "wheel":
							c = pr;
							break;
						case "copy":
						case "cut":
						case "paste":
							c = tr;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							c = lr;
							break;
						case "submit":
							c = ur;
							break;
						case "toggle":
						case "beforetoggle": c = mr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? s === null ? null : s + "Capture" : s;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = jn(m, p), g != null && d.push(qf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (s = new c(s, u, null, n, i), o.push({
						event: s,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (c = e === "mouseover" || e === "pointerover", s = e === "mouseout" || e === "pointerout", c && n !== wn && (u = n.relatedTarget || n.fromElement) && (Bt(u) || u[Ft])) break a;
					(s || c) && (u = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, s ? (c = n.relatedTarget || n.toElement, s = r, c = c ? Bt(c) : null, c !== null && (f = l(c), d = c.tag, c !== f || d !== 5 && d !== 27 && d !== 6) && (c = null)) : (s = null, c = r), s !== c && (d = Zn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = lr, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = s == null ? u : Ht(s), h = c == null ? u : Ht(c), u = new d(g, m + "leave", s, n, i), u.target = f, u.relatedTarget = h, g = null, Bt(i) === r && (d = new d(p, m + "enter", c, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = s && c ? ie(s, c, Yf) : null, s !== null && Xf(o, u, s, d, !1), c !== null && f !== null && Xf(o, f, c, d, !0)));
				}
				a: {
					if (s = r ? Ht(r) : window, c = s.nodeName && s.nodeName.toLowerCase(), c === "select" || c === "input" && s.type === "file") var _ = Pr;
					else if (Or(s)) {
						if (Fr) _ = Wr;
						else {
							_ = Hr;
							var v = Vr;
						}
					} else c = s.nodeName, !c || c.toLowerCase() !== "input" || s.type !== "checkbox" && s.type !== "radio" ? r && yn(r.elementType) && (_ = Pr) : _ = Ur;
					if (_ &&= _(e, r)) {
						kr(o, _, n, i);
						break a;
					}
					v && v(e, s, r);
				}
				switch (v = r ? Ht(r) : window, e) {
					case "focusin":
						(Or(v) || v.contentEditable === "true") && (ti = v, ni = r, ri = null);
						break;
					case "focusout":
						ri = ni = ti = null;
						break;
					case "mousedown":
						ii = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						ii = !1, ai(o, n, i);
						break;
					case "selectionchange": if (ei) break;
					case "keydown":
					case "keyup": ai(o, n, i);
				}
				var y;
				if (gr) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else wr ? Sr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (yr && n.locale !== "ko" && (wr || b !== "onCompositionStart" ? b === "onCompositionEnd" && wr && (y = Rn()) : (Fn = i, In = "value" in Fn ? Fn.value : Fn.textContent, wr = !0)), v = Jf(r, b), 0 < v.length && (b = new nr(b, e, null, n, i), o.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = Cr(n), y !== null && (b.data = y)))), (y = vr ? Tr(e, n) : Er(e, n)) && (b = Jf(r, "onBeforeInput"), 0 < b.length && (v = new nr("onBeforeInput", "beforeinput", null, n, i), o.push({
					event: v,
					listeners: b
				}), v.data = y)), If(o, e, r, n, i);
			}
			Vf(o, t);
		});
	}
	function qf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Jf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = jn(e, n), i != null && r.unshift(qf(e, i, a)), i = jn(e, t), i != null && r.push(qf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Yf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Xf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = jn(n, a), l != null && o.unshift(qf(n, l, c))) : i || (l = jn(n, a), l != null && o.push(qf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Zf = /\r\n?/g, Qf = /\u0000|\uFFFD/g;
	function $f(e) {
		return (typeof e == "string" ? e : "" + e).replace(Zf, "\n").replace(Qf, "");
	}
	function ep(e, t) {
		return t = $f(t), $f(e) === t;
	}
	function $(e, t, n, r, i, a) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || hn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && hn(e, "" + r);
				else return;
				break;
			case "className":
				en(e, "class", r);
				break;
			case "tabIndex":
				en(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				en(e, n, r);
				break;
			case "style":
				vn(e, r, a);
				return;
			case "data": if (t !== "object") {
				en(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Sn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof a == "function" && (n === "formAction" ? (t !== "input" && $(e, t, "name", i.name, i, null), $(e, t, "formEncType", i.formEncType, i, null), $(e, t, "formMethod", i.formMethod, i, null), $(e, t, "formTarget", i.formTarget, i, null)) : ($(e, t, "encType", i.encType, i, null), $(e, t, "method", i.method, i, null), $(e, t, "target", i.target, i, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Sn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = Cn);
				return;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(s(61));
					if (n = r.__html, n != null) {
						if (i.children != null) throw Error(s(60));
						a?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = Sn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), $t(e, "popover", r);
				break;
			case "xlinkActuate":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				tn(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				tn(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				tn(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				$t(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = bn.get(n) || n, $t(e, n, r);
			else return;
		}
		M = !0;
	}
	function tp(e, t, n, r, i, a) {
		switch (n) {
			case "style":
				vn(e, r, a);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(s(61));
					if (n = r.__html, n != null) {
						if (i.children != null) throw Error(s(60));
						a?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") hn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") hn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = Cn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Kt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), a = n.slice(2, i ? n.length - 7 : void 0), t = e[Pt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(a, t, i), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(a, r, i);
						break a;
					}
					M = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : $t(e, n, r);
				}
				return;
		}
		M = !0;
	}
	function np(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, i = !1, a;
				for (a in n) if (n.hasOwnProperty(a)) {
					var o = n[a];
					if (o != null) switch (a) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							i = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(s(137, t));
						default: $(e, t, a, o, n, null);
					}
				}
				i && $(e, t, "srcSet", n.srcSet, n, null), r && $(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = a = o = i = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							i = d;
							break;
						case "type":
							o = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							a = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(s(137, t));
							break;
						default: $(e, t, r, d, n, null);
					}
				}
				un(e, a, c, l, u, o, i, !1);
				return;
			case "select":
				for (i in Q("invalid", e), r = o = a = null, n) if (n.hasOwnProperty(i) && (c = n[i], c != null)) switch (i) {
					case "value":
						a = c;
						break;
					case "defaultValue":
						o = c;
						break;
					case "multiple": r = c;
					default: $(e, t, i, c, n, null);
				}
				t = a, n = o, e.multiple = !!r, t == null ? n != null && fn(e, !!r, n, !0) : fn(e, !!r, t, !1);
				return;
			case "textarea":
				for (o in Q("invalid", e), a = i = r = null, n) if (n.hasOwnProperty(o) && (c = n[o], c != null)) switch (o) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						i = c;
						break;
					case "children":
						a = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(s(91));
						break;
					default: $(e, t, o, c, n, null);
				}
				mn(e, r, i, a);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: $(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < zf.length; r++) Q(zf[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(s(137, t));
					default: $(e, t, u, r, n, null);
				}
				return;
			default: if (yn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && tp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && $(e, t, c, r, n, null));
	}
	var rp = {};
	function ip(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var i = null, a = null, o = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || $(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (M = !0), a = m;
							break;
						case "name":
							m !== f && (M = !0), i = m;
							break;
						case "checked":
							m !== f && (M = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (M = !0), d = m;
							break;
						case "value":
							m !== f && (M = !0), o = m;
							break;
						case "defaultValue":
							m !== f && (M = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(s(137, t));
							break;
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				ln(e, o, c, l, u, d, a, i);
				return;
			case "select":
				for (a in m = o = c = p = null, n) if (l = n[a], n.hasOwnProperty(a) && l != null) switch (a) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(a) || $(e, t, a, null, r, l);
				}
				for (i in r) if (a = r[i], l = n[i], r.hasOwnProperty(i) && (a != null || l != null)) switch (i) {
					case "value":
						a !== l && (M = !0), p = a;
						break;
					case "defaultValue":
						a !== l && (M = !0), c = a;
						break;
					case "multiple": a !== l && (M = !0), o = a;
					default: a !== l && $(e, t, i, a, r, l);
				}
				t = c, n = o, r = m, p == null ? !!r != !!n && (t == null ? fn(e, !!n, n ? [] : "", !1) : fn(e, !!n, t, !0)) : fn(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (i = n[c], n.hasOwnProperty(c) && i != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, i);
				}
				for (o in r) if (i = r[o], a = n[o], r.hasOwnProperty(o) && (i != null || a != null)) switch (o) {
					case "value":
						i !== a && (M = !0), p = i;
						break;
					case "defaultValue":
						i !== a && (M = !0), m = i;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (i != null) throw Error(s(91));
						break;
					default: i !== a && $(e, t, o, i, r, a);
				}
				pn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: $(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (M = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: $(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && $(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(s(137, t));
						break;
					default: $(e, t, u, p, r, m);
				}
				return;
			default: if (yn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && tp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || tp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && $(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || $(e, t, f, p, r, m);
	}
	function ap(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function op() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && ap(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && ap(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var sp = null, cp = null;
	function lp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function up(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function dp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function fp(e, t, n, r) {
		return n = lp(n).createElement(e), n[D] = r, n[Pt] = t, np(n, e, t), j(n), n;
	}
	function pp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var mp = null;
	function hp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== mp && (mp = e, !0) : (mp = null, !1);
	}
	var gp = typeof setTimeout == "function" ? setTimeout : void 0, _p = typeof clearTimeout == "function" ? clearTimeout : void 0, vp = typeof Promise == "function" ? Promise : void 0, yp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : gp, bp = typeof queueMicrotask == "function" ? queueMicrotask : vp === void 0 ? gp : function(e) {
		return vp.resolve(null).then(e).catch(xp);
	};
	function xp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Sp(e) {
		return e === "head";
	}
	function Cp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") _m(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, _m(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[A] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && _m(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function wp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Tp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Ep(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Dp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Op(e) {
		return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function kp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Dp(t, n, e);
	}
	function Ap(e) {
		return e.documentElement.clientHeight;
	}
	function jp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Mp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Ap(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Xm(f), u > $m) {
									s.length = o;
									break;
								}
								f = new Promise(jp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Np(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Np.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : S({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Np.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Np.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Pp(e) {
		return {
			name: e,
			group: new Np("group", e),
			imagePair: new Np("image-pair", e),
			old: new Np("old", e),
			new: new Np("new", e)
		};
	}
	function Fp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Fp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Bp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Rp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Ip, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Ip(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Fp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Bp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Rp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Lp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Lp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Rp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function zp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Bp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = zp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Fp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Fp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
	};
	function Vp(e, t) {
		return e.tag !== 6 && (e = b(e), pm(e, t));
	}
	Fp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
	};
	function Hp(e, t) {
		return t.push(e), !1;
	}
	Fp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = lp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Fp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Fp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
			for (var n = t = 0; n < Kp.length; n++) {
				var r = Kp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Kp[t++] = r;
			}
			Kp.length = t;
		}
	};
	function Gp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Kp = [], qp = !1;
	function Jp(e, t, n) {
		Kp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), qp || (qp = !0, mm(function() {
			qp = !1;
			var e = Kp;
			Kp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Fp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e;
	};
	function Yp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Fp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Fp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Xp(e, t, n, r, i) {
		var a = Bt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = ie(n, a, x), t === null ? t = !1 : (h(t, !0, ne, a, n), a = ee, ee = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = ie(r, a, x), t === null ? t = !1 : (h(t, !0, re, a, r), a = ee, te = ee = null, t = a !== null)), t) : !1;
	}
	function Zp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Fp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(s(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Zp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var i = t[r];
			i.tag === 6 ? (i = b(i), Zp(i, n)) : b(i).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function Qp(e, t) {
		return e = b(e), $p(e, t), !1;
	}
	function $p(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function em(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Kp.length; i++) {
				var a = Kp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Kp[r++] = a);
			}
			Kp.length = r, n.observe(e);
		}), $p(e, t));
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Jp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function nm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					nm(n), zt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function rm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[A]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function im(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function am(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var um = null;
	function dm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function fm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function mm(e) {
		yp(function() {
			yp(function(t) {
				return e(t);
			});
		});
	}
	function hm(e, t, n) {
		switch (t = lp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(s(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(s(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(s(454));
				return e;
			default: throw Error(s(451));
		}
	}
	function gm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && $(e, t, r, null, rp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === Cn && (e.onclick = null), zt(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		zt(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = w.d;
	w.d = {
		f: Sm,
		r: Cm,
		D: Em,
		C: Dm,
		L: Om,
		m: km,
		X: jm,
		S: Am,
		M: Mm
	};
	function Sm() {
		var e = xm.f(), t = zd();
		return e || t;
	}
	function Cm(e) {
		var t = Vt(e);
		t !== null && t.tag === 5 && t.type === "form" ? ac(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = cn(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), np(t, "link", e), j(t), r.head.appendChild(t)));
		}
	}
	function Em(e) {
		xm.D(e), Tm("dns-prefetch", e, null);
	}
	function Dm(e, t) {
		xm.C(e, t), Tm("preconnect", e, t);
	}
	function Om(e, t, n) {
		xm.L(e, t, n);
		var r = wm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + cn(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + cn(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + cn(n.imageSizes) + "\"]")) : i += "[href=\"" + cn(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = S({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				np(o, "link", e), t === "style" && (o[Rt] = !0, o.onload = o.onerror = function() {
					Wt(o);
				}), j(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + cn(r) + "\"][href=\"" + cn(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = S({
				rel: "modulepreload",
				href: e
			}, t), vm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(zm(a))) return;
				}
				r = n.createElement("link"), np(r, "link", e), j(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Ut(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = S({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					j(c), np(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Vm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function jm(e, t) {
		xm.X(e, t);
		var n = wm;
		if (n && e) {
			var r = Ut(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = S({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), j(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mm(e, t) {
		xm.M(e, t);
		var n = wm;
		if (n && e) {
			var r = Ut(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = S({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), j(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var i = (i = Fe.current) ? bm(i) : null;
		if (!i) throw Error(s(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Ut(i).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Pm(n.href);
					var a = Ut(i).hoistableStyles, o = a.get(e);
					if (o || (i = i.ownerDocument || i, o = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, a.set(e, o), (a = i.querySelector(Fm(e))) ? a._p || (o.instance = a, o.state.loading = 5) : (a = vm.get(e), a || (a = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, vm.set(e, a)), Lm(i, e, a, o.state))), t && r === null) throw Error(s(528, ""));
					return o;
				}
				if (t && r !== null) throw Error(s(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Ut(i).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(s(444, e));
		}
	}
	function Pm(e) {
		return "href=\"" + cn(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return S({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[Rt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[Rt] = !0, t.onload = t.onerror = Wt.bind(null, t), np(t, "link", n), j(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + cn(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + cn(n.href) + "\"]");
				if (r) return t.instance = r, j(r), r;
				var i = S({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), j(r), np(r, "style", i), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				i = Pm(n.href);
				var a = e.querySelector(Fm(i));
				if (a) return t.state.loading |= 4, t.instance = a, j(a), a;
				r = Im(n), (i = vm.get(i)) && Hm(r, i), a = (e.ownerDocument || e).createElement("link"), j(a);
				var o = a;
				return o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), np(a, "link", r), t.state.loading |= 4, Vm(a, n.precedence, e), t.instance = a;
			case "script": return a = Rm(n.src), (i = e.querySelector(zm(a))) ? (t.instance = i, j(i), i) : (r = n, (i = vm.get(a)) && (r = S({}, n), Um(r, i)), e = e.ownerDocument || e, i = e.createElement("script"), j(i), np(i, "link", r), e.head.appendChild(i), t.instance = i);
			case "void": return null;
			default: throw Error(s(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Vm(r, n.precedence, e));
		return t.instance;
	}
	function Vm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Hm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Wm = null;
	function Gm(e, t, n) {
		if (Wm === null) {
			var r = /* @__PURE__ */ new Map(), i = Wm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Wm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[A] || a[D] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Km(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Jm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Ym(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Xm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Zm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Xm(t), e.suspenseyImages.push(t)), e = rh.bind(e), t.decode().then(e, e));
	}
	function Qm(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Pm(r.href), a = t.querySelector(Fm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, j(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), j(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), np(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = nh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var $m = 0;
	function eh(e, t) {
		return e.stylesheets && e.count === 0 && ah(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ah(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > $m ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function th(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ah(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function nh() {
		this.count--, th(this);
	}
	function rh() {
		this.imgCount--, th(this);
	}
	var ih = null;
	function ah(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ih = /* @__PURE__ */ new Map(), t.forEach(oh, e), ih = null, nh.call(e));
	}
	function oh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ih.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ih.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = nh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var sh = {
		$$typeof: fe,
		Provider: null,
		Consumer: null,
		_currentValue: Oe,
		_currentValue2: Oe,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = E(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = E(0), this.hiddenUpdates = E(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Li(3, null, null, t), e.current = a, a.stateNode = e, t = Ia(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, yo(a), e;
	}
	function uh(e) {
		return e ? (e = Fi, e) : Fi;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = xo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = So(e, r, t), n !== null && (Pd(n, e, t), Co(n, e, t));
	}
	function fh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ph(e, t) {
		fh(e, t), (e = e.alternate) && fh(e, t);
	}
	function mh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Mi(e, 67108864);
			t !== null && Pd(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = jd();
			t = kt(t);
			var n = Mi(e, t);
			n !== null && Pd(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = C.T;
		C.T = null;
		var a = w.p;
		try {
			w.p = 2, yh(e, t, n, r);
		} finally {
			w.p = a, C.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = C.T;
		C.T = null;
		var a = w.p;
		try {
			w.p = 8, yh(e, t, n, r);
		} finally {
			w.p = a, C.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) Kf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = Vt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = vt(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - dt(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Ef(a), !(W & 6) && (_d = $e() + 500, Df(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Mi(a, 2), s !== null && Pd(s, a, 2), zd(), ph(a, 2);
					}
					if (a = bh(r), a === null && Kf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Kf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = Tn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = Bt(e), e !== null) {
			var t = l(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = u(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = d(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return xh = e, null;
	}
	function Ch(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (et()) {
				case tt: return 2;
				case nt: return 8;
				case rt:
				case it: return 32;
				case at: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var wh = !1, Th = null, Eh = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Th = null;
				break;
			case "dragenter":
			case "dragleave":
				Eh = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Vt(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Th = Nh(Th, e, t, n, r, i), !0;
			case "dragenter": return Eh = Nh(Eh, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = Bt(e.target);
		if (t !== null) {
			var n = l(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = u(n), t !== null) {
						e.blockedOn = t, Mt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = d(n), t !== null) {
						e.blockedOn = t, Mt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = bh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				wn = r, n.target.dispatchEvent(r), wn = null;
			} else return t = Vt(n), t !== null && mh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		wh = !1, Th !== null && Ih(Th) && (Th = null), Eh !== null && Ih(Eh) && (Eh = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, wh || (wh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Sh(r || n) === null) continue;
					break;
				}
				var a = Vt(n);
				a !== null && (e.splice(t, 3), t -= 3, rc(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Th !== null && zh(Th, e), Eh !== null && zh(Eh, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[Pt] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[Pt] || null) s = o.formAction;
					else if (Sh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(s(409));
		var n = t.current;
		dh(n, jd(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			dh(e.current, 2, null, e, null, null), zd(), t[Ft] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = jt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = r.version;
	if (Kh !== "19.3.1") throw Error(s(527, Kh, "19.3.1"));
	w.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
		return e = p(t), e = e === null ? null : m(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: C,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			ct = Jh.inject(qh), lt = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!c(e)) throw Error(s(299));
		var n = !1, r = "", i = Ec, a = Dc, o = Oc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (a = t.onCaughtError), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, i, a, o, Uh), e[Ft] = t.current, Wf(e), new Wh(t);
	};
})), c = (/* @__PURE__ */ e(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = s();
})))(), l = i();
function u(e, t) {
	let n = e.icons, r = e.aliases || Object.create(null), i = Object.create(null);
	function a(e) {
		if (n[e]) return i[e] = [];
		if (!(e in i)) {
			i[e] = null;
			let t = r[e] && r[e].parent, n = t && a(t);
			n && (i[e] = [t].concat(n));
		}
		return i[e];
	}
	return Object.keys(n).concat(Object.keys(r)).forEach(a), i;
}
var d = Object.freeze({
	left: 0,
	top: 0,
	width: 16,
	height: 16
}), f = Object.freeze({
	rotate: 0,
	vFlip: !1,
	hFlip: !1
}), p = Object.freeze({
	...d,
	...f
}), m = Object.freeze({
	...p,
	body: "",
	hidden: !1
});
function h(e, t) {
	let n = {};
	!e.hFlip != !t.hFlip && (n.hFlip = !0), !e.vFlip != !t.vFlip && (n.vFlip = !0);
	let r = ((e.rotate || 0) + (t.rotate || 0)) % 4;
	return r && (n.rotate = r), n;
}
function g(e, t) {
	let n = h(e, t);
	for (let r in m) r in f ? r in e && !(r in n) && (n[r] = f[r]) : r in t ? n[r] = t[r] : r in e && (n[r] = e[r]);
	return n;
}
function _(e, t, n) {
	let r = e.icons, i = e.aliases || Object.create(null), a = {};
	function o(e) {
		a = g(r[e] || i[e], a);
	}
	return o(t), n.forEach(o), g(e, a);
}
function v(e, t) {
	let n = [];
	if (typeof e != "object" || typeof e.icons != "object") return n;
	e.not_found instanceof Array && e.not_found.forEach((e) => {
		t(e, null), n.push(e);
	});
	let r = u(e);
	for (let i in r) {
		let a = r[i];
		a && (t(i, _(e, i, a)), n.push(i));
	}
	return n;
}
var y = {
	provider: "",
	aliases: {},
	not_found: {},
	...d
};
function b(e, t) {
	for (let n in t) if (n in e && typeof e[n] != typeof t[n]) return !1;
	return !0;
}
function ee(e) {
	if (typeof e != "object" || !e) return null;
	let t = e;
	if (typeof t.prefix != "string" || !e.icons || typeof e.icons != "object" || !b(e, y)) return null;
	let n = t.icons;
	for (let e in n) {
		let t = n[e];
		if (!e || typeof t.body != "string" || !b(t, m)) return null;
	}
	let r = t.aliases || Object.create(null);
	for (let e in r) {
		let t = r[e], i = t.parent;
		if (!e || typeof i != "string" || !n[i] && !r[i] || !b(t, m)) return null;
	}
	return t;
}
var te = Object.create(null);
function ne(e, t) {
	return {
		provider: e,
		prefix: t,
		icons: Object.create(null),
		missing: /* @__PURE__ */ new Set()
	};
}
function re(e, t) {
	let n = te[e] || (te[e] = Object.create(null));
	return n[t] || (n[t] = ne(e, t));
}
function x(e, t) {
	return ee(t) ? v(t, (t, n) => {
		n ? e.icons[t] = n : e.missing.add(t);
	}) : [];
}
function ie(e, t, n) {
	try {
		if (typeof n.body == "string") return e.icons[t] = { ...n }, !0;
	} catch {}
	return !1;
}
var S = /^[a-z0-9]+(-[a-z0-9]+)*$/, ae = (e, t, n, r = "") => {
	let i = e.split(":");
	if (e.slice(0, 1) === "@") {
		if (i.length < 2 || i.length > 3) return null;
		r = i.shift().slice(1);
	}
	if (i.length > 3 || !i.length) return null;
	if (i.length > 1) {
		let e = i.pop(), n = i.pop(), a = {
			provider: i.length > 0 ? i[0] : r,
			prefix: n,
			name: e
		};
		return t && !oe(a) ? null : a;
	}
	let a = i[0], o = a.split("-");
	if (o.length > 1) {
		let e = {
			provider: r,
			prefix: o.shift(),
			name: o.join("-")
		};
		return t && !oe(e) ? null : e;
	}
	if (n && r === "") {
		let e = {
			provider: r,
			prefix: "",
			name: a
		};
		return t && !oe(e, n) ? null : e;
	}
	return null;
}, oe = (e, t) => e ? !!((t && e.prefix === "" || e.prefix) && e.name) : !1, se = !1;
function ce(e) {
	return typeof e == "boolean" && (se = e), se;
}
function le(e) {
	let t = typeof e == "string" ? ae(e, !0, se) : e;
	if (t) {
		let e = re(t.provider, t.prefix), n = t.name;
		return e.icons[n] || (e.missing.has(n) ? null : void 0);
	}
}
function ue(e, t) {
	let n = ae(e, !0, se);
	if (!n) return !1;
	let r = re(n.provider, n.prefix);
	return t ? ie(r, n.name, t) : (r.missing.add(n.name), !0);
}
function de(e, t) {
	if (typeof e != "object") return !1;
	if (typeof t != "string" && (t = e.provider || ""), se && !t && !e.prefix) {
		let t = !1;
		return ee(e) && (e.prefix = "", v(e, (e, n) => {
			ue(e, n) && (t = !0);
		})), t;
	}
	let n = e.prefix;
	return oe({
		prefix: n,
		name: "a"
	}) ? !!x(re(t, n), e) : !1;
}
var fe = Object.freeze({
	width: null,
	height: null
}), pe = Object.freeze({
	...fe,
	...f
}), me = /(-?[0-9.]*[0-9]+[0-9.]*)/g, he = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function ge(e, t, n) {
	if (t === 1) return e;
	if (n ||= 100, typeof e == "number") return Math.ceil(e * t * n) / n;
	if (typeof e != "string") return e;
	let r = e.split(me);
	if (r === null || !r.length) return e;
	let i = [], a = r.shift(), o = he.test(a);
	for (;;) {
		if (o) {
			let e = parseFloat(a);
			isNaN(e) ? i.push(a) : i.push(Math.ceil(e * t * n) / n);
		} else i.push(a);
		if (a = r.shift(), a === void 0) return i.join("");
		o = !o;
	}
}
function _e(e, t = "defs") {
	let n = "", r = e.indexOf("<" + t);
	for (; r >= 0;) {
		let i = e.indexOf(">", r), a = e.indexOf("</" + t);
		if (i === -1 || a === -1) break;
		let o = e.indexOf(">", a);
		if (o === -1) break;
		n += e.slice(i + 1, a).trim(), e = e.slice(0, r).trim() + e.slice(o + 1);
	}
	return {
		defs: n,
		content: e
	};
}
function ve(e, t) {
	return e ? "<defs>" + e + "</defs>" + t : t;
}
function ye(e, t, n) {
	let r = _e(e);
	return ve(r.defs, t + r.content + n);
}
var be = (e) => e === "unset" || e === "undefined" || e === "none";
function xe(e, t) {
	let n = {
		...p,
		...e
	}, r = {
		...pe,
		...t
	}, i = {
		left: n.left,
		top: n.top,
		width: n.width,
		height: n.height
	}, a = n.body;
	[n, r].forEach((e) => {
		let t = [], n = e.hFlip, r = e.vFlip, o = e.rotate;
		n ? r ? o += 2 : (t.push("translate(" + (i.width + i.left).toString() + " " + (0 - i.top).toString() + ")"), t.push("scale(-1 1)"), i.top = i.left = 0) : r && (t.push("translate(" + (0 - i.left).toString() + " " + (i.height + i.top).toString() + ")"), t.push("scale(1 -1)"), i.top = i.left = 0);
		let s;
		switch (o < 0 && (o -= Math.floor(o / 4) * 4), o %= 4, o) {
			case 1:
				s = i.height / 2 + i.top, t.unshift("rotate(90 " + s.toString() + " " + s.toString() + ")");
				break;
			case 2:
				t.unshift("rotate(180 " + (i.width / 2 + i.left).toString() + " " + (i.height / 2 + i.top).toString() + ")");
				break;
			case 3: s = i.width / 2 + i.left, t.unshift("rotate(-90 " + s.toString() + " " + s.toString() + ")");
		}
		o % 2 == 1 && (i.left !== i.top && (s = i.left, i.left = i.top, i.top = s), i.width !== i.height && (s = i.width, i.width = i.height, i.height = s)), t.length && (a = ye(a, "<g transform=\"" + t.join(" ") + "\">", "</g>"));
	});
	let o = r.width, s = r.height, c = i.width, l = i.height, u, d;
	o === null ? (d = s === null ? "1em" : s === "auto" ? l : s, u = ge(d, c / l)) : (u = o === "auto" ? c : o, d = s === null ? ge(u, l / c) : s === "auto" ? l : s);
	let f = {}, m = (e, t) => {
		be(t) || (f[e] = t.toString());
	};
	m("width", u), m("height", d);
	let h = [
		i.left,
		i.top,
		c,
		l
	];
	return f.viewBox = h.join(" "), {
		attributes: f,
		viewBox: h,
		body: a
	};
}
var Se = /\sid="(\S+)"/g, Ce = /* @__PURE__ */ new Map();
function we(e) {
	e = e.replace(/[0-9]+$/, "") || "a";
	let t = Ce.get(e) || 0;
	return Ce.set(e, t + 1), t ? `${e}${t}` : e;
}
function Te(e) {
	let t = [], n;
	for (; n = Se.exec(e);) t.push(n[1]);
	if (!t.length) return e;
	let r = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
	return t.forEach((t) => {
		let n = we(t), i = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		e = e.replace(RegExp("([#;\"])(" + i + ")([\")]|\\.[a-z])", "g"), "$1" + n + r + "$3");
	}), e = e.replace(new RegExp(r, "g"), ""), e;
}
var Ee = Object.create(null);
function De(e, t) {
	Ee[e] = t;
}
function C(e) {
	return Ee[e] || Ee[""];
}
function w(e) {
	let t;
	if (typeof e.resources == "string") t = [e.resources];
	else if (t = e.resources, !(t instanceof Array) || !t.length) return null;
	return {
		resources: t,
		path: e.path || "/",
		maxURL: e.maxURL || 500,
		rotate: e.rotate || 2e3,
		timeout: e.timeout || 1e4,
		random: e.random === !0,
		index: e.index || 0,
		dataAfterTimeout: e.dataAfterTimeout !== !1
	};
}
var Oe = Object.create(null);
Oe[""] = w({ resources: ["https://api.iconify.design", "https://api2.iconify.design"] });
function ke(e, t) {
	let n = w(t);
	return n !== null && (Oe[e] = n, !0);
}
function Ae(e) {
	return Oe[e];
}
var je = (() => {
	let e;
	try {
		if (e = fetch, typeof e == "function") return e;
	} catch {}
})();
function Me(e, t) {
	let n = Ae(e);
	if (!n) return 0;
	let r;
	if (!n.maxURL) r = 0;
	else {
		let e = 0;
		n.resources.forEach((t) => {
			e = Math.max(e, t.length);
		});
		let i = t + ".json?icons=";
		r = n.maxURL - e - n.path.length - i.length;
	}
	return r;
}
function T(e) {
	return e === 404;
}
var Ne = (e, t, n) => {
	let r = [], i = Me(e, t), a = "icons", o = {
		type: a,
		provider: e,
		prefix: t,
		icons: []
	}, s = 0;
	return n.forEach((n, c) => {
		s += n.length + 1, s >= i && c > 0 && (r.push(o), o = {
			type: a,
			provider: e,
			prefix: t,
			icons: []
		}, s = n.length), o.icons.push(n);
	}), r.push(o), r;
};
function Pe(e) {
	if (typeof e == "string") {
		let t = Ae(e);
		if (t) return t.path;
	}
	return "/";
}
var Fe = {
	prepare: Ne,
	send: (e, t, n) => {
		if (!je) {
			n("abort", 424);
			return;
		}
		let r = Pe(t.provider);
		switch (t.type) {
			case "icons": {
				let e = t.prefix, n = t.icons.join(","), i = new URLSearchParams({ icons: n });
				r += e + ".json?" + i.toString();
				break;
			}
			case "custom": {
				let e = t.uri;
				r += e.slice(0, 1) === "/" ? e.slice(1) : e;
				break;
			}
			default:
				n("abort", 400);
				return;
		}
		let i = 503;
		je(e + r).then((e) => {
			let t = e.status;
			if (t !== 200) setTimeout(() => {
				n(T(t) ? "abort" : "next", t);
			});
			else return i = 501, e.json();
		}).then((e) => {
			setTimeout(typeof e != "object" || !e ? () => {
				e === 404 ? n("abort", e) : n("next", i);
			} : () => {
				n("success", e);
			});
		}).catch(() => {
			n("next", i);
		});
	}
};
function Ie(e, t) {
	e.forEach((e) => {
		let n = e.loaderCallbacks;
		n && (e.loaderCallbacks = n.filter((e) => e.id !== t));
	});
}
function Le(e) {
	e.pendingCallbacksFlag || (e.pendingCallbacksFlag = !0, setTimeout(() => {
		e.pendingCallbacksFlag = !1;
		let t = e.loaderCallbacks ? e.loaderCallbacks.slice(0) : [];
		if (!t.length) return;
		let n = !1, r = e.provider, i = e.prefix;
		t.forEach((t) => {
			let a = t.icons, o = a.pending.length;
			a.pending = a.pending.filter((t) => {
				if (t.prefix !== i) return !0;
				let o = t.name;
				if (e.icons[o]) a.loaded.push({
					provider: r,
					prefix: i,
					name: o
				});
				else if (e.missing.has(o)) a.missing.push({
					provider: r,
					prefix: i,
					name: o
				});
				else return n = !0, !0;
				return !1;
			}), a.pending.length !== o && (n || Ie([e], t.id), t.callback(a.loaded.slice(0), a.missing.slice(0), a.pending.slice(0), t.abort));
		});
	}));
}
var Re = 0;
function ze(e, t, n) {
	let r = Re++, i = Ie.bind(null, n, r);
	if (!t.pending.length) return i;
	let a = {
		id: r,
		icons: t,
		callback: e,
		abort: i
	};
	return n.forEach((e) => {
		(e.loaderCallbacks ||= []).push(a);
	}), i;
}
function Be(e) {
	let t = {
		loaded: [],
		missing: [],
		pending: []
	}, n = Object.create(null);
	e.sort((e, t) => e.provider === t.provider ? e.prefix === t.prefix ? e.name.localeCompare(t.name) : e.prefix.localeCompare(t.prefix) : e.provider.localeCompare(t.provider));
	let r = {
		provider: "",
		prefix: "",
		name: ""
	};
	return e.forEach((e) => {
		if (r.name === e.name && r.prefix === e.prefix && r.provider === e.provider) return;
		r = e;
		let i = e.provider, a = e.prefix, o = e.name, s = n[i] || (n[i] = Object.create(null)), c = s[a] || (s[a] = re(i, a)), l;
		l = o in c.icons ? t.loaded : a === "" || c.missing.has(o) ? t.missing : t.pending;
		let u = {
			provider: i,
			prefix: a,
			name: o
		};
		l.push(u);
	}), t;
}
function Ve(e, t = !0, n = !1) {
	let r = [];
	return e.forEach((e) => {
		let i = typeof e == "string" ? ae(e, t, n) : e;
		i && r.push(i);
	}), r;
}
var He = {
	resources: [],
	index: 0,
	timeout: 2e3,
	rotate: 750,
	random: !1,
	dataAfterTimeout: !1
};
function Ue(e, t, n, r) {
	let i = e.resources.length, a = e.random ? Math.floor(Math.random() * i) : e.index, o;
	if (e.random) {
		let t = e.resources.slice(0);
		for (o = []; t.length > 1;) {
			let e = Math.floor(Math.random() * t.length);
			o.push(t[e]), t = t.slice(0, e).concat(t.slice(e + 1));
		}
		o = o.concat(t);
	} else o = e.resources.slice(a).concat(e.resources.slice(0, a));
	let s = Date.now(), c = "pending", l = 0, u, d = null, f = [], p = [];
	typeof r == "function" && p.push(r);
	function m() {
		d &&= (clearTimeout(d), null);
	}
	function h() {
		c === "pending" && (c = "aborted"), m(), f.forEach((e) => {
			e.status === "pending" && (e.status = "aborted");
		}), f = [];
	}
	function g(e, t) {
		t && (p = []), typeof e == "function" && p.push(e);
	}
	function _() {
		return {
			startTime: s,
			payload: t,
			status: c,
			queriesSent: l,
			queriesPending: f.length,
			subscribe: g,
			abort: h
		};
	}
	function v() {
		c = "failed", p.forEach((e) => {
			e(void 0, u);
		});
	}
	function y() {
		f.forEach((e) => {
			e.status === "pending" && (e.status = "aborted");
		}), f = [];
	}
	function b(t, n, r) {
		let i = n !== "success";
		switch (f = f.filter((e) => e !== t), c) {
			case "pending": break;
			case "failed":
				if (i || !e.dataAfterTimeout) return;
				break;
			default: return;
		}
		if (n === "abort") u = r, v();
		else if (i) u = r, f.length || (o.length ? ee() : v());
		else {
			if (m(), y(), !e.random) {
				let n = e.resources.indexOf(t.resource);
				n !== -1 && n !== e.index && (e.index = n);
			}
			c = "completed", p.forEach((e) => {
				e(r);
			});
		}
	}
	function ee() {
		if (c !== "pending") return;
		m();
		let r = o.shift();
		if (r === void 0) {
			if (f.length) {
				d = setTimeout(() => {
					m(), c === "pending" && (y(), v());
				}, e.timeout);
				return;
			}
			v();
			return;
		}
		let i = {
			status: "pending",
			resource: r,
			callback: (e, t) => {
				b(i, e, t);
			}
		};
		f.push(i), l++, d = setTimeout(ee, e.rotate), n(r, t, i.callback);
	}
	return setTimeout(ee), _;
}
function We(e) {
	let t = {
		...He,
		...e
	}, n = [];
	function r() {
		n = n.filter((e) => e().status === "pending");
	}
	function i(e, i, a) {
		let o = Ue(t, e, i, (e, t) => {
			r(), a && a(e, t);
		});
		return n.push(o), o;
	}
	function a(e) {
		return n.find((t) => e(t)) || null;
	}
	return {
		query: i,
		find: a,
		setIndex: (e) => {
			t.index = e;
		},
		getIndex: () => t.index,
		cleanup: r
	};
}
function Ge() {}
var Ke = Object.create(null);
function qe(e) {
	if (!Ke[e]) {
		let t = Ae(e);
		if (!t) return;
		Ke[e] = {
			config: t,
			redundancy: We(t)
		};
	}
	return Ke[e];
}
function Je(e, t, n) {
	let r, i;
	if (typeof e == "string") {
		let t = C(e);
		if (!t) return n(void 0, 424), Ge;
		i = t.send;
		let a = qe(e);
		a && (r = a.redundancy);
	} else {
		let t = w(e);
		if (t) {
			r = We(t);
			let n = C(e.resources ? e.resources[0] : "");
			n && (i = n.send);
		}
	}
	return !r || !i ? (n(void 0, 424), Ge) : r.query(t, i, n)().abort;
}
function Ye() {}
function Xe(e) {
	e.iconsLoaderFlag || (e.iconsLoaderFlag = !0, setTimeout(() => {
		e.iconsLoaderFlag = !1, Le(e);
	}));
}
function Ze(e) {
	let t = [], n = [];
	return e.forEach((e) => {
		(e.match(S) ? t : n).push(e);
	}), {
		valid: t,
		invalid: n
	};
}
function Qe(e, t, n) {
	function r() {
		let n = e.pendingIcons;
		t.forEach((t) => {
			n && n.delete(t), e.icons[t] || e.missing.add(t);
		});
	}
	if (n && typeof n == "object") try {
		if (!x(e, n).length) {
			r();
			return;
		}
	} catch (e) {
		console.error(e);
	}
	r(), Xe(e);
}
function $e(e, t) {
	e instanceof Promise ? e.then((e) => {
		t(e);
	}).catch(() => {
		t(null);
	}) : t(e);
}
function et(e, t) {
	e.iconsToLoad = e.iconsToLoad ? e.iconsToLoad.concat(t).sort() : t, e.iconsQueueFlag || (e.iconsQueueFlag = !0, setTimeout(() => {
		e.iconsQueueFlag = !1;
		let { provider: t, prefix: n } = e, r = e.iconsToLoad;
		if (delete e.iconsToLoad, !r || !r.length) return;
		let i = e.loadIcon;
		if (e.loadIcons && (r.length > 1 || !i)) {
			$e(e.loadIcons(r, n, t), (t) => {
				Qe(e, r, t);
			});
			return;
		}
		if (i) {
			r.forEach((r) => {
				$e(i(r, n, t), (t) => {
					Qe(e, [r], t ? {
						prefix: n,
						icons: { [r]: t }
					} : null);
				});
			});
			return;
		}
		let { valid: a, invalid: o } = Ze(r);
		if (o.length && Qe(e, o, null), !a.length) return;
		let s = n.match(S) ? C(t) : null;
		s ? s.prepare(t, n, a).forEach((n) => {
			Je(t, n, (t) => {
				Qe(e, n.icons, t);
			});
		}) : Qe(e, a, null);
	}));
}
var tt = (e, t) => {
	let n = Be(Ve(e, !0, ce()));
	if (!n.pending.length) {
		let e = !0;
		return t && setTimeout(() => {
			e && t(n.loaded, n.missing, n.pending, Ye);
		}), () => {
			e = !1;
		};
	}
	let r = Object.create(null), i = [], a, o;
	return n.pending.forEach((e) => {
		let { provider: t, prefix: n } = e;
		if (n === o && t === a) return;
		a = t, o = n, i.push(re(t, n));
		let s = r[t] || (r[t] = Object.create(null));
		s[n] || (s[n] = []);
	}), n.pending.forEach((e) => {
		let { provider: t, prefix: n, name: i } = e, a = re(t, n), o = a.pendingIcons ||= /* @__PURE__ */ new Set();
		o.has(i) || (o.add(i), r[t][n].push(i));
	}), i.forEach((e) => {
		let t = r[e.provider][e.prefix];
		t.length && et(e, t);
	}), t ? ze(t, n, i) : Ye;
};
function nt(e, t) {
	let n = { ...e };
	for (let e in t) {
		let r = t[e], i = typeof r;
		e in fe ? (r === null || r && (i === "string" || i === "number")) && (n[e] = r) : i === typeof n[e] && (n[e] = e === "rotate" ? r % 4 : r);
	}
	return n;
}
var rt = /[\s,]+/;
function it(e, t) {
	t.split(rt).forEach((t) => {
		switch (t.trim()) {
			case "horizontal":
				e.hFlip = !0;
				break;
			case "vertical": e.vFlip = !0;
		}
	});
}
function at(e, t = 0) {
	let n = e.replace(/^-?[0-9.]*/, "");
	function r(e) {
		for (; e < 0;) e += 4;
		return e % 4;
	}
	if (n === "") {
		let t = parseInt(e);
		return isNaN(t) ? 0 : r(t);
	}
	if (n !== e) {
		let t = 0;
		switch (n) {
			case "%":
				t = 25;
				break;
			case "deg": t = 90;
		}
		if (t) {
			let i = parseFloat(e.slice(0, e.length - n.length));
			return isNaN(i) ? 0 : (i /= t, i % 1 == 0 ? r(i) : 0);
		}
	}
	return t;
}
function ot(e, t) {
	let n = e.indexOf("xlink:") === -1 ? "" : " xmlns:xlink=\"http://www.w3.org/1999/xlink\"";
	for (let e in t) n += " " + e + "=\"" + t[e] + "\"";
	return "<svg xmlns=\"http://www.w3.org/2000/svg\"" + n + ">" + e + "</svg>";
}
function st(e) {
	return e.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ").replace(/:/g, "%3A").replace(/\//g, "%2F");
}
function ct(e) {
	return "data:image/svg+xml," + st(e);
}
function lt(e) {
	return "url(\"" + ct(e) + "\")";
}
var ut;
function dt() {
	try {
		ut = window.trustedTypes.createPolicy("iconify", { createHTML: (e) => e });
	} catch {
		ut = null;
	}
}
function ft(e) {
	return ut === void 0 && dt(), ut ? ut.createHTML(e) : e;
}
var pt = {
	...pe,
	inline: !1
}, mt = {
	xmlns: "http://www.w3.org/2000/svg",
	xmlnsXlink: "http://www.w3.org/1999/xlink",
	"aria-hidden": !0,
	role: "img"
}, ht = { display: "inline-block" }, gt = { backgroundColor: "currentColor" }, _t = { backgroundColor: "transparent" }, vt = {
	Image: "var(--svg)",
	Repeat: "no-repeat",
	Size: "100% 100%"
}, yt = {
	WebkitMask: gt,
	mask: gt,
	background: _t
};
for (let e in yt) {
	let t = yt[e];
	for (let n in vt) t[e + n] = vt[n];
}
var bt = {
	...pt,
	inline: !0
};
function xt(e) {
	return e + (e.match(/^[-0-9.]+$/) ? "px" : "");
}
var St = (e, t, n) => {
	let r = t.inline ? bt : pt, i = nt(r, t), a = t.mode || "svg", o = {}, s = t.style || {}, c = { ...a === "svg" ? mt : {} };
	if (n) {
		let e = ae(n, !1, !0);
		if (e) {
			let t = ["iconify"];
			for (let n of ["provider", "prefix"]) e[n] && t.push("iconify--" + e[n]);
			c.className = t.join(" ");
		}
	}
	for (let e in t) {
		let n = t[e];
		if (n !== void 0) switch (e) {
			case "icon":
			case "style":
			case "children":
			case "onLoad":
			case "mode":
			case "ssr":
			case "fallback": break;
			case "_ref":
				c.ref = n;
				break;
			case "className":
				c[e] = (c[e] ? c[e] + " " : "") + n;
				break;
			case "inline":
			case "hFlip":
			case "vFlip":
				i[e] = n === !0 || n === "true" || n === 1;
				break;
			case "flip":
				typeof n == "string" && it(i, n);
				break;
			case "color":
				o.color = n;
				break;
			case "rotate":
				typeof n == "string" ? i[e] = at(n) : typeof n == "number" && (i[e] = n);
				break;
			case "ariaHidden":
			case "aria-hidden":
				n !== !0 && n !== "true" && delete c["aria-hidden"];
				break;
			default: r[e] === void 0 && (c[e] = n);
		}
	}
	let u = xe(e, i), d = u.attributes;
	if (i.inline && (o.verticalAlign = "-0.125em"), a === "svg") return c.style = {
		...o,
		...s
	}, Object.assign(c, d), c.dangerouslySetInnerHTML = { __html: ft(Te(u.body)) }, (0, l.createElement)("svg", c);
	let { body: f, width: p, height: m } = e, h = a === "mask" || a !== "bg" && f.indexOf("currentColor") !== -1, g = ot(f, {
		...d,
		width: p + "",
		height: m + ""
	});
	return c.style = {
		...o,
		"--svg": lt(g),
		width: xt(d.width),
		height: xt(d.height),
		...ht,
		...h ? gt : _t,
		...s
	}, (0, l.createElement)("span", c);
};
if (ce(!0), De("", Fe), typeof document < "u" && typeof window < "u") {
	let e = window;
	if (e.IconifyPreload !== void 0) {
		let t = e.IconifyPreload, n = "Invalid IconifyPreload syntax.";
		typeof t == "object" && t && (t instanceof Array ? t : [t]).forEach((e) => {
			try {
				(typeof e != "object" || !e || e instanceof Array || typeof e.icons != "object" || typeof e.prefix != "string" || !de(e)) && console.error(n);
			} catch {
				console.error(n);
			}
		});
	}
	if (e.IconifyProviders !== void 0) {
		let t = e.IconifyProviders;
		if (typeof t == "object" && t) for (let e in t) {
			let n = "IconifyProviders[" + e + "] is invalid.";
			try {
				let r = t[e];
				if (typeof r != "object" || !r || r.resources === void 0) continue;
				ke(e, r) || console.error(n);
			} catch {
				console.error(n);
			}
		}
	}
}
function Ct(e) {
	let [t, n] = (0, l.useState)(!!e.ssr), [r, i] = (0, l.useState)({});
	function a(t) {
		if (t) {
			let t = e.icon;
			if (typeof t == "object") return {
				name: "",
				data: t
			};
			let n = le(t);
			if (n) return {
				name: t,
				data: n
			};
		}
		return { name: "" };
	}
	let [o, s] = (0, l.useState)(a(!!e.ssr));
	function c() {
		let e = r.callback;
		e && (e(), i({}));
	}
	function u(e) {
		if (JSON.stringify(o) !== JSON.stringify(e)) return c(), s(e), !0;
	}
	function d() {
		var t;
		let n = e.icon;
		if (typeof n == "object") {
			u({
				name: "",
				data: n
			});
			return;
		}
		let r = le(n);
		if (u({
			name: n,
			data: r
		})) {
			if (r === void 0) {
				let e = tt([n], d);
				i({ callback: e });
			} else r && ((t = e.onLoad) == null || t.call(e, n));
		}
	}
	(0, l.useEffect)(() => (n(!0), c), []), (0, l.useEffect)(() => {
		t && d();
	}, [e.icon, t]);
	let { name: f, data: m } = o;
	return m ? St({
		...p,
		...m
	}, e, f) : e.children ? e.children : e.fallback ? e.fallback : (0, l.createElement)("span", {});
}
var E = (0, l.forwardRef)((e, t) => Ct({
	...e,
	_ref: t
}));
(0, l.forwardRef)((e, t) => Ct({
	inline: !0,
	...e,
	_ref: t
}));
var wt = {
	prefix: "mdi",
	icons: /* @__PURE__ */ JSON.parse("{\"account-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0 7c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1\\\"/>\"},\"alert\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2z\\\"/>\"},\"alert-octagon\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M13 13h-2V7h2m-2 8h2v2h-2m4.73-14H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27z\\\"/>\"},\"alert-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2\\\"/>\"},\"battery\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M16.67 4H15V2H9v2H7.33A1.33 1.33 0 0 0 6 5.33v15.34C6 21.4 6.6 22 7.33 22h9.34A1.33 1.33 0 0 0 18 20.67V5.33C18 4.6 17.4 4 16.67 4\\\"/>\"},\"battery-50\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M16 13H8V6h8m.67-2H15V2H9v2H7.33A1.33 1.33 0 0 0 6 5.33v15.34C6 21.4 6.6 22 7.33 22h9.34A1.33 1.33 0 0 0 18 20.67V5.33C18 4.6 17.4 4 16.67 4\\\"/>\"},\"battery-heart-variant\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M16.67 4H15V2H9v2H7.33A1.34 1.34 0 0 0 6 5.33v15.34A1.34 1.34 0 0 0 7.33 22h9.34A1.34 1.34 0 0 0 18 20.67V5.33A1.34 1.34 0 0 0 16.67 4m-4.09 11.64l-.58.53l-.58-.53C9.36 13.77 8 12.54 8 11a2.18 2.18 0 0 1 2.2-2.2a2.4 2.4 0 0 1 1.8.83a2.4 2.4 0 0 1 1.8-.83A2.18 2.18 0 0 1 16 11c0 1.54-1.36 2.77-3.42 4.64\\\"/>\"},\"bed-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3s1.34 3 3 3m0-4c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m12-3h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4m2 8h-8V9h6c1.1 0 2 .9 2 2Z\\\"/>\"},\"calendar\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5z\\\"/>\"},\"calendar-blank\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1\\\"/>\"},\"calendar-month-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M7 11h2v2H7zm14-6v14c0 1.11-.89 2-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h1V1h2v2h8V1h2v2h1a2 2 0 0 1 2 2M5 7h14V5H5zm14 12V9H5v10zm-4-6v-2h2v2zm-4 0v-2h2v2zm-4 2h2v2H7zm8 2v-2h2v2zm-4 0v-2h2v2z\\\"/>\"},\"calendar-range\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M9 10H7v2h2zm4 0h-2v2h2zm4 0h-2v2h2zm2-7h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 16H5V8h14z\\\"/>\"},\"calendar-star\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2V5a2 2 0 0 0-2-2h-1V1m-7.12 11H7.27l2.92 2.11l-1.11 3.45L12 15.43l2.92 2.13l-1.12-3.44L16.72 12h-3.6L12 8.56z\\\"/>\"},\"calendar-week-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M5 3h1V1h2v2h8V1h2v2h1c1.11 0 2 .89 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m0 16h14V9H5zM5 7h14V5H5zm12 4v2H7v-2z\\\"/>\"},\"campfire\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m15.9 18.5l6 1.6l-.4 1.9l-9.4-2.5L2.7 22l-.5-1.9l6-1.6l-6.1-1.6l.5-1.9l9.4 2.5l9.4-2.5l.5 1.9zm.17-10.58c-.16-.22-.36-.42-.57-.59c-.45-.43-1-.74-1.44-1.2C13 5.08 12.79 3.34 13.44 2c-.65.17-1.26.54-1.77.95C9.84 4.46 9.11 7.1 10 9.38c0 .07.04.15.04.24c0 .16-.11.3-.25.38a.51.51 0 0 1-.57-.23c-.8-1.03-.93-2.51-.38-3.7c-1.19.99-1.84 2.65-1.73 4.22c.02.36.07.71.19 1.07c.11.44.29.87.52 1.25c.75 1.25 2.08 2.15 3.5 2.33c1.52.2 3.14-.09 4.31-1.15c1.3-1.2 1.77-3.12 1.08-4.79l-.1-.17q-.21-.495-.57-.9zm-2.24 4.55c-.2.18-.52.36-.78.44c-.79.28-1.59-.12-2.05-.6c.84-.2 1.34-.84 1.5-1.48c.11-.58-.11-1.05-.21-1.61c-.08-.53-.07-.99.13-1.49c.13.27.27.55.44.77c.55.72 1.41 1.04 1.59 2c.02.13.05.22.05.33c0 .6-.24 1.24-.68 1.64\\\"/>\"},\"cellphone\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M17 19H7V5h10m0-4H7c-1.11 0-2 .89-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2\\\"/>\"},\"checkbox-marked-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19 19H5V5h10V3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8h-2m-11.09-.92L6.5 11.5L11 16L21 6l-1.41-1.42L11 13.17z\\\"/>\"},\"chevron-down\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z\\\"/>\"},\"chevron-up\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z\\\"/>\"},\"circle-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 20a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2\\\"/>\"},\"close\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z\\\"/>\"},\"desk\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M3 6h18c.55 0 1 .45 1 1s-.45 1-1 1v11h-2v-2h-4v2h-2V8H5v11H3V8c-.55 0-1-.45-1-1s.45-1 1-1m13 4.5v.5h2v-.5c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5m0 4v.5h2v-.5c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5\\\"/>\"},\"door\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M8 3c-1.11 0-2 .89-2 2v16h12V5c0-1.11-.89-2-2-2zm0 2h8v14H8zm5 6v2h2v-2z\\\"/>\"},\"dump-truck\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M20 8h-5v6H2v3h1a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5zM6 18.5A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5m12 0a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5M17 12V9.5h2.5l1.96 2.5zm1-5h-4v6H3L1.57 8H1V6h12l1-1h4z\\\"/>\"},\"floor-plan\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M10 5v5H9V5H5v8h4v-1h1v5H9v-3H5v5h7v-2h1v2h6v-2h2v4H3V3h18v12h-2v-5h-6v5h-1V9h7V5z\\\"/>\"},\"fullscreen\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M5 5h5v2H7v3H5zm9 0h5v5h-2V7h-3zm3 9h2v5h-5v-2h3zm-7 3v2H5v-5h2v3z\\\"/>\"},\"gauge\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8c0 2.4-1 4.5-2.7 6c-1.4-1.3-3.3-2-5.3-2s-3.8.7-5.3 2C5 16.5 4 14.4 4 12a8 8 0 0 1 8-8m2 1.89c-.38.01-.74.26-.9.65l-1.29 3.23l-.1.23c-.71.13-1.3.6-1.57 1.26c-.41 1.03.09 2.19 1.12 2.6s2.19-.09 2.6-1.12c.26-.66.14-1.42-.29-1.98l.1-.26l1.29-3.21l.01-.03c.2-.51-.05-1.09-.56-1.3c-.13-.05-.26-.07-.41-.07M10 6a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M7 9a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m10 0a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1\\\"/>\"},\"graph-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19.5 17c-.14 0-.26 0-.39.04L17.5 13.8c.45-.45.75-1.09.75-1.8a2.5 2.5 0 0 0-2.5-2.5c-.14 0-.25 0-.4.04L13.74 6.3c.47-.46.76-1.09.76-1.8a2.5 2.5 0 0 0-5 0c0 .7.29 1.34.76 1.79L8.65 9.54c-.15-.04-.26-.04-.4-.04a2.5 2.5 0 0 0-2.5 2.5c0 .71.29 1.34.75 1.79l-1.61 3.25C4.76 17 4.64 17 4.5 17a2.5 2.5 0 0 0 0 5A2.5 2.5 0 0 0 7 19.5c0-.7-.29-1.34-.76-1.79l1.62-3.25c.14.04.26.04.39.04s.25 0 .38-.04l1.63 3.25c-.47.45-.76 1.09-.76 1.79a2.5 2.5 0 0 0 5 0A2.5 2.5 0 0 0 12 17c-.13 0-.26 0-.39.04L10 13.8c.45-.45.75-1.09.75-1.8c0-.7-.29-1.33-.75-1.79l1.61-3.25c.13.04.26.04.39.04s.26 0 .39-.04L14 10.21a2.5 2.5 0 0 0 1.75 4.29c.13 0 .25 0 .38-.04l1.63 3.25c-.47.45-.76 1.09-.76 1.79a2.5 2.5 0 0 0 5 0a2.5 2.5 0 0 0-2.5-2.5m-15 3.5c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m8.5-1c0 .55-.45 1-1 1s-1-.45-1-1s.45-1 1-1s1 .45 1 1M7.25 12c0-.55.45-1 1-1s1 .45 1 1s-.45 1-1 1s-1-.45-1-1M11 4.5c0-.55.45-1 1-1s1 .45 1 1s-.45 1-1 1s-1-.45-1-1m3.75 7.5c0-.55.45-1 1-1s1 .45 1 1s-.45 1-1 1s-1-.45-1-1m4.75 8.5c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1\\\"/>\"},\"home\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z\\\"/>\"},\"home-import-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m15 13l-4 4v-3H2v-2h9V9zM5 20v-4h2v2h10v-7.81l-5-4.5L7.21 10H4.22L12 3l10 9h-3v8z\\\"/>\"},\"home-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81zM12 3L2 12h3v8h6v-6h2v6h6v-8h3\\\"/>\"},\"leaf\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8\\\"/>\"},\"light-switch\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M8 6v12h8V6zm6 4h-4V8h4zm5.4-8.4C19 1.2 18.5 1 18 1H6c-.5 0-1 .2-1.4.6S4 2.5 4 3v18c0 .5.2 1 .6 1.4s.9.6 1.4.6h12c.5 0 1-.2 1.4-.6s.6-.9.6-1.4V3c0-.5-.2-1-.6-1.4M18 21H6V3h12z\\\"/>\"},\"lightbulb-group-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M7 19a2.9 2.9 0 0 0 .17 1H6a1 1 0 0 1-1-1v-1h2m3 1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h-4m-6-2a1 1 0 0 0 1 1h2v-2.12A6.92 6.92 0 0 1 5 10a6.8 6.8 0 0 1 .68-3A4 4 0 0 0 4 14.45M17 19a2.9 2.9 0 0 1-.17 1H18a1 1 0 0 0 1-1v-1h-2m0-8a5 5 0 0 1-2 4v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a5 5 0 1 1 8-4m-2 0a3 3 0 1 0-4 2.82V15h2v-2.18A3 3 0 0 0 15 10m3.32-3a6.8 6.8 0 0 1 .68 3a6.92 6.92 0 0 1-2 4.88V17h2a1 1 0 0 0 1-1v-1.55A4 4 0 0 0 18.32 7\\\"/>\"},\"lightbulb-off-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 2C9.76 2 7.78 3.05 6.5 4.68l1.43 1.43C8.84 4.84 10.32 4 12 4a5 5 0 0 1 5 5c0 1.68-.84 3.16-2.11 4.06l1.42 1.44C17.94 13.21 19 11.24 19 9a7 7 0 0 0-7-7M3.28 4L2 5.27L5.04 8.3C5 8.53 5 8.76 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h5.73l4 4L20 20.72zm3.95 6.5l5.5 5.5H10v-2.42a5 5 0 0 1-2.77-3.08M9 20v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1z\\\"/>\"},\"lightbulb-on\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1zm6-10h3v2h-3zM1 11h3v2H1zM13 1v3h-2V1zM4.92 3.5l2.13 2.14l-1.42 1.41L3.5 4.93zm12.03 2.13l2.12-2.13l1.43 1.43l-2.13 2.12z\\\"/>\"},\"lightbulb-on-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M20 11h3v2h-3zM1 11h3v2H1zM13 1v3h-2V1zM4.92 3.5l2.13 2.14l-1.42 1.41L3.5 4.93zm12.03 2.13l2.12-2.13l1.43 1.43l-2.13 2.12zM12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1zm-3-3h2v-2.13c1.73-.44 3-2.01 3-3.87a4 4 0 0 0-4-4a4 4 0 0 0-4 4c0 1.86 1.27 3.43 3 3.87z\\\"/>\"},\"lightbulb-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7M9 21v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1m3-17a5 5 0 0 0-5 5c0 2.05 1.23 3.81 3 4.58V16h4v-2.42c1.77-.77 3-2.53 3-4.58a5 5 0 0 0-5-5\\\"/>\"},\"lightning-bolt\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M11 15H6l7-14v8h5l-7 14z\\\"/>\"},\"map-marker-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7m0 2a5 5 0 0 0-5 5c0 1 0 3 5 9.71C17 12 17 10 17 9a5 5 0 0 0-5-5\\\"/>\"},\"map-marker-radius-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 4c2.2 0 4 1.8 4 4c0 2.1-2.1 5.5-4 7.9c-1.9-2.5-4-5.8-4-7.9c0-2.2 1.8-4 4-4m0-2C8.7 2 6 4.7 6 8c0 4.5 6 11 6 11s6-6.6 6-11c0-3.3-2.7-6-6-6m0 4c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m8 13c0 2.2-3.6 4-8 4s-8-1.8-8-4c0-1.3 1.2-2.4 3.1-3.2l.6.9c-1 .5-1.7 1.1-1.7 1.8c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5c0-.7-.7-1.3-1.8-1.8l.6-.9c2 .8 3.2 1.9 3.2 3.2\\\"/>\"},\"map-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m20.5 3l-.16.03L15 5.1L9 3L3.36 4.9c-.21.07-.36.25-.36.48V20.5a.5.5 0 0 0 .5.5l.16-.03L9 18.9l6 2.1l5.64-1.9c.21-.07.36-.25.36-.48V3.5a.5.5 0 0 0-.5-.5M10 5.47l4 1.4v11.66l-4-1.4zm-5 .99l3-1.01v11.7l-3 1.16zm14 11.08l-3 1.01V6.86l3-1.16z\\\"/>\"},\"moon-waning-crescent\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M2 12a10 10 0 0 0 13 9.54a10 10 0 0 1 0-19.08A10 10 0 0 0 2 12\\\"/>\"},\"motion-sensor\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M10 .2C9 .2 8.2 1 8.2 2S9 3.8 10 3.8S11.8 3 11.8 2S11 .2 10 .2m5.67.8A7.33 7.33 0 0 0 23 8.33V7a6 6 0 0 1-6-6zm2.66 0c0 2.58 2.09 4.67 4.67 4.67V4.33c-1.84 0-3.33-1.49-3.33-3.33zM21 1a2 2 0 0 0 2 2V1zM7.92 4.03c-.17 0-.34.03-.5.08L2 5.8V11h1.8V7.33l2.11-.66L2 22h1.8l2.87-8.11L9 17v5h1.8v-6.41l-2.49-4.54l.73-2.87L10.12 10H15V8.2h-3.62l-2-3.33c-.3-.5-.84-.84-1.46-.84\\\"/>\"},\"motion-sensor-off\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M11.4 8.2H15V10h-1.8zM19.67 1h-1.34c0 2.58 2.09 4.67 4.67 4.67V4.33c-1.84 0-3.33-1.49-3.33-3.33M21 1a2 2 0 0 0 2 2V1zm-4 0h-1.33c0 4.05 3.28 7.33 7.33 7.33V7c-3.31 0-6-2.69-6-6m-7 2.8c1 0 1.8-.8 1.8-1.8S11 .2 10 .2S8.2 1 8.2 2S9 3.8 10 3.8M2.39 1.73L1.11 3l2.35 2.35L2 5.8V11h1.8V7.33l1.25-.39l.63.63L2 22h1.8l2.87-8.11L9 17v5h1.8v-6.41l-2.49-4.54l.19-.68l12.34 12.36l1.27-1.27zm6.99 3.14c-.3-.5-.84-.84-1.46-.84c-.17 0-.34.03-.5.08l-.08.03l4.01 4.01z\\\"/>\"},\"package-variant-closed\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.99.99 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88zM12 4.15l-1.89 1.07L16 8.61l1.96-1.11zM6.04 7.5L12 10.85l1.96-1.1l-5.88-3.4zM5 15.91l6 3.38v-6.71L5 9.21zm14 0v-6.7l-6 3.37v6.71z\\\"/>\"},\"pause\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M14 19h4V5h-4M6 19h4V5H6z\\\"/>\"},\"play\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M8 5.14v14l11-7z\\\"/>\"},\"plus\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z\\\"/>\"},\"power\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m16.56 5.44l-1.45 1.45A5.97 5.97 0 0 1 18 12a6 6 0 0 1-6 6a6 6 0 0 1-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 5.44A7.96 7.96 0 0 0 4 12a8 8 0 0 0 8 8a8 8 0 0 0 8-8c0-2.72-1.36-5.12-3.44-6.56M13 3h-2v10h2\\\"/>\"},\"power-plug-off-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M22.11 21.46L2.39 1.73L1.11 3l5.14 5.14C6.1 8.41 6 8.7 6 9v5.5L9.5 18v3h5v-3l.81-.8l5.53 5.53zm-9.02-4.87l-.42.41h-1.34l-.41-.41L8 13.67V9.89l5.89 5.89zM12.2 9l-2-2H14V3h2v4c1 0 2 1 2 2v5.5l-.15.15L16 12.8V9.09c0-.03-.05-.09-.08-.09zM10 6.8l-2-2V3h2z\\\"/>\"},\"power-plug-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M16 7V3h-2v4h-4V3H8v4C7 7 6 8 6 9v5.5L9.5 18v3h5v-3l3.5-3.5V9c0-1-1-2-2-2m0 6.67l-2.91 2.92l-.42.41h-1.34l-.41-.41L8 13.67V9.09c0-.03.06-.09.09-.09h7.83c.03 0 .08.06.08.09z\\\"/>\"},\"power-socket-de\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M4.22 2A2.22 2.22 0 0 0 2 4.22v15.56C2 21 3 22 4.22 22h15.56A2.22 2.22 0 0 0 22 19.78V4.22C22 3 21 2 19.78 2zM11 4.07V6h2V4.07A8 8 0 0 1 20 12a8 8 0 0 1-7 7.93V18h-2v1.93A8 8 0 0 1 4 12a8 8 0 0 1 7-7.93M7.5 10.5A1.5 1.5 0 0 0 6 12c0 .83.66 1.5 1.5 1.5A1.5 1.5 0 0 0 9 12a1.5 1.5 0 0 0-1.5-1.5m9 0A1.5 1.5 0 0 0 15 12a1.5 1.5 0 0 0 1.5 1.5A1.5 1.5 0 0 0 18 12a1.5 1.5 0 0 0-1.5-1.5\\\"/>\"},\"radar\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m19.07 4.93l-1.41 1.41A8 8 0 0 1 20 12a8 8 0 0 1-8 8a8 8 0 0 1-8-8c0-4.08 3.05-7.44 7-7.93v2.02C8.16 6.57 6 9.03 6 12a6 6 0 0 0 6 6a6 6 0 0 0 6-6c0-1.66-.67-3.16-1.76-4.24l-1.41 1.41C15.55 9.9 16 10.9 16 12a4 4 0 0 1-4 4a4 4 0 0 1-4-4c0-1.86 1.28-3.41 3-3.86v2.14c-.6.35-1 .98-1 1.72a2 2 0 0 0 2 2a2 2 0 0 0 2-2c0-.74-.4-1.38-1-1.72V2h-1A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-2.76-1.12-5.26-2.93-7.07\\\"/>\"},\"recycle\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m21.82 15.42l-2.5 4.33c-.49.86-1.4 1.31-2.32 1.25h-2v2l-2.5-4.5L15 14v2h2.82l-2.22-3.85l4.33-2.5l1.8 3.12c.52.77.59 1.8.09 2.65M9.21 3.06h5c.98 0 1.83.57 2.24 1.39l1 1.74l1.73-1l-2.64 4.41l-5.15.09l1.73-1l-1.41-2.45l-2.21 3.85l-4.34-2.5l1.8-3.12c.41-.83 1.26-1.41 2.25-1.41m-4.16 16.7l-2.5-4.33c-.49-.85-.42-1.87.09-2.64l1-1.73l-1.73-1l5.14.08l2.65 4.42l-1.73-1L6.56 16H11v5H7.4a2.51 2.51 0 0 1-2.35-1.24\\\"/>\"},\"remote\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 0C8.96 0 6.21 1.23 4.22 3.22l1.41 1.41A8.95 8.95 0 0 1 12 2c2.5 0 4.74 1 6.36 2.64l1.41-1.41C17.79 1.23 15.04 0 12 0M7.05 6.05l1.41 1.41a5.02 5.02 0 0 1 7.08 0l1.41-1.41A6.98 6.98 0 0 0 12 4c-1.93 0-3.68.78-4.95 2.05M12 15a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m3-6H9a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1\\\"/>\"},\"restore-alert\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M13 3c-5 0-9 4-9 9H1l3.9 3.9l.1.1l4-4H6c0-3.9 3.1-7 7-7s7 3.1 7 7s-3.1 7-7 7c-1.9 0-3.7-.8-4.9-2.1l-1.4 1.4C8.3 20 10.5 21 13 21c5 0 9-4 9-9s-4-9-9-9m-1 12h2v2h-2zm0-8h2v6h-2z\\\"/>\"},\"robot-vacuum\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 2c2.65 0 5.19 1.06 7.07 2.93l-1.42 1.42A8 8 0 0 0 12 4c-2.12 0-4.16.84-5.65 2.35L4.93 4.93C6.81 3.06 9.35 2 12 2M3.66 6.5l1.45 1.44A8.04 8.04 0 0 0 4 12a8 8 0 0 0 8 8a8 8 0 0 0 8-8c0-1.43-.39-2.83-1.12-4.06l1.46-1.44A9.93 9.93 0 0 1 22 12a10 10 0 0 1-10 10A10 10 0 0 1 2 12c0-1.96.58-3.88 1.66-5.5M12 6a6 6 0 0 1 6 6c0 1.59-.63 3.12-1.76 4.24l-1.41-1.41a4.004 4.004 0 0 1-5.66 0l-1.41 1.41A5.97 5.97 0 0 1 6 12a6 6 0 0 1 6-6m0 2a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1\\\"/>\"},\"satellite-variant\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m11.62 1l5.66 5.67l-2.12 2.12l-2.12-2.12l-1.42 1.42l2.33 2.32l-1.16 1.17l.45.46a2.5 2.5 0 0 1 2.83.5l-3.53 3.53a2.5 2.5 0 0 1-.5-2.83l-.46-.45l-1.17 1.16l-2.32-2.33l-1.42 1.42l2.12 2.12l-2.12 2.12L1 11.62L3.14 9.5l2.12 2.12l1.41-1.41l-2.83-2.83c-.78-.78-.78-2.05 0-2.83l.71-.71c.78-.78 2.05-.78 2.83 0l2.83 2.83l1.41-1.41L9.5 3.14zM18 14a4 4 0 0 1-4 4v-2a2 2 0 0 0 2-2zm4 0a8 8 0 0 1-8 8v-2a6 6 0 0 0 6-6z\\\"/>\"},\"shield-check-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M21 11c0 5.55-3.84 10.74-9 12c-5.16-1.26-9-6.45-9-12V5l9-4l9 4zm-9 10c3.75-1 7-5.46 7-9.78V6.3l-7-3.12L5 6.3v4.92C5 15.54 8.25 20 12 21m-2-4l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9\\\"/>\"},\"skip-next\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M16 18h2V6h-2M6 18l8.5-6L6 6z\\\"/>\"},\"skip-previous\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M6 18V6h2v12zm3.5-6L18 6v12z\\\"/>\"},\"sofa-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M21 9V7c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78c-.53-.48-1.23-.78-2-.78H6C4.35 4 3 5.35 3 7v2c-1.65 0-3 1.35-3 3v5c0 1.65 1.35 3 3 3v2h2v-2h14v2h2v-2c1.65 0 3-1.35 3-3v-5c0-1.65-1.35-3-3-3m-7-3h4c.55 0 1 .45 1 1v2.78c-.61.55-1 1.34-1 2.22v2h-5V7c0-.55.45-1 1-1M5 7c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v7H6v-2c0-.88-.39-1.67-1-2.22zm17 10c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v4h16v-4c0-.55.45-1 1-1s1 .45 1 1z\\\"/>\"},\"tablet\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19 18H5V6h14m2-2H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2\\\"/>\"},\"tablet-dashboard\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19 18H5V6h14m2-2H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M7 8h6v5H7zm7 0h3v2h-3zm3 3v5h-3v-5zM7 14h6v2H7z\\\"/>\"},\"television\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M21 17H3V5h18m0-2H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2\\\"/>\"},\"television-classic\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M8.16 3L6.75 4.41L9.34 7H4c-1.11 0-2 .89-2 2v10c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V9c0-1.11-.89-2-2-2h-5.34l2.59-2.59L15.84 3L12 6.84zM4 9h13v10H4zm15.5 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m0 3a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1\\\"/>\"},\"thermometer\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-9a1 1 0 0 1 1 1v3h-2V5a1 1 0 0 1 1-1\\\"/>\"},\"toggle-switch-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M17 6H7c-3.31 0-6 2.69-6 6s2.69 6 6 6h10c3.31 0 6-2.69 6-6s-2.69-6-6-6m0 10H7c-2.21 0-4-1.79-4-4s1.79-4 4-4h10c2.21 0 4 1.79 4 4s-1.79 4-4 4m0-7c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3\\\"/>\"},\"trash-can-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zM7 6h10v13H7zm2 2v9h2V8zm4 0v9h2V8z\\\"/>\"},\"truck\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M18 18.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5z\\\"/>\"},\"truck-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5s.67 1.5 1.5 1.5m1.5-9H17V12h4.46zM6 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5s.67 1.5 1.5 1.5M20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H9c0 1.66-1.34 3-3 3s-3-1.34-3-3H1V6c0-1.11.89-2 2-2h14v4zM3 6v9h.76c.55-.61 1.35-1 2.24-1s1.69.39 2.24 1H15V6z\\\"/>\"},\"tune-variant\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M8 13c-1.86 0-3.41 1.28-3.86 3H2v2h2.14c.45 1.72 2 3 3.86 3s3.41-1.28 3.86-3H22v-2H11.86c-.45-1.72-2-3-3.86-3m0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2M19.86 6c-.45-1.72-2-3-3.86-3s-3.41 1.28-3.86 3H2v2h10.14c.45 1.72 2 3 3.86 3s3.41-1.28 3.86-3H22V6zM16 9c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2\\\"/>\"},\"usb-port\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M8 2c-1.1 0-2 .9-2 2v8H5v4l4 4v2h6v-2l4-4v-4h-1V4a2 2 0 0 0-2-2M8 4h8v8H8m1-5v2h2V7m2 0v2h2V7Z\\\"/>\"},\"view-dashboard-outline\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M19 5v2h-4V5zM9 5v6H5V5zm10 8v6h-4v-6zM9 17v2H5v-2zM21 3h-8v6h8zM11 3H3v10h8zm10 8h-8v10h8zm-10 4H3v6h8z\\\"/>\"},\"volume-high\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77s-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9z\\\"/>\"},\"volume-minus\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M3 9h4l5-5v16l-5-5H3zm11 2h8v2h-8z\\\"/>\"},\"volume-off\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 4L9.91 6.09L12 8.18M4.27 3L3 4.27L7.73 9H3v6h4l5 5v-6.73l4.25 4.26c-.67.51-1.42.93-2.25 1.17v2.07c1.38-.32 2.63-.95 3.68-1.81L19.73 21L21 19.73l-9-9M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.9 8.9 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71m-2.5 0c0-1.77-1-3.29-2.5-4.03v2.21l2.45 2.45c.05-.2.05-.42.05-.63\\\"/>\"},\"volume-plus\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M3 9h4l5-5v16l-5-5H3zm11 2h3V8h2v3h3v2h-3v3h-2v-3h-3z\\\"/>\"},\"warehouse\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M6 19h2v2H6zm6-16L2 8v13h2v-8h16v8h2V8zm-4 8H4V9h4zm6 0h-4V9h4zm6 0h-4V9h4zM6 15h2v2H6zm4 0h2v2h-2zm0 4h2v2h-2zm4 0h2v2h-2z\\\"/>\"},\"watch\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M6 12a6 6 0 0 1 6-6a6 6 0 0 1 6 6a6 6 0 0 1-6 6a6 6 0 0 1-6-6m14 0a7.94 7.94 0 0 0-3.05-6.27L16 0H8l-.95 5.73A7.94 7.94 0 0 0 4 12c0 2.54 1.19 4.81 3.05 6.27L8 24h8l.95-5.73A7.96 7.96 0 0 0 20 12\\\"/>\"},\"water\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 20a6 6 0 0 1-6-6c0-4 6-10.75 6-10.75S18 10 18 14a6 6 0 0 1-6 6\\\"/>\"},\"water-percent\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12 3.25S6 10 6 14c0 3.32 2.69 6 6 6a6 6 0 0 0 6-6c0-4-6-10.75-6-10.75m2.47 6.72l1.06 1.06l-6 6l-1.06-1.06M9.75 10A1.25 1.25 0 0 1 11 11.25a1.25 1.25 0 0 1-1.25 1.25a1.25 1.25 0 0 1-1.25-1.25A1.25 1.25 0 0 1 9.75 10m4.5 4.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 14.25 17A1.25 1.25 0 0 1 13 15.75a1.25 1.25 0 0 1 1.25-1.25\\\"/>\"},\"waves\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M20 12h2v2h-2c-1.38 0-2.74-.35-4-1c-2.5 1.3-5.5 1.3-8 0c-1.26.65-2.63 1-4 1H2v-2h2c1.39 0 2.78-.47 4-1.33c2.44 1.71 5.56 1.71 8 0c1.22.86 2.61 1.33 4 1.33m0-6h2v2h-2c-1.38 0-2.74-.35-4-1c-2.5 1.3-5.5 1.3-8 0c-1.26.65-2.63 1-4 1H2V6h2c1.39 0 2.78-.47 4-1.33c2.44 1.71 5.56 1.71 8 0C17.22 5.53 18.61 6 20 6m0 12h2v2h-2c-1.38 0-2.74-.35-4-1c-2.5 1.3-5.5 1.3-8 0c-1.26.65-2.63 1-4 1H2v-2h2c1.39 0 2.78-.47 4-1.33c2.44 1.71 5.56 1.71 8 0c1.22.86 2.61 1.33 4 1.33\\\"/>\"},\"waves-arrow-up\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M20 14h2v2h-2c-1.38 0-2.74-.35-4-1c-2.5 1.3-5.5 1.3-8 0c-1.26.65-2.63 1-4 1H2v-2h2c1.39 0 2.78-.47 4-1.33c2.44 1.71 5.56 1.71 8 0c1.22.86 2.61 1.33 4 1.33m0 6h2v2h-2c-1.38 0-2.74-.35-4-1c-2.5 1.3-5.5 1.3-8 0c-1.26.65-2.63 1-4 1H2v-2h2c1.39 0 2.78-.47 4-1.33c2.44 1.71 5.56 1.71 8 0c1.22.86 2.61 1.33 4 1.33M7 2L3 6h3v5h2V6h3m6-4l-4 4h3v5h2V6h3\\\"/>\"},\"weather-cloudy\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M6 19a5 5 0 0 1-5-5a5 5 0 0 1 5-5c1-2.35 3.3-4 6-4c3.43 0 6.24 2.66 6.5 6.03L19 11a4 4 0 0 1 4 4a4 4 0 0 1-4 4zm13-6h-2v-1a5 5 0 0 0-5-5c-2.5 0-4.55 1.82-4.94 4.19C6.73 11.07 6.37 11 6 11a3 3 0 0 0-3 3a3 3 0 0 0 3 3h13a2 2 0 0 0 2-2a2 2 0 0 0-2-2\\\"/>\"},\"weather-night\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m17.75 4.09l-2.53 1.94l.91 3.06l-2.63-1.81l-2.63 1.81l.91-3.06l-2.53-1.94L12.44 4l1.06-3l1.06 3zm3.5 6.91l-1.64 1.25l.59 1.98l-1.7-1.17l-1.7 1.17l.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95zm-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85c-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14c.4-.4.82-.76 1.27-1.08c.75-.53 1.93.36 1.85 1.19c-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82c-2.81 3.14-2.7 7.96.31 10.98c3.02 3.01 7.84 3.12 10.98.31\\\"/>\"},\"weather-night-partly-cloudy\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M22 10.28c-.26.02-.5.03-.74.03c-1.94 0-3.87-.74-5.35-2.22A7.52 7.52 0 0 1 13.72 2c.05-.47-.5-1-1.01-1a.7.7 0 0 0-.39.12c-.32.24-.66.52-.96.82c-2.31 2.3-2.81 5.72-1.52 8.52a5.48 5.48 0 0 0-3.15 3.6L6 14a4 4 0 0 0-4 4a4 4 0 0 0 4 4h13a3 3 0 0 0 3-3a3 3 0 0 0-3-3c-.58 0-1.12.16-1.58.45l.08-.95c0-.22 0-.45-.04-.67a7.45 7.45 0 0 0 4.6-2.19c.32-.3.58-.64.82-.96c.39-.55-.23-1.4-.84-1.4M19 18a1 1 0 0 1 1 1a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2.5v-.5c0-1.56 1.03-2.86 2.44-3.32c.16-.05.32-.09.49-.12c.18-.03.37-.06.57-.06c.23 0 .45.03.66.07q.105.015.21.06c.13.03.28.07.41.12c.08.03.16.07.22.11c.13.05.24.11.34.18c.08.05.16.1.23.16c.1.07.18.14.27.22c.07.08.16.13.21.2c.08.08.14.17.21.25c.06.08.13.16.18.25c.06.09.1.18.15.28s.11.18.15.28c.17.41.26.85.26 1.32V18m1.33-5.14A5.51 5.51 0 0 0 12 10h-.13c-.46-.81-.73-1.74-.73-2.71c0-.98.25-1.92.72-2.74A9.4 9.4 0 0 0 14.5 9.5a9.35 9.35 0 0 0 4.95 2.64c-.79.46-1.69.7-2.62.72\\\"/>\"},\"weather-partly-cloudy\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M12.74 5.47c2.36 1.03 3.61 3.56 3.18 5.99A6 6 0 0 1 18 16v.17a3 3 0 0 1 1-.17a3 3 0 0 1 3 3a3 3 0 0 1-3 3H6a4 4 0 0 1-4-4a4 4 0 0 1 4-4h.27C5 12.45 4.6 10.24 5.5 8.26a5.49 5.49 0 0 1 7.24-2.79m-.81 1.83c-1.77-.8-3.84.01-4.62 1.77c-.46 1.02-.38 2.15.1 3.06A5.99 5.99 0 0 1 12 10c.7 0 1.38.12 2 .34a3.51 3.51 0 0 0-2.07-3.04m1.62-3.66c-.55-.24-1.1-.41-1.67-.52l2.49-1.3l.9 2.89a7.7 7.7 0 0 0-1.72-1.07m-7.46.8c-.49.35-.92.75-1.29 1.19l.11-2.81l2.96.68c-.62.21-1.22.53-1.78.94M18 9.71c-.09-.59-.22-1.16-.41-1.71l2.38 1.5l-2.05 2.23c.11-.65.13-1.33.08-2.02M3.04 11.3c.07.6.2 1.17.39 1.7l-2.37-1.5L3.1 9.28c-.1.65-.13 1.33-.06 2.02M19 18h-3v-2a4 4 0 0 0-4-4a4 4 0 0 0-4 4H6a2 2 0 0 0-2 2a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1a1 1 0 0 0-1-1\\\"/>\"},\"weather-sunset\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M3 12h4a5 5 0 0 1 5-5a5 5 0 0 1 5 5h4a1 1 0 0 1 1 1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1a1 1 0 0 1 1-1m2 4h14a1 1 0 0 1 1 1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1a1 1 0 0 1 1-1m12 4a1 1 0 0 1 1 1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1a1 1 0 0 1 1-1zm-2-8a3 3 0 0 0-3-3a3 3 0 0 0-3 3zM12 2l2.39 3.42C13.65 5.15 12.84 5 12 5s-1.65.15-2.39.42zM3.34 7l4.16-.35A7.2 7.2 0 0 0 5.94 8.5c-.44.74-.69 1.5-.83 2.29zm17.31 0l-1.77 3.79a7.02 7.02 0 0 0-2.38-4.15z\\\"/>\"},\"weather-sunset-down\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M3 12h4a5 5 0 0 1 5-5a5 5 0 0 1 5 5h4a1 1 0 0 1 1 1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1a1 1 0 0 1 1-1m12 0a3 3 0 0 0-3-3a3 3 0 0 0-3 3zM12 2l2.39 3.42C13.65 5.15 12.84 5 12 5s-1.65.15-2.39.42zM3.34 7l4.16-.35A7.2 7.2 0 0 0 5.94 8.5c-.44.74-.69 1.5-.83 2.29zm17.31 0l-1.77 3.79a7.02 7.02 0 0 0-2.38-4.15zm-7.94 13.71l3.11-3.11c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0L12 18.59l-2.41-2.41a.996.996 0 0 0-1.41 0c-.39.39-.39 1.03 0 1.42l3.11 3.11c.21.19.45.29.71.29s.5-.1.71-.29\\\"/>\"},\"weather-sunset-up\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M3 12h4a5 5 0 0 1 5-5a5 5 0 0 1 5 5h4a1 1 0 0 1 1 1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1a1 1 0 0 1 1-1m12 0a3 3 0 0 0-3-3a3 3 0 0 0-3 3zM12 2l2.39 3.42C13.65 5.15 12.84 5 12 5s-1.65.15-2.39.42zM3.34 7l4.16-.35A7.2 7.2 0 0 0 5.94 8.5c-.44.74-.69 1.5-.83 2.29zm17.31 0l-1.77 3.79a7.02 7.02 0 0 0-2.38-4.15zm-7.94 9.3l3.11 3.11a.996.996 0 1 1-1.41 1.41L12 18.41l-2.41 2.41a.996.996 0 1 1-1.41-1.41l3.11-3.11c.21-.2.45-.3.71-.3s.5.1.71.3\\\"/>\"},\"weather-windy\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"M4 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1h8a2 2 0 0 0 2-2a2 2 0 0 0-2-2c-.55 0-1.05.22-1.41.59a.973.973 0 0 1-1.42 0c-.39-.39-.39-1.03 0-1.42C9.9 2.45 10.9 2 12 2a4 4 0 0 1 4 4a4 4 0 0 1-4 4zm15 2a1 1 0 0 0 1-1a1 1 0 0 0-1-1c-.28 0-.53.11-.71.29a.996.996 0 0 1-1.41 0c-.38-.39-.38-1.02 0-1.41C17.42 8.34 18.17 8 19 8a3 3 0 0 1 3 3a3 3 0 0 1-3 3H5a1 1 0 0 1-1-1a1 1 0 0 1 1-1zm-1 6H4a1 1 0 0 1-1-1a1 1 0 0 1 1-1h14a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-.83 0-1.58-.34-2.12-.88c-.38-.39-.38-1.02 0-1.41a.996.996 0 0 1 1.41 0c.18.18.43.29.71.29a1 1 0 0 0 1-1a1 1 0 0 0-1-1\\\"/>\"},\"white-balance-sunny\":{\"body\":\"<path fill=\\\"currentColor\\\" d=\\\"m3.55 19.09l1.41 1.41l1.8-1.79l-1.42-1.42M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6c0-3.32-2.69-6-6-6m8 7h3v-2h-3m-2.76 7.71l1.8 1.79l1.41-1.41l-1.79-1.8M20.45 5l-1.41-1.4l-1.8 1.79l1.42 1.42M13 1h-2v3h2M6.76 5.39L4.96 3.6L3.55 5l1.79 1.81zM1 13h3v-2H1m12 9h-2v3h2\\\"/>\"}}"),
	aliases: {},
	width: 24,
	height: 24
}, Tt = ":host{height:calc(100vh - var(--header-height,56px));--ink:#f2f7f4;--ink-2:#f2f7f4b8;--ink-3:#f2f7f480;--glass:#ffffff13;--glass-strong:#ffffff21;--line:#ffffff24;--line-2:#ffffff14;--accent:#5eead4;--accent-2:#a78bfa;--ok:#4ade80;--warn:#fbbf24;--bad:#f87171;--radius:22px;--font:\"SF Pro Display\", \"Inter\", \"Segoe UI Variable\", \"Segoe UI\", system-ui, -apple-system, Roboto, sans-serif;min-height:560px;display:block;position:relative}*{box-sizing:border-box}.host{font-family:var(--font);color:var(--ink);-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;background:#0b1412;border-radius:0;position:absolute;inset:0;overflow:hidden}.loading{color:#5eead4;letter-spacing:.3em;place-items:center;height:100%;display:grid}a{color:inherit}button{font:inherit;color:inherit}input{font:inherit}.shell{background:#0b1412;display:flex;position:absolute;inset:0}.shell:fullscreen{width:100vw;height:100vh}.scene{z-index:0;pointer-events:none;position:absolute;inset:0;overflow:hidden}.scene svg{display:block}.rail{z-index:3;flex-direction:column;flex:0 0 78px;align-items:center;gap:10px;width:78px;padding:22px 0 18px;display:flex;position:relative}.rail .spacer{flex:1}.rail-btn{cursor:pointer;width:50px;height:50px;color:var(--ink-2);background:0 0;border:1px solid #0000;border-radius:50%;place-items:center;transition:all .25s;display:grid}.rail-btn:hover{color:var(--ink);background:#ffffff0f}.rail-btn.active{color:var(--ink);background:linear-gradient(#ffffff47,#ffffff14);border-color:#ffffff59;transform:scale(1.08);box-shadow:0 8px 22px #00000059,inset 0 1px #fff6}.rail-dot{background:var(--ok);width:6px;height:6px;box-shadow:0 0 10px var(--ok);border-radius:50%}.rail-dot.off{background:var(--bad);box-shadow:0 0 10px var(--bad)}.stage{z-index:2;scrollbar-width:thin;scrollbar-color:#fff3 transparent;flex:1;min-width:0;padding:22px 26px 160px 6px;position:relative;overflow:hidden auto}.frame{-webkit-backdrop-filter:blur(16px)saturate(130%);background:linear-gradient(#ffffff0f,#ffffff05);border:1px solid #ffffff29;border-radius:34px;overflow:hidden;box-shadow:0 30px 80px #00000059,inset 0 1px #ffffff1f}.card{background:var(--glass);border:1px solid var(--line-2);border-radius:var(--radius);-webkit-backdrop-filter:blur(18px)saturate(140%);min-width:0;padding:20px 22px;position:relative;overflow:hidden;box-shadow:inset 0 1px #ffffff14}.card.flat{border:0;border-right:1px solid var(--line-2);border-bottom:1px solid var(--line-2);box-shadow:none;border-radius:0}.card.click{cursor:pointer;transition:background .2s}.card.click:hover{background:var(--glass-strong)}.card h2{letter-spacing:-.01em;margin:0;font-size:26px;font-weight:600;line-height:1.12}.card h3{margin:0;font-size:19px;font-weight:600}.card .eyebrow{letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3);font-size:11px;font-weight:600}.card .sub{color:var(--ink-2);font-size:13.5px}.card .corner{color:var(--ink-3);position:absolute;top:18px;right:18px}.row{align-items:center;gap:10px;display:flex}.between{justify-content:space-between;align-items:center;gap:10px;display:flex}.col{flex-direction:column;gap:12px;display:flex}.muted{color:var(--ink-3)}.mono{font-variant-numeric:tabular-nums}.board{grid-template-columns:1.05fr 1fr 1fr 1fr 1.1fr;display:grid}.board>.stack{border-right:1px solid var(--line-2);flex-direction:column;min-width:0;display:flex}.board>.stack:last-child{border-right:0}.board>.stack>.card{border:0;border-bottom:1px solid var(--line-2);box-shadow:none;background:#ffffff0b;border-radius:0}.board>.stack>.card:last-child{border-bottom:0;flex:1}.board .wide{border-top:1px solid var(--line-2);grid-column:2/5}.grid-auto{grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px;display:grid}.section{padding:22px}.section-title{align-items:center;gap:12px;margin:0 0 16px;font-size:22px;font-weight:600;display:flex}.icon-chip{border:1px solid var(--line);background:#ffffff1a;border-radius:12px;place-items:center;width:38px;height:38px;display:grid}.slider{cursor:pointer;touch-action:none;align-items:center;height:26px;display:flex;position:relative}.slider .track{background:#ffffff1f;border-radius:99px;height:8px;position:absolute;left:0;right:0;overflow:hidden}.slider .fill{border-radius:99px;position:absolute;top:0;bottom:0;left:0}.slider .knob{background:#fff;border-radius:50%;width:24px;height:24px;margin-left:-12px;transition:transform .15s;position:absolute;box-shadow:0 2px 10px #0006}.slider:active .knob{transform:scale(1.15)}.label-row{color:var(--ink-2);justify-content:space-between;margin-bottom:6px;font-size:13px;display:flex}.swatches{flex-wrap:wrap;gap:6px;margin-top:14px;display:flex}.swatch{cursor:pointer;border:2px solid #ffffff40;border-radius:50%;width:23px;height:23px;transition:transform .15s;box-shadow:inset 0 -3px 6px #00000040,0 2px 6px #0000004d}.swatch:hover{transform:scale(1.12)}.swatch.sel{border-color:#fff;box-shadow:0 0 0 3px #ffffff40,0 0 14px}.toggle{cursor:pointer;border:1px solid var(--line);background:#ffffff24;border-radius:99px;flex:none;width:52px;height:30px;transition:background .25s;position:relative}.toggle:after{content:\"\";background:#e8efec;border-radius:50%;width:22px;height:22px;transition:transform .25s;position:absolute;top:3px;left:3px;box-shadow:0 2px 6px #00000059}.toggle.on{background:var(--accent)}.toggle.on:after{background:#fff;transform:translate(22px)}.toggle.na{opacity:.35;cursor:not-allowed}.seg{border:1px solid var(--line-2);background:#00000040;border-radius:14px;gap:4px;padding:4px;display:flex}.seg button{cursor:pointer;color:var(--ink-2);white-space:nowrap;background:0 0;border:0;border-radius:10px;flex:1;padding:8px 6px;font-size:13px}.seg button.sel{color:var(--ink);background:#ffffff2e;box-shadow:inset 0 1px #fff3}.seg button.sel.blue{color:#fff;background:#3b82f6}.btn{border:1px solid var(--line);cursor:pointer;color:var(--ink);background:#ffffff14;border-radius:12px;justify-content:center;align-items:center;gap:6px;padding:9px 12px;font-size:13px;display:inline-flex}.btn:hover{background:#ffffff29}.btn.round{border-radius:50%;width:44px;height:44px;padding:0}.btn.big{color:#111;background:#fff;border:0;border-radius:50%;width:76px;height:76px}.btn.primary{color:#fff;background:linear-gradient(135deg,#a855f7,#ec4899);border:0}.chip{border:1px solid var(--line);white-space:nowrap;background:#ffffff1a;border-radius:99px;align-items:center;gap:6px;padding:4px 10px;font-size:12px;display:inline-flex}.chip.ok{color:#bbf7d0;background:#4ade8026;border-color:#4ade8059}.chip.warn{color:#fde68a;background:#fbbf2426;border-color:#fbbf2459}.chip.bad{color:#fecaca;background:#f8717126;border-color:#f8717159}.list-row{border:1px solid var(--line-2);background:#ffffff0d;border-radius:14px;align-items:center;gap:12px;padding:10px 12px;display:flex}.list-row+.list-row{margin-top:8px}.list-row.hl{border-color:var(--line);background:#ffffff1f}.bar{background:#ffffff1f;border-radius:99px;height:8px;overflow:hidden}.bar>i{border-radius:99px;height:100%;display:block}.illus{filter:drop-shadow(0 18px 18px #00000059);margin:8px auto 0;display:block}.illus.tap{cursor:pointer;transition:transform .2s}.illus.tap:hover{transform:translateY(-2px)scale(1.02)}.fade-in{animation:.45s both fadeIn}@keyframes fadeIn{0%{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes rain{0%{transform:translateY(-120px)}to{transform:translateY(110vh)}}@keyframes fall{0%{transform:translateY(-10vh)rotate(0)}50%{transform:translate(40px,50vh)rotate(200deg)}to{transform:translate(-20px,110vh)rotate(400deg)}}@keyframes float{0%,to{opacity:.2;transform:translate(0)}50%{opacity:1;transform:translate(30px,-40px)}}@keyframes twinkle{0%,to{opacity:.25}50%{opacity:1}}@keyframes flame{0%,to{transform:scaleY(1)translateY(0)}50%{transform:scaleY(1.15)translateY(-3px)}}@keyframes sway{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes wave{0%{transform:translate(0)}to{transform:translate(-50%)}}@keyframes dash{to{stroke-dashoffset:-200px}}@keyframes pulse{0%,to{opacity:.9;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}@keyframes drive{0%{transform:translate(-8px)}50%{transform:translate(8px)}to{transform:translate(-8px)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes cloud{0%{transform:translate(-20%)}to{transform:translate(120%)}}@media (prefers-reduced-motion:reduce){.scene *{animation:none!important}}.span2{grid-column:span 2}.house-grid{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:start;gap:18px;display:grid}.ha-card-host{--ha-card-background:transparent;--card-background-color:#0a121899;--ha-card-border-radius:0 0 22px 22px;--ha-card-border-width:0;--ha-card-box-shadow:none;--primary-text-color:#f2f7f4;--secondary-text-color:#f2f7f4b3;border-radius:0 0 22px 22px;overflow:hidden}@media (width<=1500px){.home-board>*{grid-area:auto!important}.board{grid-template-columns:1fr 1fr 1fr}.board .wide{grid-column:1/-1}.board>.stack{border-bottom:1px solid var(--line-2)}}@media (width<=1200px){.week-top{grid-template-columns:1fr!important}.house-grid{grid-template-columns:1fr}}@media (width<=900px){.span2{grid-column:auto}.rail{flex-basis:58px;width:58px}.rail-btn{width:42px;height:42px}.stage{padding:12px 10px 140px 0}.board{grid-template-columns:1fr}.frame{border-radius:24px}}", Et = null, Dt = /* @__PURE__ */ new Set();
function Ot(e) {
	Et = e, Dt.forEach((e) => e());
}
var kt = () => Et, At = (e) => (Dt.add(e), () => {
	Dt.delete(e);
});
function jt(e) {
	return (0, l.useSyncExternalStore)(At, () => e(Et));
}
var Mt = (e) => jt((t) => e ? t?.states[e] : void 0), Nt = {}, D = () => jt((e) => e?.states ?? Nt), Pt = () => jt((e) => e?.connected !== !1), Ft = {}, It = () => ({
	entities: jt((e) => e?.entities ?? Ft),
	devices: jt((e) => e?.devices ?? Ft),
	areas: jt((e) => e?.areas ?? Ft)
});
async function O(e, t, n = {}, r) {
	if (Et) try {
		await Et.callService(e, t, n, r ? { entity_id: r } : void 0);
	} catch (n) {
		console.warn("[Nexus] Dienstaufruf fehlgeschlagen", e, t, n);
	}
}
function Lt(e, t = "daily") {
	let [n, r] = (0, l.useState)([]), i = jt((e) => !!e);
	return (0, l.useEffect)(() => {
		if (!e || !Et) return;
		let n, i = !0;
		return Et.connection.subscribeMessage((e) => i && r(e.forecast ?? []), {
			type: "weather/subscribe_forecast",
			forecast_type: t,
			entity_id: e
		}).then((e) => {
			i ? n = e : e();
		}).catch(() => r([])), () => {
			i = !1, n?.();
		};
	}, [
		e,
		t,
		i
	]), n;
}
var k = (e) => !!e && (e.state === "on" || e.state === "playing" || e.state === "cleaning"), A = (e) => !e || e.state === "unavailable" || e.state === "unknown", Rt = (e, t) => e?.attributes.friendly_name || t, zt = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}, Bt = [
	"#60a5fa",
	"#f87171",
	"#4ade80",
	"#fbbf24",
	"#a78bfa",
	"#f472b6"
];
function Vt(e, t = 14) {
	let [n, r] = (0, l.useState)([]), i = jt((e) => !!e), a = e.map((e) => e.entity).join(",");
	return (0, l.useEffect)(() => {
		if (!i || !e.length) return;
		let n = !0, a = async () => {
			let i = /* @__PURE__ */ new Date();
			i.setHours(0, 0, 0, 0);
			let a = new Date(i.getTime() + t * 864e5), o = `start=${encodeURIComponent(i.toISOString())}&end=${encodeURIComponent(a.toISOString())}`, s = [];
			await Promise.all(e.map(async (e, t) => {
				let n = [];
				try {
					n = await Et.callApi("GET", `calendars/${e.entity}?${o}`) ?? [];
				} catch {
					n = [];
				}
				n.forEach((n) => {
					let r = !!n.start.date;
					s.push({
						summary: n.summary,
						allDay: r,
						start: r ? zt(n.start.date) : new Date(n.start.dateTime),
						end: r ? zt(n.end.date) : new Date(n.end.dateTime ?? n.start.dateTime),
						calendar: e.label,
						color: e.color ?? Bt[t % Bt.length]
					});
				});
			})), s.sort((e, t) => e.start.getTime() - t.start.getTime()), n && r(s);
		};
		a();
		let o = setInterval(a, 6e5);
		return () => {
			n = !1, clearInterval(o);
		};
	}, [
		i,
		a,
		t
	]), n;
}
function Ht(e) {
	let t = e?.entity, n = Mt(t), [r, i] = (0, l.useState)([]), a = (0, l.useCallback)(async () => {
		if (Et && t) try {
			let e = await Et.callWS({
				type: "todo/item/list",
				entity_id: t
			});
			i(e.items ?? []);
		} catch {
			i([]);
		}
	}, [t]);
	return (0, l.useEffect)(() => {
		a();
	}, [
		a,
		n?.state,
		n?.last_updated
	]), {
		items: r,
		add: async (e) => {
			await O("todo", "add_item", { item: e }, t), setTimeout(a, 400);
		},
		toggle: async (e) => {
			await O("todo", "update_item", {
				item: e.uid,
				status: e.status === "completed" ? "needs_action" : "completed"
			}, t), setTimeout(a, 400);
		},
		remove: async (e) => {
			await O("todo", "remove_item", { item: [e.uid] }, t), setTimeout(a, 400);
		}
	};
}
function Ut(e, t, n = 100) {
	t /= 100, n /= 100;
	let r = (t) => (t + e / 60) % 6, i = (e) => n - n * t * Math.max(Math.min(r(e), 4 - r(e), 1), 0);
	return `rgb(${Math.round(i(5) * 255)}, ${Math.round(i(3) * 255)}, ${Math.round(i(1) * 255)})`;
}
function j(e) {
	if (!k(e)) return "#3a4a46";
	let t = e.attributes.rgb_color;
	if (t) return `rgb(${t.join(",")})`;
	let n = e.attributes.hs_color;
	return n ? Ut(n[0], n[1]) : "#ffd9a0";
}
function Wt(e = 1e3) {
	let [t, n] = (0, l.useState)(() => /* @__PURE__ */ new Date());
	return (0, l.useEffect)(() => {
		let t = setInterval(() => n(/* @__PURE__ */ new Date()), e);
		return () => clearInterval(t);
	}, [e]), t;
}
var Gt = (e) => e.toLocaleTimeString("de-DE", {
	hour: "2-digit",
	minute: "2-digit"
}), Kt = (e) => e.toLocaleDateString("de-DE", {
	weekday: "long",
	day: "numeric",
	month: "long"
}), qt = (e, t) => e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate(), Jt = (e, t = /* @__PURE__ */ new Date()) => {
	let n = new Date(t);
	n.setHours(0, 0, 0, 0);
	let r = new Date(e);
	return r.setHours(0, 0, 0, 0), Math.round((r.getTime() - n.getTime()) / 864e5);
}, Yt = (e) => e === 0 ? "heute" : e === 1 ? "morgen" : e === 2 ? "übermorgen" : e < 0 ? `vor ${-e} Tagen` : `in ${e} Tagen`;
function Xt(e) {
	let [t, n] = (0, l.useState)(e), r = (0, l.useRef)(!1);
	return (0, l.useEffect)(() => {
		r.current || n(e);
	}, [e]), (0, l.useMemo)(() => ({
		v: t,
		setV: n,
		dragging: r
	}), [t]);
}
var Zt = (e) => {
	if (!e) return null;
	let t = e.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
	return t ? new Date(+t[3], t[2] - 1, +t[1]) : (t = e.match(/^(\d{4})-(\d{2})-(\d{2})/), t ? new Date(+t[1], t[2] - 1, +t[3]) : null);
}, Qt = /* @__PURE__ */ e(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), M = (/* @__PURE__ */ e(((e, t) => {
	t.exports = Qt();
})))();
function N({ children: e, className: t = "", style: n, onClick: r }) {
	return /* @__PURE__ */ (0, M.jsx)("div", {
		className: `card fade-in ${r ? "click" : ""} ${t}`,
		style: n,
		onClick: r,
		children: e
	});
}
function $t({ value: e, onCommit: t, gradient: n = "linear-gradient(90deg, rgba(255,255,255,.25), #fff)", disabled: r }) {
	let i = (0, l.useRef)(null), { v: a, setV: o, dragging: s } = Xt(e), c = (e) => {
		let t = i.current.getBoundingClientRect();
		return Math.round(Math.min(100, Math.max(0, (e - t.left) / t.width * 100)));
	};
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		ref: i,
		className: "slider",
		style: { opacity: r ? .45 : 1 },
		onPointerDown: (e) => {
			r || (e.target.setPointerCapture(e.pointerId), s.current = !0, o(c(e.clientX)));
		},
		onPointerMove: (e) => s.current && o(c(e.clientX)),
		onPointerUp: (e) => {
			if (!s.current) return;
			s.current = !1;
			let n = c(e.clientX);
			o(n), t(n);
		},
		children: [/* @__PURE__ */ (0, M.jsx)("div", {
			className: "track",
			children: /* @__PURE__ */ (0, M.jsx)("div", {
				className: "fill",
				style: {
					width: `${a}%`,
					background: n
				}
			})
		}), /* @__PURE__ */ (0, M.jsx)("div", {
			className: "knob",
			style: { left: `${a}%` }
		})]
	});
}
function en({ on: e, onClick: t, na: n }) {
	return /* @__PURE__ */ (0, M.jsx)("div", {
		role: "switch",
		"aria-checked": e,
		className: `toggle ${e ? "on" : ""} ${n ? "na" : ""}`,
		onClick: (e) => {
			e.stopPropagation(), n || t();
		}
	});
}
function tn({ options: e, value: t, onChange: n, labels: r, icons: i }) {
	return /* @__PURE__ */ (0, M.jsx)("div", {
		className: "seg",
		children: e.map((e) => /* @__PURE__ */ (0, M.jsxs)("button", {
			className: e === t ? "sel blue" : "",
			onClick: () => n(e),
			children: [i?.[e] ? /* @__PURE__ */ (0, M.jsx)(E, {
				icon: i[e],
				style: {
					verticalAlign: "-2px",
					marginRight: 4
				}
			}) : null, r?.[e] ?? e]
		}, e))
	});
}
function nn({ value: e, color: t }) {
	return /* @__PURE__ */ (0, M.jsx)("div", {
		className: "bar",
		children: /* @__PURE__ */ (0, M.jsx)("i", { style: {
			width: `${Math.max(0, Math.min(100, e))}%`,
			background: t
		} })
	});
}
// src/config.ts
var rn = (0, l.createContext)({}), P = () => (0, l.useContext)(rn), an = [
	"#60a5fa",
	"#f87171",
	"#4ade80",
	"#fbbf24",
	"#a78bfa",
	"#f472b6",
	"#2dd4bf",
	"#fb923c"
], on = (e, t) => t ?? an[e % an.length];
// src/scenes.tsx
function sn(e) {
	let t = e;
	return () => (t = (t * 9301 + 49297) % 233280, t / 233280);
}
var cn = {
	position: "absolute",
	inset: 0
};
function ln({ x: e, scale: t, delay: n, hue: r }) {
	let i = `hsl(${r} 55% 42%)`, a = `hsl(${r} 60% 55%)`;
	return /* @__PURE__ */ (0, M.jsx)("g", {
		transform: `translate(${e} 0) scale(${t})`,
		children: /* @__PURE__ */ (0, M.jsxs)("g", {
			style: {
				transformOrigin: "0px 0px",
				animation: `sway ${4 + n}s ease-in-out ${n}s infinite`
			},
			children: [
				/* @__PURE__ */ (0, M.jsx)("path", {
					d: "M0 0 C -2 -20 2 -36 0 -52",
					stroke: i,
					strokeWidth: "3",
					fill: "none"
				}),
				/* @__PURE__ */ (0, M.jsx)("path", {
					d: "M0 -40 C -26 -54 -34 -30 -10 -30 C -4 -30 -2 -36 0 -40 Z",
					fill: a
				}),
				/* @__PURE__ */ (0, M.jsx)("path", {
					d: "M0 -44 C 24 -60 36 -36 12 -34 C 6 -34 2 -40 0 -44 Z",
					fill: i
				}),
				/* @__PURE__ */ (0, M.jsx)("path", {
					d: "M0 -52 C -12 -70 -22 -54 -8 -50 Z",
					fill: a
				}),
				/* @__PURE__ */ (0, M.jsx)("path", {
					d: "M0 -52 C 12 -72 24 -56 8 -50 Z",
					fill: i
				})
			]
		})
	});
}
function un() {
	let e = (0, l.useMemo)(() => {
		let e = sn(7);
		return Array.from({ length: 70 }, () => ({
			left: e() * 100,
			delay: e() * 3,
			dur: .9 + e() * .8,
			h: 40 + e() * 60,
			o: .15 + e() * .3
		}));
	}, []), t = (0, l.useMemo)(() => {
		let e = sn(11);
		return Array.from({ length: 26 }, (t, n) => ({
			x: n * 80 + e() * 40,
			scale: .7 + e() * .8,
			delay: e() * 2,
			hue: 120 + e() * 30
		}));
	}, []);
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "scene",
		children: [
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				...cn,
				background: "linear-gradient(180deg,#3d5f52 0%,#2a4a3f 45%,#1c362e 75%,#14261f 100%)"
			} }),
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				...cn,
				background: "radial-gradient(900px 400px at 15% 5%, rgba(255,255,255,.12), transparent 60%)"
			} }),
			[
				0,
				1,
				2
			].map((e) => /* @__PURE__ */ (0, M.jsx)("div", { style: {
				position: "absolute",
				top: 20 + e * 50,
				left: 0,
				width: 420,
				height: 120,
				borderRadius: 120,
				background: "rgba(255,255,255,.06)",
				filter: "blur(18px)",
				animation: `cloud ${80 + e * 30}s linear ${-e * 25}s infinite`
			} }, e)),
			e.map((e, t) => /* @__PURE__ */ (0, M.jsx)("i", { style: {
				position: "absolute",
				top: 0,
				left: `${e.left}%`,
				width: 1.5,
				height: e.h,
				background: `linear-gradient(180deg, transparent, rgba(220,240,255,${e.o}))`,
				animation: `rain ${e.dur}s linear ${e.delay}s infinite`,
				transform: "rotate(8deg)"
			} }, t)),
			/* @__PURE__ */ (0, M.jsxs)("svg", {
				viewBox: "0 0 2000 220",
				preserveAspectRatio: "xMidYMax slice",
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					width: "100%",
					height: 220
				},
				children: [
					/* @__PURE__ */ (0, M.jsx)("defs", { children: /* @__PURE__ */ (0, M.jsxs)("linearGradient", {
						id: "soil",
						x1: "0",
						x2: "0",
						y1: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, M.jsx)("stop", {
							offset: "0",
							stopColor: "#2b2a26"
						}), /* @__PURE__ */ (0, M.jsx)("stop", {
							offset: "1",
							stopColor: "#141412"
						})]
					}) }),
					/* @__PURE__ */ (0, M.jsx)("g", {
						transform: "translate(0 150)",
						children: t.map((e, t) => /* @__PURE__ */ (0, M.jsx)(ln, { ...e }, t))
					}),
					/* @__PURE__ */ (0, M.jsx)("path", {
						d: "M0 150 C 300 140 600 158 1000 148 C 1400 138 1700 156 2000 146 V220 H0 Z",
						fill: "url(#soil)"
					}),
					Array.from({ length: 40 }).map((e, t) => /* @__PURE__ */ (0, M.jsx)("ellipse", {
						cx: t * 53 % 2e3,
						cy: 170 + t % 4 * 9,
						rx: 8 + t % 5 * 4,
						ry: 5 + t % 3 * 2,
						fill: t % 3 ? "#3a3935" : "#4a4843"
					}, t))
				]
			})
		]
	});
}
var dn = "M0 -10 C 6 -6 10 -2 10 4 C 6 3 3 6 0 10 C -3 6 -6 3 -10 4 C -10 -2 -6 -6 0 -10 Z";
function fn() {
	let e = (0, l.useMemo)(() => {
		let e = sn(23), t = [
			"#f97316",
			"#ea580c",
			"#facc15",
			"#dc2626",
			"#fb923c"
		];
		return Array.from({ length: 22 }, () => ({
			left: e() * 100,
			delay: e() * 14,
			dur: 10 + e() * 10,
			size: 14 + e() * 14,
			c: t[Math.floor(e() * t.length)]
		}));
	}, []), t = (0, l.useMemo)(() => {
		let e = sn(5);
		return Array.from({ length: 16 }, () => ({
			x: e() * 100,
			y: 15 + e() * 60,
			s: 80 + e() * 200,
			c: e() > .5 ? "rgba(249,115,22,.35)" : "rgba(220,38,38,.3)"
		}));
	}, []);
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "scene",
		children: [
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				...cn,
				background: "linear-gradient(180deg,#3a3566 0%,#5b4277 30%,#8c4f6e 60%,#b35f4c 85%,#3b1f1c 100%)"
			} }),
			t.map((e, t) => /* @__PURE__ */ (0, M.jsx)("div", { style: {
				position: "absolute",
				left: `${e.x}%`,
				top: `${e.y}%`,
				width: e.s,
				height: e.s,
				borderRadius: "50%",
				background: e.c,
				filter: "blur(30px)"
			} }, t)),
			/* @__PURE__ */ (0, M.jsxs)("svg", {
				viewBox: "0 0 2000 600",
				preserveAspectRatio: "xMidYMax slice",
				style: {
					position: "absolute",
					left: 0,
					bottom: 0,
					width: "100%",
					height: "70%"
				},
				children: [
					[
						120,
						420,
						760,
						1180,
						1520,
						1860
					].map((e, t) => /* @__PURE__ */ (0, M.jsxs)("g", {
						opacity: .55 + t % 2 * .2,
						children: [
							/* @__PURE__ */ (0, M.jsx)("rect", {
								x: e - 8,
								y: 240,
								width: 16,
								height: 360,
								fill: "#2a1a24"
							}),
							/* @__PURE__ */ (0, M.jsx)("path", {
								d: `M${e} 120 L${e - 90} 330 L${e + 90} 330 Z`,
								fill: "#2f1d2b"
							}),
							/* @__PURE__ */ (0, M.jsx)("path", {
								d: `M${e} 60 L${e - 70} 230 L${e + 70} 230 Z`,
								fill: "#331f2f"
							})
						]
					}, t)),
					/* @__PURE__ */ (0, M.jsx)("path", {
						d: "M0 560 C 300 540 700 575 1000 555 C 1300 540 1700 572 2000 550 V600 H0 Z",
						fill: "#3a1c14"
					}),
					Array.from({ length: 70 }).map((e, t) => /* @__PURE__ */ (0, M.jsx)("path", {
						d: dn,
						transform: `translate(${t * 29 % 2e3} ${565 + t % 5 * 7}) rotate(${t * 47 % 360}) scale(1.2)`,
						fill: [
							"#f97316",
							"#facc15",
							"#dc2626",
							"#ea580c"
						][t % 4]
					}, t))
				]
			}),
			e.map((e, t) => /* @__PURE__ */ (0, M.jsxs)("svg", {
				width: e.size,
				height: e.size,
				viewBox: "-12 -12 24 24",
				style: {
					position: "absolute",
					top: 0,
					left: `${e.left}%`,
					animation: `fall ${e.dur}s linear ${-e.delay}s infinite`
				},
				children: [/* @__PURE__ */ (0, M.jsx)("path", {
					d: dn,
					fill: e.c
				}), /* @__PURE__ */ (0, M.jsx)("path", {
					d: "M0 -9 L0 9",
					stroke: "rgba(0,0,0,.25)",
					strokeWidth: "1"
				})]
			}, t))
		]
	});
}
function pn({ x: e }) {
	return /* @__PURE__ */ (0, M.jsxs)("g", {
		transform: `translate(${e} 520)`,
		children: [
			/* @__PURE__ */ (0, M.jsx)("ellipse", {
				cx: "0",
				cy: "10",
				rx: "70",
				ry: "12",
				fill: "rgba(251,146,60,.25)"
			}),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "-34",
				y: "4",
				width: "68",
				height: "8",
				rx: "4",
				fill: "#5b3a1f",
				transform: "rotate(12)"
			}),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "-34",
				y: "4",
				width: "68",
				height: "8",
				rx: "4",
				fill: "#4a2e18",
				transform: "rotate(-12)"
			}),
			/* @__PURE__ */ (0, M.jsxs)("g", {
				style: {
					transformOrigin: "0px 6px",
					animation: "flame 0.9s ease-in-out infinite"
				},
				children: [/* @__PURE__ */ (0, M.jsx)("path", {
					d: "M0 -60 C 20 -30 26 -10 0 6 C -26 -10 -20 -30 0 -60 Z",
					fill: "#f97316"
				}), /* @__PURE__ */ (0, M.jsx)("path", {
					d: "M0 -40 C 12 -20 14 -6 0 6 C -14 -6 -12 -20 0 -40 Z",
					fill: "#fde047"
				})]
			}),
			[
				-10,
				4,
				14
			].map((e, t) => /* @__PURE__ */ (0, M.jsxs)("circle", {
				cx: e,
				cy: -70 - t * 10,
				r: "2",
				fill: "#fbbf24",
				children: [/* @__PURE__ */ (0, M.jsx)("animate", {
					attributeName: "cy",
					values: `${-60 - t * 8};${-140 - t * 10}`,
					dur: `${1.8 + t * .4}s`,
					repeatCount: "indefinite"
				}), /* @__PURE__ */ (0, M.jsx)("animate", {
					attributeName: "opacity",
					values: "1;0",
					dur: `${1.8 + t * .4}s`,
					repeatCount: "indefinite"
				})]
			}, t))
		]
	});
}
function mn() {
	let e = (0, l.useMemo)(() => {
		let e = sn(31);
		return Array.from({ length: 90 }, () => ({
			x: e() * 100,
			y: e() * 60,
			s: 1 + e() * 2,
			d: e() * 4
		}));
	}, []), t = (0, l.useMemo)(() => {
		let e = sn(41);
		return Array.from({ length: 22 }, () => ({
			x: e() * 100,
			y: 30 + e() * 60,
			d: e() * 6,
			dur: 5 + e() * 6,
			c: e() > .5 ? "#bef264" : "#93c5fd",
			s: 6 + e() * 10
		}));
	}, []);
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "scene",
		children: [
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				...cn,
				background: "linear-gradient(180deg,#0b1030 0%,#18205a 45%,#1d2a4f 75%,#0a0f1c 100%)"
			} }),
			e.map((e, t) => /* @__PURE__ */ (0, M.jsx)("i", { style: {
				position: "absolute",
				left: `${e.x}%`,
				top: `${e.y}%`,
				width: e.s,
				height: e.s,
				borderRadius: "50%",
				background: "#fff",
				animation: `twinkle ${3 + e.d}s ease-in-out ${e.d}s infinite`
			} }, t)),
			t.map((e, t) => /* @__PURE__ */ (0, M.jsx)("i", { style: {
				position: "absolute",
				left: `${e.x}%`,
				top: `${e.y}%`,
				width: e.s,
				height: e.s,
				borderRadius: "50%",
				background: e.c,
				boxShadow: `0 0 18px 6px ${e.c}`,
				filter: "blur(1px)",
				animation: `float ${e.dur}s ease-in-out ${-e.d}s infinite`
			} }, t)),
			/* @__PURE__ */ (0, M.jsxs)("svg", {
				viewBox: "0 0 2000 600",
				preserveAspectRatio: "xMidYMax slice",
				style: {
					position: "absolute",
					left: 0,
					bottom: 0,
					width: "100%",
					height: "55%"
				},
				children: [
					/* @__PURE__ */ (0, M.jsx)("path", {
						d: "M0 420 C 300 360 500 400 800 370 C 1100 340 1400 400 1700 360 C 1850 345 1950 370 2000 360 V600 H0 Z",
						fill: "#0e1530"
					}),
					[
						60,
						240,
						1620,
						1820,
						1960
					].map((e, t) => /* @__PURE__ */ (0, M.jsx)("path", {
						d: `M${e} 280 L${e - 50} 470 L${e + 50} 470 Z`,
						fill: "#0b1126"
					}, t)),
					[420, 1360].map((e, t) => /* @__PURE__ */ (0, M.jsxs)("g", { children: [/* @__PURE__ */ (0, M.jsx)("path", {
						d: `M${e} 440 L${e - 70} 530 L${e + 70} 530 Z`,
						fill: "#1e293b"
					}), /* @__PURE__ */ (0, M.jsx)("path", {
						d: `M${e} 440 L${e - 14} 530 L${e + 14} 530 Z`,
						fill: "#f59e0b",
						opacity: ".55"
					})] }, t)),
					/* @__PURE__ */ (0, M.jsx)("path", {
						d: "M0 520 C 400 505 800 530 1200 512 C 1500 500 1800 525 2000 515 V600 H0 Z",
						fill: "#070b16"
					}),
					/* @__PURE__ */ (0, M.jsx)(pn, { x: 760 }),
					/* @__PURE__ */ (0, M.jsx)(pn, { x: 1640 }),
					Array.from({ length: 120 }).map((e, t) => /* @__PURE__ */ (0, M.jsx)("line", {
						x1: t * 17,
						y1: 600,
						x2: t * 17 + (t % 3 - 1) * 4,
						y2: 575 - t % 4 * 6,
						stroke: "#0f172a",
						strokeWidth: "3"
					}, t))
				]
			})
		]
	});
}
function hn() {
	let e = (0, l.useMemo)(() => {
		let e = sn(53);
		return Array.from({ length: 140 }, () => ({
			x: e() * 100,
			y: e() * 100,
			s: .8 + e() * 1.8,
			d: e() * 5
		}));
	}, []);
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "scene",
		children: [
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				...cn,
				background: "radial-gradient(1200px 800px at 30% 20%, #12352d 0%, #0b1a1a 45%, #0a0f1c 100%)"
			} }),
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				...cn,
				background: "radial-gradient(700px 500px at 85% 80%, rgba(99,102,241,.18), transparent 60%)"
			} }),
			e.map((e, t) => /* @__PURE__ */ (0, M.jsx)("i", { style: {
				position: "absolute",
				left: `${e.x}%`,
				top: `${e.y}%`,
				width: e.s,
				height: e.s,
				borderRadius: "50%",
				background: "#fff",
				opacity: .6,
				animation: `twinkle ${3 + e.d}s ease-in-out ${e.d}s infinite`
			} }, t))
		]
	});
}
function gn() {
	let e = (0, l.useMemo)(() => {
		let e = sn(61);
		return Array.from({ length: 60 }, () => ({
			x: e() * 100,
			y: e() * 45,
			s: 1 + e() * 1.5,
			d: e() * 5
		}));
	}, []), t = (e, t) => {
		let n = `M0 ${e}`;
		for (let r = 0; r <= 4e3; r += 200) n += ` Q ${r + 100} ${e - t} ${r + 200} ${e}`;
		return n + " V400 H0 Z";
	};
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "scene",
		children: [
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				...cn,
				background: "linear-gradient(180deg,#0d1b2e 0%,#163352 45%,#1b4a6b 70%,#0b2236 100%)"
			} }),
			e.map((e, t) => /* @__PURE__ */ (0, M.jsx)("i", { style: {
				position: "absolute",
				left: `${e.x}%`,
				top: `${e.y}%`,
				width: e.s,
				height: e.s,
				borderRadius: "50%",
				background: "#fff",
				animation: `twinkle ${3 + e.d}s ease-in-out ${e.d}s infinite`
			} }, t)),
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				position: "absolute",
				right: "30%",
				top: "62%",
				width: 90,
				height: 90,
				borderRadius: "50%",
				background: "radial-gradient(circle at 35% 35%, #fff, #cbd5e1)",
				boxShadow: "0 0 60px 20px rgba(226,232,240,.25)"
			} }),
			/* @__PURE__ */ (0, M.jsx)("svg", {
				viewBox: "0 0 2000 400",
				preserveAspectRatio: "none",
				style: {
					position: "absolute",
					left: 0,
					bottom: 0,
					width: "200%",
					height: 260,
					animation: "wave 30s linear infinite"
				},
				children: /* @__PURE__ */ (0, M.jsx)("path", {
					d: t(120, 18),
					fill: "rgba(56,189,248,.18)"
				})
			}),
			/* @__PURE__ */ (0, M.jsx)("svg", {
				viewBox: "0 0 2000 400",
				preserveAspectRatio: "none",
				style: {
					position: "absolute",
					left: 0,
					bottom: 0,
					width: "200%",
					height: 200,
					animation: "wave 18s linear infinite reverse"
				},
				children: /* @__PURE__ */ (0, M.jsx)("path", {
					d: t(150, 22),
					fill: "rgba(14,116,144,.35)"
				})
			}),
			/* @__PURE__ */ (0, M.jsx)("svg", {
				viewBox: "0 0 2000 400",
				preserveAspectRatio: "none",
				style: {
					position: "absolute",
					left: 0,
					bottom: 0,
					width: "200%",
					height: 140,
					animation: "wave 12s linear infinite"
				},
				children: /* @__PURE__ */ (0, M.jsx)("path", {
					d: t(180, 16),
					fill: "#0b2236"
				})
			})
		]
	});
}
function _n({ litRatio: e = .5 }) {
	let t = (0, l.useMemo)(() => {
		let e = sn(71);
		return Array.from({ length: 50 }, () => ({
			x: e() * 100,
			y: e() * 35,
			s: 1 + e() * 1.4,
			d: e() * 5
		}));
	}, []), n = [
		[880, 430],
		[940, 430],
		[1060, 430],
		[1120, 430],
		[880, 500],
		[940, 500],
		[1060, 500],
		[1120, 500],
		[1e3, 360]
	], r = Math.round(n.length * e);
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "scene",
		children: [
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				...cn,
				background: "linear-gradient(180deg,#141a3a 0%,#3b2c63 35%,#a24f6b 62%,#f19a5b 78%,#2a1b2e 100%)"
			} }),
			t.map((e, t) => /* @__PURE__ */ (0, M.jsx)("i", { style: {
				position: "absolute",
				left: `${e.x}%`,
				top: `${e.y}%`,
				width: e.s,
				height: e.s,
				borderRadius: "50%",
				background: "#fff",
				animation: `twinkle ${3 + e.d}s ease-in-out ${e.d}s infinite`
			} }, t)),
			/* @__PURE__ */ (0, M.jsx)("div", { style: {
				position: "absolute",
				left: "12%",
				top: "14%",
				width: 70,
				height: 70,
				borderRadius: "50%",
				background: "radial-gradient(circle at 35% 35%, #fff7ed, #fde68a)",
				boxShadow: "0 0 50px 14px rgba(253,230,138,.35)"
			} }),
			/* @__PURE__ */ (0, M.jsxs)("svg", {
				viewBox: "0 0 2000 700",
				preserveAspectRatio: "xMidYMax slice",
				style: {
					position: "absolute",
					left: 0,
					bottom: 0,
					width: "100%",
					height: "70%"
				},
				children: [
					/* @__PURE__ */ (0, M.jsx)("path", {
						d: "M0 520 C 300 470 600 500 900 470 C 1200 440 1500 500 2000 460 V700 H0 Z",
						fill: "#2b1b33"
					}),
					/* @__PURE__ */ (0, M.jsx)("path", {
						d: "M0 590 C 400 560 800 600 1200 575 C 1500 560 1800 590 2000 580 V700 H0 Z",
						fill: "#1a1022"
					}),
					[
						200,
						330,
						1500,
						1640,
						1800
					].map((e, t) => /* @__PURE__ */ (0, M.jsxs)("g", { children: [/* @__PURE__ */ (0, M.jsx)("rect", {
						x: e - 6,
						y: 480,
						width: 12,
						height: 110,
						fill: "#140c19"
					}), /* @__PURE__ */ (0, M.jsx)("circle", {
						cx: e,
						cy: 470,
						r: 48 + t % 2 * 14,
						fill: "#1a1022"
					})] }, t)),
					/* @__PURE__ */ (0, M.jsxs)("g", { children: [
						/* @__PURE__ */ (0, M.jsx)("rect", {
							x: "840",
							y: "390",
							width: "320",
							height: "200",
							fill: "#1c1426"
						}),
						/* @__PURE__ */ (0, M.jsx)("path", {
							d: "M820 400 L1000 290 L1180 400 Z",
							fill: "#241a31"
						}),
						/* @__PURE__ */ (0, M.jsx)("rect", {
							x: "1090",
							y: "300",
							width: "28",
							height: "60",
							fill: "#1c1426"
						}),
						n.map(([e, t], n) => /* @__PURE__ */ (0, M.jsx)("rect", {
							x: e - 18,
							y: t - 22,
							width: 36,
							height: 40,
							rx: 3,
							fill: n < r ? "#fcd34d" : "#2e2340",
							opacity: n < r ? .9 : 1,
							children: n < r && /* @__PURE__ */ (0, M.jsx)("animate", {
								attributeName: "opacity",
								values: ".85;1;.85",
								dur: `${4 + n}s`,
								repeatCount: "indefinite"
							})
						}, n)),
						/* @__PURE__ */ (0, M.jsx)("rect", {
							x: "985",
							y: "520",
							width: "30",
							height: "70",
							fill: r > 0 ? "#f59e0b" : "#2e2340",
							opacity: ".8"
						})
					] })
				]
			})
		]
	});
}
// src/illus.tsx
var vn = 0, yn = (e) => `${e}${++vn}`;
function bn({ color: e, on: t, shade: n = "#2f6f5a", width: r = 120 }) {
	let i = yn("pl");
	return /* @__PURE__ */ (0, M.jsxs)("svg", {
		width: r,
		height: r * 1.25,
		viewBox: "0 0 120 150",
		className: "illus",
		children: [
			/* @__PURE__ */ (0, M.jsxs)("defs", { children: [
				/* @__PURE__ */ (0, M.jsxs)("linearGradient", {
					id: `${i}s`,
					x1: "0",
					x2: "0",
					y1: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, M.jsx)("stop", {
						offset: "0",
						stopColor: n,
						stopOpacity: "1"
					}), /* @__PURE__ */ (0, M.jsx)("stop", {
						offset: "1",
						stopColor: n,
						stopOpacity: ".75"
					})]
				}),
				/* @__PURE__ */ (0, M.jsxs)("radialGradient", {
					id: `${i}l`,
					cx: ".5",
					cy: "0",
					r: "1",
					children: [/* @__PURE__ */ (0, M.jsx)("stop", {
						offset: "0",
						stopColor: e,
						stopOpacity: ".75"
					}), /* @__PURE__ */ (0, M.jsx)("stop", {
						offset: "1",
						stopColor: e,
						stopOpacity: "0"
					})]
				}),
				/* @__PURE__ */ (0, M.jsxs)("linearGradient", {
					id: `${i}h`,
					x1: "0",
					x2: "1",
					children: [/* @__PURE__ */ (0, M.jsx)("stop", {
						offset: "0",
						stopColor: "#fff",
						stopOpacity: ".45"
					}), /* @__PURE__ */ (0, M.jsx)("stop", {
						offset: ".5",
						stopColor: "#fff",
						stopOpacity: "0"
					})]
				})
			] }),
			/* @__PURE__ */ (0, M.jsx)("line", {
				x1: "60",
				y1: "0",
				x2: "60",
				y2: "52",
				stroke: "rgba(255,255,255,.55)",
				strokeWidth: "1.5"
			}),
			t && /* @__PURE__ */ (0, M.jsx)("path", {
				d: "M30 86 L-10 150 L130 150 L90 86 Z",
				fill: `url(#${i}l)`
			}),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "55",
				y: "50",
				width: "10",
				height: "8",
				rx: "2",
				fill: "#1f2937"
			}),
			/* @__PURE__ */ (0, M.jsx)("path", {
				d: "M60 56 C 38 58 26 72 24 88 L96 88 C94 72 82 58 60 56 Z",
				fill: `url(#${i}s)`
			}),
			/* @__PURE__ */ (0, M.jsx)("path", {
				d: "M60 56 C 44 58 34 70 32 84 L44 84 C46 70 52 62 60 58 Z",
				fill: `url(#${i}h)`
			}),
			/* @__PURE__ */ (0, M.jsx)("ellipse", {
				cx: "60",
				cy: "88",
				rx: "36",
				ry: "5",
				fill: t ? e : "#1c2523"
			}),
			t && /* @__PURE__ */ (0, M.jsx)("ellipse", {
				cx: "60",
				cy: "90",
				rx: "18",
				ry: "4",
				fill: "#fff",
				opacity: ".9"
			})
		]
	});
}
function xn({ color: e, on: t }) {
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		style: {
			display: "flex",
			justifyContent: "flex-end",
			gap: 0,
			marginRight: -10
		},
		children: [/* @__PURE__ */ (0, M.jsx)(bn, {
			color: e,
			on: t,
			shade: "#b4232c",
			width: 86
		}), /* @__PURE__ */ (0, M.jsx)(bn, {
			color: e,
			on: t,
			shade: "#b4232c",
			width: 86
		})]
	});
}
function Sn({ color: e, on: t }) {
	let n = yn("st");
	return /* @__PURE__ */ (0, M.jsxs)("svg", {
		width: "150",
		height: "100",
		viewBox: "0 0 150 100",
		className: "illus",
		children: [
			/* @__PURE__ */ (0, M.jsx)("defs", { children: /* @__PURE__ */ (0, M.jsxs)("radialGradient", {
				id: n,
				cx: ".5",
				cy: ".5",
				r: ".5",
				children: [/* @__PURE__ */ (0, M.jsx)("stop", {
					offset: "0",
					stopColor: e,
					stopOpacity: ".8"
				}), /* @__PURE__ */ (0, M.jsx)("stop", {
					offset: "1",
					stopColor: e,
					stopOpacity: "0"
				})]
			}) }),
			/* @__PURE__ */ (0, M.jsx)("path", {
				d: "M0 95 H30 V78 H60 V61 H90 V44 H120 V27 H150 V100 H0 Z",
				fill: "#c9b79a",
				opacity: ".85"
			}),
			/* @__PURE__ */ (0, M.jsx)("path", {
				d: "M0 95 H30 V78 H60 V61 H90 V44 H120 V27 H150",
				fill: "none",
				stroke: "#8b7355",
				strokeWidth: "2"
			}),
			[30, 90].map((e, r) => /* @__PURE__ */ (0, M.jsxs)("g", { children: [t && /* @__PURE__ */ (0, M.jsx)("circle", {
				cx: e + 10,
				cy: 52 - r * 34 + 20,
				r: "22",
				fill: `url(#${n})`
			}), /* @__PURE__ */ (0, M.jsx)("rect", {
				x: e + 4,
				y: 46 - r * 34 + 20,
				width: "12",
				height: "8",
				rx: "3",
				fill: t ? "#fff" : "#4b5563"
			})] }, r))
		]
	});
}
function Cn({ active: e }) {
	let t = yn("vd");
	return /* @__PURE__ */ (0, M.jsxs)("svg", {
		width: "150",
		height: "140",
		viewBox: "0 0 150 140",
		className: "illus",
		children: [
			/* @__PURE__ */ (0, M.jsxs)("defs", { children: [/* @__PURE__ */ (0, M.jsxs)("linearGradient", {
				id: `${t}a`,
				x1: "0",
				x2: "1",
				children: [
					/* @__PURE__ */ (0, M.jsx)("stop", {
						offset: "0",
						stopColor: "#1f2326"
					}),
					/* @__PURE__ */ (0, M.jsx)("stop", {
						offset: ".5",
						stopColor: "#3a3f44"
					}),
					/* @__PURE__ */ (0, M.jsx)("stop", {
						offset: "1",
						stopColor: "#15181a"
					})
				]
			}), /* @__PURE__ */ (0, M.jsxs)("linearGradient", {
				id: `${t}b`,
				x1: "0",
				x2: "0",
				y1: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, M.jsx)("stop", {
					offset: "0",
					stopColor: "#4b5056"
				}), /* @__PURE__ */ (0, M.jsx)("stop", {
					offset: "1",
					stopColor: "#1b1e21"
				})]
			})] }),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "62",
				y: "8",
				width: "64",
				height: "104",
				rx: "12",
				fill: `url(#${t}a)`
			}),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "70",
				y: "18",
				width: "48",
				height: "14",
				rx: "5",
				fill: "#0b0d0e"
			}),
			/* @__PURE__ */ (0, M.jsx)("circle", {
				cx: "94",
				cy: "25",
				r: "3",
				fill: e ? "#4ade80" : "#60a5fa"
			}),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "66",
				y: "58",
				width: "56",
				height: "5",
				rx: "2",
				fill: "#8a7a5c",
				opacity: ".8"
			}),
			/* @__PURE__ */ (0, M.jsx)("path", {
				d: "M50 112 H140 L146 124 H44 Z",
				fill: "#111416"
			}),
			/* @__PURE__ */ (0, M.jsx)("ellipse", {
				cx: e ? 40 : 82,
				cy: "118",
				rx: "38",
				ry: "12",
				fill: `url(#${t}b)`,
				children: e && /* @__PURE__ */ (0, M.jsx)("animate", {
					attributeName: "cx",
					values: "30;60;30",
					dur: "6s",
					repeatCount: "indefinite"
				})
			}),
			/* @__PURE__ */ (0, M.jsx)("ellipse", {
				cx: e ? 40 : 82,
				cy: "113",
				rx: "12",
				ry: "4",
				fill: "#2b3035",
				children: e && /* @__PURE__ */ (0, M.jsx)("animate", {
					attributeName: "cx",
					values: "30;60;30",
					dur: "6s",
					repeatCount: "indefinite"
				})
			})
		]
	});
}
function wn({ on: e, color: t = "#22d3ee", width: n = 150 }) {
	let r = yn("tv");
	return /* @__PURE__ */ (0, M.jsxs)("svg", {
		width: n,
		height: n * .72,
		viewBox: "0 0 150 108",
		className: "illus",
		children: [
			/* @__PURE__ */ (0, M.jsx)("defs", { children: /* @__PURE__ */ (0, M.jsxs)("linearGradient", {
				id: r,
				x1: "0",
				x2: "1",
				y1: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, M.jsx)("stop", {
					offset: "0",
					stopColor: e ? t : "#0f1514"
				}), /* @__PURE__ */ (0, M.jsx)("stop", {
					offset: "1",
					stopColor: e ? "#7c3aed" : "#060908"
				})]
			}) }),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "4",
				y: "4",
				width: "142",
				height: "84",
				rx: "6",
				fill: "#0b0f0e"
			}),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "9",
				y: "9",
				width: "132",
				height: "74",
				rx: "3",
				fill: `url(#${r})`,
				opacity: e ? .9 : 1
			}),
			!e && /* @__PURE__ */ (0, M.jsx)("path", {
				d: "M18 14 L60 14 L30 78 L14 78 Z",
				fill: "#fff",
				opacity: ".06"
			}),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "66",
				y: "88",
				width: "18",
				height: "10",
				fill: "#1f2937"
			}),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "40",
				y: "98",
				width: "70",
				height: "5",
				rx: "2",
				fill: "#111827"
			})
		]
	});
}
function Tn({ count: e, onCount: t }) {
	let n = Math.max(3, Math.min(e, 6));
	return /* @__PURE__ */ (0, M.jsxs)("svg", {
		width: "170",
		height: "70",
		viewBox: "0 0 170 70",
		className: "illus",
		children: [
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "6",
				y: "18",
				width: "158",
				height: "38",
				rx: "12",
				fill: "#e8ece9"
			}),
			/* @__PURE__ */ (0, M.jsx)("rect", {
				x: "6",
				y: "44",
				width: "158",
				height: "12",
				rx: "6",
				fill: "#c9cfcb"
			}),
			Array.from({ length: n }).map((e, r) => {
				let i = 20 + r * (120 / (n - 1)), a = r < t;
				return /* @__PURE__ */ (0, M.jsxs)("g", { children: [
					/* @__PURE__ */ (0, M.jsx)("circle", {
						cx: i,
						cy: "34",
						r: "9",
						fill: "#cfd5d1"
					}),
					/* @__PURE__ */ (0, M.jsx)("circle", {
						cx: i - 3,
						cy: "34",
						r: "1.6",
						fill: "#555"
					}),
					/* @__PURE__ */ (0, M.jsx)("circle", {
						cx: i + 3,
						cy: "34",
						r: "1.6",
						fill: "#555"
					}),
					/* @__PURE__ */ (0, M.jsx)("circle", {
						cx: i,
						cy: "49",
						r: "2",
						fill: a ? "#4ade80" : "#94a3b8"
					})
				] }, r);
			}),
			/* @__PURE__ */ (0, M.jsx)("path", {
				d: "M164 37 C 180 37 168 66 150 66",
				fill: "none",
				stroke: "#c9cfcb",
				strokeWidth: "4"
			})
		]
	});
}
function En({ condition: e, size: t = 110 }) {
	let n = [
		"sunny",
		"clear-night",
		"partlycloudy"
	].includes(e), r = e === "clear-night", i = [
		"rainy",
		"pouring",
		"lightning-rainy"
	].includes(e), a = ["snowy", "snowy-rainy"].includes(e), o = !["sunny", "clear-night"].includes(e);
	return /* @__PURE__ */ (0, M.jsxs)("svg", {
		width: t,
		height: t * .75,
		viewBox: "0 0 120 90",
		children: [
			n && !r && /* @__PURE__ */ (0, M.jsx)("circle", {
				cx: "40",
				cy: "34",
				r: "20",
				fill: "#fcd34d"
			}),
			r && /* @__PURE__ */ (0, M.jsx)("path", {
				d: "M48 14 A22 22 0 1 0 66 48 A18 18 0 1 1 48 14 Z",
				fill: "#e2e8f0"
			}),
			o && /* @__PURE__ */ (0, M.jsxs)("g", { children: [
				/* @__PURE__ */ (0, M.jsx)("ellipse", {
					cx: "50",
					cy: "58",
					rx: "34",
					ry: "18",
					fill: "#cbd5e1"
				}),
				/* @__PURE__ */ (0, M.jsx)("circle", {
					cx: "44",
					cy: "46",
					r: "18",
					fill: "#e2e8f0"
				}),
				/* @__PURE__ */ (0, M.jsx)("circle", {
					cx: "66",
					cy: "44",
					r: "22",
					fill: "#f8fafc"
				}),
				/* @__PURE__ */ (0, M.jsx)("ellipse", {
					cx: "62",
					cy: "60",
					rx: "38",
					ry: "16",
					fill: "#f1f5f9"
				})
			] }),
			i && [
				40,
				56,
				72,
				88
			].map((e, t) => /* @__PURE__ */ (0, M.jsx)("line", {
				x1: e,
				y1: "76",
				x2: e - 5,
				y2: "88",
				stroke: "#7dd3fc",
				strokeWidth: "3",
				strokeLinecap: "round"
			}, t)),
			a && [
				42,
				60,
				78
			].map((e, t) => /* @__PURE__ */ (0, M.jsx)("circle", {
				cx: e,
				cy: "82",
				r: "3",
				fill: "#fff"
			}, t))
		]
	});
}
// src/common.tsx
var Dn = {
	"clear-night": "Klar",
	cloudy: "Bewölkt",
	exceptional: "Unwetter",
	fog: "Nebel",
	hail: "Hagel",
	lightning: "Gewitter",
	"lightning-rainy": "Gewitter, Regen",
	partlycloudy: "Teils bewölkt",
	pouring: "Starkregen",
	rainy: "Regen",
	snowy: "Schnee",
	"snowy-rainy": "Schneeregen",
	sunny: "Sonnig",
	windy: "Windig",
	"windy-variant": "Windig, bewölkt"
}, On = (e) => e != null && !Number.isNaN(e) ? Math.round(e) : "–";
function kn() {
	let e = P(), t = Wt(1e3), n = Mt(e.weather), r = Lt(e.weather)[0], i = n?.attributes.temperature, a = n?.attributes.apparent_temperature ?? i, o = n?.state ?? "cloudy";
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [/* @__PURE__ */ (0, M.jsxs)("div", {
		style: {
			textAlign: "center",
			padding: "10px 0 18px"
		},
		children: [
			/* @__PURE__ */ (0, M.jsx)("div", {
				className: "mono",
				style: {
					fontSize: "clamp(64px, 7.2vw, 118px)",
					fontWeight: 200,
					letterSpacing: "-0.03em",
					lineHeight: 1
				},
				children: Gt(t)
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					fontSize: 22,
					marginTop: 10
				},
				children: Kt(t)
			}),
			e.location && /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "eyebrow",
				style: { marginTop: 6 },
				children: [
					/* @__PURE__ */ (0, M.jsx)(E, {
						icon: "mdi:map-marker-outline",
						style: { verticalAlign: "-2px" }
					}),
					" ",
					e.location
				]
			})
		]
	}), n && /* @__PURE__ */ (0, M.jsxs)("div", {
		style: {
			borderTop: "1px solid var(--line-2)",
			paddingTop: 16
		},
		className: "row",
		children: [
			/* @__PURE__ */ (0, M.jsx)(En, {
				condition: o,
				size: 96
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				style: {
					fontSize: 64,
					fontWeight: 600,
					lineHeight: 1
				},
				children: [On(i), "°"]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "col",
				style: { gap: 6 },
				children: [/* @__PURE__ */ (0, M.jsx)("div", {
					style: { fontSize: 20 },
					children: Dn[o] ?? o
				}), /* @__PURE__ */ (0, M.jsxs)("span", {
					className: "chip",
					children: [
						"Gefühlt ",
						On(a),
						"° · H ",
						On(r?.temperature),
						"° · T ",
						On(r?.templow),
						"°"
					]
				})]
			})
		]
	})] });
}
function An() {
	let e = P(), t = D();
	return (e.waste ?? []).map((e, n) => {
		let r = Number(t[e.entity]?.state), i = Zt(e.date ? t[e.date]?.state : void 0);
		return {
			...e,
			id: e.entity,
			icon: e.icon ?? "mdi:trash-can-outline",
			color: on(n + 3, e.color),
			days: Number.isFinite(r) ? r : null,
			date: i
		};
	}).filter((e) => e.days !== null).sort((e, t) => (e.days ?? 999) - (t.days ?? 999));
}
function jn() {
	let e = P(), t = An(), n = t[0];
	return n ? /* @__PURE__ */ (0, M.jsxs)(N, { children: [
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "between",
			children: [/* @__PURE__ */ (0, M.jsx)("h2", {
				style: {
					fontVariant: "small-caps",
					letterSpacing: ".04em"
				},
				children: "Müllabfuhr"
			}), /* @__PURE__ */ (0, M.jsx)(E, {
				icon: "mdi:truck-outline",
				className: "muted",
				width: 22
			})]
		}),
		e.address && /* @__PURE__ */ (0, M.jsxs)("div", {
			className: "sub",
			style: { marginTop: 4 },
			children: [
				/* @__PURE__ */ (0, M.jsx)(E, {
					icon: "mdi:map-marker-outline",
					style: { verticalAlign: "-2px" }
				}),
				" ",
				e.address
			]
		}),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "list-row hl",
			style: {
				marginTop: 16,
				display: "block"
			},
			children: [/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "between",
				children: [/* @__PURE__ */ (0, M.jsxs)("span", { children: ["Nächste: ", /* @__PURE__ */ (0, M.jsx)("b", {
					style: { color: n.color },
					children: n.name
				})] }), /* @__PURE__ */ (0, M.jsx)("span", {
					style: {
						fontSize: 22,
						fontWeight: 600,
						color: "#93c5fd"
					},
					children: Yt(n.days)
				})]
			}), /* @__PURE__ */ (0, M.jsx)("div", {
				className: "bar",
				style: {
					marginTop: 10,
					height: 5
				},
				children: /* @__PURE__ */ (0, M.jsx)("i", { style: {
					width: `${100 - Math.min(100, n.days / 14 * 100)}%`,
					background: "#60a5fa"
				} })
			})]
		}),
		/* @__PURE__ */ (0, M.jsx)("div", {
			style: { marginTop: 12 },
			children: t.map((e, t) => /* @__PURE__ */ (0, M.jsxs)("div", {
				className: `list-row ${t === 0 ? "hl" : ""}`,
				children: [
					/* @__PURE__ */ (0, M.jsx)(E, {
						icon: e.icon,
						width: 22,
						style: {
							color: e.color,
							flex: "0 0 auto"
						}
					}),
					/* @__PURE__ */ (0, M.jsxs)("div", {
						style: {
							flex: 1,
							minWidth: 0
						},
						children: [/* @__PURE__ */ (0, M.jsx)("div", {
							style: {
								fontSize: 17,
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis"
							},
							children: e.name
						}), /* @__PURE__ */ (0, M.jsx)("div", {
							className: "mono",
							style: {
								fontSize: 13,
								color: "var(--ink-3)"
							},
							children: e.date ? e.date.toLocaleDateString("de-DE", {
								weekday: "long",
								day: "2-digit",
								month: "2-digit"
							}) : ""
						})]
					}),
					/* @__PURE__ */ (0, M.jsx)("span", {
						className: `chip ${e.days <= 1 ? "warn" : ""}`,
						children: Yt(e.days)
					})
				]
			}, e.id))
		})
	] }) : null;
}
function Mn() {
	let e = An(), t = e[0];
	if (!t) return null;
	let n = 100 - Math.min(100, t.days / 14 * 100), r = e.filter((e) => e.days <= 7).length;
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "row",
			children: [/* @__PURE__ */ (0, M.jsx)("div", {
				className: "icon-chip",
				style: { background: "rgba(251,146,60,.2)" },
				children: /* @__PURE__ */ (0, M.jsx)(E, {
					icon: "mdi:dump-truck",
					width: 20,
					color: "#fb923c"
				})
			}), /* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsx)("h3", {
				style: { letterSpacing: ".04em" },
				children: "NÄCHSTE ABHOLUNG"
			}), /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "sub",
				children: [
					r,
					" ",
					r === 1 ? "Abholung" : "Abholungen",
					" in den nächsten 7 Tagen"
				]
			})] })]
		}),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "list-row hl",
			style: { marginTop: 14 },
			children: [/* @__PURE__ */ (0, M.jsxs)("div", {
				style: { flex: 1 },
				children: [/* @__PURE__ */ (0, M.jsx)("div", {
					style: {
						fontSize: 15,
						color: "var(--ink-2)"
					},
					children: Yt(t.days).replace(/^./, (e) => e.toUpperCase())
				}), /* @__PURE__ */ (0, M.jsxs)("div", {
					style: { fontSize: 18 },
					children: [t.name, t.date ? ` – ${t.date.toLocaleDateString("de-DE", {
						weekday: "long",
						day: "numeric",
						month: "long"
					})}` : ""]
				})]
			}), /* @__PURE__ */ (0, M.jsx)(E, {
				icon: t.icon,
				width: 26,
				style: { color: t.color }
			})]
		}),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			style: {
				position: "relative",
				height: 40,
				marginTop: 16
			},
			children: [
				/* @__PURE__ */ (0, M.jsx)("div", { style: {
					position: "absolute",
					left: 0,
					right: 30,
					top: 24,
					borderTop: "2px dashed rgba(255,255,255,.25)"
				} }),
				/* @__PURE__ */ (0, M.jsx)("div", { style: {
					position: "absolute",
					left: 0,
					width: `calc(${n}% * 0.9)`,
					top: 23,
					height: 3,
					background: "#60a5fa",
					borderRadius: 2
				} }),
				/* @__PURE__ */ (0, M.jsx)("div", {
					style: {
						position: "absolute",
						left: `calc(${n}% * 0.9)`,
						top: 4,
						animation: "drive 3s ease-in-out infinite"
					},
					children: /* @__PURE__ */ (0, M.jsx)(E, {
						icon: "mdi:truck",
						width: 28,
						color: "#facc15"
					})
				}),
				/* @__PURE__ */ (0, M.jsx)("div", {
					style: {
						position: "absolute",
						right: 0,
						top: 2
					},
					children: /* @__PURE__ */ (0, M.jsx)(E, {
						icon: "mdi:home",
						width: 28,
						color: "#f87171"
					})
				})
			]
		})
	] });
}
var Nn = [
	{
		label: "Warmweiß",
		data: { color_temp_kelvin: 2700 },
		css: "#ffc58a"
	},
	{
		label: "Neutral",
		data: { color_temp_kelvin: 4e3 },
		css: "#fff1dc"
	},
	{
		label: "Kaltweiß",
		data: { color_temp_kelvin: 6e3 },
		css: "#e8f1ff"
	},
	{
		label: "Rot",
		data: { hs_color: [0, 90] },
		css: Ut(0, 75)
	},
	{
		label: "Orange",
		data: { hs_color: [28, 95] },
		css: Ut(28, 85)
	},
	{
		label: "Grün",
		data: { hs_color: [140, 80] },
		css: Ut(140, 65)
	},
	{
		label: "Cyan",
		data: { hs_color: [188, 90] },
		css: Ut(188, 80)
	},
	{
		label: "Blau",
		data: { hs_color: [222, 90] },
		css: Ut(222, 75)
	},
	{
		label: "Lila",
		data: { hs_color: [270, 85] },
		css: Ut(270, 65)
	},
	{
		label: "Magenta",
		data: { hs_color: [312, 85] },
		css: Ut(312, 70)
	}
];
function Pn({ room: e }) {
	let t = D(), n = (e.lights ?? []).map((e) => t[e]).filter(Boolean), r = n.filter((e) => k(e)), i = n.filter((e) => !A(e)).map((e) => e.entity_id), a = r.length ? Math.round(r.reduce((e, t) => e + (t.attributes.brightness ?? 255), 0) / r.length / 2.55) : 0, o = r[0] ? j(r[0]) : "#3a4a46", s = () => i.length && O("light", r.length ? "turn_off" : "turn_on", {}, i), c = e.style ?? "pendant";
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [/* @__PURE__ */ (0, M.jsxs)("div", {
		className: "between",
		style: { alignItems: "flex-start" },
		children: [/* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsxs)("h2", { children: [
			e.title,
			/* @__PURE__ */ (0, M.jsx)("br", {}),
			"Licht"
		] }), /* @__PURE__ */ (0, M.jsxs)("div", {
			className: "sub",
			style: { marginTop: 6 },
			children: [
				r.length,
				" von ",
				n.length,
				" an"
			]
		})] }), /* @__PURE__ */ (0, M.jsxs)("div", {
			onClick: s,
			className: "illus tap",
			title: "Tippen: alle an/aus",
			children: [
				c === "pendant" && /* @__PURE__ */ (0, M.jsx)(bn, {
					color: o,
					on: r.length > 0,
					width: 96
				}),
				c === "twin" && /* @__PURE__ */ (0, M.jsx)(xn, {
					color: o,
					on: r.length > 0
				}),
				c === "stairs" && /* @__PURE__ */ (0, M.jsx)(Sn, {
					color: o,
					on: r.length > 0
				})
			]
		})]
	}), /* @__PURE__ */ (0, M.jsxs)("div", {
		style: { marginTop: 10 },
		children: [
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "label-row",
				children: [/* @__PURE__ */ (0, M.jsx)("span", { children: "Helligkeit" }), /* @__PURE__ */ (0, M.jsxs)("span", {
					className: "mono",
					children: [a, "%"]
				})]
			}),
			/* @__PURE__ */ (0, M.jsx)($t, {
				value: a,
				gradient: `linear-gradient(90deg, rgba(255,255,255,.15), ${r.length ? o : "#9ca3af"})`,
				onCommit: (e) => e === 0 ? O("light", "turn_off", {}, i) : O("light", "turn_on", { brightness_pct: e }, i),
				disabled: !i.length
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				className: "swatches",
				children: Nn.map((e) => /* @__PURE__ */ (0, M.jsx)("div", {
					title: e.label,
					className: "swatch",
					style: {
						background: e.css,
						color: e.css
					},
					onClick: () => i.length && O("light", "turn_on", e.data, i)
				}, e.label))
			})
		]
	})] });
}
function Fn({ room: e, compact: t }) {
	let n = D(), [r, i] = (0, l.useState)(!t), a = (e.switches ?? []).map((e) => ({
		id: e,
		e: n[e]
	})), o = a.filter((e) => k(e.e)).length;
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "between",
			children: [/* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsx)("h2", { children: e.title }), /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "eyebrow",
				style: { marginTop: 6 },
				children: [
					"Steckdosen · ",
					o,
					"/",
					a.length,
					" an"
				]
			})] }), /* @__PURE__ */ (0, M.jsx)("button", {
				className: "btn round",
				onClick: () => i(!r),
				title: "Liste ein-/ausklappen",
				children: /* @__PURE__ */ (0, M.jsx)(E, {
					icon: r ? "mdi:chevron-up" : "mdi:chevron-down",
					width: 20
				})
			})]
		}),
		/* @__PURE__ */ (0, M.jsx)(Tn, {
			count: a.length,
			onCount: o
		}),
		r && /* @__PURE__ */ (0, M.jsx)("div", {
			style: { marginTop: 10 },
			children: a.map(({ id: e, e: t }) => /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "list-row",
				style: { padding: "8px 12px" },
				children: [
					/* @__PURE__ */ (0, M.jsx)(E, {
						icon: e.includes("usb") ? "mdi:usb-port" : "mdi:power-socket-de",
						width: 20,
						className: "muted"
					}),
					/* @__PURE__ */ (0, M.jsx)("div", {
						style: {
							flex: 1,
							fontSize: 15,
							opacity: A(t) ? .5 : 1
						},
						children: Rt(t, e)
					}),
					A(t) && /* @__PURE__ */ (0, M.jsx)("span", {
						className: "chip bad",
						children: "offline"
					}),
					/* @__PURE__ */ (0, M.jsx)(en, {
						on: k(t),
						na: A(t),
						onClick: () => O(e.split(".")[0], "toggle", {}, e)
					})
				]
			}, e))
		})
	] });
}
function In({ events: e, limit: t = 4 }) {
	let n = e.filter((e) => e.end.getTime() > Date.now()), r = n.slice(0, t);
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [/* @__PURE__ */ (0, M.jsxs)("div", {
		className: "row",
		children: [/* @__PURE__ */ (0, M.jsx)("div", {
			className: "icon-chip",
			children: /* @__PURE__ */ (0, M.jsx)(E, {
				icon: "mdi:calendar-month-outline",
				width: 20
			})
		}), /* @__PURE__ */ (0, M.jsxs)("div", {
			style: { flex: 1 },
			children: [/* @__PURE__ */ (0, M.jsx)("h3", {
				style: { letterSpacing: ".06em" },
				children: "NÄCHSTE TERMINE"
			}), /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "sub",
				children: [n.length, " in 14 Tagen"]
			})]
		})]
	}), /* @__PURE__ */ (0, M.jsxs)("div", {
		style: {
			marginTop: 14,
			borderLeft: "2px solid rgba(255,255,255,.15)",
			marginLeft: 8,
			paddingLeft: 14
		},
		children: [r.length === 0 && /* @__PURE__ */ (0, M.jsx)("div", {
			className: "sub",
			children: "Keine Termine. Freie Bahn."
		}), r.map((e, t) => /* @__PURE__ */ (0, M.jsxs)("div", {
			style: {
				position: "relative",
				marginBottom: 10
			},
			children: [/* @__PURE__ */ (0, M.jsx)("span", { style: {
				position: "absolute",
				left: -21,
				top: 18,
				width: 12,
				height: 12,
				borderRadius: "50%",
				background: e.color,
				boxShadow: `0 0 10px ${e.color}`
			} }), /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "list-row",
				style: {
					borderColor: `${e.color}66`,
					background: `${e.color}1f`
				},
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					style: {
						flex: 1,
						minWidth: 0
					},
					children: [/* @__PURE__ */ (0, M.jsxs)("div", {
						className: "sub",
						style: { color: "var(--ink)" },
						children: [
							Yt(Math.max(0, Jt(e.start))).replace(/^./, (e) => e.toUpperCase()),
							" · ",
							e.allDay ? "ganztägig" : Gt(e.start)
						]
					}), /* @__PURE__ */ (0, M.jsx)("div", {
						style: {
							fontSize: 17,
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis"
						},
						children: e.summary
					})]
				}), /* @__PURE__ */ (0, M.jsx)(E, {
					icon: "mdi:calendar-blank",
					width: 20,
					style: { color: e.color }
				})]
			})]
		}, t))]
	})] });
}
function Ln() {
	let e = (P().todos ?? []).map((e, t) => ({
		...e,
		color: on(t, e.color)
	})), [t, n] = (0, l.useState)(0), r = e[Math.min(t, Math.max(0, e.length - 1))], { items: i, add: a, toggle: o, remove: s } = Ht(r), [c, u] = (0, l.useState)("");
	if (!r) return null;
	let d = i.filter((e) => e.status === "needs_action"), f = i.filter((e) => e.status === "completed").slice(0, 3), p = () => {
		c.trim() && a(c.trim()), u("");
	};
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		style: {
			display: "flex",
			flexDirection: "column"
		},
		children: [
			/* @__PURE__ */ (0, M.jsx)("h2", {
				style: { color: "#c4b5fd" },
				children: "Aufgaben"
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "sub",
				style: {
					color: "#f9a8d4",
					marginTop: 4
				},
				children: [
					d.length,
					" offen in „",
					r.label,
					"“"
				]
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				className: "row",
				style: {
					marginTop: 12,
					flexWrap: "wrap",
					gap: 6
				},
				children: e.map((e, r) => /* @__PURE__ */ (0, M.jsx)("button", {
					className: "chip",
					onClick: () => n(r),
					style: {
						cursor: "pointer",
						borderColor: r === t ? e.color : void 0,
						color: r === t ? e.color : void 0
					},
					children: e.label
				}, e.entity))
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				style: {
					marginTop: 12,
					flex: 1
				},
				children: [d.length === 0 && /* @__PURE__ */ (0, M.jsx)("div", {
					className: "sub",
					children: "Nichts offen."
				}), [...d, ...f].map((e) => /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "list-row",
					style: {
						borderLeft: `3px solid ${r.color}`,
						background: `${r.color}22`
					},
					children: [
						/* @__PURE__ */ (0, M.jsx)("span", {
							onClick: () => o(e),
							style: {
								width: 22,
								height: 22,
								borderRadius: "50%",
								border: `2px solid ${r.color}`,
								cursor: "pointer",
								flex: "0 0 auto",
								background: e.status === "completed" ? r.color : "transparent"
							}
						}),
						/* @__PURE__ */ (0, M.jsx)("div", {
							style: {
								flex: 1,
								fontSize: 17,
								textDecoration: e.status === "completed" ? "line-through" : "none",
								opacity: e.status === "completed" ? .55 : 1
							},
							children: e.summary
						}),
						/* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:close",
							className: "muted",
							style: { cursor: "pointer" },
							onClick: () => s(e)
						})
					]
				}, e.uid))]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "row",
				style: { marginTop: 14 },
				children: [/* @__PURE__ */ (0, M.jsx)("input", {
					value: c,
					onChange: (e) => u(e.target.value),
					onKeyDown: (e) => e.key === "Enter" && p(),
					placeholder: "Aufgabe hinzufügen …",
					style: {
						flex: 1,
						minWidth: 0,
						padding: "14px 16px",
						borderRadius: 14,
						border: "1px solid var(--line)",
						background: "rgba(0,0,0,.25)",
						color: "var(--ink)",
						outline: "none"
					}
				}), /* @__PURE__ */ (0, M.jsx)("button", {
					className: "btn primary",
					style: {
						width: 50,
						height: 50,
						borderRadius: 14,
						flex: "0 0 auto"
					},
					onClick: p,
					title: "Hinzufügen",
					children: /* @__PURE__ */ (0, M.jsx)(E, {
						icon: "mdi:plus",
						width: 24
					})
				})]
			})
		]
	});
}
function Rn() {
	let e = P().tv, t = Mt(e);
	if (!e) return null;
	let n = !!t && ![
		"off",
		"standby",
		"unavailable",
		"unknown"
	].includes(t.state), r = Math.round((t?.attributes.volume_level ?? 0) * 100), i = t?.attributes.media_title || t?.attributes.source || (n ? "Läuft" : "Aus");
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "card",
		style: {
			borderRadius: 0,
			border: 0,
			background: "rgba(80,70,20,.18)",
			display: "flex",
			alignItems: "center",
			gap: 22,
			flexWrap: "wrap"
		},
		children: [
			/* @__PURE__ */ (0, M.jsx)("div", {
				onClick: () => O("media_player", "toggle", {}, e),
				style: { cursor: "pointer" },
				title: "Ein/Aus",
				children: /* @__PURE__ */ (0, M.jsx)(wn, {
					on: n,
					width: 150
				})
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				style: {
					flex: "1 1 200px",
					minWidth: 0
				},
				children: [
					/* @__PURE__ */ (0, M.jsxs)("div", {
						className: "sub",
						children: [
							/* @__PURE__ */ (0, M.jsx)(E, {
								icon: "mdi:television",
								style: { verticalAlign: "-2px" }
							}),
							" ",
							Rt(t, "Fernseher")
						]
					}),
					/* @__PURE__ */ (0, M.jsx)("div", {
						style: {
							fontSize: 24,
							fontWeight: 600
						},
						children: "Fernseher"
					}),
					/* @__PURE__ */ (0, M.jsx)("div", {
						className: "sub",
						children: A(t) ? "nicht erreichbar" : i
					})
				]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "row",
				style: { gap: 12 },
				children: [
					/* @__PURE__ */ (0, M.jsx)("button", {
						className: "btn round",
						onClick: () => O("media_player", "media_previous_track", {}, e),
						disabled: !n,
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:skip-previous",
							width: 22
						})
					}),
					/* @__PURE__ */ (0, M.jsx)("button", {
						className: "btn big",
						onClick: () => O("media_player", n ? "media_play_pause" : "turn_on", {}, e),
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: n ? t?.state === "playing" ? "mdi:pause" : "mdi:play" : "mdi:power",
							width: 34
						})
					}),
					/* @__PURE__ */ (0, M.jsx)("button", {
						className: "btn round",
						onClick: () => O("media_player", "media_next_track", {}, e),
						disabled: !n,
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:skip-next",
							width: 22
						})
					})
				]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "row",
				style: { flex: "1 1 220px" },
				children: [/* @__PURE__ */ (0, M.jsx)(E, {
					icon: t?.attributes.is_volume_muted ? "mdi:volume-off" : "mdi:volume-high",
					width: 22,
					style: { cursor: "pointer" },
					onClick: () => O("media_player", "volume_mute", { is_volume_muted: !t?.attributes.is_volume_muted }, e)
				}), /* @__PURE__ */ (0, M.jsx)("div", {
					style: { flex: 1 },
					children: /* @__PURE__ */ (0, M.jsx)($t, {
						value: r,
						onCommit: (t) => O("media_player", "volume_set", { volume_level: t / 100 }, e),
						disabled: !n
					})
				})]
			})
		]
	});
}
// src/hacard.tsx
function zn({ config: e }) {
	let t = (0, l.useRef)(null), n = (0, l.useRef)(null), [r, i] = (0, l.useState)(0), a = JSON.stringify(e);
	return (0, l.useEffect)(() => {
		let e = !0, r = window;
		return (async () => {
			if (!r.loadCardHelpers) return;
			let o = await r.loadCardHelpers();
			if (!e || !t.current) return;
			let s = o.createCardElement(JSON.parse(a));
			s.hass = kt(), s.addEventListener("ll-rebuild", (e) => {
				e.stopPropagation(), i((e) => e + 1);
			}), t.current.replaceChildren(s), n.current = s;
		})(), () => {
			e = !1;
		};
	}, [a, r]), (0, l.useEffect)(() => At(() => {
		n.current && (n.current.hass = kt());
	}), []), /* @__PURE__ */ (0, M.jsx)("div", {
		ref: t,
		className: "ha-card-host"
	});
}
// src/pages/House.tsx
var Bn = (e, t) => t.includes("*") ? RegExp(`^${t.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`).test(e) : e === t, Vn = [
	"hs",
	"xy",
	"rgb",
	"rgbw",
	"rgbww"
], Hn = "linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)";
function Un({ e }) {
	let t = e.entity_id, n = e.attributes.supported_color_modes ?? [], r = n.some((e) => Vn.includes(e)), i = n.includes("color_temp"), a = n.some((e) => e !== "onoff"), o = k(e), s = o ? Math.round((e.attributes.brightness ?? 255) / 2.55) : 0, c = e.attributes.hs_color, l = c ? Math.round(c[0] / 360 * 100) : 0, u = e.attributes.min_color_temp_kelvin ?? 2e3, d = e.attributes.max_color_temp_kelvin ?? 6500, f = e.attributes.color_temp_kelvin ?? u, p = Math.round((f - u) / Math.max(1, d - u) * 100), m = Nn.filter((e) => "hs_color" in e.data ? r : i);
	return !a && !r && !i ? /* @__PURE__ */ (0, M.jsx)("div", {
		className: "sub",
		children: "Diese Lampe kann nur an und aus."
	}) : /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "col",
		style: {
			gap: 12,
			padding: "4px 2px 2px"
		},
		children: [
			a && /* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "label-row",
				children: [/* @__PURE__ */ (0, M.jsx)("span", { children: "Helligkeit" }), /* @__PURE__ */ (0, M.jsxs)("span", {
					className: "mono",
					children: [s, "%"]
				})]
			}), /* @__PURE__ */ (0, M.jsx)($t, {
				value: s,
				gradient: `linear-gradient(90deg, rgba(255,255,255,.15), ${o ? j(e) : "#9ca3af"})`,
				onCommit: (e) => e === 0 ? O("light", "turn_off", {}, t) : O("light", "turn_on", { brightness_pct: e }, t)
			})] }),
			r && /* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "label-row",
				children: [/* @__PURE__ */ (0, M.jsx)("span", { children: "Farbe" }), /* @__PURE__ */ (0, M.jsx)("span", {
					className: "mono",
					children: c && e.attributes.color_mode !== "color_temp" ? `${Math.round(c[0])}°` : "–"
				})]
			}), /* @__PURE__ */ (0, M.jsx)($t, {
				value: l,
				gradient: Hn,
				onCommit: (e) => O("light", "turn_on", { hs_color: [Math.round(e / 100 * 360) % 360, 100] }, t)
			})] }),
			i && /* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "label-row",
				children: [/* @__PURE__ */ (0, M.jsx)("span", { children: "Weißton" }), /* @__PURE__ */ (0, M.jsx)("span", {
					className: "mono",
					children: e.attributes.color_mode === "color_temp" ? `${f} K` : "–"
				})]
			}), /* @__PURE__ */ (0, M.jsx)($t, {
				value: p,
				gradient: "linear-gradient(90deg,#ffb35c,#fff1dc,#dbe8ff)",
				onCommit: (e) => O("light", "turn_on", { color_temp_kelvin: Math.round(u + e / 100 * (d - u)) }, t)
			})] }),
			m.length > 0 && /* @__PURE__ */ (0, M.jsx)("div", {
				className: "swatches",
				style: { marginTop: 2 },
				children: m.map((e) => /* @__PURE__ */ (0, M.jsx)("div", {
					title: e.label,
					className: "swatch",
					style: {
						background: e.css,
						color: e.css
					},
					onClick: () => O("light", "turn_on", e.data, t)
				}, e.label))
			})
		]
	});
}
function Wn() {
	let e = P(), t = D(), { entities: n, devices: r, areas: i } = It(), [a, o] = (0, l.useState)("alle"), [s, c] = (0, l.useState)(null), u = (0, l.useMemo)(() => {
		let a = e.switchboard_exclude ?? [], o = Object.values(t).filter((e) => {
			let t = e.entity_id.split(".")[0];
			if (t !== "light" && t !== "switch") return !1;
			let r = n[e.entity_id];
			return !(r?.hidden || r?.entity_category || r?.platform === "adaptive_lighting" || r?.platform === "group" || Array.isArray(e.attributes.entity_id) || a.some((t) => Bn(e.entity_id, t)));
		}), s = /* @__PURE__ */ new Map();
		return o.forEach((e) => {
			let t = n[e.entity_id], a = t?.area_id || (t?.device_id ? r[t.device_id]?.area_id : null) || "_", o = a === "_" ? "Ohne Raum" : i[a]?.name ?? a;
			s.has(a) || s.set(a, {
				name: o,
				items: []
			}), s.get(a).items.push(e);
		}), [...s.entries()].map(([e, t]) => ({
			id: e,
			...t,
			items: t.items.sort((e, t) => String(e.attributes.friendly_name).localeCompare(String(t.attributes.friendly_name), "de"))
		})).sort((e, t) => e.id === "_" ? 1 : t.id === "_" ? -1 : e.name.localeCompare(t.name, "de"));
	}, [
		t,
		n,
		r,
		i,
		e.switchboard_exclude
	]), d = (e) => a === "alle" || a === "lampen" && e.entity_id.startsWith("light.") || a === "verbraucher" && e.entity_id.startsWith("switch.") || a === "an" && k(e), f = u.flatMap((e) => e.items), p = f.filter((e) => e.entity_id.startsWith("light.") && !A(e)), m = f.filter((e) => e.entity_id.startsWith("switch.") && !A(e)), h = (e, t) => e.toLowerCase().startsWith(t.toLowerCase() + " ") ? e.slice(t.length + 1) : e;
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		style: {
			display: "flex",
			flexDirection: "column",
			background: "rgba(22, 18, 40, .78)"
		},
		children: [
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "between",
				style: { flexWrap: "wrap" },
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "section-title",
					style: { margin: 0 },
					children: [/* @__PURE__ */ (0, M.jsx)("span", {
						className: "icon-chip",
						style: { background: "rgba(250,204,21,.2)" },
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:light-switch",
							width: 20,
							color: "#facc15"
						})
					}), "Schaltzentrale"]
				}), /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "row",
					style: { gap: 6 },
					children: [/* @__PURE__ */ (0, M.jsxs)("span", {
						className: "chip ok",
						children: [
							/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:lightbulb-on-outline" }),
							" ",
							p.filter(k).length,
							"/",
							p.length
						]
					}), /* @__PURE__ */ (0, M.jsxs)("span", {
						className: "chip",
						children: [
							/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:power-socket-de" }),
							" ",
							m.filter(k).length,
							"/",
							m.length
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "row",
				style: {
					marginTop: 14,
					gap: 8,
					flexWrap: "wrap"
				},
				children: [/* @__PURE__ */ (0, M.jsxs)("button", {
					className: "btn",
					onClick: () => O("light", "turn_off", {}, p.filter(k).map((e) => e.entity_id)),
					disabled: !p.some(k),
					children: [/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:lightbulb-off-outline" }), " Alle Lampen aus"]
				}), /* @__PURE__ */ (0, M.jsxs)("button", {
					className: "btn",
					onClick: () => O("switch", "turn_off", {}, m.filter(k).map((e) => e.entity_id)),
					disabled: !m.some(k),
					children: [/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:power-plug-off-outline" }), " Alle Verbraucher aus"]
				})]
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				className: "seg",
				style: { marginTop: 12 },
				children: [
					"alle",
					"lampen",
					"verbraucher",
					"an"
				].map((e) => /* @__PURE__ */ (0, M.jsx)("button", {
					className: e === a ? "sel blue" : "",
					onClick: () => o(e),
					children: {
						alle: "Alle",
						lampen: "Lampen",
						verbraucher: "Verbraucher",
						an: "Nur an"
					}[e]
				}, e))
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					marginTop: 14,
					overflowY: "auto",
					maxHeight: "calc(100vh - 330px)",
					minHeight: 300,
					paddingRight: 4
				},
				children: u.map((e) => {
					let t = e.items.filter(d);
					if (!t.length) return null;
					let n = t.filter(k).map((e) => e.entity_id);
					return /* @__PURE__ */ (0, M.jsxs)("div", {
						style: { marginBottom: 16 },
						children: [/* @__PURE__ */ (0, M.jsxs)("div", {
							className: "between",
							style: { margin: "0 4px 8px" },
							children: [/* @__PURE__ */ (0, M.jsxs)("span", {
								className: "eyebrow",
								style: { color: "var(--ink-2)" },
								children: [
									e.name,
									" · ",
									n.length,
									"/",
									t.length,
									" an"
								]
							}), n.length > 0 && /* @__PURE__ */ (0, M.jsx)("button", {
								className: "chip",
								style: { cursor: "pointer" },
								onClick: () => O("homeassistant", "turn_off", {}, n),
								children: "alle aus"
							})]
						}), /* @__PURE__ */ (0, M.jsx)("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
								gap: 8
							},
							children: t.map((t) => {
								let n = t.entity_id.startsWith("light."), r = k(t), i = s === t.entity_id, a = n && r && t.attributes.brightness !== void 0 ? Math.round(t.attributes.brightness / 2.55) : null;
								return /* @__PURE__ */ (0, M.jsxs)("div", {
									className: "list-row",
									style: {
										margin: 0,
										padding: "9px 12px",
										display: "block",
										gridColumn: i ? "1 / -1" : void 0,
										background: r ? n ? "rgba(250,204,21,.14)" : "rgba(94,234,212,.12)" : void 0,
										borderColor: i ? "rgba(255,255,255,.45)" : r ? n ? "rgba(250,204,21,.4)" : "rgba(94,234,212,.35)" : void 0
									},
									children: [/* @__PURE__ */ (0, M.jsxs)("div", {
										className: "row",
										children: [
											/* @__PURE__ */ (0, M.jsx)(E, {
												icon: n ? r ? "mdi:lightbulb-on" : "mdi:lightbulb-outline" : t.entity_id.includes("usb") ? "mdi:usb-port" : "mdi:power-socket-de",
												width: 20,
												color: r ? n ? j(t) : "#5eead4" : void 0
											}),
											/* @__PURE__ */ (0, M.jsxs)("span", {
												onClick: () => n && !A(t) && c(i ? null : t.entity_id),
												style: {
													flex: 1,
													minWidth: 0,
													fontSize: 14.5,
													whiteSpace: "nowrap",
													overflow: "hidden",
													textOverflow: "ellipsis",
													opacity: A(t) ? .5 : 1,
													cursor: n ? "pointer" : "default"
												},
												title: n ? "Tippen: Helligkeit und Farbe" : void 0,
												children: [h(String(t.attributes.friendly_name ?? t.entity_id), e.name), a !== null && /* @__PURE__ */ (0, M.jsxs)("span", {
													className: "muted",
													style: {
														marginLeft: 6,
														fontSize: 12
													},
													children: [a, "%"]
												})]
											}),
											n && !A(t) && /* @__PURE__ */ (0, M.jsx)(E, {
												icon: i ? "mdi:chevron-up" : "mdi:tune-variant",
												width: 18,
												className: "muted",
												style: {
													cursor: "pointer",
													flex: "0 0 auto"
												},
												onClick: () => c(i ? null : t.entity_id)
											}),
											/* @__PURE__ */ (0, M.jsx)(en, {
												on: r,
												na: A(t),
												onClick: () => O(n ? "light" : "switch", "toggle", {}, t.entity_id)
											})
										]
									}), i && /* @__PURE__ */ (0, M.jsx)("div", {
										style: { marginTop: 10 },
										children: /* @__PURE__ */ (0, M.jsx)(Un, { e: t })
									})]
								}, t.entity_id);
							})
						})]
					}, e.id);
				})
			})
		]
	});
}
function Gn() {
	let e = P().house_cards ?? [];
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "house-grid",
		children: [/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "col",
			style: {
				gap: 18,
				minWidth: 0
			},
			children: [e.map((e, t) => /* @__PURE__ */ (0, M.jsxs)(N, {
				style: { padding: 0 },
				children: [e.title && /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "row",
					style: { padding: "16px 20px 10px" },
					children: [/* @__PURE__ */ (0, M.jsx)("span", {
						className: "icon-chip",
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: e.icon ?? "mdi:view-dashboard-outline",
							width: 20
						})
					}), /* @__PURE__ */ (0, M.jsx)("h3", {
						style: { fontSize: 20 },
						children: e.title
					})]
				}), /* @__PURE__ */ (0, M.jsx)(zn, { config: e.card })]
			}, t)), e.length === 0 && /* @__PURE__ */ (0, M.jsx)(N, { children: /* @__PURE__ */ (0, M.jsx)("div", {
				className: "sub",
				children: "Unter „house_cards“ lassen sich hier beliebige Home-Assistant-Karten einbinden, z. B. Lageplan oder Grundriss."
			}) })]
		}), /* @__PURE__ */ (0, M.jsx)(Wn, {})]
	});
}
// src/pages/Home.tsx
var Kn = {
	docked: "Angedockt",
	cleaning: "Saugt",
	returning: "Fährt zur Station",
	paused: "Pausiert",
	idle: "Bereit",
	error: "Fehler",
	unavailable: "Offline"
};
function qn() {
	let e = P(), t = e.vacuum, n = Mt(e.vacuum), r = n?.state ?? "unavailable", i = n?.attributes.fan_speed_list ?? [], a = n?.attributes.battery_level, o = r === "cleaning";
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "between",
			children: [/* @__PURE__ */ (0, M.jsx)("h2", { children: e.vacuum_name ?? "Saugroboter" }), /* @__PURE__ */ (0, M.jsx)(E, {
				icon: "mdi:robot-vacuum",
				width: 22,
				className: "muted"
			})]
		}),
		/* @__PURE__ */ (0, M.jsx)("div", {
			className: "eyebrow",
			style: { marginTop: 4 },
			children: n?.attributes.friendly_name ?? "Saugroboter"
		}),
		/* @__PURE__ */ (0, M.jsx)("div", {
			className: "row",
			style: { marginTop: 10 },
			children: /* @__PURE__ */ (0, M.jsxs)("span", {
				className: `chip ${r === "error" ? "bad" : o ? "warn" : "ok"}`,
				children: [
					"● ",
					Kn[r] ?? r,
					a === void 0 ? "" : ` · ${a}%`
				]
			})
		}),
		/* @__PURE__ */ (0, M.jsx)("div", {
			style: {
				display: "flex",
				justifyContent: "flex-end"
			},
			children: /* @__PURE__ */ (0, M.jsx)(Cn, { active: o })
		}),
		i.length > 0 && /* @__PURE__ */ (0, M.jsxs)(M.Fragment, { children: [/* @__PURE__ */ (0, M.jsx)("div", {
			className: "label-row",
			style: { marginTop: 6 },
			children: /* @__PURE__ */ (0, M.jsx)("span", { children: "Saugstufe" })
		}), /* @__PURE__ */ (0, M.jsx)(tn, {
			options: i,
			value: n?.attributes.fan_speed,
			onChange: (e) => O("vacuum", "set_fan_speed", { fan_speed: e }, t)
		})] }),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "row",
			style: {
				marginTop: 12,
				flexWrap: "wrap"
			},
			children: [
				/* @__PURE__ */ (0, M.jsxs)("button", {
					className: "btn",
					style: { flex: 1 },
					disabled: A(n),
					onClick: () => O("vacuum", o ? "pause" : "start", {}, t),
					children: [
						/* @__PURE__ */ (0, M.jsx)(E, { icon: o ? "mdi:pause" : "mdi:play" }),
						" ",
						o ? "Pause" : "Saugen"
					]
				}),
				/* @__PURE__ */ (0, M.jsxs)("button", {
					className: "btn",
					style: { flex: 1 },
					disabled: A(n),
					onClick: () => O("vacuum", "return_to_base", {}, t),
					children: [/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:home-import-outline" }), " Zur Station"]
				}),
				/* @__PURE__ */ (0, M.jsx)("button", {
					className: "btn",
					disabled: A(n),
					onClick: () => O("vacuum", "locate", {}, t),
					title: "Robi piepen lassen",
					children: /* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:map-marker-radius-outline" })
				})
			]
		})
	] });
}
function Jn({ events: e }) {
	let t = P(), n = t.rooms ?? [], r = n.filter((e) => (e.lights ?? []).length > 0), i = n.filter((e) => (e.switches ?? []).length > 0), a = r.filter((e, t) => t % 2 == 0), o = r.filter((e, t) => t % 2 == 1);
	return /* @__PURE__ */ (0, M.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, M.jsxs)("div", {
			className: "board home-board",
			children: [
				/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "stack",
					style: {
						gridColumn: 1,
						gridRow: "1 / span 2"
					},
					children: [/* @__PURE__ */ (0, M.jsx)(kn, {}), /* @__PURE__ */ (0, M.jsx)(jn, {})]
				}),
				/* @__PURE__ */ (0, M.jsx)("div", {
					className: "stack",
					style: {
						gridColumn: 2,
						gridRow: 1
					},
					children: a.map((e) => /* @__PURE__ */ (0, M.jsx)(Pn, { room: e }, e.id))
				}),
				/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "stack",
					style: {
						gridColumn: 3,
						gridRow: 1
					},
					children: [o.map((e) => /* @__PURE__ */ (0, M.jsx)(Pn, { room: e }, e.id)), t.vacuum && /* @__PURE__ */ (0, M.jsx)(qn, {})]
				}),
				/* @__PURE__ */ (0, M.jsx)("div", {
					className: "stack",
					style: {
						gridColumn: 4,
						gridRow: 1
					},
					children: i.map((e) => /* @__PURE__ */ (0, M.jsx)(Fn, {
						room: e,
						compact: !0
					}, e.id))
				}),
				/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "stack",
					style: {
						gridColumn: 5,
						gridRow: "1 / span 2"
					},
					children: [
						/* @__PURE__ */ (0, M.jsx)(In, { events: e }),
						/* @__PURE__ */ (0, M.jsx)(Mn, {}),
						/* @__PURE__ */ (0, M.jsx)(Ln, {})
					]
				}),
				/* @__PURE__ */ (0, M.jsx)("div", {
					className: "wide",
					style: { gridRow: 2 },
					children: /* @__PURE__ */ (0, M.jsx)(Rn, {})
				})
			]
		})
	});
}
// src/pages/Week.tsx
var Yn = [
	"SO",
	"MO",
	"DI",
	"MI",
	"DO",
	"FR",
	"SA"
];
function Xn(e) {
	let t = [], n = /* @__PURE__ */ new Date();
	n.setHours(0, 0, 0, 0);
	for (let r = 0; r < e; r++) t.push(new Date(n.getTime() + r * 864e5));
	return t;
}
function Zn({ events: e }) {
	let t = e.filter((e) => e.end.getTime() > Date.now()).slice(0, 3);
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: 12
		},
		children: [
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "section-title",
				style: { margin: 0 },
				children: [/* @__PURE__ */ (0, M.jsx)("span", {
					className: "icon-chip",
					children: /* @__PURE__ */ (0, M.jsx)(E, {
						icon: "mdi:calendar-star",
						width: 20
					})
				}), "Demnächst"]
			}),
			t.length === 0 && /* @__PURE__ */ (0, M.jsx)("div", {
				className: "sub",
				children: "Nichts geplant."
			}),
			t.map((e, t) => /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "list-row",
				style: {
					borderLeft: `4px solid ${e.color}`,
					padding: "12px 14px"
				},
				children: [
					/* @__PURE__ */ (0, M.jsxs)("div", {
						style: {
							textAlign: "center",
							minWidth: 46
						},
						children: [/* @__PURE__ */ (0, M.jsx)("div", {
							style: {
								fontSize: 26,
								fontWeight: 700,
								lineHeight: 1
							},
							children: e.start.getDate()
						}), /* @__PURE__ */ (0, M.jsx)("div", {
							className: "eyebrow",
							children: e.start.toLocaleDateString("de-DE", { month: "short" })
						})]
					}),
					/* @__PURE__ */ (0, M.jsxs)("div", {
						style: {
							flex: 1,
							minWidth: 0
						},
						children: [/* @__PURE__ */ (0, M.jsx)("div", {
							style: {
								fontSize: 17,
								fontWeight: 600,
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis"
							},
							children: e.summary
						}), /* @__PURE__ */ (0, M.jsxs)("div", {
							className: "sub",
							children: [
								e.start.toLocaleDateString("de-DE", { weekday: "short" }),
								" · ",
								e.allDay ? "ganztägig" : Gt(e.start)
							]
						})]
					}),
					/* @__PURE__ */ (0, M.jsx)("span", {
						className: "chip",
						children: Yt(Jt(e.start))
					})
				]
			}, t))
		]
	});
}
function Qn({ events: e }) {
	let t = An(), n = Xn(14);
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [/* @__PURE__ */ (0, M.jsxs)("div", {
		className: "between",
		style: { marginBottom: 12 },
		children: [/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "section-title",
			style: { margin: 0 },
			children: [/* @__PURE__ */ (0, M.jsx)("span", {
				className: "icon-chip",
				children: /* @__PURE__ */ (0, M.jsx)(E, {
					icon: "mdi:calendar-range",
					width: 20
				})
			}), "14 Tage"]
		}), /* @__PURE__ */ (0, M.jsx)("span", {
			className: "sub",
			children: "Müll · Termine"
		})]
	}), /* @__PURE__ */ (0, M.jsx)("div", {
		style: {
			display: "grid",
			gridTemplateColumns: "repeat(7, minmax(0,1fr))",
			gap: 10
		},
		children: n.map((n, r) => {
			let i = t.filter((e) => e.date && qt(e.date, n)), a = e.filter((e) => e.allDay ? n >= e.start && n < e.end : qt(e.start, n)), o = i.length ? i[0].color : null;
			return /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "list-row",
				style: {
					display: "block",
					margin: 0,
					minHeight: 92,
					padding: "10px 10px",
					border: r === 0 ? "2px solid rgba(255,255,255,.7)" : o ? `2px solid ${o}` : void 0,
					boxShadow: o ? `0 0 16px ${o}55` : void 0,
					background: o ? `${o}22` : void 0
				},
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "between",
					children: [/* @__PURE__ */ (0, M.jsx)("span", {
						className: "eyebrow",
						style: { color: "var(--ink-2)" },
						children: r === 0 ? "HEUTE" : Yn[n.getDay()]
					}), /* @__PURE__ */ (0, M.jsx)("span", {
						style: { fontWeight: 700 },
						children: n.getDate()
					})]
				}), /* @__PURE__ */ (0, M.jsxs)("div", {
					style: {
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						gap: 4
					},
					children: [
						i.map((e) => /* @__PURE__ */ (0, M.jsxs)("span", {
							className: "chip",
							style: {
								background: e.color,
								color: "#111",
								border: 0,
								fontWeight: 700,
								justifyContent: "center"
							},
							children: [
								/* @__PURE__ */ (0, M.jsx)(E, { icon: e.icon }),
								" ",
								e.name.split(" ")[0]
							]
						}, e.id)),
						a.length > 0 && /* @__PURE__ */ (0, M.jsxs)("span", {
							className: "sub",
							style: { fontSize: 12 },
							children: [
								/* @__PURE__ */ (0, M.jsx)(E, {
									icon: "mdi:calendar",
									style: { verticalAlign: "-2px" }
								}),
								" ",
								a.length,
								" Termin",
								a.length > 1 ? "e" : ""
							]
						}),
						!i.length && !a.length && /* @__PURE__ */ (0, M.jsx)("span", {
							className: "muted",
							style: { fontSize: 14 },
							children: "frei"
						})
					]
				})]
			}, r);
		})
	})] });
}
function $n() {
	let e = /* @__PURE__ */ new Date(), t = e.getMonth() === 11 && e.getDate() > 24 ? e.getFullYear() + 1 : e.getFullYear(), n = new Date(t, 11, 24), r = Jt(n), i = new Date(t, 10, 1), a = Math.max(0, Math.min(100, (e.getTime() - i.getTime()) / (n.getTime() - i.getTime()) * 100));
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		style: {
			padding: 0,
			background: "linear-gradient(180deg,#1e3a5f 0%,#2b5876 60%,#dbeafe 60.5%,#f1f5f9 100%)",
			minHeight: 240
		},
		children: [
			/* @__PURE__ */ (0, M.jsxs)("svg", {
				viewBox: "0 0 400 240",
				style: {
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%"
				},
				preserveAspectRatio: "xMidYMax slice",
				children: [Array.from({ length: 30 }).map((e, t) => /* @__PURE__ */ (0, M.jsx)("circle", {
					cx: t * 47 % 400,
					cy: t * 31 % 140,
					r: 1.5 + t % 3,
					fill: "#fff",
					opacity: ".8",
					children: /* @__PURE__ */ (0, M.jsx)("animate", {
						attributeName: "cy",
						values: `${t * 31 % 140};${150 + t * 31 % 140}`,
						dur: `${6 + t % 5}s`,
						repeatCount: "indefinite"
					})
				}, t)), /* @__PURE__ */ (0, M.jsxs)("g", {
					transform: "translate(335 112) scale(.82)",
					children: [
						/* @__PURE__ */ (0, M.jsx)("rect", {
							x: "-6",
							y: "40",
							width: "12",
							height: "18",
							fill: "#7c4a1e"
						}),
						/* @__PURE__ */ (0, M.jsx)("path", {
							d: "M0 -60 L-44 44 H44 Z",
							fill: "#15803d"
						}),
						/* @__PURE__ */ (0, M.jsx)("path", {
							d: "M0 -60 L-30 10 H30 Z",
							fill: "#16a34a"
						}),
						/* @__PURE__ */ (0, M.jsx)("path", {
							d: "M0 -70 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z",
							fill: "#facc15"
						}),
						[
							[
								-20,
								20,
								"#ef4444"
							],
							[
								14,
								6,
								"#60a5fa"
							],
							[
								-6,
								-14,
								"#f472b6"
							],
							[
								24,
								32,
								"#facc15"
							]
						].map(([e, t, n], r) => /* @__PURE__ */ (0, M.jsx)("circle", {
							cx: e,
							cy: t,
							r: "4",
							fill: n
						}, r))
					]
				})]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				style: {
					position: "relative",
					padding: 22
				},
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "between",
					children: [/* @__PURE__ */ (0, M.jsx)("h2", { children: "Heiligabend" }), /* @__PURE__ */ (0, M.jsxs)("span", {
						style: {
							background: "#fff",
							color: "#111",
							borderRadius: 99,
							padding: "6px 14px",
							fontWeight: 700,
							fontSize: 20
						},
						children: [r, " Tage"]
					})]
				}), /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "sub",
					style: {
						color: "#e0f2fe",
						marginTop: 4
					},
					children: ["24. Dezember ", t]
				})]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				style: {
					position: "absolute",
					left: 22,
					right: 22,
					bottom: 18
				},
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "between",
					style: {
						color: "#0f172a",
						fontWeight: 600,
						marginBottom: 6
					},
					children: [/* @__PURE__ */ (0, M.jsx)("span", { children: "Weihnachten lädt …" }), /* @__PURE__ */ (0, M.jsxs)("span", { children: [Math.round(a), " %"] })]
				}), /* @__PURE__ */ (0, M.jsx)("div", {
					className: "bar",
					style: { background: "rgba(15,23,42,.2)" },
					children: /* @__PURE__ */ (0, M.jsx)("i", { style: {
						width: `${a}%`,
						background: "linear-gradient(90deg,#fde68a,#f97316)"
					} })
				})]
			})
		]
	});
}
function er({ events: e }) {
	let t = An(), n = Xn(7);
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		className: "section",
		children: [/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "section-title",
			children: [/* @__PURE__ */ (0, M.jsx)("span", {
				className: "icon-chip",
				children: /* @__PURE__ */ (0, M.jsx)(E, {
					icon: "mdi:checkbox-marked-outline",
					width: 20
				})
			}), "Meine Woche"]
		}), /* @__PURE__ */ (0, M.jsx)("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
				gap: 12
			},
			children: n.map((n, r) => {
				let i = e.filter((e) => e.allDay ? n >= e.start && n < e.end : qt(e.start, n)), a = t.filter((e) => e.date && qt(e.date, n));
				return /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "list-row",
					style: {
						display: "block",
						margin: 0,
						minHeight: 220,
						padding: 14,
						border: r === 0 ? "2px solid rgba(147,197,253,.8)" : void 0
					},
					children: [
						/* @__PURE__ */ (0, M.jsx)("div", {
							className: "eyebrow",
							children: r === 0 ? "HEUTE" : n.toLocaleDateString("de-DE", { weekday: "long" }).toUpperCase()
						}),
						/* @__PURE__ */ (0, M.jsxs)("div", {
							style: {
								fontSize: 24,
								fontWeight: 700,
								marginBottom: 10
							},
							children: [n.getDate(), "."]
						}),
						a.map((e) => /* @__PURE__ */ (0, M.jsxs)("div", {
							className: "list-row",
							style: {
								padding: "7px 10px",
								background: `${e.color}33`,
								borderColor: `${e.color}88`
							},
							children: [/* @__PURE__ */ (0, M.jsx)(E, {
								icon: e.icon,
								style: { color: e.color }
							}), /* @__PURE__ */ (0, M.jsxs)("span", {
								style: { fontSize: 14 },
								children: [e.name, " raus"]
							})]
						}, e.id)),
						i.map((e, t) => /* @__PURE__ */ (0, M.jsx)("div", {
							className: "list-row",
							style: {
								padding: "7px 10px",
								borderLeft: `3px solid ${e.color}`
							},
							children: /* @__PURE__ */ (0, M.jsxs)("div", {
								style: { minWidth: 0 },
								children: [/* @__PURE__ */ (0, M.jsx)("div", {
									style: {
										fontSize: 14,
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis"
									},
									children: e.summary
								}), /* @__PURE__ */ (0, M.jsx)("div", {
									className: "muted",
									style: { fontSize: 12 },
									children: e.allDay ? "ganztägig" : Gt(e.start)
								})]
							})
						}, t)),
						!i.length && !a.length && /* @__PURE__ */ (0, M.jsx)("div", {
							className: "muted",
							style: { fontSize: 14 },
							children: "Nichts eingetragen."
						})
					]
				}, r);
			})
		})]
	});
}
function tr() {
	let e = D(), t = (0, l.useMemo)(() => Object.values(e).filter((e) => e.entity_id.startsWith("sensor.") && e.attributes.device_class === "battery" && Number.isFinite(Number(e.state))).sort((e, t) => Number(e.state) - Number(t.state)).slice(0, 8), [e]), n = (t) => {
		let n = t.replace(/^sensor\./, "").replace(/_battery_level$|_batterie$|_battery$/, ""), r = e[`sensor.${n}_battery_state`]?.state ?? e[`binary_sensor.${n}_is_charging`]?.state;
		return r === "charging" || r === "on";
	};
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		className: "section",
		children: [
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "between",
				style: { marginBottom: 14 },
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "section-title",
					style: { margin: 0 },
					children: [/* @__PURE__ */ (0, M.jsx)("span", {
						className: "icon-chip",
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:battery-heart-variant",
							width: 20
						})
					}), "Akkus"]
				}), /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "row",
					children: [/* @__PURE__ */ (0, M.jsxs)("span", {
						className: "chip ok",
						children: [
							/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:lightning-bolt" }),
							" ",
							t.filter((e) => n(e.entity_id)).length,
							" lädt"
						]
					}), /* @__PURE__ */ (0, M.jsxs)("span", {
						className: "chip",
						children: [t.length, " Geräte"]
					})]
				})]
			}),
			t.length === 0 && /* @__PURE__ */ (0, M.jsx)("div", {
				className: "sub",
				children: "Keine Akkusensoren gefunden."
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				className: "grid-auto",
				children: t.map((e) => {
					let t = Number(e.state), r = n(e.entity_id), i = t < 20 ? "var(--bad)" : t < 40 ? "var(--warn)" : "var(--ok)";
					return /* @__PURE__ */ (0, M.jsxs)("div", {
						className: "list-row",
						style: {
							display: "block",
							margin: 0,
							padding: 16
						},
						children: [
							/* @__PURE__ */ (0, M.jsxs)("div", {
								className: "between",
								children: [/* @__PURE__ */ (0, M.jsxs)("div", {
									className: "row",
									style: { minWidth: 0 },
									children: [/* @__PURE__ */ (0, M.jsx)("span", {
										className: "icon-chip",
										style: {
											width: 34,
											height: 34
										},
										children: /* @__PURE__ */ (0, M.jsx)(E, { icon: e.attributes.icon || "mdi:battery" })
									}), /* @__PURE__ */ (0, M.jsx)("span", {
										style: {
											fontSize: 15,
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis"
										},
										children: String(e.attributes.friendly_name ?? e.entity_id).replace(/ ?(Akku(stand)?|Batterie(stand)?|Battery( level)?)$/i, "")
									})]
								}), r && /* @__PURE__ */ (0, M.jsx)(E, {
									icon: "mdi:lightning-bolt",
									color: "#facc15"
								})]
							}),
							/* @__PURE__ */ (0, M.jsxs)("div", {
								style: {
									fontSize: 40,
									fontWeight: 700,
									margin: "10px 0 8px"
								},
								children: [t, /* @__PURE__ */ (0, M.jsx)("span", {
									style: {
										fontSize: 18,
										fontWeight: 400
									},
									children: " %"
								})]
							}),
							/* @__PURE__ */ (0, M.jsx)(nn, {
								value: t,
								color: r ? "linear-gradient(90deg,#facc15,#f59e0b)" : i
							}),
							/* @__PURE__ */ (0, M.jsx)("div", {
								className: "sub",
								style: {
									marginTop: 8,
									color: r ? "#fde68a" : void 0
								},
								children: r ? "Lädt" : "Im Akkubetrieb"
							})
						]
					}, e.entity_id);
				})
			})
		]
	});
}
function nr({ events: e }) {
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "col",
		style: { gap: 18 },
		children: [
			/* @__PURE__ */ (0, M.jsxs)("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "minmax(260px, 1fr) minmax(0, 2.4fr) minmax(240px, 1fr)",
					gap: 18
				},
				className: "week-top",
				children: [
					/* @__PURE__ */ (0, M.jsx)(Zn, { events: e }),
					/* @__PURE__ */ (0, M.jsx)(Qn, { events: e }),
					/* @__PURE__ */ (0, M.jsx)($n, {})
				]
			}),
			/* @__PURE__ */ (0, M.jsx)(er, { events: e }),
			/* @__PURE__ */ (0, M.jsx)(tr, {})
		]
	});
}
// src/pages/Scenes.tsx
var rr = (e) => O(e.domain ?? e.entity.split(".")[0], e.service ?? (e.entity.startsWith("script.") ? "turn_on" : "toggle"), e.data ?? {}, e.entity);
function ir() {
	let e = P(), t = Wt(1e3), n = Mt(e.weather), r = n?.attributes.temperature;
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		style: {
			display: "flex",
			flexDirection: "column",
			minHeight: 620
		},
		children: [
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "between",
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "row",
					children: [/* @__PURE__ */ (0, M.jsx)("span", {
						className: "icon-chip",
						style: { background: "#0e7490" },
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:circle-outline",
							width: 20
						})
					}), /* @__PURE__ */ (0, M.jsx)("h3", {
						style: { fontSize: 22 },
						children: "Nachtwache"
					})]
				}), e.night_room && /* @__PURE__ */ (0, M.jsx)("span", {
					className: "chip",
					children: e.night_room
				})]
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					flex: 1,
					display: "grid",
					placeItems: "center",
					padding: "26px 0"
				},
				children: /* @__PURE__ */ (0, M.jsxs)("div", {
					style: {
						position: "relative",
						width: 300,
						height: 300,
						maxWidth: "80vw",
						maxHeight: "80vw"
					},
					children: [
						/* @__PURE__ */ (0, M.jsx)("div", { style: {
							position: "absolute",
							inset: 0,
							borderRadius: "50%",
							background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
							transform: "translate(18px, 6px)",
							filter: "brightness(.8)"
						} }),
						/* @__PURE__ */ (0, M.jsx)("div", { style: {
							position: "absolute",
							inset: 0,
							borderRadius: "50%",
							background: "#2563eb",
							boxShadow: "0 30px 60px rgba(0,0,0,.45)"
						} }),
						/* @__PURE__ */ (0, M.jsxs)("div", {
							style: {
								position: "absolute",
								inset: 18,
								borderRadius: "50%",
								overflow: "hidden",
								background: "#000"
							},
							children: [/* @__PURE__ */ (0, M.jsx)("div", { style: {
								position: "absolute",
								inset: "54% 0 0 0",
								background: "repeating-linear-gradient(45deg,#3b82f6 0 3px,#2563eb 3px 6px)"
							} }), /* @__PURE__ */ (0, M.jsxs)("div", {
								style: {
									position: "absolute",
									top: "18%",
									width: "100%",
									textAlign: "center"
								},
								children: [r !== void 0 && /* @__PURE__ */ (0, M.jsxs)("div", {
									className: "sub",
									style: { color: "#bfdbfe" },
									children: [
										/* @__PURE__ */ (0, M.jsx)(E, {
											icon: "mdi:weather-cloudy",
											style: { verticalAlign: "-2px" }
										}),
										" ",
										Math.round(r),
										"°"
									]
								}), /* @__PURE__ */ (0, M.jsx)("div", {
									className: "mono",
									style: {
										fontSize: 66,
										fontWeight: 300,
										lineHeight: 1.05
									},
									children: Gt(t)
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "list-row",
				style: { padding: 14 },
				children: [/* @__PURE__ */ (0, M.jsx)("span", { style: {
					width: 10,
					height: 10,
					borderRadius: "50%",
					background: "#94a3b8"
				} }), /* @__PURE__ */ (0, M.jsxs)("span", {
					className: "sub",
					children: [Kt(t), n ? ` · ${Dn[n.state] ?? n.state}` : ""]
				})]
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				className: "row",
				style: {
					flexWrap: "wrap",
					gap: 8,
					marginTop: 12
				},
				children: (e.night_actions ?? []).map((e) => /* @__PURE__ */ (0, M.jsxs)("button", {
					className: "btn",
					onClick: () => rr(e),
					children: [
						e.icon && /* @__PURE__ */ (0, M.jsx)(E, { icon: e.icon }),
						" ",
						e.label
					]
				}, e.entity + e.label))
			})
		]
	});
}
function ar({ a: e }) {
	let t = Mt(e.entity), n = k(t);
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		onClick: () => !A(t) && O(e.entity.split(".")[0], "toggle", {}, e.entity),
		style: {
			cursor: "pointer",
			borderRadius: 14,
			padding: "12px 8px",
			textAlign: "center",
			flex: 1,
			minWidth: 90,
			background: n ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.08)",
			color: n ? "#111" : "var(--ink)",
			border: "1px solid var(--line)",
			transition: "all .2s"
		},
		children: [
			/* @__PURE__ */ (0, M.jsx)(E, {
				icon: e.icon ?? "mdi:toggle-switch-outline",
				width: 22
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					fontSize: 13,
					fontWeight: 600,
					marginTop: 4
				},
				children: e.label
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					fontSize: 12,
					opacity: .7
				},
				children: A(t) ? "offline" : n ? "An" : "Aus"
			})
		]
	});
}
function or({ onFire: e }) {
	let [t, n] = (0, l.useState)(0), r = (0, l.useRef)(null), i = () => {
		r.current && clearInterval(r.current), r.current = null, n(0);
	};
	return /* @__PURE__ */ (0, M.jsxs)("button", {
		className: "btn",
		onPointerDown: () => {
			let t = Date.now();
			r.current = window.setInterval(() => {
				let r = Math.min(100, (Date.now() - t) / 1600 * 100);
				n(r), r >= 100 && (i(), e());
			}, 30);
		},
		onPointerUp: i,
		onPointerLeave: i,
		style: {
			width: "100%",
			padding: 14,
			position: "relative",
			overflow: "hidden",
			borderColor: "rgba(248,113,113,.6)",
			background: "rgba(127,29,29,.35)"
		},
		children: [/* @__PURE__ */ (0, M.jsx)("span", { style: {
			position: "absolute",
			left: 0,
			top: 0,
			bottom: 0,
			width: `${t}%`,
			background: "rgba(239,68,68,.6)"
		} }), /* @__PURE__ */ (0, M.jsxs)("span", {
			style: { position: "relative" },
			children: [/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:alert-octagon" }), " Notaus – gedrückt halten"]
		})]
	});
}
function sr() {
	let e = P(), t = Wt(1e3), n = Mt(e.weather), r = D(), i = n?.attributes.temperature;
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		style: { minHeight: 620 },
		children: [
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "between",
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "row",
					children: [/* @__PURE__ */ (0, M.jsx)("span", {
						className: "icon-chip",
						style: { background: "#155e75" },
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:tablet-dashboard",
							width: 20
						})
					}), /* @__PURE__ */ (0, M.jsx)("h3", {
						style: { fontSize: 22 },
						children: "Zentrale"
					})]
				}), /* @__PURE__ */ (0, M.jsx)("span", {
					className: "chip",
					children: "Ganzes Haus"
				})]
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					marginTop: 18,
					borderRadius: 26,
					padding: 14,
					background: "#16181d",
					boxShadow: "0 20px 40px rgba(0,0,0,.45)"
				},
				children: /* @__PURE__ */ (0, M.jsxs)("div", {
					style: {
						borderRadius: 16,
						padding: 18,
						background: "linear-gradient(135deg,#1e1b4b,#3b0764 60%,#4c1d95)"
					},
					children: [/* @__PURE__ */ (0, M.jsxs)("div", {
						className: "between",
						style: { alignItems: "flex-start" },
						children: [/* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsx)("div", {
							className: "mono",
							style: {
								fontSize: 54,
								fontWeight: 300,
								lineHeight: 1
							},
							children: Gt(t)
						}), /* @__PURE__ */ (0, M.jsx)("div", {
							className: "sub",
							children: Kt(t)
						})] }), n && /* @__PURE__ */ (0, M.jsxs)("div", {
							style: { textAlign: "right" },
							children: [/* @__PURE__ */ (0, M.jsxs)("div", {
								style: { fontSize: 30 },
								children: [i === void 0 ? "–" : Math.round(i), "°"]
							}), /* @__PURE__ */ (0, M.jsx)("div", {
								className: "sub",
								children: Dn[n.state] ?? n.state
							})]
						})]
					}), /* @__PURE__ */ (0, M.jsx)("div", {
						className: "row",
						style: {
							marginTop: 26,
							gap: 8,
							flexWrap: "wrap"
						},
						children: (e.house_switches ?? []).map((e) => /* @__PURE__ */ (0, M.jsx)(ar, { a: e }, e.entity))
					})]
				})
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				className: "eyebrow",
				style: { margin: "22px 0 10px" },
				children: "Abläufe"
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 10
				},
				children: (e.routines ?? []).filter((e) => r[e.entity]).map((e, t) => /* @__PURE__ */ (0, M.jsxs)("button", {
					className: "list-row",
					style: {
						margin: 0,
						cursor: "pointer",
						textAlign: "left"
					},
					onClick: () => rr(e),
					children: [/* @__PURE__ */ (0, M.jsx)("span", {
						className: "icon-chip",
						style: {
							background: on(t, e.color),
							border: 0
						},
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: e.icon ?? "mdi:play",
							width: 20,
							color: "#fff"
						})
					}), /* @__PURE__ */ (0, M.jsx)("span", {
						style: {
							fontSize: 16,
							fontWeight: 600
						},
						children: e.label
					})]
				}, e.entity))
			}),
			e.emergency && r[e.emergency] && /* @__PURE__ */ (0, M.jsxs)("div", {
				style: { marginTop: 14 },
				children: [/* @__PURE__ */ (0, M.jsx)(or, { onFire: () => O("script", "turn_on", {}, e.emergency) }), e.emergency_reset && r[e.emergency_reset] && /* @__PURE__ */ (0, M.jsxs)("button", {
					className: "btn",
					style: {
						width: "100%",
						marginTop: 8
					},
					onClick: () => O("script", "turn_on", {}, e.emergency_reset),
					children: [/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:restore-alert" }), " Notaus aufheben"]
				})]
			})
		]
	});
}
function cr() {
	let e = P(), t = e.tv, n = Mt(e.tv), r = Mt(e.tv_plug), i = !!n && ![
		"off",
		"standby",
		"unavailable",
		"unknown"
	].includes(n.state), a = n?.attributes.source_list ?? [], o = Math.round((n?.attributes.volume_level ?? 0) * 100);
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		style: { minHeight: 620 },
		children: [
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "between",
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "row",
					children: [/* @__PURE__ */ (0, M.jsx)("span", {
						className: "icon-chip",
						style: {
							background: "#16a34a",
							border: 0
						},
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:television-classic",
							width: 20
						})
					}), /* @__PURE__ */ (0, M.jsx)("h3", {
						style: { fontSize: 22 },
						children: "Fernseher"
					})]
				}), e.tv_room && /* @__PURE__ */ (0, M.jsx)("span", {
					className: "chip ok",
					children: e.tv_room
				})]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "row",
				style: {
					marginTop: 18,
					alignItems: "flex-start"
				},
				children: [/* @__PURE__ */ (0, M.jsx)("div", {
					style: {
						borderRadius: 18,
						overflow: "hidden",
						background: "linear-gradient(135deg,#065f46,#16a34a)",
						padding: 10,
						cursor: "pointer"
					},
					onClick: () => O("media_player", "toggle", {}, t),
					children: /* @__PURE__ */ (0, M.jsx)(wn, {
						on: i,
						color: "#4ade80",
						width: 170
					})
				}), /* @__PURE__ */ (0, M.jsxs)("div", {
					style: {
						paddingLeft: 8,
						minWidth: 0
					},
					children: [/* @__PURE__ */ (0, M.jsx)("div", {
						style: {
							fontSize: 26,
							fontWeight: 700
						},
						children: i ? n?.attributes.source || "An" : "Aus"
					}), /* @__PURE__ */ (0, M.jsx)("div", {
						className: "sub",
						children: n?.attributes.media_title || (A(n) ? "nicht erreichbar" : i ? "Läuft" : "Tippen zum Einschalten")
					})]
				})]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "row",
				style: {
					justifyContent: "space-around",
					marginTop: 26
				},
				children: [
					/* @__PURE__ */ (0, M.jsx)("button", {
						className: "btn round",
						onClick: () => O("media_player", "volume_down", {}, t),
						disabled: !i,
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:volume-minus",
							width: 22
						})
					}),
					/* @__PURE__ */ (0, M.jsx)("button", {
						className: "btn round",
						onClick: () => O("media_player", "media_previous_track", {}, t),
						disabled: !i,
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:skip-previous",
							width: 22
						})
					}),
					/* @__PURE__ */ (0, M.jsx)("button", {
						className: "btn big",
						style: {
							background: "#22c55e",
							color: "#fff"
						},
						onClick: () => O("media_player", i ? "media_play_pause" : "turn_on", {}, t),
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: i ? n?.state === "playing" ? "mdi:pause" : "mdi:play" : "mdi:power",
							width: 34
						})
					}),
					/* @__PURE__ */ (0, M.jsx)("button", {
						className: "btn round",
						onClick: () => O("media_player", "media_next_track", {}, t),
						disabled: !i,
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:skip-next",
							width: 22
						})
					}),
					/* @__PURE__ */ (0, M.jsx)("button", {
						className: "btn round",
						onClick: () => O("media_player", "volume_up", {}, t),
						disabled: !i,
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:volume-plus",
							width: 22
						})
					})
				]
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				style: { marginTop: 18 },
				children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "label-row",
					children: [/* @__PURE__ */ (0, M.jsx)("span", { children: "Lautstärke" }), /* @__PURE__ */ (0, M.jsxs)("span", { children: [o, "%"] })]
				}), /* @__PURE__ */ (0, M.jsx)($t, {
					value: o,
					onCommit: (e) => O("media_player", "volume_set", { volume_level: e / 100 }, t),
					disabled: !i,
					gradient: "linear-gradient(90deg,#16a34a,#4ade80)"
				})]
			}),
			/* @__PURE__ */ (0, M.jsx)("div", {
				className: "eyebrow",
				style: { margin: "22px 0 10px" },
				children: "Quellen"
			}),
			/* @__PURE__ */ (0, M.jsxs)("div", {
				className: "row",
				style: {
					flexWrap: "wrap",
					gap: 8
				},
				children: [a.length === 0 && /* @__PURE__ */ (0, M.jsx)("span", {
					className: "sub",
					children: "Keine Quellen gemeldet."
				}), a.slice(0, 10).map((e) => /* @__PURE__ */ (0, M.jsx)("button", {
					className: "chip",
					style: {
						cursor: "pointer",
						fontSize: 14,
						padding: "8px 14px",
						borderColor: n?.attributes.source === e ? "#4ade80" : void 0
					},
					onClick: () => O("media_player", "select_source", { source: e }, t),
					children: e
				}, e))]
			}),
			e.tv_plug && /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "row",
				style: { marginTop: 18 },
				children: [/* @__PURE__ */ (0, M.jsx)("span", {
					className: "sub",
					style: { flex: 1 },
					children: "Steckdose Fernseher"
				}), /* @__PURE__ */ (0, M.jsxs)("button", {
					className: "btn",
					onClick: () => O(e.tv_plug.split(".")[0], "toggle", {}, e.tv_plug),
					children: [
						/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:power-socket-de" }),
						" ",
						k(r) ? "Ausschalten" : "Einschalten"
					]
				})]
			})
		]
	});
}
function lr() {
	let e = P();
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		style: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
			gap: 20
		},
		children: [
			/* @__PURE__ */ (0, M.jsx)(ir, {}),
			/* @__PURE__ */ (0, M.jsx)(sr, {}),
			e.tv && /* @__PURE__ */ (0, M.jsx)(cr, {})
		]
	});
}
// src/pages/Lage.tsx
function ur() {
	let e = P(), t = Mt(e.weather), n = Lt(e.weather).slice(0, 6);
	if (!t) return null;
	let r = t.attributes;
	return /* @__PURE__ */ (0, M.jsxs)(N, {
		className: "span2",
		children: [/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "row",
			style: {
				alignItems: "center",
				gap: 18,
				flexWrap: "wrap"
			},
			children: [
				/* @__PURE__ */ (0, M.jsx)(En, {
					condition: t.state,
					size: 120
				}),
				/* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsxs)("div", {
					style: {
						fontSize: 72,
						fontWeight: 600,
						lineHeight: 1
					},
					children: [r.temperature === void 0 ? "–" : Math.round(r.temperature), "°"]
				}), /* @__PURE__ */ (0, M.jsx)("div", {
					style: { fontSize: 22 },
					children: Dn[t.state] ?? t.state
				})] }),
				/* @__PURE__ */ (0, M.jsxs)("div", {
					className: "row",
					style: {
						marginLeft: "auto",
						gap: 8,
						flexWrap: "wrap"
					},
					children: [
						r.humidity !== void 0 && /* @__PURE__ */ (0, M.jsxs)("span", {
							className: "chip",
							children: [
								/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:water-percent" }),
								" ",
								r.humidity,
								" %"
							]
						}),
						r.wind_speed !== void 0 && /* @__PURE__ */ (0, M.jsxs)("span", {
							className: "chip",
							children: [
								/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:weather-windy" }),
								" ",
								r.wind_speed,
								" ",
								r.wind_speed_unit ?? "km/h"
							]
						}),
						r.pressure !== void 0 && /* @__PURE__ */ (0, M.jsxs)("span", {
							className: "chip",
							children: [
								/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:gauge" }),
								" ",
								r.pressure,
								" ",
								r.pressure_unit ?? "hPa"
							]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, M.jsx)("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
				gap: 10,
				marginTop: 18
			},
			children: n.map((e, t) => /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "list-row",
				style: {
					display: "block",
					textAlign: "center",
					margin: 0
				},
				children: [
					/* @__PURE__ */ (0, M.jsx)("div", {
						className: "eyebrow",
						children: t === 0 ? "HEUTE" : new Date(e.datetime).toLocaleDateString("de-DE", { weekday: "short" }).toUpperCase()
					}),
					/* @__PURE__ */ (0, M.jsx)("div", {
						style: {
							display: "grid",
							placeItems: "center"
						},
						children: /* @__PURE__ */ (0, M.jsx)(En, {
							condition: e.condition ?? "cloudy",
							size: 64
						})
					}),
					/* @__PURE__ */ (0, M.jsx)("div", {
						style: {
							fontSize: 20,
							fontWeight: 600
						},
						children: e.temperature === void 0 ? "–" : `${Math.round(e.temperature)}°`
					}),
					/* @__PURE__ */ (0, M.jsx)("div", {
						className: "muted",
						children: e.templow === void 0 ? "" : `${Math.round(e.templow)}°`
					}),
					e.precipitation_probability !== void 0 && /* @__PURE__ */ (0, M.jsxs)("div", {
						className: "sub",
						style: { color: "#7dd3fc" },
						children: [
							/* @__PURE__ */ (0, M.jsx)(E, { icon: "mdi:water" }),
							" ",
							e.precipitation_probability,
							" %"
						]
					})
				]
			}, t))
		})]
	});
}
function dr() {
	let e = P().warnings, t = D();
	if (!e) return null;
	let n = Number(e.level ? t[e.level]?.state : NaN), r = Number(e.prelevel ? t[e.prelevel]?.state : NaN), i = (e.alerts ?? []).map((e) => t[e]).filter((e) => k(e)), a = e.motion ? t[e.motion.entity] : void 0, o = n >= 3 ? "var(--bad)" : n >= 1 ? "var(--warn)" : "var(--ok)";
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "section-title",
			style: { margin: 0 },
			children: [/* @__PURE__ */ (0, M.jsx)("span", {
				className: "icon-chip",
				children: /* @__PURE__ */ (0, M.jsx)(E, {
					icon: "mdi:alert-outline",
					width: 20
				})
			}), "Warnlage"]
		}),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "row",
			style: {
				marginTop: 16,
				gap: 22
			},
			children: [Number.isFinite(n) && /* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsx)("div", {
				className: "eyebrow",
				children: "Warnstufe"
			}), /* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					fontSize: 56,
					fontWeight: 700,
					color: o,
					lineHeight: 1.05
				},
				children: n
			})] }), Number.isFinite(r) && /* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsx)("div", {
				className: "eyebrow",
				children: "Vorwarnung"
			}), /* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					fontSize: 56,
					fontWeight: 700,
					lineHeight: 1.05
				},
				children: r
			})] })]
		}),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			style: { marginTop: 14 },
			children: [
				i.length === 0 && /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "list-row",
					children: [/* @__PURE__ */ (0, M.jsx)(E, {
						icon: "mdi:shield-check-outline",
						color: "#4ade80",
						width: 22
					}), /* @__PURE__ */ (0, M.jsxs)("span", { children: ["Keine aktiven Warnungen", e.region ? ` für ${e.region}` : ""] })]
				}),
				i.map((e) => /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "list-row",
					style: { borderColor: "rgba(251,191,36,.5)" },
					children: [/* @__PURE__ */ (0, M.jsx)(E, {
						icon: "mdi:alert",
						color: "#fbbf24",
						width: 22
					}), /* @__PURE__ */ (0, M.jsx)("span", {
						style: { flex: 1 },
						children: e.attributes.headline || Rt(e, e.entity_id)
					})]
				}, e.entity_id)),
				a && e.motion && /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "list-row",
					children: [
						/* @__PURE__ */ (0, M.jsx)(E, {
							icon: k(a) ? "mdi:motion-sensor" : "mdi:motion-sensor-off",
							width: 22,
							color: k(a) ? "#f87171" : void 0
						}),
						/* @__PURE__ */ (0, M.jsx)("span", {
							style: { flex: 1 },
							children: e.motion.label
						}),
						/* @__PURE__ */ (0, M.jsx)("span", {
							className: `chip ${k(a) ? "bad" : "ok"}`,
							children: k(a) ? "Bewegung" : "ruhig"
						})
					]
				})
			]
		})
	] });
}
function fr() {
	let e = P().gauge, t = D();
	if (!e) return null;
	let n = t[e.entity], r = Number(n?.state), i = Number(e.yellow ? t[e.yellow]?.state : NaN), a = Number(e.red ? t[e.red]?.state : NaN), o = Number.isFinite(a) ? a * 1.15 : Number.isFinite(r) ? r * 1.6 : 100, s = Number.isFinite(a) && r >= a ? "var(--bad)" : Number.isFinite(i) && r >= i ? "var(--warn)" : "#38bdf8";
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "section-title",
			style: { margin: 0 },
			children: [/* @__PURE__ */ (0, M.jsx)("span", {
				className: "icon-chip",
				children: /* @__PURE__ */ (0, M.jsx)(E, {
					icon: "mdi:waves-arrow-up",
					width: 20
				})
			}), e.name]
		}),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			style: {
				fontSize: 64,
				fontWeight: 700,
				marginTop: 10,
				color: s
			},
			children: [Number.isFinite(r) ? r : "–", /* @__PURE__ */ (0, M.jsxs)("span", {
				style: {
					fontSize: 22,
					fontWeight: 400,
					color: "var(--ink-2)"
				},
				children: [" ", String(n?.attributes.unit_of_measurement ?? "")]
			})]
		}),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			style: {
				position: "relative",
				height: 16,
				borderRadius: 99,
				background: "rgba(255,255,255,.1)",
				marginTop: 10,
				overflow: "hidden"
			},
			children: [
				/* @__PURE__ */ (0, M.jsx)("div", { style: {
					position: "absolute",
					left: 0,
					top: 0,
					bottom: 0,
					width: `${Math.min(100, r / o * 100)}%`,
					background: `linear-gradient(90deg,#0ea5e9,${s})`
				} }),
				Number.isFinite(i) && /* @__PURE__ */ (0, M.jsx)("div", { style: {
					position: "absolute",
					left: `${i / o * 100}%`,
					top: 0,
					bottom: 0,
					width: 3,
					background: "#fbbf24"
				} }),
				Number.isFinite(a) && /* @__PURE__ */ (0, M.jsx)("div", { style: {
					position: "absolute",
					left: `${a / o * 100}%`,
					top: 0,
					bottom: 0,
					width: 3,
					background: "#ef4444"
				} })
			]
		}),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "row",
			style: {
				marginTop: 10,
				gap: 8
			},
			children: [Number.isFinite(i) && /* @__PURE__ */ (0, M.jsxs)("span", {
				className: "chip warn",
				children: ["Gelb ab ", i]
			}), Number.isFinite(a) && /* @__PURE__ */ (0, M.jsxs)("span", {
				className: "chip bad",
				children: ["Rot ab ", a]
			})]
		})
	] });
}
var pr = {
	new_moon: "Neumond",
	waxing_crescent: "Zunehmende Sichel",
	first_quarter: "Erstes Viertel",
	waxing_gibbous: "Zunehmender Mond",
	full_moon: "Vollmond",
	waning_gibbous: "Abnehmender Mond",
	last_quarter: "Letztes Viertel",
	waning_crescent: "Abnehmende Sichel"
};
function mr() {
	let e = P().sky, t = D();
	if (!e) return null;
	let n = [
		[
			e.dawn,
			"Morgendämmerung",
			"mdi:weather-sunset"
		],
		[
			e.rising,
			"Sonnenaufgang",
			"mdi:weather-sunset-up"
		],
		[
			e.setting,
			"Sonnenuntergang",
			"mdi:weather-sunset-down"
		],
		[
			e.dusk,
			"Abenddämmerung",
			"mdi:weather-night"
		]
	], r = e.moon_phase ? t[e.moon_phase]?.state : void 0;
	return /* @__PURE__ */ (0, M.jsxs)(N, { children: [/* @__PURE__ */ (0, M.jsxs)("div", {
		className: "section-title",
		style: { margin: 0 },
		children: [/* @__PURE__ */ (0, M.jsx)("span", {
			className: "icon-chip",
			children: /* @__PURE__ */ (0, M.jsx)(E, {
				icon: "mdi:weather-night-partly-cloudy",
				width: 20
			})
		}), "Sonne & Mond"]
	}), /* @__PURE__ */ (0, M.jsxs)("div", {
		style: { marginTop: 14 },
		children: [n.filter(([e]) => e && t[e]).map(([e, n, r]) => {
			let i = new Date(t[e].state);
			return /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "list-row",
				children: [
					/* @__PURE__ */ (0, M.jsx)(E, {
						icon: r,
						width: 20,
						color: "#fcd34d"
					}),
					/* @__PURE__ */ (0, M.jsx)("span", {
						style: { flex: 1 },
						children: n
					}),
					/* @__PURE__ */ (0, M.jsx)("span", {
						className: "mono",
						children: isNaN(i.getTime()) ? "–" : Gt(i)
					})
				]
			}, e);
		}), r && /* @__PURE__ */ (0, M.jsxs)("div", {
			className: "list-row",
			children: [
				/* @__PURE__ */ (0, M.jsx)(E, {
					icon: "mdi:moon-waning-crescent",
					width: 20,
					color: "#e2e8f0"
				}),
				/* @__PURE__ */ (0, M.jsx)("span", {
					style: { flex: 1 },
					children: pr[r] ?? r
				}),
				e.moon_elevation && t[e.moon_elevation] && /* @__PURE__ */ (0, M.jsxs)("span", {
					className: "mono",
					children: [t[e.moon_elevation].state, "°"]
				})
			]
		})]
	})] });
}
function hr({ id: e, title: t }) {
	let n = Mt(e), [r, i] = (0, l.useState)(0);
	(0, l.useEffect)(() => {
		let e = setInterval(() => i((e) => e + 1), 1e4);
		return () => clearInterval(e);
	}, []);
	let a = n?.attributes.entity_picture, o = a ? `${a}${a.includes("?") ? "&" : "?"}t=${r}` : null;
	return /* @__PURE__ */ (0, M.jsx)(N, {
		className: "span2",
		style: { padding: 0 },
		children: /* @__PURE__ */ (0, M.jsxs)("div", {
			style: {
				position: "relative",
				aspectRatio: "16/9",
				background: "#0b1220"
			},
			children: [o ? /* @__PURE__ */ (0, M.jsx)("img", {
				src: o,
				alt: t,
				style: {
					width: "100%",
					height: "100%",
					objectFit: "cover",
					display: "block"
				}
			}) : /* @__PURE__ */ (0, M.jsx)("div", {
				style: {
					position: "absolute",
					inset: 0,
					display: "grid",
					placeItems: "center"
				},
				className: "muted",
				children: "Kein Bild"
			}), /* @__PURE__ */ (0, M.jsxs)("span", {
				className: "chip",
				style: {
					position: "absolute",
					left: 12,
					top: 12,
					background: "rgba(0,0,0,.55)"
				},
				children: [
					/* @__PURE__ */ (0, M.jsx)("span", { style: {
						width: 8,
						height: 8,
						borderRadius: "50%",
						background: n && n.state !== "unavailable" ? "#ef4444" : "#64748b"
					} }),
					" ",
					t
				]
			})]
		})
	});
}
function gr() {
	let e = P();
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		style: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
			gap: 18
		},
		children: [
			/* @__PURE__ */ (0, M.jsx)(ur, {}),
			/* @__PURE__ */ (0, M.jsx)(dr, {}),
			/* @__PURE__ */ (0, M.jsx)(fr, {}),
			/* @__PURE__ */ (0, M.jsx)(mr, {}),
			(e.cameras ?? []).map((e) => /* @__PURE__ */ (0, M.jsx)(hr, {
				id: e.entity,
				title: e.title
			}, e.entity))
		]
	});
}
// src/pages/Network.tsx
var _r = 1600, vr = 900, yr = [
	[170, 360],
	[130, 540],
	[210, 710],
	[420, 760],
	[250, 220]
], br = {
	docked: "angedockt",
	cleaning: "saugt",
	returning: "fährt heim",
	paused: "pausiert",
	idle: "bereit",
	error: "Fehler"
};
function xr({ events: e }) {
	let t = P(), n = D(), r = An(), i = (0, l.useMemo)(() => {
		let i = {
			me: "#38bdf8",
			rooms: "#fb923c",
			dev: "#facc15",
			lage: "#2dd4bf",
			waste: "#f472b6",
			home: "#4ade80"
		}, a = [], o = Object.keys(n), s = o.filter((e) => e.startsWith("light.") && e !== t.all_lights && !Array.isArray(n[e].attributes.entity_id)), c = o.filter((e) => e.startsWith("switch.") && !e.includes("adaptive_lighting") && !(t.house_switches ?? []).some((t) => t.entity === e)), l = (t.todos ?? []).reduce((e, t) => e + (Number(n[t.entity]?.state) || 0), 0), u = e.find((e) => e.end.getTime() > Date.now()), d = Object.values(n).filter((e) => e.entity_id.startsWith("person.")), f = t.phone_battery_match ? Object.values(n).find((e) => e.entity_id.includes(t.phone_battery_match) && e.attributes.device_class === "battery") : void 0;
		a.push({
			id: "me",
			x: 820,
			y: 190,
			label: t.person ?? "Ich",
			icon: "mdi:account-outline",
			color: i.me,
			size: 108
		}), f && a.push({
			id: "tel",
			parent: "me",
			x: 610,
			y: 95,
			label: "Telefon",
			value: `${f.state} %`,
			icon: "mdi:cellphone",
			color: i.me
		}), (t.calendars ?? []).length && a.push({
			id: "kal",
			parent: "me",
			x: 520,
			y: 250,
			label: "Kalender",
			value: u ? `${Yt(Math.max(0, Jt(u.start)))}: ${u.summary.slice(0, 22)}` : "frei",
			icon: "mdi:calendar-month-outline",
			color: i.me
		}), (t.todos ?? []).length && a.push({
			id: "todo",
			parent: "me",
			x: 1030,
			y: 90,
			label: "Aufgaben",
			value: `${l} offen`,
			icon: "mdi:checkbox-marked-outline",
			color: i.me
		});
		let p = (t.rooms ?? []).slice(0, yr.length);
		if (p.length && (a.push({
			id: "rooms",
			x: 400,
			y: 500,
			label: "Räume",
			icon: "mdi:floor-plan",
			color: i.rooms,
			size: 108
		}), p.forEach((e, t) => {
			let r = e.lights ?? [], o = r.filter((e) => k(n[e])).length, s = e.switches ?? [];
			a.push({
				id: `r${t}`,
				parent: "rooms",
				x: yr[t][0],
				y: yr[t][1],
				label: e.title,
				value: r.length ? `${o}/${r.length} Licht` : s.length ? `${s.filter((e) => k(n[e])).length}/${s.length} Schalter` : void 0,
				icon: e.icon ?? "mdi:door",
				color: i.rooms
			});
		})), r.length && (a.push({
			id: "waste",
			x: 760,
			y: 790,
			label: "Müll",
			icon: "mdi:trash-can-outline",
			color: i.waste,
			size: 96
		}), r.slice(0, 2).forEach((e, t) => a.push({
			id: `w${t}`,
			parent: "waste",
			x: 600 + t * 330,
			y: 870,
			label: e.name,
			value: Yt(e.days),
			icon: e.icon,
			color: i.waste
		}))), a.push({
			id: "dev",
			x: 1180,
			y: 700,
			label: "Geräte",
			icon: "mdi:lightbulb-group-outline",
			color: i.dev,
			size: 108
		}), a.push({
			id: "li",
			parent: "dev",
			x: 1470,
			y: 600,
			label: "Lichter",
			value: `${s.filter((e) => k(n[e])).length}/${s.length} an`,
			icon: "mdi:lightbulb-outline",
			color: i.dev
		}), a.push({
			id: "st",
			parent: "dev",
			x: 1460,
			y: 800,
			label: "Schalter",
			value: `${c.filter((e) => k(n[e])).length}/${c.length} an`,
			icon: "mdi:power-socket-de",
			color: i.dev
		}), t.vacuum && n[t.vacuum]) {
			let e = n[t.vacuum];
			a.push({
				id: "vac",
				parent: "dev",
				x: 1240,
				y: 870,
				label: t.vacuum_name ?? "Saugroboter",
				value: br[e.state] ?? e.state,
				icon: "mdi:robot-vacuum",
				color: i.dev
			});
		}
		let m = t.weather ? n[t.weather] : void 0, h = t.warnings?.level ? n[t.warnings.level] : void 0, g = t.gauge ? n[t.gauge.entity] : void 0;
		if ((m || h || g) && (a.push({
			id: "lage",
			x: 1260,
			y: 310,
			label: "Lage",
			icon: "mdi:radar",
			color: i.lage,
			size: 104
		}), m && a.push({
			id: "wx",
			parent: "lage",
			x: 1470,
			y: 160,
			label: "Wetter",
			value: `${Math.round(Number(m.attributes.temperature))}°`,
			icon: "mdi:weather-partly-cloudy",
			color: i.lage
		}), h && a.push({
			id: "warn",
			parent: "lage",
			x: 1510,
			y: 360,
			label: "Warnstufe",
			value: h.state,
			icon: "mdi:alert-outline",
			color: i.lage
		}), g && a.push({
			id: "gauge",
			parent: "lage",
			x: 1130,
			y: 120,
			label: t.gauge.name,
			value: `${g.state} ${g.attributes.unit_of_measurement ?? ""}`,
			icon: "mdi:waves",
			color: i.lage
		})), d.length) {
			let e = d.filter((e) => e.state === "home").length;
			a.push({
				id: "home",
				x: 1180,
				y: 505,
				label: "Wer ist da",
				value: `${e} zu Hause`,
				icon: "mdi:home-outline",
				color: i.home,
				size: 92
			});
		}
		return a;
	}, [
		n,
		e,
		r,
		t
	]), a = Object.fromEntries(i.map((e) => [e.id, e])), o = /* @__PURE__ */ new Date();
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			maxWidth: 1600,
			margin: "0 auto",
			aspectRatio: `${_r}/${vr}`,
			minHeight: 560
		},
		children: [/* @__PURE__ */ (0, M.jsxs)("svg", {
			viewBox: `0 0 ${_r} ${vr}`,
			style: {
				position: "absolute",
				inset: 0,
				width: "100%",
				height: "100%"
			},
			children: [
				/* @__PURE__ */ (0, M.jsx)("defs", { children: /* @__PURE__ */ (0, M.jsxs)("radialGradient", {
					id: "nx-core",
					cx: ".5",
					cy: ".4",
					r: ".6",
					children: [
						/* @__PURE__ */ (0, M.jsx)("stop", {
							offset: "0",
							stopColor: "#6ee7b7"
						}),
						/* @__PURE__ */ (0, M.jsx)("stop", {
							offset: ".6",
							stopColor: "#047857"
						}),
						/* @__PURE__ */ (0, M.jsx)("stop", {
							offset: "1",
							stopColor: "#022c22"
						})
					]
				}) }),
				i.map((e) => {
					let t = e.parent ? a[e.parent] : {
						x: 800,
						y: 470
					};
					if (!t) return null;
					let n = !e.parent;
					return /* @__PURE__ */ (0, M.jsxs)("g", { children: [/* @__PURE__ */ (0, M.jsx)("line", {
						x1: t.x,
						y1: t.y,
						x2: e.x,
						y2: e.y,
						stroke: e.color,
						strokeOpacity: n ? .7 : .45,
						strokeWidth: n ? 3 : 1.6
					}), /* @__PURE__ */ (0, M.jsx)("line", {
						x1: t.x,
						y1: t.y,
						x2: e.x,
						y2: e.y,
						stroke: e.color,
						strokeWidth: n ? 3 : 2,
						strokeDasharray: "4 36",
						style: { animation: `dash ${n ? 3 : 5}s linear infinite` }
					})] }, `l${e.id}`);
				}),
				/* @__PURE__ */ (0, M.jsx)("circle", {
					cx: 800,
					cy: 470,
					r: 175,
					fill: "none",
					stroke: "rgba(110,231,183,.15)",
					strokeWidth: "1"
				}),
				/* @__PURE__ */ (0, M.jsx)("g", {
					style: {
						transformOrigin: "800px 470px",
						animation: "spin 60s linear infinite"
					},
					children: Array.from({ length: 60 }).map((e, t) => {
						let n = t / 60 * Math.PI * 2, r = t % 5 == 0 ? 168 : 160;
						return /* @__PURE__ */ (0, M.jsx)("line", {
							x1: 800 + Math.cos(n) * 150,
							y1: 470 + Math.sin(n) * 150,
							x2: 800 + Math.cos(n) * r,
							y2: 470 + Math.sin(n) * r,
							stroke: "rgba(110,231,183,.55)",
							strokeWidth: t % 5 == 0 ? 3 : 1.5
						}, t);
					})
				}),
				/* @__PURE__ */ (0, M.jsx)("circle", {
					cx: 800,
					cy: 470,
					r: 125,
					fill: "url(#nx-core)",
					style: {
						transformOrigin: "800px 470px",
						animation: "pulse 4s ease-in-out infinite"
					}
				}),
				/* @__PURE__ */ (0, M.jsx)("circle", {
					cx: 800,
					cy: 470,
					r: 125,
					fill: "none",
					stroke: "rgba(255,255,255,.35)"
				}),
				/* @__PURE__ */ (0, M.jsxs)("g", {
					transform: "translate(800 452)",
					children: [
						/* @__PURE__ */ (0, M.jsx)("path", {
							d: "M0 -52 L45 -26 L45 26 L0 52 L-45 26 L-45 -26 Z",
							fill: "rgba(255,255,255,.92)"
						}),
						/* @__PURE__ */ (0, M.jsx)("rect", {
							x: "-34",
							y: "-16",
							width: "68",
							height: "34",
							rx: "17",
							fill: "#0b1f1a"
						}),
						[-14, 14].map((e) => /* @__PURE__ */ (0, M.jsx)("circle", {
							cx: e,
							cy: "1",
							r: "8",
							fill: "#5eead4",
							children: /* @__PURE__ */ (0, M.jsx)("animate", {
								attributeName: "r",
								values: "8;8;1;8",
								keyTimes: "0;.9;.95;1",
								dur: "5s",
								repeatCount: "indefinite"
							})
						}, e))
					]
				}),
				/* @__PURE__ */ (0, M.jsx)("text", {
					x: 800,
					y: 548,
					textAnchor: "middle",
					fill: "#ecfdf5",
					fontSize: "30",
					fontWeight: "600",
					fontFamily: "inherit",
					children: t.title ?? "Nexus"
				}),
				/* @__PURE__ */ (0, M.jsxs)("text", {
					x: 800,
					y: 574,
					textAnchor: "middle",
					fill: "rgba(236,253,245,.6)",
					fontSize: "16",
					fontFamily: "inherit",
					children: [Gt(o), " · alles im Blick"]
				})
			]
		}), i.map((e) => {
			let t = e.size ?? 66;
			return /* @__PURE__ */ (0, M.jsxs)("div", {
				style: {
					position: "absolute",
					left: `${e.x / _r * 100}%`,
					top: `${e.y / vr * 100}%`,
					transform: "translate(-50%, -50%)",
					textAlign: "center",
					width: 200,
					pointerEvents: "none"
				},
				children: [
					/* @__PURE__ */ (0, M.jsx)("div", {
						style: {
							width: `clamp(${t * .55}px, ${t / _r * 100}vw, ${t}px)`,
							aspectRatio: "1",
							margin: "0 auto",
							borderRadius: "50%",
							display: "grid",
							placeItems: "center",
							background: `radial-gradient(circle at 35% 30%, ${e.color}55, rgba(10,20,25,.9) 70%)`,
							border: `2px solid ${e.color}aa`,
							boxShadow: `0 0 ${e.parent ? 14 : 30}px ${e.color}55`
						},
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: e.icon,
							width: e.parent ? 26 : 40,
							color: "#f1f5f9"
						})
					}),
					/* @__PURE__ */ (0, M.jsx)("div", {
						style: {
							marginTop: 6,
							fontSize: e.parent ? 14 : 19,
							fontWeight: e.parent ? 500 : 700,
							color: "#f1f5f9",
							textShadow: "0 2px 6px rgba(0,0,0,.8)"
						},
						children: e.label
					}),
					e.value && /* @__PURE__ */ (0, M.jsx)("div", {
						style: {
							fontSize: 12.5,
							color: e.color,
							fontFamily: "ui-monospace, Menlo, monospace",
							textShadow: "0 2px 6px rgba(0,0,0,.8)"
						},
						children: e.value
					})
				]
			}, e.id);
		})]
	});
}
// src/App.tsx
var Sr = [
	{
		id: "zuhause",
		label: "Zuhause",
		icon: "mdi:home-outline",
		scene: () => /* @__PURE__ */ (0, M.jsx)(un, {})
	},
	{
		id: "haus",
		label: "Haus",
		icon: "mdi:floor-plan",
		scene: () => /* @__PURE__ */ (0, M.jsx)(Cr, {})
	},
	{
		id: "woche",
		label: "Woche",
		icon: "mdi:calendar-week-outline",
		scene: () => /* @__PURE__ */ (0, M.jsx)(fn, {})
	},
	{
		id: "abend",
		label: "Abend",
		icon: "mdi:campfire",
		scene: () => /* @__PURE__ */ (0, M.jsx)(mn, {})
	},
	{
		id: "lage",
		label: "Lage",
		icon: "mdi:waves",
		scene: () => /* @__PURE__ */ (0, M.jsx)(gn, {})
	},
	{
		id: "netz",
		label: "Netz",
		icon: "mdi:graph-outline",
		scene: () => /* @__PURE__ */ (0, M.jsx)(hn, {})
	}
];
function Cr() {
	let e = D(), t = Object.values(e).filter((e) => e.entity_id.startsWith("light.") && !Array.isArray(e.attributes.entity_id)), n = t.length ? t.filter(k).length / t.length : 0;
	return /* @__PURE__ */ (0, M.jsx)(_n, { litRatio: n });
}
var wr = "nexus-dashboard-page", Tr = () => {
	try {
		let e = localStorage.getItem(wr);
		if (e && Sr.some((t) => t.id === e)) return e;
	} catch {}
	return "zuhause";
};
function Er() {
	let e = P(), [t, n] = (0, l.useState)(Tr), r = Pt(), i = Vt(e.calendars ?? [], 14), a = (0, l.useRef)(null), o = (e) => {
		n(e);
		try {
			localStorage.setItem(wr, e);
		} catch {}
	}, s = () => {
		let e = a.current;
		e && (document.fullscreenElement ? document.exitFullscreen?.() : e.requestFullscreen?.().catch(() => void 0));
	}, c = Sr.find((e) => e.id === t);
	return /* @__PURE__ */ (0, M.jsxs)("div", {
		className: "shell",
		ref: a,
		children: [
			c.scene(),
			/* @__PURE__ */ (0, M.jsxs)("nav", {
				className: "rail",
				children: [
					/* @__PURE__ */ (0, M.jsx)("div", {
						className: `rail-dot ${r ? "" : "off"}`,
						title: r ? "Verbunden" : "Verbindung getrennt"
					}),
					/* @__PURE__ */ (0, M.jsx)("div", { style: { height: 8 } }),
					Sr.map((e) => /* @__PURE__ */ (0, M.jsx)("button", {
						className: `rail-btn ${e.id === t ? "active" : ""}`,
						onClick: () => o(e.id),
						title: e.label,
						"aria-label": e.label,
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: e.icon,
							width: 24
						})
					}, e.id)),
					/* @__PURE__ */ (0, M.jsx)("div", { className: "spacer" }),
					/* @__PURE__ */ (0, M.jsx)("button", {
						className: "rail-btn",
						onClick: s,
						title: "Vollbild ein/aus",
						"aria-label": "Vollbild",
						children: /* @__PURE__ */ (0, M.jsx)(E, {
							icon: "mdi:fullscreen",
							width: 24
						})
					})
				]
			}),
			/* @__PURE__ */ (0, M.jsxs)("main", {
				className: "stage",
				children: [
					t === "zuhause" && /* @__PURE__ */ (0, M.jsx)(Jn, { events: i }),
					t === "haus" && /* @__PURE__ */ (0, M.jsx)(Gn, {}),
					t === "woche" && /* @__PURE__ */ (0, M.jsx)(nr, { events: i }),
					t === "abend" && /* @__PURE__ */ (0, M.jsx)(lr, {}),
					t === "lage" && /* @__PURE__ */ (0, M.jsx)(gr, {}),
					t === "netz" && /* @__PURE__ */ (0, M.jsx)(xr, { events: i })
				]
			}, t)
		]
	});
}
// src/card.tsx
de(wt);
var Dr = "1.2.0", Or = class extends HTMLElement {
	root;
	config = {};
	hasHass = !1;
	setConfig(e) {
		this.config = e ?? {}, this.render();
	}
	set hass(e) {
		Ot(e), this.hasHass || (this.hasHass = !0, this.render());
	}
	getCardSize() {
		return 12;
	}
	getGridOptions() {
		return {
			columns: "full",
			rows: 12
		};
	}
	connectedCallback() {
		this.render();
	}
	render() {
		if (this.isConnected) {
			if (!this.shadowRoot) {
				let e = this.attachShadow({ mode: "open" }), t = document.createElement("style");
				t.textContent = Tt;
				let n = document.createElement("div");
				n.className = "host", e.append(t, n), this.root = (0, c.createRoot)(n);
			}
			this.hasHass ? this.root.render(/* @__PURE__ */ (0, M.jsx)(rn.Provider, {
				value: this.config,
				children: /* @__PURE__ */ (0, M.jsx)(Er, {})
			})) : this.root.render(/* @__PURE__ */ (0, M.jsx)("div", {
				className: "loading",
				children: "NEXUS · VERBINDE …"
			}));
		}
	}
};
if (!customElements.get("nexus-dashboard")) {
	customElements.define("nexus-dashboard", Or);
	let e = window;
	e.customCards = e.customCards ?? [], e.customCards.push({
		type: "nexus-dashboard",
		name: "Nexus Dashboard",
		description: "Szenisches Vollbild-Dashboard mit Glas-Karten",
		preview: !1
	}), console.info(`%c NEXUS-DASHBOARD %c ${Dr} `, "background:#0f766e;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px", "background:#134e4a;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px");
}
