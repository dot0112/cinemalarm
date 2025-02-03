const checkString = (object) => {
    const notStringParams = [];
    for (const key of Object.keys(object)) {
        if (typeof object[key] !== "string" || object[key].trim() === "") {
            notStringParams.push(key);
        }
    }
    return notStringParams;
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

    const errors = [];

    if (!cinemaRegex.test(cinema)) errors.push("cinema");
    if (!movieRegex.test(movie)) errors.push("movie");
    if (!timeRegex.test(time)) errors.push("time");

    return errors;
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

    const errors = [];

    if (!cinemaRegex.test(cinema)) errors.push("cinema");
    if (!movieRegex.test(movie)) errors.push("movie");
    if (!timeRegex.test(time)) errors.push("time");

    return errors;
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

    const errors = [];

    if (!cinemaRegex.test(cinema)) errors.push("cinema");
    if (!movieRegex.test(movie)) errors.push("movie");
    if (!timeRegex.test(time)) errors.push("time");

    return errors;
};

const checkFormFunctions = {
    C: checkFormC,
    L: checkFormL,
    M: checkFormM,
};

const checkValidForm = (object) => {
    const result = {
        status: "success",
        error: {},
    };
    try {
        // Parameter 전달 확인
        const { uuid, multiplex, date, cinema, movie, time } = object;

        const requiredParams = [
            "uuid",
            "multiplex",
            "date",
            "cinema",
            "movie",
            "time",
        ];
        const missingParams = requiredParams.filter((param) => !object[param]);
        if (missingParams.length > 0) {
            result.error = Object.fromEntries(
                missingParams.map((param) => [param, true])
            );
            throw new Error("Missing required parameters");
        }

        // Parameter 자료형 확인
        const checkStringResult = checkString(object);
        if (checkStringResult.length > 0) {
            result.error = Object.fromEntries(
                checkStringResult.map((param) => [param, true])
            );
            throw new Error("Invalid type of parameter");
        }

        // 날짜 형식 확인
        const checkDateResult = checkDate(date);
        if (!checkDateResult) {
            result.error["date"] = true;
            throw new Error(`Invalid date format: ${date}`);
        }

        // Multiplex 기호 확인
        if (!(multiplex in checkFormFunctions)) {
            result.error["multiplex"] = true;
            throw new Error(`Invalid multiplex: ${multiplex}`);
        }

        // Multiplex에 맞는 지점, 영화, 시간 형식인지 확인
        const checkFormResult = checkFormFunctions[multiplex]({
            cinema: cinema,
            movie: movie,
            time: time,
        });
        if (checkFormResult.length > 0) {
            result.error = Object.fromEntries(
                checkFormResult.map((param) => [param, true])
            );
            throw new Error("Invalid form of parameter");
        }

        return result;
    } catch (err) {
        global.errorLogger(err);
        result.status = err.message;
    }
    return result;
};

module.exports = { checkValidForm, checkFormC, checkFormL, checkFormM };
