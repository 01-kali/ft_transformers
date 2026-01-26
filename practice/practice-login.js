var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class UserRepository {


    findUser(username) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`  [DB] Searching for ${username}...`);
                if (username === "admin") {
                    resolve("User Found: ID 123");
                }
                else {
                    resolve("User Not Found");
                }
            }, 1500);
        });
    }
}
class AuthService {
    constructor(UserRepo) {
        this.UserRepo = UserRepo;
    }
    login(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Checking credentials...");
            const result = yield this.userRepo.findUser(name);
            console.log(result);
        });
    }
}
class AuthService {
    constructor(repo) {
        this.repo = repo;
    }
    login(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Checking credentials...');
            const result = yield this.repo.findUser(name);
            console.log(result);
        });
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const ur = new UserRepository();
        const aus = new AuthService(ur);
        yield aus.login("admin");
        yield aus.login("hacker");
    });
}
main();
