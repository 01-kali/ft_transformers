var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class DatabaseService {
    save(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`  [Database] INSERT INTO books VALUES ("${data.title}")`);
                resolve(true);
            }, 1000);
        });
    }
}
class CreateBookDto {
}
class LibraryService {
    constructor(db) {
        this.db = db;
    }
    create(bookDto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.save(bookDto);
        });
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const Database = new DatabaseService;
        const myBook = new CreateBookDto();
        const service = new LibraryService(Database);
        myBook.title = "C++ for Beginners";
        yield service.create(myBook);
    });
}
main();
