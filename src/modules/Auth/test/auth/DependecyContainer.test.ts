// src/modules/Auth/test/auth/DependecyContainer.test.ts
import 'reflect-metadata';

// 👇 mock con @injectable aplicado programáticamente
jest.mock('@infrastructure/pubsub/PubsubEventsPublisher', () => {
    const { injectable } = require('inversify');
    class PubsubEventsPublisherMock {}
    injectable()(PubsubEventsPublisherMock); // <-- DECORADOR APLICADO
    return { __esModule: true, default: PubsubEventsPublisherMock };
});

import createDependencyContainer, { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import TYPES from '@common/dependencies/Types';
import PubSubEventsPublisher from '@infrastructure/pubsub/PubsubEventsPublisher';

describe('DependencyContainer', () => {
    beforeEach(() => {
        try {
            GLOBAL_CONTAINER.unbindAll();
        } catch {}
    });

    it('bindea EventsPublisher -> PubSubEventsPublisher', () => {
        createDependencyContainer();

        expect(GLOBAL_CONTAINER.isBound(TYPES.EventsPublisher)).toBe(true);

        const instance = GLOBAL_CONTAINER.get(TYPES.EventsPublisher);
        expect(instance).toBeInstanceOf(PubSubEventsPublisher);
    });
});
