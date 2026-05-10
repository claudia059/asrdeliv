
import jwt from "jsonwebtoken";

export function accessToken(userEmail: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is required");
    }

    const signed = jwt.sign(
        { email: userEmail },
        secret,
        { expiresIn: "15m" }
    );
    return signed;
};

export function accessVerify(userToken: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is required");
    }

    const verified = jwt.verify(userToken, secret);
    return verified;
}

