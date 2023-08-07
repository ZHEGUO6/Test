module.exports = (code = 200, msg = '', data = null) => {
    return {
        code,
        msg,
        data
    }
}