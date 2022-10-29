import PingResolver from "./ping/ping.resolver";
import AuthResolver from "./authResolver/auth.resolver";
import UrlsResolver from "./urlsResolver/urls.resolver";

export const resolvers = [
    PingResolver,
    AuthResolver,
    UrlsResolver
] as const;