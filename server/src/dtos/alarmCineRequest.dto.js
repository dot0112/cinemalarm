class CreateAlarmCineRequestDto {
    constructor({ uuid, multiplex, date, cinema, movie, time }) {
        this.uuid = uuid;
        this.multiplex = multiplex;
        this.date = date;
        this.cinema = cinema;
        this.movie = movie;
        this.time = time;
    }

    requirements = {
        register: ["uuid", "multiplex", "date", "cinema", "movie", "time"],
        unregister: ["uuid", "multiplex", "date", "cinema", "movie", "time"],
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

module.exports = CreateAlarmCineRequestDto;
