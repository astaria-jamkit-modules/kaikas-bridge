var module = (function() {
    const wallet = require("wallet-api"),
          klaytn = require("klaytn-api"),
          webjs = require("webjs-helper");

    function _klaytn_broadcast_transaction(params, request) {
        var [ transaction ] = request["params"];

        klaytn.broadcast.send(transaction)
            .then(function(response) {
                webjs.callback(params["resolve"], response);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }

    function _klaytn_send_request(params, request) {
        var { method, params: rpc_params } = request;

        klaytn.api.send(method, rpc_params)
            .then(function(response) {
                webjs.callback(params["resolve"], response);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }

    global["klaytn_get_account_address"] = function(params) {
        wallet.get_account_address()
            .then(function(result) {
                webjs.callback(params["resolve"], result);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }
    
    global["klaytn_get_network_id"] = function(params) {
        wallet.get_network_id()
            .then(function(result) {
                webjs.callback(params["resolve"], result);
            })
            .catch(function(error) {
                webjs.callback(params["reject"], error);
            });
    }

    global["klaytn_send_request"] = function(params) {
        var request = JSON.parse(params["params"]);

        if ([ "klay_sendTransaction" ].includes(request["method"])) {
            _klaytn_broadcast_transaction(params, request);
        } else {
            if ([ "klay_getTransactionReceipt" ].includes(request["method"])) {
                timeout(1, function() {
                    _klaytn_send_request(params, request);
                });
            } else {
                _klaytn_send_request(params, request);
            }
        }
    }

    return {
        initialize: function(id, bridge) {
            webjs.initialize(id, bridge);

            return this;
        },

        inject: function() {
            var dir_path = this.__ENV__["dir-path"];

            webjs.import(dir_path + "/klaytn.js");
            webjs.import(dir_path + "/caver.js");
        },
    }
})();

__MODULE__ = module;
