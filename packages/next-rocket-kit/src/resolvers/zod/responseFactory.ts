import { NextResponse } from "next/server";
import { TypeOf, ZodType, ZodTypeDef } from "zod";
import { getReasonPhrase } from "http-status-codes";
import { ReplyInit } from "../types";

export const responseFactory = <R extends ZodType<any, ZodTypeDef, any>,>(
	respnseSchemas?: R,
) => {
	return {
		rewrite: NextResponse.redirect,

		next: NextResponse.next,

		redirect: NextResponse.redirect,

		json(body: TypeOf<R>, init?: ReplyInit) {
			if (respnseSchemas) respnseSchemas.parse(body);

			if (init?.status && !init?.statusText) {
				init.statusText = getReasonPhrase(init.status);
			}

			return NextResponse.json<TypeOf<R>>(body, init);
		},
	};
};
