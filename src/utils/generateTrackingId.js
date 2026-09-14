import crypto from "node:crypto";

const generateTrackingId = () => {
    const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replaceAll("-", "");

    const randomPart = crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return `ZS-${date}-${randomPart}`;
};

export default generateTrackingId;