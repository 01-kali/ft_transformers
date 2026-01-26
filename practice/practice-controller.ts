

function Controller(path: string) { return (t: any) => {}; }
function Post(path?: string) { return (t: any, k: string, d: any) => {}; }
function Body() { return (t: any, k: string, i: number) => {}; }



class LoginDto {
  username!: string;
  password!: string;
}


class AuthService {
  async validateUser(dto: LoginDto) {
    console.log(`  [Service] Checking DB for user: ${dto.username}`);
    return "Login Success!";
  }
}

@Controller('auth')
class AuthController{
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.validateUser(dto);
  }
}


async function main() {

  const service = new AuthService();
  

  const controller = new AuthController(service);


  const reqData = new LoginDto();
  reqData.username = "admin";
  reqData.password = "123456";


  console.log("--- Sending HTTP Request ---");

  const result = await controller.login(reqData); 
  console.log("Response:", result);
}

main();
