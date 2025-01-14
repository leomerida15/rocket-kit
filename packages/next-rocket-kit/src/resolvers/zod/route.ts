import { NextRequest, NextResponse } from "next/server";
import { ZodType, ZodTypeDef, ZodObject, TypeOf } from "zod";
import { IZodRouteParams } from "./types";
import { requestFactory } from "./requestFactory";
import { responseFactory } from "./responseFactory";

export const zodRoute = <
	B extends ZodType<any, ZodTypeDef, any>,
	C extends ZodObject<any>,
	Q extends ZodObject<any>,
	H extends ZodObject<any>,
	R extends ZodType<any, ZodTypeDef, any>,
>(
	P: IZodRouteParams<B, C, Q, H, R> | IZodRouteParams<B, C, Q, H, R>["Handler"],
) => {
	const controllerFactory = (nextRequest: NextRequest, context: TypeOf<C>) => {
		try {
			const { schemas, Handler } = ((): {
				schemas?: IZodRouteParams<B, C, Q, H, R>["schemas"];
				Handler: IZodRouteParams<B, C, Q, H, R>["Handler"];
			} => {
				if (typeof P === "object")
					return {
						schemas: P.schemas,
						Handler: P.Handler,
					};

				return {
					Handler: P,
				};
			})();

			return requestFactory<B, C, Q, H, R>(nextRequest, context, schemas)
				.then((req) => {
					const reply = responseFactory(schemas?.response);

					return Handler(req, reply, context);
				})
				.finally();
		} catch (error) {
			return NextResponse.json((error as any).errors, {
				status: 400,
			}) as Response;
		}
	};

	return controllerFactory;
};
