class CreateAlarmCineResponseDto {
    constructor({ status, message }) {
        this.status = status || 200;
        this.message = message || "Success";
    }
}

module.exports = CreateAlarmCineResponseDto;
