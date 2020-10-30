"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../authentication/auth");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const corsOptions = require("../../corsOption/cors");
const authInstance = new auth_1.Authentication();
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.use(cors_1.default());
/* GET users listing. */
router.get('/', cors_1.default(corsOptions), (req, res, next) => {
    res.send('respond with a resource');
});
router.get('/registerTempUser', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield authInstance.RegisterUserTemp();
        res.json(result);
    }
    catch (error) {
        res.json(error);
    }
}));
router.get('/loginTempUser', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield authInstance.LoginTempUser();
        res.json(result);
    }
    catch (error) {
        res.json(error);
    }
}));
router.get('/confirmTempRegistration', cors_1.default(corsOptions), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield authInstance.confirmTempRegistration();
        res.json(result);
    }
    catch (error) {
        res.json(error);
    }
}));
router.post('/loginUser', cors_1.default(corsOptions), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        const data = {
            username: input.username,
            password: input.password
        };
        const result = yield authInstance.LoginUser(data);
        res.json(result);
    }
    catch (error) {
        res.json(error);
    }
}));
router.post('/register', cors_1.default(corsOptions), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        const data = {
            name: input.name,
            gender: input.gender,
            birthdate: input.birthdate,
            address: input.address,
            email: input.email,
            phoneNumber: input.phoneNumber,
            username: input.username,
            password: input.password,
        };
        const result = yield authInstance.RegisterUser(data);
        res.json(result);
    }
    catch (error) {
        res.json(error);
    }
}));
router.post('/getUserAttributes', cors_1.default(corsOptions), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body.idToken;
        if (input) {
            const result = yield authInstance.ValidateToken(input);
            if (result.status === 'success' && result.isValid)
                res.json(result.tokenPayLoad);
            else
                res.status(400).json(result);
        }
        else {
            res.status(400).send('Token is empty');
        }
    }
    catch (error) {
        res.json(error);
    }
}));
router.post('/validateToken', cors_1.default(corsOptions), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body.accessToken;
        if (input) {
            const result = yield authInstance.ValidateToken(input);
            res.json(result);
        }
        else {
            res.status(400).send('Token is empty');
        }
    }
    catch (error) {
        res.json(error);
    }
}));
router.post('/logout', cors_1.default(corsOptions), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body.username;
        if (input) {
            authInstance.logUserOut(input);
            res.send('done');
        }
        else {
            res.status(400).send('username is empty');
        }
    }
    catch (error) {
        res.json(error);
    }
}));
router.post('/renewToken', cors_1.default(corsOptions), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        if (!(input.username && !input.refreshToken))
            res.status(400).send('data is empty');
        const data = {
            username: input.username,
            refreshToken: input.refreshToken
        };
        if (input) {
            const result = yield authInstance.renew(data);
            res.json(result);
        }
        else {
            res.status(400).send('username is empty');
        }
    }
    catch (error) {
        res.json(error);
    }
}));
router.post('/getAllUsers', cors_1.default(corsOptions), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        if (!(input.username && input.idToken)) {
            res.status(400).send('data is empty or missing');
            return;
        }
        const data = {
            username: input.username
        };
        // validate the token to see if user is authorized
        const tokenValidation = yield authInstance.ValidateToken(input.idToken);
        let isAuthorized = false;
        if (tokenValidation.status === 'success' && tokenValidation.isValid) {
            const isCurrentUserAdmin = tokenValidation.tokenPayLoad['custom:isAdmin'] !== '1';
            const currentUserName = tokenValidation.tokenPayLoad['cognito:username'];
            const currentUserEmail = tokenValidation.tokenPayLoad.email;
            isAuthorized = (data.username === currentUserName || data.username === currentUserEmail || isCurrentUserAdmin);
        }
        else {
            res.status(403).send('user not authorized');
            return;
        }
        if (isAuthorized) {
            const result = yield authInstance.getAllUsers(data);
            res.json(result);
        }
        else {
            res.status(403).send('user not authorized');
        }
    }
    catch (error) {
        res.json(error);
    }
}));
router.post('/updateUserData', cors_1.default(corsOptions), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        if (!(input.username && !input.userData))
            res.status(400).send('data is empty or missing');
        const data = {
            user: {
                username: input.username,
                password: input.password,
            },
            userData: {
                name: input.name,
                gender: input.gender,
                birthdate: input.birthdate,
                address: input.address,
                email: input.email,
                phone_number: input.phone_number,
            }
        };
        const result = yield authInstance.updateUserData(data);
        res.json(result);
    }
    catch (error) {
        res.json(error);
    }
}));
const usersRouter = router;
module.exports = usersRouter;
//# sourceMappingURL=users.js.map