
class UserRepository {


  findUser(username: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`  [DB] Searching for ${username}...`);
        if (username === "admin") {
          resolve("User Found: ID 123");
        } else {
          resolve("User Not Found");
        }
      }, 1500);
    });
  }
}

class AuthService{
  private UserRepo: new UserRepository;

  constructor(UserRepo: UserRepository){
    this.UserRepo = UserRepo;
  }
  async login(name: string){
    console.log("Checking credentials...");
    const result = await this.userRepo.findUser(name);
    console.log(result);
  }
}

class AuthService {
  private repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async login(name: string) {
    console.log('Checking credentials...');
    const result = await this.repo.findUser(name);
    console.log(result);
  }
}

async function main() {
  const ur = new UserRepository();
  const aus = new AuthService(ur);
  await aus.login("admin");
  await aus.login("hacker");
}

main();
