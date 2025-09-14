export interface EventsPublisher {
    publish(event: any, data: unknown): Promise<string>;
}
