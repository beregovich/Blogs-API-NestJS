export class ClientCreatedEvent {
  constructor(
    public userId: string,
    public login: string,
    public email: string,
  ) {}
}
