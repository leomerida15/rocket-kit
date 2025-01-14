import { oas31 } from "openapi3-ts";

export const Oas = {
	"3.0": (doc?: oas31.OpenAPIObject) => {
		if (!doc) return oas31.OpenApiBuilder.create(doc);

		if (!doc.openapi) doc.openapi = "3.0.3";

		return oas31.OpenApiBuilder.create(doc);
	},
	"3.1": (doc?: oas31.OpenAPIObject) => {
		if (!doc) return oas31.OpenApiBuilder.create(doc);

		if (!doc.openapi) doc.openapi = "3.1.0";

		return oas31.OpenApiBuilder.create(doc);
	},
};
