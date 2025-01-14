import { NextRequest } from "next/server";
import { IYupSchemasValid } from "./types";
import { IYupRequestFactoryResp } from "./types";
import { AnyObject, InferType, ObjectSchema } from "yup";
import ValidAndFormat from "./ValidAndFormat";

export const requestFactory = async <
	B extends ObjectSchema<AnyObject>,
	C extends ObjectSchema<AnyObject>,
	Q extends ObjectSchema<AnyObject>,
	H extends ObjectSchema<AnyObject>,
	R extends ObjectSchema<AnyObject>,
>(
	nativeRequest: NextRequest,
	context: InferType<C>,
	Schemas?: IYupSchemasValid<B, C, Q, H, R>,
) => {
	const validAndFormat = new ValidAndFormat<B, C, Q, H, R>(
		nativeRequest,
		context,
		Schemas,
	);

	const Headers = validAndFormat.headers();

	const Context = validAndFormat.context();

	const Query = validAndFormat.query();

	const body = await validAndFormat.body();

	const state = Object.getOwnPropertySymbols(nativeRequest)
		.filter((S) => S.toString().includes("state"))
		.map((S) => {
			//@ts-ignore
			return nativeRequest[S];
		})[0] as NextRequest;

	const resp = {
		getHeaders: () => Headers,
		getContext: () => Context,
		getQuery: (keys: Array<keyof InferType<Q> | string>) => Query(keys),
		getBody: () => body,
	};

	return {
		...resp,
		...nativeRequest,
		...state,
	} as unknown as IYupRequestFactoryResp<B, C, Q>;
};
