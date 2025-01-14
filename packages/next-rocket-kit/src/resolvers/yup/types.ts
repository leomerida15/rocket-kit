import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { AnyObject, ISchema, InferType, ObjectSchema } from "yup";
import { yupRoute } from "./route";
import { responseFactory } from "./responseFactory";

export type YupResponseFactoryType = typeof responseFactory;

export type YupHandlerReturn =
	| void
	| ReturnType<ReturnType<YupResponseFactoryType>["json"]>
	| ReturnType<ReturnType<YupResponseFactoryType>["redirect"]>
	| ReturnType<ReturnType<YupResponseFactoryType>["rewrite"]>
	| ReturnType<ReturnType<YupResponseFactoryType>["next"]>;

export type YupHandlerType<
	B extends ObjectSchema<AnyObject>,
	C extends ObjectSchema<AnyObject>,
	Q extends ObjectSchema<AnyObject>,
	H extends ObjectSchema<AnyObject>,
	R extends ObjectSchema<AnyObject>,
> = IYupRouteParams<B, C, Q, H, R>["Handler"];

export type YupActionReturnType<
	B extends ObjectSchema<AnyObject>,
	C extends ObjectSchema<AnyObject>,
	Q extends ObjectSchema<AnyObject>,
	H extends ObjectSchema<AnyObject>,
	R extends ObjectSchema<AnyObject>,
> = ReturnType<YupHandlerType<B, C, Q, H, R>>;

type MethodKeyType = "Handler";
type MethodIndexType = "0";

export type YupReqType<
	B extends ObjectSchema<AnyObject>,
	C extends ObjectSchema<AnyObject>,
	Q extends ObjectSchema<AnyObject>,
	H extends ObjectSchema<AnyObject>,
	R extends ObjectSchema<AnyObject>,
> = Parameters<IYupRouteParams<B, C, Q, H, R>[MethodKeyType]>[MethodIndexType];

type ShemaKeyType = "schemas";
export type IYupSchema<
	B extends ObjectSchema<AnyObject>,
	C extends ObjectSchema<AnyObject>,
	Q extends ObjectSchema<AnyObject>,
	H extends ObjectSchema<AnyObject>,
	R extends ObjectSchema<AnyObject>,
> = IYupRouteParams<B, C, Q, H, R>[ShemaKeyType];

export interface IYupRouteParams<
	B extends ObjectSchema<AnyObject>,
	C extends ObjectSchema<AnyObject>,
	Q extends ObjectSchema<AnyObject>,
	H extends ObjectSchema<AnyObject>,
	R extends ObjectSchema<AnyObject>,
> {
	schemas?: IYupSchemasValid<B, C, Q, H, R>;
	Handler: (
		req: IYupRequestFactoryResp<B, C, Q>,
		reply: ReturnType<YupResponseFactoryType>,
		context: InferType<C>,
	) =>
		| void
		| Response
		| NextResponse<InferType<R>>
		| Promise<void | Response | NextResponse<InferType<R>>>;
}

export interface IYupSchemasValid<
	B extends ISchema<any>,
	C extends ISchema<any>,
	Q extends ISchema<AnyObject>,
	H extends AnyObject,
	R extends AnyObject,
> {
	body?: B;
	context?: C;
	query?: Q;
	headers?: H;
	response?: R;
}

export interface IYupRequestFactoryResp<
	B extends ISchema<any>,
	C extends ISchema<any>,
	Q extends ISchema<AnyObject>,
> extends NextRequest {
	getHeaders: () => ReturnType<typeof headers>;
	getContext: () => InferType<C>;
	getQuery: (queriesArray: string[]) => InferType<Q>;
	getBody: () => InferType<B>;
}

export type YupRouteType = typeof yupRoute;
