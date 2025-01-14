import { ZodType, ZodTypeDef, ZodObject, TypeOf } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { requestFactory } from "./requestFactory";
import { responseFactory } from "./responseFactory";
import { zodRoute } from "./route";

export type ZodResponseFactoryType = typeof responseFactory;

export type RequestFactoryType = typeof requestFactory;

export type HandlerType<
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
> = IZodRouteParams<B, C, Q, H, R>["Handler"];

export type ZodActionReturnType<
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
> = ReturnType<HandlerType<B, C, Q, H, R>>;

export type ZodResponseFactoryKeyJsonType = ReturnType<
	ReturnType<ZodResponseFactoryType>["json"]
>;

export type ZodHandlerReturn = void | Response | Promise<void | Response>;

export interface IZodSchemasValid<
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
> {
	body?: B;
	context?: C;
	query?: Q;
	headers?: H;
	response?: R;
}

export interface IZodRequestFactoryResp<
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
> extends NextRequest {
	getHeaders: () => ReturnType<typeof headers>;
	getContext: () => TypeOf<C>;
	getQuery: (queryArray: string[]) => TypeOf<Q>;
	getBody: () => TypeOf<B>;
}

export interface IZodRouteParams<
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
> {
	schemas?: IZodSchemasValid<B, C, Q, H, R>;
	Handler: (
		req: IZodRequestFactoryResp<B, C, Q>,
		reply: ReturnType<typeof responseFactory>,
		context: TypeOf<C>,
	) =>
		| void
		| Response
		| NextResponse<TypeOf<R>>
		| Promise<void | Response | NextResponse<TypeOf<R>>>;
}

export type ZodRouteType = typeof zodRoute;
