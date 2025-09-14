import PubSubEventsPublisher from '@infrastructure/pubsub/PubsubEventsPublisher';
import { EventsPublisher } from '@common/domain/events';

import { Container } from 'inversify';
import TYPES from './Types';

export const GLOBAL_CONTAINER = new Container();

const createDependencyContainer = () => {
    GLOBAL_CONTAINER.bind<EventsPublisher>(TYPES.EventsPublisher).to(PubSubEventsPublisher);
};

export default createDependencyContainer;
