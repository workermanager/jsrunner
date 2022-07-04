// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var runner_pb = require('./runner_pb.js');

function serialize_runner_BootstrapArg(arg) {
  if (!(arg instanceof runner_pb.BootstrapArg)) {
    throw new Error('Expected argument of type runner.BootstrapArg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_runner_BootstrapArg(buffer_arg) {
  return runner_pb.BootstrapArg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_runner_Message(arg) {
  if (!(arg instanceof runner_pb.Message)) {
    throw new Error('Expected argument of type runner.Message');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_runner_Message(buffer_arg) {
  return runner_pb.Message.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_runner_Void(arg) {
  if (!(arg instanceof runner_pb.Void)) {
    throw new Error('Expected argument of type runner.Void');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_runner_Void(buffer_arg) {
  return runner_pb.Void.deserializeBinary(new Uint8Array(buffer_arg));
}


var MessageQueueService = exports.MessageQueueService = {
  pop: {
    path: '/runner.MessageQueue/Pop',
    requestStream: false,
    responseStream: false,
    requestType: runner_pb.Void,
    responseType: runner_pb.Message,
    requestSerialize: serialize_runner_Void,
    requestDeserialize: deserialize_runner_Void,
    responseSerialize: serialize_runner_Message,
    responseDeserialize: deserialize_runner_Message,
  },
  monitor: {
    path: '/runner.MessageQueue/Monitor',
    requestStream: false,
    responseStream: true,
    requestType: runner_pb.Void,
    responseType: runner_pb.Message,
    requestSerialize: serialize_runner_Void,
    requestDeserialize: deserialize_runner_Void,
    responseSerialize: serialize_runner_Message,
    responseDeserialize: deserialize_runner_Message,
  },
};

exports.MessageQueueClient = grpc.makeGenericClientConstructor(MessageQueueService);
var RunnerService = exports.RunnerService = {
  bootstrap: {
    path: '/runner.Runner/Bootstrap',
    requestStream: false,
    responseStream: false,
    requestType: runner_pb.BootstrapArg,
    responseType: runner_pb.Void,
    requestSerialize: serialize_runner_BootstrapArg,
    requestDeserialize: deserialize_runner_BootstrapArg,
    responseSerialize: serialize_runner_Void,
    responseDeserialize: deserialize_runner_Void,
  },
};

exports.RunnerClient = grpc.makeGenericClientConstructor(RunnerService);
