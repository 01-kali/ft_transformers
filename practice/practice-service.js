var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("--- SYSTEM CHECK: The file is running ---");

class MockDatabase {
    save(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('  [Database] Saving data...');
                resolve(true);
            }, 2000);
        });
    }
}
class TaskService {
    constructor(db) {
        this.db = db;
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("1. Starting the function...");
            yield this.db.save(item);
            console.log("2. Finished! Function is done.");
        });
    }
}

function main() {
    return __awaiter(this, void 0, void 0, function* () {

        const db = new MockDatabase();

        const service = new TaskService(db);

        yield service.create("Buy Groceries");
    });
}

main();
