import { yupRoute } from "./yup/route";
import { zodRoute } from "./zod/route";

export const resolverObj = {
	yup: yupRoute,
	zod: zodRoute,
};
