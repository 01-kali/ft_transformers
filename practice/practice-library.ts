
class DatabaseService {
  save(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`  [Database] INSERT INTO books VALUES ("${data.title}")`);
        resolve(true);
      }, 1000);
    });
  }
}

class CreateBookDto{
  title: string;
}

class LibraryService{
  private db: DatabaseService;
  constructor(db: DatabaseService) {
    this.db = db;
  }
  async create(bookDto: CreateBookDto){
    await this.db.save(bookDto);
  }
}

async function main(){
  const Database = new DatabaseService;
  const myBook = new CreateBookDto();
  const service = new LibraryService(Database);
  myBook.title = "C++ for Beginners";
  await service.create(myBook);
}

main();
