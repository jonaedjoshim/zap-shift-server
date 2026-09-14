const calculateParcelCost = ({
    parcelType,
    weight,
    senderRegion,
    receiverRegion,
}) => {
    if (
        !parcelType ||
        !senderRegion ||
        !receiverRegion
    ) {
        return null;
    }

    const isWithinRegion =
        senderRegion === receiverRegion;

    if (parcelType === "document") {
        return isWithinRegion ? 60 : 80;
    }

    if (parcelType !== "non-document") {
        return null;
    }

    const parsedWeight = Number(weight);

    if (
        !Number.isFinite(parsedWeight) ||
        parsedWeight <= 0
    ) {
        return null;
    }

    if (parsedWeight <= 3) {
        return isWithinRegion ? 110 : 150;
    }

    const extraWeight =
        parsedWeight - 3;

    const extraCharge =
        extraWeight * 40;

    if (isWithinRegion) {
        return 110 + extraCharge;
    }

    return 150 + extraCharge + 40;
};

export default calculateParcelCost;