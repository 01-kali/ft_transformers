class MockDatabase {
  save(data: string) {

    return new Promise((resolve) => {
      
      setTimeout(() => {
        
        console.log('  [Database] Saving data...'); 
        
        resolve(true);
      
      }, 2000);
    
    });
  
  }
}

class TaskService {
  private db: MockDatabase;

  constructor(db: MockDatabase) {
    this.db = db;
  }

  async create(item: string) {
    console.log("1. Starting the function...");
    await this.db.save(item);
    console.log("2. Finished! Function is done.");
  }
}


async function main() {

  const db = new MockDatabase();


  const service = new TaskService(db);


  await service.create("Buy Groceries");
}


main();
