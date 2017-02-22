import BaseConsumer from './base-consumer';

export default BaseConsumer.extend({

    consume (descriptor) {
        // eslint-disable-next-line no-console
        console.error(descriptor.get('source'), descriptor.get('plainText'));
        return true;
    }

});