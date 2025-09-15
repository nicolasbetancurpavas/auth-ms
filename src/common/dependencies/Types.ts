const TYPES = {
    Postgresql: Symbol.for('Postgresql'),
    PostgresRepository: Symbol.for('PostgresRepository'),
    PubSub: Symbol.for('PubSub'),
    PubSubRepo: Symbol.for('PubSubRepo'),
    EventsPublisher: Symbol.for('PubSubEventsPublisher'),
    Publisher: Symbol.for('PubsubPublisher'),
};
export default TYPES;
