import crypto from "node:crypto";

const generateTransactionId = () => {
    const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `TXN-${Date.now().toString().slice(-6)}-${randomHex}`;
};

export default generateTransactionId;