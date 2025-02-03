class CreateAlarmCineResponseDto {
    constructor({ status, message, data, error }) {
        this.status = status || 200;
        this.message = message || "Success";
        (this.data = data || {}), (this.error = error || {});
    }
}

module.exports = CreateAlarmCineResponseDto;
