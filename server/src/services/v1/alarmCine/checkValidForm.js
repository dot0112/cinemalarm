const checkString = (object) => {
    for (const value of Object.values(object)) {
        if (typeof value !== "string" || value.trim() === "") {
            return false;
        }
    }
    return true;
};

const checkDate = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return false;
    }
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
};

const checkFormC = ({ cinema, movie, time }) => {
    /**
     * CGV 형식
     *
     * Cinema: `string`
     * Movie: `string`
     * Time: `string`
     */
    const cinemaRegex = /^[^\s]+$/;
    const movieRegex = /^[^\s]+$/;
    const timeRegex = /^[^\s]+$/;
    return (
        cinemaRegex.test(cinema) &&
        movieRegex.test(movie) &&
        timeRegex.test(time)
    );
};

const checkFormL = ({ cinema, movie, time }) => {
    /**
     * LOTTE CINEMA 형식
     *
     * Cinema: `string|string|string`
     * Movie: `string`
     * Time: `HH:MM/HH:MM/string`
     */
    const cinemaRegex = /^[^\s]+\|[^\s]+\|[^\s]+$/;
    const movieRegex = /^[^\s]+$/;
    const timeRegex = /^[^\s]+\:[^\s]+\/[^\s]+\:[^\s]+\/[^\s]+$/;
    return (
        cinemaRegex.test(cinema) &&
        movieRegex.test(movie) &&
        timeRegex.test(time)
    );
};

const checkFormM = ({ cinema, movie, time }) => {
    /**
     * MEGABOX 형식
     *
     * Cinema: `string/string`
     * Movie: `string`
     * Time: `HH:MM/HH:MM/string`
     */
    const cinemaRegex = /^[^\s]+\/[^\s]+$/;
    const movieRegex = /^[^\s]+$/;
    const timeRegex = /^[^\s]+\:[^\s]+\/[^\s]+\:[^\s]+\/[^\s]+$/;
    return (
        cinemaRegex.test(cinema) &&
        movieRegex.test(movie) &&
        timeRegex.test(time)
    );
};

const checkFormFunctions = {
    C: checkFormC,
    L: checkFormL,
    M: checkFormM,
};

const checkValidForm = (object) => {
    try {
        // Parameter 전달 확인
        const { uuid, multiplex, date, cinema, movie, time } = object;
        if (!uuid || !multiplex || !date || !cinema || !movie || !time) {
            throw new Error("Missing required parameters");
        }

        // Parameter 자료형 확인
        const checkStringResult = checkString(object);
        if (!checkStringResult) {
            throw new Error("Invalid type of parameter");
        }

        // 날짜 형식 확인
        const checkDateResult = checkDate(date);
        if (!checkDateResult) {
            throw new Error(`Invalid date format: ${date}`);
        }

        // Multiplex 기호 확인
        if (!(multiplex in checkFormFunctions)) {
            throw new Error(`Invalid multiplex: ${multiplex}`);
        }

        // Multiplex에 맞는 지점, 영화, 시간 형식인지 확인
        const checkFormResult = checkFormFunctions[multiplex]({
            cinema: cinema,
            movie: movie,
            time: time,
        });
        if (!checkFormResult) {
            throw new Error("Invalid form of parameter");
        }

        return true;
    } catch (err) {
        global.errorLogger(err);
    }
    return false;
};

module.exports = { checkValidForm, checkFormC, checkFormL, checkFormM };
