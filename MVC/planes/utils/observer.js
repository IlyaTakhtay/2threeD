class Observer {
    #listeners = {}
  
    #getCallbacksFor(eventName) {
      return this.#listeners[eventName] ?? [];
    }
  
    #setCallbacksFor(eventName, listeners) {
      if (listeners.length === 0) {
        delete this.#listeners[eventName];
      } else {
        this.#listeners[eventName] = listeners;
      } 
    }
  
    subscribe(eventName, callback) {
      const subs = this.#getCallbacksFor(eventName);
  
      subs.push(callback);
  
      this.#setCallbacksFor(eventName, subs);
  
      return () => this.unsubscribe(eventName, callback);
    }
  
    unsubscribe(eventName, callback) {
      const subs = this.#getCallbacksFor(eventName)
        .filter((item) => item !== callback);
  
      this.#setCallbacksFor(eventName, subs);
    }
  
    dispatch(eventName, data) {
      this.#getCallbacksFor(eventName)
        .forEach((callback) => callback(data));
    }
  }


export default new Observer();