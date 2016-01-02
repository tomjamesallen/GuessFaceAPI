var _ = require('underscore');

module.exports = function (maxThreads) {
  // We need to keep track of threads.
  // Each thread has a means of being resolved, and on resolving it's removed
  // from the queue.
  // 
  // When a thread is resolved we check the queue for any unresolved threads.

  var maxThreads = maxThreads || 1;
  var activeThreads = 0;
  var threadCounter = 0;

  var newThreadId = function () {
    return threadCounter ++;
  };

  var onThreadResolved = function () {
    activeThreads --;

    // Call next thread.
    _.find(api.threads, function (thread) {      
      if (thread.state === null) {
        thread._call();
        return true;
      }
    });
  };

  var api = {
    threads: {},
    newThread: function (callback) {
      var threadApi = {
        id: newThreadId(),
        callback: callback || function () {},
        state: null, // null, 'active', 'resolved'
        _call: function () {
          this.state = 'active';
          this.callback(this);
          activeThreads ++;
        },
        resolve: function () {
          this.state = 'resolved';
          onThreadResolved();
        }
      };

      if (activeThreads < maxThreads) {
        threadApi._call();
      }

      return api.threads[threadApi.id] = threadApi;
    },
    resolveThread: function (id) {
      if (typeof api.threads[id] === 'object') {
        api.threads[id].resolve();
      }
    }
  };

  return api;
};