// Path to the .proto contract; proto-loader reads this at startup (no separate protoc step for this example).
const PROTO_PATH = "./customers.proto";

import grpc from "@grpc/grpc-js";
// Turns .proto text into a JS object model @grpc/grpc-js can use to build a Server and stubs.
import protoLoader from "@grpc/proto-loader";
import { v4 as uuidv4 } from "uuid";

// `@grpc/grpc-js` : is the main gRPC library for Node.js, used to create gRPC servers and clients.
// `@grpc/proto-loader` : is used to load .proto files so Node.js can understand the gRPC service definitions.

// Parse the file synchronously into a packageDefinition (descriptor + options for how types map to JS).
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, // Field names stay as in .proto (e.g. snake_case) instead of default camelCase.
  longs: String, // 64-bit integers as strings in JS (no native int64).
  enums: String, // Enum values as strings.
  arrays: true, // repeated fields become JS arrays.
});

// From that definition, load the generated package tree; CustomerService matches `service CustomerService` in the .proto.
const customersProto = grpc.loadPackageDefinition(packageDefinition);

// In-process gRPC server; we register implementations and then bind to a TCP port.
const server = new grpc.Server();

const customers = [
  {
    id: "sdfshdfsd",
    name: "Abhishek Mardiya",
    age: 28,
    address: "Gandhinagar",
  },
  {
    id: "cvvbcbewb",
    name: "John Doe",
    age: 25,
    address: "Uttrakhand",
  },
];

// Wire the service: first arg is the service descriptor from the proto, second is an object of method implementations.
// Keys are camelCase rpc names (getAll ↔ GetAll in .proto).
server.addService(customersProto.CustomerService.service, {
  // Unary handler: (call, callback). call.request is the decoded request message; ignore call with _ if unused.
  getAll: (_call, callback) => {
    // callback(err, response). null error + plain object matches the CustomerList message shape.
    callback(null, { customers });
  },
  get: (call, callback) => {
    const customer = customers.find((n) => n.id === call.request.id);

    if (customer) {
      callback(null, customer);
    } else {
      // gRPC errors: status code + details; client receives a failed RPC with NOT_FOUND.
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
  insert: (call, callback) => {
    const customer = call.request;

    customer.id = uuidv4();
    customers.push(customer);
    callback(null, customer);
  },
  update: (call, callback) => {
    const existingCustomer = customers.find((n) => n.id === call.request.id);

    if (existingCustomer) {
      existingCustomer.name = call.request.name;
      existingCustomer.age = call.request.age;
      existingCustomer.address = call.request.address;
      callback(null, existingCustomer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
  remove: (call, callback) => {
    const existingCustomerIndex = customers.findIndex(
      (n) => n.id === call.request.id,
    );

    if (existingCustomerIndex !== -1) {
      customers.splice(existingCustomerIndex, 1);
      // Empty message in .proto becomes {} in JS for the response.
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
});

// bindAsync: listen on host:port; createInsecure() = no TLS (fine for local demos only).
server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(`Error starting gRPC server: ${err}`);
    } else {
      // @grpc/grpc-js 1.10+: bindAsync already listens;
      // omit server.start(); as it is deprecated.
      // run the file (node server/index.js), and the server is “up” once the bindAsync callback runs without err and you log the port.
      console.log(`gRPC server is listening on ${port}`);
    }
  },
);
