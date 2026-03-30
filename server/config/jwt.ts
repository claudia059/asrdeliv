
import jwt from "jsonwebtoken";

export function accessToken(userEmail: string) {
        const signed = jwt.sign(
            {email: userEmail},
            process.env.JWT_SECRET,
            {expiresIn: "15m"}
        );
        return signed;
};

export function accessVerify(userToken: string) {
    const verified = jwt.verify(userToken, process.env.JWT_SECRET);
    return verified;
}

