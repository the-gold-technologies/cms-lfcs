import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("contact", "Contact Us");
export { GET, PUT };
