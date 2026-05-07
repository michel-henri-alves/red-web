export const formatApiErrorCause = (err, t) => {
    const responseData = err.response?.data;

    if (!responseData) {
        return t("unexpected.error");
    }

    if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        return responseData.errors
            .map((errorKey) => t(errorKey))
            .join("\n");
    }

    if (responseData.error) {
        return t(responseData.error, {
            param: t(responseData.field || ""),
            value: responseData.value
        });
    }

    if (responseData.message) {
        return t(responseData.message);
    }

    return t("unexpected.error");
};
