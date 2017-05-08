import Ember from 'ember';
import BaseListener from './base-listener';
import ErrorDescriptor from '../error-descriptor';
const {getOwner} = Ember;

export default BaseListener.extend({

    init() {
        this._super.apply(this, arguments);
        if (!getOwner(this)) {
            throw new Error('Application container must be defined for ember-listener');
        }
    },

    listen(manager) {

        const owner = Ember.getOwner(this);
        const listener = this;

        //Capturing errors during transitions
        const ApplicationRoute = owner.lookup('route:application');
        ApplicationRoute.reopen({
            actions: {
                error: function (error) {
                    manager.consume(
                        ErrorDescriptor.create({
                            source: `ember-route`,
                            listener: listener,
                            error
                        })
                    );

                    //allow errors to bubble so error substate routes can be shown
                    return true;
                }
            }
        });


        //Capturing RSVP errors
        Ember.RSVP.onerror = function (error) {
            manager.consume(
                ErrorDescriptor.create({
                    source: `ember-rsvp`,
                    listener: listener,
                    error
                })
            );
        };

        //Capturing ember errors
        Ember.onerror = function (error) {
            manager.consume(
                ErrorDescriptor.create({
                    source: `ember`,
                    listener: listener,
                    error
                })
            );
        };

    }


});
