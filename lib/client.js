window.__ModuleLoader__.load({
	id: "dsh-better-input",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = require("react-dom");
		//#region node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) {
					if (def.inclusive) bag.maximum = def.value;
					else bag.exclusiveMaximum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) {
					if (def.inclusive) bag.minimum = def.value;
					else bag.exclusiveMinimum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = boolean$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Boolean(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "boolean") return payload;
				payload.issues.push({
					expected: "boolean",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$2 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) {
				if (ctx.target === "draft-2020-12") result.$defs = defs;
				else result.definitions = defs;
			}
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) {
				if (legacy) {
					json.minimum = exclusiveMinimum;
					json.exclusiveMinimum = true;
				} else json.exclusiveMinimum = exclusiveMinimum;
			} else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) {
				if (legacy) {
					json.maximum = exclusiveMaximum;
					json.exclusiveMaximum = true;
				} else json.exclusiveMaximum = exclusiveMaximum;
			} else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			_installLazyMethods(inst, "ZodNumber", {
				gt(value, params) {
					return this.check(/* @__PURE__ */ _gt(value, params));
				},
				gte(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				min(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				lt(value, params) {
					return this.check(/* @__PURE__ */ _lt(value, params));
				},
				lte(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				max(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				int(params) {
					return this.check(int(params));
				},
				safe(params) {
					return this.check(int(params));
				},
				positive(params) {
					return this.check(/* @__PURE__ */ _gt(0, params));
				},
				nonnegative(params) {
					return this.check(/* @__PURE__ */ _gte(0, params));
				},
				negative(params) {
					return this.check(/* @__PURE__ */ _lt(0, params));
				},
				nonpositive(params) {
					return this.check(/* @__PURE__ */ _lte(0, params));
				},
				multipleOf(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				step(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				finite() {
					return this;
				}
			});
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum({
				type: "enum",
				entries,
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region src/remote-contract.ts
		const textSchema = string();
		const betterInputSettingsSchema = object({
			language: string(),
			maxRecordingSeconds: number(),
			polishingEnabled: boolean(),
			polishProvider: string(),
			polishModel: string(),
			polishReasoningEffort: string(),
			polishPrompt: string(),
			optimizeEnabled: boolean(),
			optimizeProvider: string(),
			optimizeModel: string(),
			optimizeReasoningEffort: string(),
			optimizePrompt: string(),
			contextTurns: number()
		});
		const betterInputSettingsPatchSchema = object({
			language: string().optional(),
			maxRecordingSeconds: number().optional(),
			polishingEnabled: boolean().optional(),
			polishProvider: string().optional(),
			polishModel: string().optional(),
			polishReasoningEffort: string().optional(),
			polishPrompt: string().optional(),
			optimizeEnabled: boolean().optional(),
			optimizeProvider: string().optional(),
			optimizeModel: string().optional(),
			optimizeReasoningEffort: string().optional(),
			optimizePrompt: string().optional(),
			contextTurns: number().optional()
		});
		const betterInputSettingsViewSchema = object({
			available: boolean(),
			writable: boolean(),
			settings: betterInputSettingsSchema,
			overridden: array(string()),
			defaultPolishPrompt: string(),
			defaultOptimizePrompt: string()
		});
		const reasoningEffortSchema = object({
			id: string(),
			name: string(),
			description: string().optional()
		});
		const resolveModelEffortsResultSchema = object({
			efforts: array(reasoningEffortSchema),
			defaultEffort: string().optional()
		});
		const listRoutesResultSchema = array(object({
			provider: string(),
			providerName: string(),
			model: string(),
			modelName: string(),
			reasoningEfforts: array(reasoningEffortSchema),
			defaultReasoningEffort: string().optional()
		}));
		const polishResultSchema = string();
		const optimizeResultSchema = string();
		const aboutInfoSchema = object({
			repository: string(),
			repositorySlug: string(),
			version: string(),
			license: string(),
			updateCommand: string(),
			updateCommandNpx: string()
		});
		const updateCheckResultSchema = object({
			status: _enum([
				"up-to-date",
				"update-available",
				"unpublished",
				"error"
			]),
			installed: string(),
			latest: string().nullable(),
			updateCommand: string(),
			updateCommandNpx: string()
		});
		//#endregion
		//#region src/remote.ts
		const TYPERT_REMOTE = {
			package: "dsh-better-input",
			descriptors: [
				{
					id: "dsh-better-input#betterInput/getSettings",
					service: "BetterInputPolish",
					namespace: "betterInput",
					method: "getSettings",
					invocation: { kind: "direct" },
					parameters: [],
					result: {
						mode: "strict",
						typeSymbol: "dsh-better-input#BetterInputSettingsView",
						schema: betterInputSettingsViewSchema
					}
				},
				{
					id: "dsh-better-input#betterInput/updateSettings",
					service: "BetterInputPolish",
					namespace: "betterInput",
					method: "updateSettings",
					invocation: { kind: "direct" },
					parameters: [{
						name: "patch",
						wire: "patch",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-better-input#BetterInputSettingsPatch",
							schema: betterInputSettingsPatchSchema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-better-input#BetterInputSettingsView",
						schema: betterInputSettingsViewSchema
					}
				},
				{
					id: "dsh-better-input#betterInput/listRoutes",
					service: "BetterInputPolish",
					namespace: "betterInput",
					method: "listRoutes",
					invocation: { kind: "direct" },
					parameters: [],
					result: {
						mode: "strict",
						typeSymbol: "dsh-better-input#PolishRoute[]",
						schema: listRoutesResultSchema
					}
				},
				{
					id: "dsh-better-input#betterInput/resolveModelEfforts",
					service: "BetterInputPolish",
					namespace: "betterInput",
					method: "resolveModelEfforts",
					invocation: { kind: "direct" },
					parameters: [{
						name: "provider",
						wire: "provider",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "string",
							schema: textSchema
						}
					}, {
						name: "model",
						wire: "model",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "string",
							schema: textSchema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "dsh-better-input#ResolveModelEffortsResult",
						schema: resolveModelEffortsResultSchema
					}
				},
				{
					id: "dsh-better-input#betterInput/getAbout",
					service: "BetterInputPolish",
					namespace: "betterInput",
					method: "getAbout",
					invocation: { kind: "direct" },
					parameters: [],
					result: {
						mode: "strict",
						typeSymbol: "dsh-better-input#AboutInfo",
						schema: aboutInfoSchema
					}
				},
				{
					id: "dsh-better-input#betterInput/checkForUpdate",
					service: "BetterInputPolish",
					namespace: "betterInput",
					method: "checkForUpdate",
					invocation: { kind: "direct" },
					parameters: [],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-better-input#UpdateCheckResult",
						schema: updateCheckResultSchema
					}
				},
				{
					id: "dsh-better-input#betterInput/polish",
					service: "BetterInputPolish",
					namespace: "betterInput",
					method: "polish",
					invocation: { kind: "direct" },
					parameters: [
						{
							name: "transcript",
							wire: "transcript",
							source: "json",
							codec: {
								mode: "strict",
								typeSymbol: "string",
								schema: textSchema
							}
						},
						{
							name: "provider",
							wire: "provider",
							source: "json",
							codec: {
								mode: "strict",
								typeSymbol: "string",
								schema: textSchema
							}
						},
						{
							name: "model",
							wire: "model",
							source: "json",
							codec: {
								mode: "strict",
								typeSymbol: "string",
								schema: textSchema
							}
						}
					],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "string",
						schema: polishResultSchema
					}
				},
				{
					id: "dsh-better-input#betterInput/optimize",
					service: "BetterInputPolish",
					namespace: "betterInput",
					method: "optimize",
					invocation: { kind: "direct" },
					parameters: [
						{
							name: "text",
							wire: "text",
							source: "json",
							codec: {
								mode: "strict",
								typeSymbol: "string",
								schema: textSchema
							}
						},
						{
							name: "provider",
							wire: "provider",
							source: "json",
							codec: {
								mode: "strict",
								typeSymbol: "string",
								schema: textSchema
							}
						},
						{
							name: "model",
							wire: "model",
							source: "json",
							codec: {
								mode: "strict",
								typeSymbol: "string",
								schema: textSchema
							}
						},
						{
							name: "context",
							wire: "context",
							source: "json",
							codec: {
								mode: "strict",
								typeSymbol: "string",
								schema: textSchema
							}
						}
					],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "string",
						schema: optimizeResultSchema
					}
				}
			]
		};
		//#endregion
		//#region src/client/strings.ts
		const zh = {
			voiceStart: "语音输入",
			voiceStop: "停止语音输入",
			voiceBusy: "正在处理…",
			voiceUnavailable: "此浏览器不支持语音识别",
			listening: "正在聆听…",
			transcribing: "正在转写…",
			polishing: "正在润色…",
			voiceFailed: "语音输入失败",
			polishNotConfigured: "未配置润色模型，请在设置页选择",
			polishFailedKeepOriginal: "润色失败，已保留原文",
			settingsTitle: "BetterInput 设置",
			settingsDescription: "配置语音识别与 AI 润色。润色复用你在 dsh 设置里已配置的模型，无需额外 API key。",
			loading: "加载中…",
			saveFailed: "保存失败，请重试",
			languageLabel: "识别语言",
			languageHint: "留空时跟随浏览器语言。",
			languagePlaceholder: "例如 zh-CN 或 en-US",
			recordingLimitLabel: "单次录音上限（秒）",
			recordingLimitHint: "1–600 秒。",
			polishLabel: "AI 润色",
			polishHint: "识别完成后用大模型清理转写文本（去口头禅、修正同音错字、加标点）。",
			on: "开",
			off: "关",
			polishModelLabel: "润色模型",
			polishModelHint: "选择 dsh 中已配置的模型路由。",
			polishModelNone: "（未选择）",
			polishEffortLabel: "润色思考强度",
			polishEffortHint: "控制大模型的推理深度。默认即适配器最低档，适合大多数场景。",
			polishPromptLabel: "自定义润色提示词",
			polishPromptHint: "留空使用内置提示词。自定义提示词总是追加输出契约保护。",
			polishPromptPlaceholder: "可选：粘贴自定义提示词…",
			showDefaultPrompt: "查看内置提示词",
			hideDefaultPrompt: "收起内置提示词",
			defaultPromptLabel: "内置提示词",
			effortDefaultLabel: "默认（关闭思考）",
			effortLoadingLabel: "加载思考强度选项…",
			routesStatus: "可用模型路由",
			routesUnavailable: "不可用",
			optimizeButton: "优化提示词",
			optimizeBusy: "优化中…",
			optimizeFailed: "优化失败，请重试",
			optimizeEmpty: "输入框为空，无需优化",
			optimizePanelTitle: "提示词优化结果",
			optimizeOriginalLabel: "原文",
			optimizeOptimizedLabel: "优化后",
			optimizeAdopt: "采纳",
			optimizeCancel: "取消",
			optimizeNotConfigured: "未配置优化模型，请在设置页开启",
			optimizeModelLabel: "优化模型",
			optimizeModelHint: "选择 dsh 中已配置的模型路由。",
			optimizeEffortLabel: "优化思考强度",
			optimizeEffortHint: "控制大模型的推理深度。默认即适配器最低档，适合大多数场景。",
			optimizePromptLabel: "自定义优化提示词",
			optimizePromptHint: "留空使用内置提示词。自定义提示词总是追加输出契约保护。",
			optimizePromptPlaceholder: "可选：粘贴自定义提示词…",
			contextTurnsLabel: "上下文引用轮数",
			contextTurnsHint: "优化时引用最近 N 轮对话作为上下文，0 为禁用。默认 3 轮。",
			aboutTitle: "关于与更新",
			aboutVersionLabel: "当前版本",
			aboutRepositoryLabel: "项目地址",
			aboutLicenseLabel: "许可证",
			checkUpdateButton: "检查更新",
			checkingUpdate: "检查中…",
			updateUpToDate: "当前已是最新版本。",
			updateAvailable: "发现新版本",
			updateUnpublished: "该版本未在 npm 上公开发布。",
			updateCheckFailed: "检查更新失败",
			updateCommandLabel: "已全局安装 dsh CLI，执行",
			updateCommandNpxLabel: "未全局安装，改用 npx 执行",
			updateCommandPick: "按你的安装方式二选一即可"
		};
		const en = {
			voiceStart: "Voice input",
			voiceStop: "Stop voice input",
			voiceBusy: "Processing…",
			voiceUnavailable: "Speech recognition is not supported in this browser",
			listening: "Listening…",
			transcribing: "Transcribing…",
			polishing: "Polishing…",
			voiceFailed: "Voice input failed",
			polishNotConfigured: "No polish model configured, please choose one in Settings",
			polishFailedKeepOriginal: "Polishing failed, original kept",
			settingsTitle: "BetterInput Settings",
			settingsDescription: "Configure voice recognition and AI polishing. Polishing reuses the models already configured in dsh — no extra API key needed.",
			loading: "Loading…",
			saveFailed: "Failed to save, please retry",
			languageLabel: "Recognition language",
			languageHint: "Empty follows the browser language.",
			languagePlaceholder: "e.g. zh-CN or en-US",
			recordingLimitLabel: "Recording limit (seconds)",
			recordingLimitHint: "1–600 seconds.",
			polishLabel: "AI polishing",
			polishHint: "Clean the transcript with an LLM after recognition (fillers, homophone fixes, punctuation).",
			on: "On",
			off: "Off",
			polishModelLabel: "Polish model",
			polishModelHint: "Pick a model route already configured in dsh.",
			polishModelNone: "(none)",
			polishEffortLabel: "Polishing thinking effort",
			polishEffortHint: "Controls the model inference depth. Default uses the adapter baseline (lightest tier).",
			polishPromptLabel: "Custom polish prompt",
			polishPromptHint: "Empty uses the built-in prompt. A custom prompt always keeps the output-contract guard.",
			polishPromptPlaceholder: "Optional: paste a custom prompt…",
			showDefaultPrompt: "Show the built-in prompt",
			hideDefaultPrompt: "Hide the built-in prompt",
			defaultPromptLabel: "Built-in prompt",
			effortDefaultLabel: "Default (thinking off)",
			effortLoadingLabel: "Loading reasoning effort options…",
			routesStatus: "Available model routes",
			routesUnavailable: "unavailable",
			optimizeButton: "Optimize prompt",
			optimizeBusy: "Optimizing…",
			optimizeFailed: "Optimization failed, please retry",
			optimizeEmpty: "Input is empty, nothing to optimize",
			optimizePanelTitle: "Prompt optimization result",
			optimizeOriginalLabel: "Original",
			optimizeOptimizedLabel: "Optimized",
			optimizeAdopt: "Adopt",
			optimizeCancel: "Cancel",
			optimizeNotConfigured: "No optimize model configured, enable it in Settings",
			optimizeModelLabel: "Optimize model",
			optimizeModelHint: "Pick a model route already configured in dsh.",
			optimizeEffortLabel: "Optimize thinking effort",
			optimizeEffortHint: "Controls the model inference depth. Default uses the adapter baseline (lightest tier).",
			optimizePromptLabel: "Custom optimize prompt",
			optimizePromptHint: "Empty uses the built-in prompt. A custom prompt always keeps the output-contract guard.",
			optimizePromptPlaceholder: "Optional: paste a custom prompt…",
			contextTurnsLabel: "Context turns",
			contextTurnsHint: "Include recent N turns as context for optimization. 0 = disabled. Default 3.",
			aboutTitle: "About & Updates",
			aboutVersionLabel: "Installed version",
			aboutRepositoryLabel: "Repository",
			aboutLicenseLabel: "License",
			checkUpdateButton: "Check for updates",
			checkingUpdate: "Checking…",
			updateUpToDate: "You are up to date.",
			updateAvailable: "A new version is available",
			updateUnpublished: "This version is not published on npm.",
			updateCheckFailed: "Update check failed",
			updateCommandLabel: "With a global dsh CLI, run",
			updateCommandNpxLabel: "Without a global dsh CLI, run via npx",
			updateCommandPick: "Use either one depending on how you installed DSH"
		};
		/** Namespace owning every BetterInput surface string. Registered into the DSH
		* locale runtime; slots declaring this namespace receive the typed `t`. */
		const BETTER_INPUT_NS = "better-input";
		/**
		* Out-of-the-box defaults: every toggle ON so new users get the full
		* experience immediately; reasoning effort left empty, which the Host
		* translates to "thinking off" (the model's `off` tier when it exposes
		* one, otherwise the adapter's own default).
		* Provider/model stay empty and get auto-filled on first settings page
		* load via SettingsController (first route returned by listRoutes).
		*/
		const DEFAULT_SETTINGS = Object.freeze({
			language: "",
			maxRecordingSeconds: 120,
			polishingEnabled: true,
			polishProvider: "",
			polishModel: "",
			polishReasoningEffort: "",
			polishPrompt: "",
			optimizeEnabled: true,
			optimizeProvider: "",
			optimizeModel: "",
			optimizeReasoningEffort: "",
			optimizePrompt: "",
			contextTurns: 3
		});
		/**
		* Recognition language derived from the browser locale. An empty stored
		* language follows the UI.
		*/
		function recognitionLanguageFromBrowser() {
			if (typeof navigator === "undefined") return "en-US";
			return (navigator.language ?? "").toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
		}
		function effectiveRecognitionLanguage(stored) {
			const value = stored.trim();
			return value === "" ? recognitionLanguageFromBrowser() : value;
		}
		function isValidRecordingLimit(value) {
			return Number.isSafeInteger(value) && value >= 1 && value <= 600;
		}
		/** Resolve the effective recording cap from stored settings. */
		function effectiveRecordingSeconds(settings) {
			return isValidRecordingLimit(settings.maxRecordingSeconds) ? settings.maxRecordingSeconds : 120;
		}
		//#endregion
		//#region src/client/web-speech.ts
		var WebSpeechSession = class {
			recognition;
			options;
			active = false;
			stopping = false;
			finalText = "";
			lastHeard = "";
			ended = false;
			silent = false;
			constructor(options) {
				const Recognition = getSpeechRecognitionConstructor();
				if (Recognition === void 0) throw new Error("Speech recognition is unavailable in this browser");
				this.options = options;
				this.recognition = new Recognition();
				this.recognition.lang = options.language;
				this.recognition.continuous = true;
				this.recognition.interimResults = true;
				this.recognition.maxAlternatives = 1;
				this.recognition.onstart = () => options.onStart?.();
				this.recognition.onresult = (event) => this.handleResult(event);
				this.recognition.onerror = (event) => this.handleError(event);
				this.recognition.onend = () => this.handleEnd();
			}
			start() {
				if (this.active || this.ended || this.silent) return;
				this.active = true;
				this.stopping = false;
				try {
					this.recognition.start();
				} catch (error) {
					this.fail(error instanceof Error ? error : new Error(String(error)));
				}
			}
			stop() {
				if (!this.active || this.ended || this.silent) return;
				this.stopping = true;
				this.active = false;
				try {
					this.recognition.stop();
				} catch {
					this.endOnce();
				}
			}
			abort() {
				if (this.ended || this.silent) return;
				this.silent = true;
				this.stopping = true;
				this.active = false;
				this.recognition.onstart = null;
				this.recognition.onresult = null;
				this.recognition.onerror = null;
				this.recognition.onend = null;
				try {
					this.recognition.abort();
				} catch {}
				this.ended = true;
			}
			handleResult(event) {
				if (this.silent || this.ended) return;
				let finalChunk = "";
				let interimChunk = "";
				for (let index = event.resultIndex; index < event.results.length; index += 1) {
					const result = event.results[index];
					const transcript = result?.[0]?.transcript ?? "";
					if (result?.isFinal === true) finalChunk = appendSpeech(finalChunk, transcript);
					else interimChunk = appendSpeech(interimChunk, transcript);
				}
				if (finalChunk !== "") {
					this.finalText = appendSpeech(this.finalText, finalChunk);
					this.lastHeard = this.finalText;
					this.options.onFinal(this.finalText);
				}
				const heard = appendSpeech(this.finalText, interimChunk);
				if (heard !== "") this.lastHeard = heard;
				this.options.onInterim(heard);
			}
			handleError(event) {
				if (this.stopping || this.silent || this.ended) return;
				const code = event.error ?? "unknown";
				const detail = event.message === void 0 ? "" : `: ${event.message}`;
				this.fail(/* @__PURE__ */ new Error(`Speech recognition failed (${code})${detail}`));
			}
			handleEnd() {
				if (this.silent || this.ended) return;
				if (this.active && !this.stopping) try {
					this.recognition.start();
					return;
				} catch (error) {
					this.fail(error instanceof Error ? error : new Error(String(error)));
					return;
				}
				this.endOnce();
			}
			fail(error) {
				if (this.stopping || this.silent || this.ended) return;
				this.active = false;
				this.stopping = true;
				this.options.onError(error);
				try {
					this.recognition.abort();
				} catch {}
				this.endOnce();
			}
			endOnce() {
				if (this.ended || this.silent) return;
				this.ended = true;
				this.options.onEnd(this.finalText !== "" ? this.finalText : this.lastHeard);
			}
		};
		function appendSpeech(current, next) {
			if (next === "") return current;
			if (current === "") return next;
			if (/\s$/.test(current) || /^\s/.test(next)) return current + next;
			return `${current} ${next}`;
		}
		function getSpeechRecognitionConstructor() {
			if (typeof window === "undefined") return void 0;
			const speechWindow = window;
			return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
		}
		//#endregion
		//#region src/client/voice-session.ts
		const NOTICE_STATES = /* @__PURE__ */ new Set(["error", "polish-error"]);
		const VOICE_ERROR_DISMISS_MS = 2600;
		/**
		* Shared voice-input state for one session, written from scratch for
		* dsh-better-input. The microphone button and the recognition bar both
		* subscribe; the bar can request stop/cancel through the same instance.
		*/
		var VoiceInputSession = class {
			snapshot = {
				state: "idle",
				detail: ""
			};
			listeners = /* @__PURE__ */ new Set();
			stopListeners = /* @__PURE__ */ new Set();
			cancelListeners = /* @__PURE__ */ new Set();
			epoch = 0;
			errorTimer;
			captureEpoch() {
				return this.epoch;
			}
			isCurrentEpoch(epoch) {
				return this.epoch === epoch;
			}
			getSnapshot = () => this.snapshot;
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => this.listeners.delete(listener);
			};
			onStopRequested = (listener) => {
				this.stopListeners.add(listener);
				return () => this.stopListeners.delete(listener);
			};
			onCancelRequested = (listener) => {
				this.cancelListeners.add(listener);
				return () => this.cancelListeners.delete(listener);
			};
			setState(state, detail = "") {
				const nextDetail = NOTICE_STATES.has(state) ? detail : "";
				if (this.snapshot.state === state && this.snapshot.detail === nextDetail) return;
				this.clearErrorTimer();
				this.snapshot = {
					state,
					detail: nextDetail
				};
				this.emit();
				if (NOTICE_STATES.has(state)) this.errorTimer = setTimeout(() => {
					this.errorTimer = void 0;
					if (NOTICE_STATES.has(this.snapshot.state)) this.setState("idle");
				}, VOICE_ERROR_DISMISS_MS);
			}
			requestStop() {
				for (const listener of this.stopListeners) listener();
			}
			requestCancel() {
				if (this.snapshot.state !== "transcribing" && this.snapshot.state !== "polishing") return;
				this.epoch += 1;
				for (const listener of this.cancelListeners) listener();
				this.setState("idle");
			}
			dispose() {
				this.clearErrorTimer();
				this.listeners.clear();
				this.stopListeners.clear();
				this.cancelListeners.clear();
			}
			clearErrorTimer() {
				if (this.errorTimer === void 0) return;
				clearTimeout(this.errorTimer);
				this.errorTimer = void 0;
			}
			emit() {
				for (const listener of this.listeners) listener();
			}
		};
		function useVoiceInputSession(session) {
			return (0, react.useSyncExternalStore)(session.subscribe, session.getSnapshot, session.getSnapshot);
		}
		//#endregion
		//#region src/client/MicrophoneButton.tsx
		/**
		* The microphone button in the composer tool row. Click to start listening,
		* click again to stop. Transcripts stream into the draft in real time; when
		* polishing is enabled, the committed transcript is polished through the Host
		* LLM route and replaces the draft (unless the user edited it meanwhile).
		*/
		function MicrophoneButton({ input, inputActions, voiceSession, remote, useSettings, t }) {
			const state = useVoiceInputSession(voiceSession).state;
			const setState = (next, detail = "") => voiceSession.setState(next, detail);
			const speechRef = (0, react.useRef)(null);
			const baseDraftRef = (0, react.useRef)("");
			const mountedRef = (0, react.useRef)(true);
			const stopRef = (0, react.useRef)(null);
			const polishAbortRef = (0, react.useRef)(null);
			const recordingTimerRef = (0, react.useRef)(null);
			const settingsRef = (0, react.useRef)(null);
			const settingsFace = useSettings();
			if (settingsFace.status === "ready") settingsRef.current = settingsFace.settings;
			const latestDraftRef = (0, react.useRef)(input.draft);
			(0, react.useEffect)(() => {
				latestDraftRef.current = input.draft;
			}, [input.draft]);
			(0, react.useEffect)(() => {
				mountedRef.current = true;
				const stop = voiceSession.onStopRequested(() => stopRef.current?.());
				const cancel = voiceSession.onCancelRequested(() => {
					speechRef.current?.abort();
					polishAbortRef.current?.abort();
				});
				return () => {
					mountedRef.current = false;
					stop();
					cancel();
					speechRef.current?.abort();
					speechRef.current = null;
					polishAbortRef.current?.abort();
					polishAbortRef.current = null;
					clearRecordingTimer(recordingTimerRef);
					voiceSession.setState("idle");
				};
			}, [voiceSession]);
			const active = state === "starting" || state === "recording";
			const busy = state === "transcribing" || state === "polishing";
			const settings = settingsFace.status === "ready" ? settingsFace.settings : settingsRef.current;
			const polishingEnabled = settings?.polishingEnabled ?? false;
			const polishProvider = (settings?.polishProvider ?? "").trim();
			const polishModel = (settings?.polishModel ?? "").trim();
			const polishConfigured = polishingEnabled && polishProvider !== "" && polishModel !== "";
			const startListening = () => {
				if (active || busy) return;
				const baseDraft = input.draft;
				baseDraftRef.current = baseDraft;
				let sessionDraft = baseDraft;
				let failed = false;
				setState("starting");
				let session;
				try {
					session = new WebSpeechSession({
						language: effectiveRecognitionLanguage(settingsRef.current?.language ?? ""),
						onInterim: (text) => {
							sessionDraft = updateDraft(baseDraft, text);
							inputActions.setDraft(sessionDraft);
						},
						onFinal: (text) => {
							sessionDraft = updateDraft(baseDraft, text);
							inputActions.setDraft(sessionDraft);
						},
						onError: (error) => {
							failed = true;
							setState("error", error.message);
						},
						onEnd: (text) => {
							speechRef.current = null;
							clearRecordingTimer(recordingTimerRef);
							if (!mountedRef.current) return;
							const transcript = text.trim();
							if (failed) return;
							if (transcript === "") {
								setState("idle");
								return;
							}
							const draftAtStop = updateDraft(baseDraft, transcript);
							inputActions.setDraft(draftAtStop);
							latestDraftRef.current = draftAtStop;
							const settings = settingsRef.current;
							if (settings !== null && settings.polishingEnabled && settings.polishProvider.trim() !== "" && settings.polishModel.trim() !== "") polishDraft({
								transcript,
								baseDraft,
								draftAtStop,
								provider: settings.polishProvider,
								model: settings.polishModel,
								remote,
								setState,
								latestDraftRef,
								actionsRef: { current: inputActions },
								polishAbortRef
							});
							else setState("idle");
						}
					});
				} catch (error) {
					if (mountedRef.current) setState("error", error instanceof Error ? error.message : "Speech recognition is unavailable in this browser");
					return;
				}
				speechRef.current = session;
				session.start();
				setState("recording");
				armRecordingTimer(recordingTimerRef, effectiveRecordingSeconds(settingsRef.current ?? { maxRecordingSeconds: 120 }), () => {
					speechRef.current?.stop();
				});
			};
			const stopListening = () => {
				clearRecordingTimer(recordingTimerRef);
				if (!active) return;
				speechRef.current?.stop();
			};
			stopRef.current = stopListening;
			const tooltip = busy ? t("voiceBusy") : active ? t("voiceStop") : state === "polish-error" ? t("polishFailedKeepOriginal") : state === "error" ? t("voiceFailed") : !polishConfigured ? `${t("voiceStart")} — ${t("polishNotConfigured")}` : t("voiceStart");
			const label = busy ? "…" : active ? t("voiceStop") : t("voiceStart");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": label,
				"aria-pressed": active,
				disabled: busy,
				title: tooltip,
				onClick: active ? stopListening : startListening,
				"data-better-input-state": state,
				"data-better-input-polish-configured": polishConfigured ? "yes" : "no",
				style: buttonStyle$1(active, busy, !polishConfigured),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MicrophoneIcon, {})
			});
		}
		async function polishDraft(options) {
			if (options.provider.trim() === "" || options.model.trim() === "") return;
			const controller = new AbortController();
			options.polishAbortRef.current = controller;
			options.setState("polishing");
			try {
				const result = await options.remote.polish(options.transcript, options.provider, options.model, controller.signal);
				if (controller.signal.aborted) return;
				if (!shouldApplyPolishResult(options.latestDraftRef.current, options.draftAtStop, options.baseDraft)) {
					options.setState("idle");
					return;
				}
				if (!result.ok) {
					options.setState("polish-error", result.error.message);
					return;
				}
				const text = result.value.trim() !== "" ? result.value.trim() : options.transcript;
				const nextDraft = updateDraft(options.baseDraft, text);
				options.latestDraftRef.current = nextDraft;
				options.actionsRef.current.setDraft(nextDraft);
				options.setState("idle");
			} catch (error) {
				if (controller.signal.aborted) return;
				options.setState("polish-error", error instanceof Error ? error.message : "Polishing failed");
			} finally {
				if (options.polishAbortRef.current === controller) options.polishAbortRef.current = null;
			}
		}
		/**
		* Only replace the draft when the user has not edited it since the transcript
		* landed. Both the transcript-at-stop and the base draft count as unchanged
		* (the user may have reverted the interim edits).
		*/
		function shouldApplyPolishResult(currentDraft, draftAtStop, baseDraft) {
			const current = collapseDraft(currentDraft);
			return current === collapseDraft(draftAtStop) || current === collapseDraft(baseDraft);
		}
		function collapseDraft(text) {
			return text.replace(/\s+/g, " ").trim();
		}
		function buttonStyle$1(active, busy, polishUnconfigured) {
			return {
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: 28,
				height: 28,
				padding: 0,
				border: "none",
				borderRadius: 6,
				background: active ? "var(--dsh-color-primary, #4f8cff)" : "transparent",
				color: active ? "#fff" : "var(--dsh-color-text, inherit)",
				cursor: busy ? "default" : "pointer",
				opacity: busy ? .5 : polishUnconfigured ? .75 : 1,
				flex: "none"
			};
		}
		function MicrophoneIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				"aria-hidden": "true",
				fill: "none",
				height: "16",
				viewBox: "0 0 16 16",
				width: "16",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M8 1.75a2.25 2.25 0 0 0-2.25 2.25v3.5a2.25 2.25 0 0 0 4.5 0V4A2.25 2.25 0 0 0 8 1.75Z",
					stroke: "currentColor",
					strokeLinejoin: "round",
					strokeWidth: "1.4"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12.25V14M5.5 14h5",
					stroke: "currentColor",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: "1.4"
				})]
			});
		}
		/** Append transcript to a base draft with one space separator. */
		function updateDraft(baseDraft, transcript) {
			const text = transcript.trim();
			if (text === "") return baseDraft;
			if (baseDraft === "") return text;
			if (/\s$/.test(baseDraft) || /^\s/.test(text)) return baseDraft + text;
			return `${baseDraft} ${text}`;
		}
		function armRecordingTimer(timerRef, seconds, stop) {
			clearRecordingTimer(timerRef);
			timerRef.current = setTimeout(stop, Math.max(1, seconds) * 1e3);
		}
		function clearRecordingTimer(timerRef) {
			if (timerRef.current === null) return;
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		//#endregion
		//#region src/client/OptimizeButton.tsx
		/**
		* The ✨ optimize button rendered above the composer card (in
		* `conversation.input.dock`), right-aligned. Click reads the current draft,
		* calls the Host LLM to optimize it, then shows a confirmation panel with
		* the original and optimized text. The draft is replaced only when the user
		* clicks "Adopt".
		*/
		function OptimizeButton({ input, inputActions, session, remote, useSettings, t }) {
			const [state, setState] = (0, react.useState)({ kind: "idle" });
			const settingsFace = useSettings();
			const abortRef = (0, react.useRef)(null);
			const draftRef = (0, react.useRef)(input.draft);
			(0, react.useEffect)(() => {
				draftRef.current = input.draft;
			}, [input.draft]);
			(0, react.useEffect)(() => {
				return () => {
					abortRef.current?.abort();
				};
			}, []);
			const settings = settingsFace.status === "ready" ? settingsFace.settings : null;
			const provider = settings?.optimizeProvider.trim() ?? "";
			const model = settings?.optimizeModel.trim() ?? "";
			const modelConfigured = provider !== "" && model !== "";
			const handleClick = async () => {
				if (state.kind === "optimizing") return;
				const draft = draftRef.current.trim();
				if (draft === "") {
					setState({
						kind: "error",
						message: t("optimizeEmpty")
					});
					return;
				}
				if (!modelConfigured) {
					setState({
						kind: "error",
						message: t("optimizeNotConfigured")
					});
					return;
				}
				abortRef.current?.abort();
				const controller = new AbortController();
				abortRef.current = controller;
				setState({ kind: "optimizing" });
				try {
					const contextTurns = settings?.contextTurns ?? 3;
					const context = contextTurns > 0 ? extractConversationContext(session, contextTurns) : "";
					const result = await remote.optimize(draft, provider, model, context, controller.signal);
					if (controller.signal.aborted) return;
					if (!result.ok) {
						setState({
							kind: "error",
							message: result.error.message
						});
						return;
					}
					const optimized = result.value.trim();
					if (optimized === "") {
						setState({
							kind: "error",
							message: t("optimizeFailed")
						});
						return;
					}
					setState({
						kind: "result",
						original: draft,
						optimized
					});
				} catch (error) {
					if (controller.signal.aborted) return;
					setState({
						kind: "error",
						message: error instanceof Error ? error.message : t("optimizeFailed")
					});
				} finally {
					if (abortRef.current === controller) abortRef.current = null;
				}
			};
			const handleAdopt = () => {
				if (state.kind !== "result") return;
				inputActions.setDraft(state.optimized);
				setState({ kind: "idle" });
			};
			const handleCancel = () => {
				setState({ kind: "idle" });
			};
			const busy = state.kind === "optimizing";
			const disabled = busy || !modelConfigured;
			const buttonTitle = modelConfigured ? t("optimizeButton") : t("optimizeNotConfigured");
			const errorToast = state.kind === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorToastPortal, {
				message: state.message,
				onDismiss: handleCancel
			}) : null;
			const confirmModal = state.kind === "result" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmModalPortal, {
				title: t("optimizePanelTitle"),
				originalLabel: t("optimizeOriginalLabel"),
				optimizedLabel: t("optimizeOptimizedLabel"),
				original: state.original,
				optimized: state.optimized,
				adoptLabel: t("optimizeAdopt"),
				cancelLabel: t("optimizeCancel"),
				onAdopt: handleAdopt,
				onCancel: handleCancel
			}) : null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: containerStyle,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-label": buttonTitle,
						title: buttonTitle,
						disabled,
						onClick: handleClick,
						style: buttonStyle(disabled),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SparkleIcon, {}), busy ? t("optimizeBusy") : ""]
					})
				}),
				errorToast,
				confirmModal
			] });
		}
		function OptimizeConfirmPanel(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: modalContentStyle,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: panelTitleStyle,
						children: props.title
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: compareRowStyle,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: compareColStyle,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: compareLabelStyle,
								children: props.originalLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
								style: preStyle,
								children: props.original
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: compareColStyle,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: compareLabelStyle,
								children: props.optimizedLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
								style: {
									...preStyle,
									borderColor: "var(--dsh-color-primary, #4f8cff)"
								},
								children: props.optimized
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: panelActionsStyle,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							style: cancelBtnStyle,
							onClick: props.onCancel,
							children: props.cancelLabel
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							style: adoptBtnStyle,
							onClick: props.onAdopt,
							children: props.adoptLabel
						})]
					})
				]
			});
		}
		/**
		* Comparison modal portalled to `document.body`. DSH renders slot content
		* inside shadow roots whose ancestors may clip or contain fixed-position
		* children, so the overlay must escape the component tree entirely.
		*/
		function ConfirmModalPortal(props) {
			return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: modalOverlayStyle,
				onClick: props.onCancel,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					onClick: (e) => e.stopPropagation(),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(OptimizeConfirmPanel, { ...props })
				})
			}), document.body);
		}
		/**
		* Small error modal, also portalled to `document.body` for the same
		* stacking/escaping reasons as the comparison modal.
		*/
		function ErrorToastPortal({ message, onDismiss }) {
			return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: modalOverlayStyle,
				onClick: onDismiss,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: errorModalStyle,
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: { flex: 1 },
						children: message
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						style: errorDismissStyle,
						onClick: onDismiss,
						children: "×"
					})]
				})
			}), document.body);
		}
		function SparkleIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				"aria-hidden": "true",
				fill: "none",
				height: "14",
				viewBox: "0 0 16 16",
				width: "14",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M8 1.5l1.3 3.7L13 6.5l-3.7 1.3L8 11.5 6.7 7.8 3 6.5l3.7-1.3L8 1.5z",
					fill: "currentColor"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M12.5 10.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7z",
					fill: "currentColor",
					opacity: "0.6"
				})]
			});
		}
		/**
		* Extract recent conversation context from the session snapshot. Returns a
		* plain-text summary of the last N user/assistant turns, formatted as:
		*
		*   User: <message text>
		*   Assistant: <response text (truncated at 500 chars)>
		*
		* Returns an empty string when there are no user/assistant nodes.
		*/
		function extractConversationContext(session, maxTurns) {
			const relevant = [];
			for (const node of session.nodes) if (node.kind === "user") {
				const text = node.content.filter((c) => c.type === "text").map((c) => c.text).join("");
				if (text.trim()) relevant.push({
					role: "user",
					text: text.trim()
				});
			} else if (node.kind === "assistant") {
				const text = node.blocks.filter((b) => b.kind === "text").map((b) => b.text).join("");
				if (text.trim()) relevant.push({
					role: "assistant",
					text: text.trim().slice(0, 500)
				});
			}
			const recent = relevant.slice(-maxTurns * 2);
			if (recent.length === 0) return "";
			return recent.map((entry) => entry.role === "user" ? `User: ${entry.text}` : `Assistant: ${entry.text}`).join("\n");
		}
		const containerStyle = {
			display: "inline-flex",
			alignItems: "center",
			height: 26,
			flex: "none"
		};
		const buttonStyle = (disabled) => ({
			display: "inline-flex",
			alignItems: "center",
			gap: 4,
			height: 26,
			padding: "0 8px",
			border: "none",
			borderRadius: 6,
			background: "transparent",
			color: "var(--dsh-color-text-secondary, inherit)",
			cursor: disabled ? "not-allowed" : "pointer",
			opacity: disabled ? .5 : 1,
			fontSize: 12,
			flex: "none"
		});
		const modalOverlayStyle = {
			position: "fixed",
			inset: 0,
			background: "rgba(0,0,0,0.35)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 99998
		};
		const modalContentStyle = {
			padding: 14,
			borderRadius: 10,
			background: "var(--dsh-color-surface, #fff)",
			border: "1px solid var(--dsh-color-border, #e0e0e0)",
			boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
			width: "min(640px, 92vw)",
			zIndex: 99999
		};
		const panelTitleStyle = {
			fontSize: 14,
			fontWeight: 600,
			marginBottom: 10,
			color: "var(--dsh-color-text, inherit)"
		};
		const compareRowStyle = {
			display: "flex",
			gap: 10,
			maxHeight: 300
		};
		const compareColStyle = {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			minWidth: 0
		};
		const compareLabelStyle = {
			fontSize: 11,
			color: "var(--dsh-color-text-secondary, #888)",
			marginBottom: 4
		};
		const preStyle = {
			margin: 0,
			padding: 10,
			fontSize: 12,
			lineHeight: 1.6,
			whiteSpace: "pre-wrap",
			wordBreak: "break-word",
			overflow: "auto",
			maxHeight: 240,
			borderRadius: 6,
			border: "1px solid var(--dsh-color-border, #e8e8e8)",
			background: "var(--dsh-color-surface-muted, #f9f9f9)",
			color: "var(--dsh-color-text, inherit)",
			fontFamily: "inherit"
		};
		const panelActionsStyle = {
			display: "flex",
			justifyContent: "flex-end",
			gap: 8,
			marginTop: 12
		};
		const adoptBtnStyle = {
			padding: "6px 16px",
			border: "none",
			borderRadius: 6,
			background: "var(--dsh-color-primary, #4f8cff)",
			color: "#fff",
			cursor: "pointer",
			fontSize: 13
		};
		const cancelBtnStyle = {
			padding: "6px 16px",
			border: "1px solid var(--dsh-color-border, #ddd)",
			borderRadius: 6,
			background: "transparent",
			color: "var(--dsh-color-text, inherit)",
			cursor: "pointer",
			fontSize: 13
		};
		const errorModalStyle = {
			padding: "10px 14px",
			borderRadius: 8,
			background: "var(--dsh-color-surface, #fff)",
			border: "1px solid var(--dsh-color-danger, #f5c2c7)",
			boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
			color: "var(--dsh-color-danger-text, #c33)",
			fontSize: 13,
			display: "flex",
			alignItems: "center",
			gap: 10,
			zIndex: 99999,
			maxWidth: 420,
			width: "min(420px, 90vw)"
		};
		const errorDismissStyle = {
			border: "none",
			background: "transparent",
			color: "inherit",
			cursor: "pointer",
			fontSize: 18,
			padding: 0,
			lineHeight: 1,
			flex: "none"
		};
		//#endregion
		//#region src/client/VoiceRecognitionBar.tsx
		/**
		* The recognition status bar above the composer. Shows live state and a stop
		* button while recording; the bar renders nothing when idle.
		*/
		function VoiceRecognitionBar({ voiceSession, t }) {
			const snapshot = useVoiceInputSession(voiceSession);
			const active = snapshot.state === "starting" || snapshot.state === "recording";
			const label = active ? t("listening") : snapshot.state === "transcribing" ? t("transcribing") : snapshot.state === "polishing" ? t("polishing") : snapshot.state === "polish-error" ? t("polishFailedKeepOriginal") : snapshot.state === "error" ? t("voiceFailed") : "";
			if (label === "") return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-better-input-bar": "true",
				role: "status",
				style: {
					display: "flex",
					alignItems: "center",
					gap: 8,
					padding: "4px 10px",
					borderRadius: 8,
					fontSize: 12,
					lineHeight: "18px",
					background: "var(--dsh-color-surface-raised, rgba(0,0,0,0.04))",
					color: "var(--dsh-color-text, inherit)"
				},
				children: [
					active ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PulsingDot, {}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label }),
					(snapshot.state === "error" || snapshot.state === "polish-error") && snapshot.detail !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: { opacity: .7 },
						children: snapshot.detail
					}) : null,
					active ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => voiceSession.requestStop(),
						style: {
							marginLeft: "auto",
							padding: "2px 8px",
							border: "none",
							borderRadius: 6,
							fontSize: 12,
							background: "var(--dsh-color-danger, #e5484d)",
							color: "#fff",
							cursor: "pointer"
						},
						children: t("voiceStop")
					}) : null
				]
			});
		}
		function PulsingDot() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				style: {
					width: 8,
					height: 8,
					borderRadius: "50%",
					background: "#e5484d",
					animation: "dsh-better-input-pulse 1.2s ease-in-out infinite"
				}
			});
		}
		//#endregion
		//#region src/client/settings-controller.ts
		const EMPTY_ABOUT = {
			repository: "",
			repositorySlug: "",
			version: "",
			license: "",
			updateCommand: "",
			updateCommandNpx: ""
		};
		const EMPTY_VIEW = {
			available: false,
			writable: false,
			settings: { ...DEFAULT_SETTINGS },
			overridden: [],
			defaultPolishPrompt: "",
			defaultOptimizePrompt: ""
		};
		/**
		* Settings read/write controller for the settings page and the microphone
		* flow. Owns the remote calls and a simple external store so both the page
		* and the voice button observe the same values. Also caches per-model
		* reasoning-effort metadata loaded lazily through resolveModelEfforts so
		* opening the effort dropdown never double-fetches across renders.
		*/
		var SettingsController = class {
			remote;
			settingsSnapshot = {
				status: "loading",
				view: EMPTY_VIEW,
				detail: ""
			};
			routesSnapshot = {
				status: "loading",
				routes: [],
				detail: ""
			};
			effortsSnapshot = {};
			aboutSnapshot = {
				status: "loading",
				about: EMPTY_ABOUT,
				detail: ""
			};
			updateSnapshot = {
				status: "idle",
				update: null,
				detail: ""
			};
			listeners = /* @__PURE__ */ new Set();
			disposed = false;
			constructor(remote) {
				this.remote = remote;
			}
			getSettingsSnapshot = () => this.settingsSnapshot;
			getRoutesSnapshot = () => this.routesSnapshot;
			getEffortsSnapshot = () => this.effortsSnapshot;
			getAboutSnapshot = () => this.aboutSnapshot;
			getUpdateSnapshot = () => this.updateSnapshot;
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => this.listeners.delete(listener);
			};
			async refreshSettings() {
				const result = await this.remote.getSettings();
				if (this.disposed) return;
				if (!result.ok) this.settingsSnapshot = {
					status: "error",
					view: EMPTY_VIEW,
					detail: result.error.message
				};
				else {
					this.settingsSnapshot = {
						status: "ready",
						view: result.value,
						detail: ""
					};
					this.autoPopulateDefaultRoutesIfNeeded(result.value.settings);
				}
				this.emit();
			}
			async refreshRoutes() {
				const result = await this.remote.listRoutes();
				if (this.disposed) return;
				if (!result.ok) this.routesSnapshot = {
					status: "error",
					routes: [],
					detail: result.error.message
				};
				else {
					this.routesSnapshot = {
						status: "ready",
						routes: result.value,
						detail: ""
					};
					if (this.settingsSnapshot.status === "ready") this.autoPopulateDefaultRoutesIfNeeded(this.settingsSnapshot.view.settings);
				}
				this.emit();
			}
			autoPopulateDefaultRoutesIfNeeded = async (settings) => {
				const polishEmpty = settings.polishProvider === "" || settings.polishModel === "";
				const optimizeEmpty = settings.optimizeProvider === "" || settings.optimizeModel === "";
				if (!polishEmpty && !optimizeEmpty) return;
				const first = (this.routesSnapshot.status === "ready" && this.routesSnapshot.routes.length > 0 ? this.routesSnapshot.routes : await (async () => {
					if (this.disposed) return [];
					const rs = await this.remote.listRoutes();
					if (this.disposed || !rs.ok) return [];
					this.routesSnapshot = {
						status: "ready",
						routes: rs.value,
						detail: ""
					};
					this.emit();
					return rs.value;
				})())[0];
				if (first === void 0) return;
				const patch = {};
				if (polishEmpty) {
					patch.polishProvider = first.provider;
					patch.polishModel = first.model;
				}
				if (optimizeEmpty) {
					patch.optimizeProvider = first.provider;
					patch.optimizeModel = first.model;
				}
				await this.update(patch);
			};
			async update(patch) {
				const result = await this.remote.updateSettings(patch);
				if (this.disposed) return false;
				if (!result.ok) return false;
				this.settingsSnapshot = {
					status: "ready",
					view: result.value,
					detail: ""
				};
				this.emit();
				return true;
			}
			/**
			* Lazily fetch reasoning efforts for a route. Results are cached in the
			* controller so changing the effort dropdown back and forth doesn't
			* re-trigger remote calls. Returns a snapshot entry immediately — the
			* caller subscribes via `useEffortsSnapshot` to re-render when the data
			* lands.
			*/
			async ensureEffortsFor(provider, model) {
				if (provider === "" || model === "" || this.disposed) return;
				const key = `${provider}\u0000${model}`;
				if (this.effortsSnapshot[key] !== void 0) return;
				this.effortsSnapshot = {
					...this.effortsSnapshot,
					[key]: {
						status: "loading",
						efforts: [],
						detail: ""
					}
				};
				this.emit();
				try {
					const result = await this.remote.resolveModelEfforts(provider, model);
					if (this.disposed) return;
					if (result.ok) this.effortsSnapshot = {
						...this.effortsSnapshot,
						[key]: {
							status: "ready",
							efforts: result.value.efforts,
							defaultEffort: result.value.defaultEffort,
							detail: ""
						}
					};
					else this.effortsSnapshot = {
						...this.effortsSnapshot,
						[key]: {
							status: "error",
							efforts: [],
							detail: result.error.message
						}
					};
				} catch (error) {
					if (this.disposed) return;
					this.effortsSnapshot = {
						...this.effortsSnapshot,
						[key]: {
							status: "error",
							efforts: [],
							detail: error instanceof Error ? error.message : String(error)
						}
					};
				}
				this.emit();
			}
			async refreshAbout() {
				const result = await this.remote.getAbout();
				if (this.disposed) return;
				if (!result.ok) this.aboutSnapshot = {
					status: "error",
					about: EMPTY_ABOUT,
					detail: result.error.message
				};
				else this.aboutSnapshot = {
					status: "ready",
					about: result.value,
					detail: ""
				};
				this.emit();
			}
			async checkForUpdate() {
				if (this.disposed) return;
				if (this.updateSnapshot.status === "loading") return;
				this.updateSnapshot = {
					status: "loading",
					update: null,
					detail: ""
				};
				this.emit();
				try {
					const result = await this.remote.checkForUpdate();
					if (this.disposed) return;
					if (result.ok) this.updateSnapshot = {
						status: "ready",
						update: result.value,
						detail: ""
					};
					else this.updateSnapshot = {
						status: "error",
						update: null,
						detail: result.error.message
					};
				} catch (error) {
					if (this.disposed) return;
					this.updateSnapshot = {
						status: "error",
						update: null,
						detail: error instanceof Error ? error.message : String(error)
					};
				}
				this.emit();
			}
			dispose() {
				this.disposed = true;
				this.listeners.clear();
			}
			emit() {
				for (const listener of this.listeners) listener();
			}
		};
		function useSettingsSnapshot(controller) {
			return (0, react.useSyncExternalStore)(controller.subscribe, controller.getSettingsSnapshot, controller.getSettingsSnapshot);
		}
		function useRoutesSnapshot(controller) {
			return (0, react.useSyncExternalStore)(controller.subscribe, controller.getRoutesSnapshot, controller.getRoutesSnapshot);
		}
		function useEffortsSnapshot(controller) {
			return (0, react.useSyncExternalStore)(controller.subscribe, controller.getEffortsSnapshot, controller.getEffortsSnapshot);
		}
		function useAboutSnapshot(controller) {
			return (0, react.useSyncExternalStore)(controller.subscribe, controller.getAboutSnapshot, controller.getAboutSnapshot);
		}
		function useUpdateSnapshot(controller) {
			return (0, react.useSyncExternalStore)(controller.subscribe, controller.getUpdateSnapshot, controller.getUpdateSnapshot);
		}
		//#endregion
		//#region src/client/settings.tsx
		function ReasoningEffortSelect(props) {
			const { settingsController, provider, model, storedEffort, onChange, t } = props;
			const efforts = useEffortsSnapshot(settingsController);
			(0, react.useEffect)(() => {
				if (provider === "" || model === "") return;
				settingsController.ensureEffortsFor(provider, model);
			}, [
				settingsController,
				provider,
				model
			]);
			if (provider === "" || model === "") return null;
			const entry = efforts[`${provider}\u0000${model}`];
			if (entry === void 0 || entry.status === "loading") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
				value: "",
				disabled: true,
				style: inputStyle,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
					value: "",
					children: t("effortLoadingLabel")
				})
			});
			if (entry.status === "error" || entry.efforts.length === 0) return null;
			const items = entry.efforts;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
				value: storedEffort,
				onChange: (event) => onChange(event.target.value),
				style: inputStyle,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
					value: "",
					children: t("effortDefaultLabel")
				}), items.map((effort) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
					value: effort.id,
					title: effort.description,
					children: effort.name
				}, effort.id))]
			});
		}
		/**
		* The BetterInput settings page. Renders the recognition and polishing
		* configuration; every field edits a local draft and saves on blur/change.
		*/
		function BetterInputSettingsSection({ close, settingsController, t }) {
			const settings = useSettingsSnapshot(settingsController);
			const routes = useRoutesSnapshot(settingsController);
			const about = useAboutSnapshot(settingsController);
			const update = useUpdateSnapshot(settingsController);
			const [drafts, setDrafts] = (0, react.useState)({});
			const [saveFailed, setSaveFailed] = (0, react.useState)(false);
			const [showDefaultPrompt, setShowDefaultPrompt] = (0, react.useState)(false);
			const [showDefaultOptimizePrompt, setShowDefaultOptimizePrompt] = (0, react.useState)(false);
			const draftsRef = (0, react.useRef)(drafts);
			draftsRef.current = drafts;
			(0, react.useEffect)(() => {
				settingsController.refreshSettings();
				settingsController.refreshRoutes();
				settingsController.refreshAbout();
			}, [settingsController]);
			if (settings.status === "loading" || routes.status === "loading") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionFrame, {
				title: t("settingsTitle"),
				children: t("loading")
			});
			const field = (name, current) => ({
				text: drafts[name] ?? current,
				invalid: false
			});
			const setField = (name, value) => {
				setDrafts((prev) => ({
					...prev,
					[name]: value
				}));
			};
			const save = async (patch) => {
				setSaveFailed(false);
				if (await settingsController.update(patch)) setDrafts((prev) => {
					const next = { ...prev };
					for (const key of Object.keys(patch)) delete next[key];
					return next;
				});
				else setSaveFailed(true);
			};
			const s = settings.view.settings;
			const languageField = field("language", s.language);
			const secondsField = field("maxRecordingSeconds", String(s.maxRecordingSeconds));
			const polishPromptField = field("polishPrompt", s.polishPrompt);
			const optimizePromptField = field("optimizePrompt", s.optimizePrompt);
			const contextTurnsField = field("contextTurns", String(s.contextTurns));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(SectionFrame, {
				title: t("settingsTitle"),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						style: hintStyle,
						children: t("settingsDescription")
					}),
					saveFailed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						style: errorStyle,
						children: t("saveFailed")
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
						label: t("languageLabel"),
						hint: t("languageHint"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "text",
							value: languageField.text,
							placeholder: t("languagePlaceholder"),
							onChange: (event) => setField("language", event.target.value),
							onBlur: () => void save({ language: languageField.text.trim() }),
							style: inputStyle
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
						label: t("recordingLimitLabel"),
						hint: t("recordingLimitHint"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "number",
							min: 1,
							max: 600,
							value: secondsField.text,
							onChange: (event) => setField("maxRecordingSeconds", event.target.value),
							onBlur: () => {
								const parsed = Number(secondsField.text);
								if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > 600) return;
								save({ maxRecordingSeconds: parsed });
							},
							style: inputStyle
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
						label: t("polishLabel"),
						hint: t("polishHint"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							style: switchStyle,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: s.polishingEnabled,
								onChange: (event) => void save({ polishingEnabled: event.target.checked })
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: s.polishingEnabled ? t("on") : t("off") })]
						})
					}),
					s.polishingEnabled ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
							label: t("polishModelLabel"),
							hint: t("polishModelHint"),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								value: drafts.polishProvider !== void 0 || drafts.polishModel !== void 0 ? `${drafts.polishProvider ?? s.polishProvider}\u0000${drafts.polishModel ?? s.polishModel}` : `${s.polishProvider}\u0000${s.polishModel}`,
								onChange: (event) => {
									const [provider, model] = event.target.value.split("\0");
									save({
										polishProvider: provider ?? "",
										polishModel: model ?? ""
									});
								},
								style: inputStyle,
								disabled: routes.status !== "ready" || routes.routes.length === 0,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "\0",
									children: t("polishModelNone")
								}), routes.status === "ready" && routes.routes.map((route) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
									value: `${route.provider}\u0000${route.model}`,
									children: [
										route.providerName,
										" / ",
										route.modelName
									]
								}, `${route.provider}\u0000${route.model}`))]
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
							label: t("polishEffortLabel"),
							hint: t("polishEffortHint"),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReasoningEffortSelect, {
								settingsController,
								provider: s.polishProvider,
								model: s.polishModel,
								storedEffort: s.polishReasoningEffort,
								onChange: (effortId) => void save({ polishReasoningEffort: effortId }),
								t
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Field, {
							label: t("polishPromptLabel"),
							hint: t("polishPromptHint"),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
								value: polishPromptField.text,
								rows: 5,
								placeholder: t("polishPromptPlaceholder"),
								onChange: (event) => setField("polishPrompt", event.target.value),
								onBlur: () => void save({ polishPrompt: polishPromptField.text }),
								style: {
									...inputStyle,
									resize: "vertical",
									fontFamily: "monospace"
								}
							}), settings.view.defaultPolishPrompt !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowDefaultPrompt((prev) => !prev),
								style: toggleLinkStyle,
								children: showDefaultPrompt ? t("hideDefaultPrompt") : t("showDefaultPrompt")
							}), showDefaultPrompt ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
								style: {
									margin: "6px 0 0",
									padding: 8,
									maxHeight: 220,
									overflow: "auto",
									whiteSpace: "pre-wrap",
									wordBreak: "break-word",
									fontSize: 11,
									lineHeight: 1.5,
									background: "var(--dsh-color-surface, rgba(0,0,0,0.03))",
									border: "1px solid var(--dsh-color-border, rgba(128,128,128,0.3))",
									borderRadius: 6,
									fontFamily: "monospace"
								},
								children: settings.view.defaultPolishPrompt
							}) : null] }) : null]
						})
					] }) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
						label: t("optimizeModelLabel"),
						hint: t("optimizeModelHint"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							value: drafts.optimizeProvider !== void 0 || drafts.optimizeModel !== void 0 ? `${drafts.optimizeProvider ?? s.optimizeProvider}\u0000${drafts.optimizeModel ?? s.optimizeModel}` : `${s.optimizeProvider}\u0000${s.optimizeModel}`,
							onChange: (event) => {
								const [provider, model] = event.target.value.split("\0");
								save({
									optimizeProvider: provider ?? "",
									optimizeModel: model ?? ""
								});
							},
							style: inputStyle,
							disabled: routes.status !== "ready" || routes.routes.length === 0,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "\0",
								children: t("polishModelNone")
							}), routes.status === "ready" && routes.routes.map((route) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
								value: `${route.provider}\u0000${route.model}`,
								children: [
									route.providerName,
									" / ",
									route.modelName
								]
							}, `${route.provider}\u0000${route.model}`))]
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
						label: t("optimizeEffortLabel"),
						hint: t("optimizeEffortHint"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReasoningEffortSelect, {
							settingsController,
							provider: s.optimizeProvider,
							model: s.optimizeModel,
							storedEffort: s.optimizeReasoningEffort,
							onChange: (effortId) => void save({ optimizeReasoningEffort: effortId }),
							t
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Field, {
						label: t("optimizePromptLabel"),
						hint: t("optimizePromptHint"),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
							value: optimizePromptField.text,
							rows: 5,
							placeholder: t("optimizePromptPlaceholder"),
							onChange: (event) => setField("optimizePrompt", event.target.value),
							onBlur: () => void save({ optimizePrompt: optimizePromptField.text }),
							style: {
								...inputStyle,
								resize: "vertical",
								fontFamily: "monospace"
							}
						}), settings.view.defaultOptimizePrompt !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowDefaultOptimizePrompt((prev) => !prev),
							style: toggleLinkStyle,
							children: showDefaultOptimizePrompt ? t("hideDefaultPrompt") : t("showDefaultPrompt")
						}), showDefaultOptimizePrompt ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
							style: {
								margin: "6px 0 0",
								padding: 8,
								maxHeight: 220,
								overflow: "auto",
								whiteSpace: "pre-wrap",
								wordBreak: "break-word",
								fontSize: 11,
								lineHeight: 1.5,
								background: "var(--dsh-color-surface, rgba(0,0,0,0.03))",
								border: "1px solid var(--dsh-color-border, rgba(128,128,128,0.3))",
								borderRadius: 6,
								fontFamily: "monospace"
							},
							children: settings.view.defaultOptimizePrompt
						}) : null] }) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
						label: t("contextTurnsLabel"),
						hint: t("contextTurnsHint"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							max: 20,
							value: contextTurnsField.text,
							onChange: (event) => setField("contextTurns", event.target.value),
							onBlur: () => {
								const parsed = Number(contextTurnsField.text);
								if (!Number.isSafeInteger(parsed) || parsed < 0 || parsed > 20) return;
								save({ contextTurns: parsed });
							},
							style: inputStyle
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						style: hintStyle,
						children: [
							t("routesStatus"),
							": ",
							routes.status === "ready" ? `${routes.routes.length}` : routes.detail || t("routesUnavailable")
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("hr", { style: dividerStyle }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AboutUpdateSection, {
						aboutStatus: about.status,
						version: about.about.version,
						repository: about.about.repository,
						license: about.about.license,
						update,
						t,
						onCheckUpdate: () => void settingsController.checkForUpdate()
					})
				]
			});
		}
		function AboutUpdateSection(props) {
			const { aboutStatus, version, repository, license, update, t, onCheckUpdate } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 8
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						style: {
							margin: 0,
							fontSize: 14
						},
						children: t("aboutTitle")
					}),
					aboutStatus === "ready" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 2,
							fontSize: 13,
							opacity: .85
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
								t("aboutVersionLabel"),
								": ",
								version || "—"
							] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
								t("aboutLicenseLabel"),
								": ",
								license || "—"
							] }),
							repository !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
								href: repository,
								target: "_blank",
								rel: "noreferrer",
								style: { color: "var(--dsh-color-primary, #4f8cff)" },
								children: [
									t("aboutRepositoryLabel"),
									": ",
									repository
								]
							}) : null
						]
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 6
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onCheckUpdate,
								disabled: update.status === "loading",
								style: {
									width: "fit-content",
									padding: "6px 12px",
									borderRadius: 6,
									border: "1px solid var(--dsh-color-border, rgba(128,128,128,0.4))",
									background: "var(--dsh-color-surface, transparent)",
									color: "var(--dsh-color-text, inherit)",
									fontSize: 13,
									cursor: update.status === "loading" ? "default" : "pointer"
								},
								children: update.status === "loading" ? t("checkingUpdate") : t("checkUpdateButton")
							}),
							update.status === "ready" && update.update !== null ? (() => {
								const status = update.update.status;
								if (status === "up-to-date") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									style: hintStyle,
									children: t("updateUpToDate")
								});
								if (status === "unpublished") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									style: hintStyle,
									children: t("updateUnpublished")
								});
								if (status === "update-available") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 4
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
											style: {
												...hintStyle,
												color: "#e5484d"
											},
											children: [
												t("updateAvailable"),
												": ",
												update.update.installed,
												" → ",
												update.update.latest
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											style: hintStyle,
											children: [t("updateCommandLabel"), ":"]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
											style: codeStyle,
											children: update.update.updateCommand
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											style: hintStyle,
											children: [t("updateCommandNpxLabel"), ":"]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
											style: codeStyle,
											children: update.update.updateCommandNpx
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											style: hintStyle,
											children: [t("updateCommandPick"), ":"]
										})
									]
								});
								return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									style: errorStyle,
									children: t("updateCheckFailed")
								});
							})() : null,
							update.status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								style: errorStyle,
								children: [
									t("updateCheckFailed"),
									": ",
									update.detail
								]
							}) : null
						]
					})
				]
			});
		}
		function SectionFrame({ title, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					padding: 16,
					display: "flex",
					flexDirection: "column",
					gap: 12
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
					style: {
						margin: 0,
						fontSize: 16
					},
					children: title
				}), children]
			});
		}
		function Field({ label, hint, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 4
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							fontSize: 13,
							fontWeight: 600
						},
						children: label
					}),
					children,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: hintStyle,
						children: hint
					})
				]
			});
		}
		const inputStyle = {
			padding: "6px 8px",
			borderRadius: 6,
			border: "1px solid var(--dsh-color-border, rgba(128,128,128,0.4))",
			background: "var(--dsh-color-surface, transparent)",
			color: "var(--dsh-color-text, inherit)",
			fontSize: 13
		};
		const hintStyle = {
			margin: 0,
			fontSize: 12,
			opacity: .7
		};
		const errorStyle = {
			margin: 0,
			fontSize: 12,
			color: "#e5484d"
		};
		const switchStyle = {
			display: "flex",
			alignItems: "center",
			gap: 8,
			fontSize: 13
		};
		const toggleLinkStyle = {
			marginTop: 6,
			padding: 0,
			border: "none",
			background: "none",
			color: "var(--dsh-color-primary, #4f8cff)",
			fontSize: 12,
			cursor: "pointer",
			textDecoration: "underline"
		};
		const dividerStyle = {
			margin: "8px 0",
			border: "none",
			borderTop: "1px solid var(--dsh-color-border, rgba(128,128,128,0.3))"
		};
		const codeStyle = {
			padding: "6px 8px",
			overflow: "auto",
			whiteSpace: "pre-wrap",
			wordBreak: "break-all",
			fontSize: 12,
			fontFamily: "monospace",
			background: "var(--dsh-color-surface, rgba(0,0,0,0.03))",
			border: "1px solid var(--dsh-color-border, rgba(128,128,128,0.3))",
			borderRadius: 6
		};
		//#endregion
		//#region src/client/index.ts
		const PULSE_KEYFRAMES = `@keyframes dsh-better-input-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}`;
		/** Required Client services: the slot registry, the Typert remote hub, and
		* the DSH locale runtime. `remote.betterInput` is mounted by this plugin's
		* own apply() via `ctx.remote.$mount`, so it MUST NOT appear here — the
		* outer inject gates plugin activation and would deadlock waiting for
		* itself. It is declared only on the inner ctx.inject() below, which runs
		* after the mount. Settings reach the browser through `SettingsScopeBinder`
		* (provided by `@deepseek-ai/dsh-client-ui-settings`) and are read inside
		* the settings section slot itself, not via a top-level `settings` service
		* here. */
		const inject = [
			"slots",
			"remote",
			"locale"
		];
		async function apply(ctx) {
			const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
			const disposeLocaleDicts = ctx.locale.register(BETTER_INPUT_NS, {
				zh,
				en
			});
			await ctx.inject([
				"slots",
				"remote",
				"remote.betterInput"
			], async (remoteCtx) => {
				const remote = remoteCtx.remote.betterInput;
				const controller = new SettingsController(remote);
				const voiceSessions = /* @__PURE__ */ new Map();
				const voiceSessionFor = (sessionId) => {
					let session = voiceSessions.get(sessionId);
					if (session === void 0) {
						session = new VoiceInputSession();
						voiceSessions.set(sessionId, session);
					}
					return session;
				};
				remoteCtx.effect(() => () => {
					for (const session of voiceSessions.values()) session.dispose();
					voiceSessions.clear();
					controller.dispose();
				}, "dsh-better-input sessions lifecycle");
				remoteCtx.effect(() => {
					const styleTag = document.createElement("style");
					styleTag.dataset.plugin = "dsh-better-input";
					styleTag.textContent = PULSE_KEYFRAMES;
					document.head.appendChild(styleTag);
					return () => {
						styleTag.remove();
					};
				}, "dsh-better-input styles");
				controller.refreshSettings();
				controller.refreshRoutes();
				const useSettings = () => {
					const snapshot = useSettingsSnapshot(controller);
					if (snapshot.status !== "ready") return {
						status: "loading",
						settings: snapshot.view.settings
					};
					return {
						status: "ready",
						settings: snapshot.view.settings
					};
				};
				remoteCtx.slots.inject("conversation.input.dock", () => remoteCtx.slots.register({
					name: "conversation.input.dock",
					id: "better-input-recognition-bar",
					order: 15,
					locale: BETTER_INPUT_NS,
					inject: (sessionId) => ({ voiceSession: voiceSessionFor(sessionId) })
				}, VoiceRecognitionBar));
				remoteCtx.slots.inject("conversation.input.right", () => remoteCtx.slots.register({
					name: "conversation.input.right",
					id: "better-input-optimize",
					order: 9998,
					locale: BETTER_INPUT_NS,
					inject: () => ({
						remote,
						useSettings
					})
				}, OptimizeButton));
				remoteCtx.slots.inject("conversation.input.right", () => remoteCtx.slots.register({
					name: "conversation.input.right",
					id: "better-input-voice",
					order: 9999,
					locale: BETTER_INPUT_NS,
					inject: (sessionId) => ({
						remote,
						voiceSession: voiceSessionFor(sessionId),
						useSettings
					})
				}, MicrophoneButton));
				remoteCtx.slots.inject("settings.section", () => remoteCtx.slots.register({
					name: "settings.section",
					id: "dsh-better-input",
					order: 16,
					label: () => ctx.locale.bind(BETTER_INPUT_NS)("settingsTitle"),
					locale: BETTER_INPUT_NS,
					inject: () => ({ settingsController: controller })
				}, BetterInputSettingsSection));
				return () => {};
			});
			return async () => {
				disposeLocaleDicts();
				await disposeRemote();
			};
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map