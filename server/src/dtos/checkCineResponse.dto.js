class CreateCheckCineResponseDto {
    constructor({ status, message, data }) {
        this.status = status || 200;
        this.message = message || "Success";
        this.data = data || null;
    }

    static fromRequest({ mode, date, cinema, movie, result }) {
        return new CreateCheckCineResponseDto({
            data: {
                mode: mode || "",
                date: date || "",
                cinema: cinema || "",
                movie: movie || "",
                result: result || "",
            },
        });
    }
}

module.exports = CreateCheckCineResponseDto;
