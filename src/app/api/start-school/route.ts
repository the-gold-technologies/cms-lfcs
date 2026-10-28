import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("start-school", "Start a School (Associate)");
export { GET, PUT };
