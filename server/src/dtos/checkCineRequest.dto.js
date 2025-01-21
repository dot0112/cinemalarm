class CreateCheckCineRequestDto {
    constructor({ multiplex, date, cinema, movie, result }) {
        this.mode = multiplex;
        this.date = date;
        this.cinema = cinema;
        this.movie = movie;
        this.result = result;
    }

    requirements = {
        date: ["mode"],
        cinema: ["mode", "date"],
        movie: ["mode", "date", "cinema"],
        time: ["mode", "date", "cinema", "movie"],
    };

    validate(endpoint) {
        const missingFields = [];
        const requiredFields = this.requirements[endpoint];

        if (!requiredFields) {
            throw new Error(`Unknown endpoint: ${endpoint}`);
        }

        for (const field of requiredFields) {
            if (!this[field]) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            throw new Error(
                `Missing required fields: ${missingFields.join(", ")}`
            );
        }
    }
}

module.exports = CreateCheckCineRequestDto;
