const registerService = require("../../services/v1/alarmCine/register");
const unregisterService = require("../../services/v1/alarmCine/unregister");

const register = async (req, res) => {
    try {
        const requestDto = { ...req.body };
        requestDto.validate("register");
        const result = await registerService.register({
            uuid: requestDto.uuid,
            multiplex: requestDto.mode,
            date: requestDto.date,
            cinema: requestDto.cinema,
            movie: requestDto.movie,
            time: requestDto.time,
        });
        const responseDto = { status: 200, message: "success", data: result };
        res.status(responseDto.status).json(responseDto);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
};

const unregister = async (req, res) => {
    const requestDto = { ...req.body };
    requestDto.validate("unregister");
    const result = await unregisterService.unregister({
        uuid: requestDto.uuid,
        multiplex: requestDto.mode,
        date: requestDto.date,
        cinema: requestDto.cinema,
        movie: requestDto.movie,
        time: requestDto.time,
    });
    const responseDto = { status: 200, message: "success", data: result };
    res.status(responseDto.status).json(responseDto);
};

module.exports = { register, unregister };
