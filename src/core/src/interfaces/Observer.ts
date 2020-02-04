export interface Subscriber {
  update(publisher: Publisher): void;
}

export interface Publisher {
  attach(subscriber: Subscriber): void;
  detach(subscriber: Subscriber): void;
  notify(): void;
}
