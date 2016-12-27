var cluster = require('cluster');

function startWorker() {
  var worker = cluster.fork();
  console.log('worker %d started', worker.id);
};

if (cluster.isMaster) {
  require('os').cpus().forEach(function() {
    startWorker();
  });

  cluster.on('disconnect', function(worker) {
    console.log('worker %d disconnected from cluster', worker.id);
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker %d exited with code %d (%s)', worker.id, code, signal);
    startWorker();
  });
} else {
  require('./centilio-device-management-service.js')();
}
