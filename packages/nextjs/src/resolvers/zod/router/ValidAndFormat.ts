import { headers as Headers } from "next/headers";
import { ZodType, ZodTypeDef, ZodObject, TypeOf } from "zod";
import { IZodSchemasValid } from "./types";
import { NextRequest } from "next/server";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export default class ValidAndFormat<
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
> {
	Schemas?: IZodSchemasValid<B, C, Q, H, R>;
	NativeContext: TypeOf<C>;
	nativeRequest: NextRequest;
	bodyNative: TypeOf<B> = {};

	constructor(
		nativeRequest: NextRequest,
		context: TypeOf<C>,
		Schemas?: IZodSchemasValid<B, C, Q, H, R>,
	) {
		this.Schemas = Schemas;
		this.NativeContext = context;
		this.nativeRequest = nativeRequest;
	}

	private getQueryWhoNoHasSchema() {
		return (queriesArray: Array<keyof TypeOf<Q>>): Partial<TypeOf<Q>> => {
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

	private createGetQueryWhoHasSchema(queryFormat: TypeOf<Q>) {
		return (queriesArray: Array<keyof TypeOf<Q>>): Partial<TypeOf<Q>> => {
			const querysEntrys = Object.entries(queryFormat);

			const queryFilter = querysEntrys.filter(([k]) =>
				queriesArray.includes(k),
			);

			const queryObj = Object.fromEntries(queryFilter) as Partial<TypeOf<Q>>;

			return queryObj;
		};
	}

	headers(): TypeOf<H> | ReadonlyHeaders {
		if (!this.Schemas?.headers) return Headers();

		return this.Schemas.headers.parse(Headers());
	}

	context(): TypeOf<C> {
		if (!this.Schemas?.context) return this.NativeContext;

		return this.Schemas.context.parse(this.NativeContext);
	}

	query() {
		if (!this.Schemas?.query) return this.getQueryWhoNoHasSchema();

		const keys = Object.keys(this.Schemas.query.shape);

		const query = this.getQueryWhoNoHasSchema()(keys);

		const queryFormat = this.Schemas.query.parse(query) as TypeOf<Q>;

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

	async body(): Promise<TypeOf<B>> {
		await this.defineBody();

		if (!this.Schemas?.body) return this.bodyNative;

		return this.Schemas.body.parse(this.bodyNative);
	}
}
