export {};

export type Roles = "admin" | "creator" | "write-access";

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        };
    }
}