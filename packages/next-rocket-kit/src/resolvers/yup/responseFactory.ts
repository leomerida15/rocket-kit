import { getReasonPhrase } from "http-status-codes";
import { NextResponse } from "next/server";
import { ISchema, InferType } from "yup";
import { ReplyInit } from "../types";

export const responseFactory = <R extends ISchema<any>,>(
	respnseSchemas?: R,
) => {
	return {
		rewrite: NextResponse.redirect,

		next: NextResponse.next,

		redirect: NextResponse.redirect,

		json: (body: InferType<R>, init?: ReplyInit) => {
			if (respnseSchemas) respnseSchemas.validate(body);

			if (init?.status && !init?.statusText) {
				init.statusText = getReasonPhrase(init.status);
			}

			return NextResponse.json<InferType<R>>(body, init);
		},
	};
};
