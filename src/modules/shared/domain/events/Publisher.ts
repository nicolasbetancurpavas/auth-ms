import { Topic } from '@google-cloud/pubsub';

export interface Publisher {
    publish(topic: Topic, data: Record<string, unknown>): Promise<void>; //TODO: Cambiar dependencia de Topic
}
