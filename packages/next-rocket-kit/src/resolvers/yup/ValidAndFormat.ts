import { NextRequest } from "next/server";
import { ObjectSchema, AnyObject, InferType } from "yup";
import { IYupSchemasValid } from "../types";
import { headers as Headers } from "next/headers";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export default class ValidAndFormat<
	B extends ObjectSchema<AnyObject>,
	C extends ObjectSchema<AnyObject>,
	Q extends ObjectSchema<AnyObject>,
	H extends ObjectSchema<AnyObject>,
	R extends ObjectSchema<AnyObject>,
> {
	Schemas?: IYupSchemasValid<B, C, Q, H, R>;
	NativeContext: InferType<C>;
	nativeRequest: NextRequest;
	bodyNative: InferType<B> = {};

	constructor(
		nativeRequest: NextRequest,
		context: InferType<C>,
		Schemas?: IYupSchemasValid<B, C, Q, H, R>,
	) {
		this.Schemas = Schemas;
		this.NativeContext = context;
		this.nativeRequest = nativeRequest;
	}

	headers(): InferType<H> | ReadonlyHeaders {
		if (!this.Schemas?.headers) return Headers();

		return this.Schemas.headers.validateSync(Headers());
	}

	context(): InferType<C> {
		if (!this.Schemas?.context) return this.NativeContext;

		return this.Schemas.context.validateSync(this.NativeContext);
	}

	private getQueryWhoNoHasSchema() {
		return (queriesArray: Array<keyof InferType<Q>>): Partial<InferType<Q>> => {
			//
			const resQueries: any = {};

			const symbolsReq = Object.getOwnPropertySymbols(this.nativeRequest);

			const UrlNative = symbolsReq
				.filter((S) => {
					//@ts-ignore
					const item = this.nativeRequest[S];

					return item?.url;
				})
				.map<URL>((S) => {
					//@ts-ignore
					const item = this.nativeRequest[S];

					return item?.url;
				})[0];

			const validUrlNative = Object.keys(this.nativeRequest).includes("url");

			const url = validUrlNative ? new URL(this.nativeRequest.url) : UrlNative;

			queriesArray.map((q) => {
				resQueries[q] = url.searchParams.get(String(q));
			});

			return resQueries;
		};
	}

	private createGetQueryWhoHasSchema(queryFormat: InferType<Q>) {
		return (queriesArray: Array<keyof InferType<Q>>): Partial<InferType<Q>> => {
			const querysEntrys = Object.entries(queryFormat);

			const queryFilter = querysEntrys.filter(([k]) =>
				queriesArray.includes(k),
			);

			const queryObj = Object.fromEntries(queryFilter) as Partial<InferType<Q>>;

			return queryObj;
		};
	}

	query() {
		if (!this.Schemas?.query) return this.getQueryWhoNoHasSchema();

		const keys = Object.keys(this.Schemas.query.fields);

		const query = this.getQueryWhoNoHasSchema()(keys);

		const queryFormat = this.Schemas.query.validateSync(query) as InferType<Q>;

		const getQueryWhoHasSchema = this.createGetQueryWhoHasSchema(queryFormat);

		return getQueryWhoHasSchema;
	}

	private async defineBody() {
		const valid_methods = !["DELETE", "GET"].includes(
			this.nativeRequest.method,
		);

		if (valid_methods && this.Schemas?.body) {
			this.bodyNative = await this.nativeRequest.json();
		}
	}

	async body(): Promise<InferType<B>> {
		await this.defineBody();

		if (!this.Schemas?.body) return this.bodyNative;

		return this.Schemas.body.validateSync(this.bodyNative);
	}
}
