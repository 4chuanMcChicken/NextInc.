function success(msg, data = {}) {
    return {
        code: 0,
        message: msg,
        data,
    };
}

function successCodeInData(msg, data) {
    data.code = 0;
    data.message = msg;
    return {
        code: 0,
        message: msg,
        data,
    };
}

function fail(code, msg, data) {
    return {
        code,
        message: msg,
        data,
    };
}

function notFound() {
    // return fail(0, "Not Found", {})
    return success('Not Found', {});
}

function operationFail(msg) {
    return fail(400, msg, {});
}

function operationFailCodeInData(msg) {
    const data = {
        code: 400,
        message: msg,
    };
    return fail(400, msg, data);
}

module.exports = {
    success,
    successCodeInData,
    fail,
    notFound,
    operationFail,
    operationFailCodeInData,
};
