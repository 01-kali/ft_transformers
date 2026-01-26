interface RobotRules{
  powerOn(): void;
}

@WebSocketGateway()
class CleaningRobot implements RobotRules{
  public powerOn(): void {
    console.log('Robot is awake!');
  }
}

@WebSocketGateway()
class messageReceiver {
  receiveMessage(@MessageBody() data: string, @ConnectedSocket() client: any){
    console.log(data);
  }
}
