window.klaytn = (function() {
    var _account = "", _network_id = 0;
    var _auto_refresh_on_network_change = true;

    function _klaytn_get_account_address() {
        return new Promise(function(resolve, reject) {
            webjs.call("klaytn_get_account_address")
                .then(function(result) {
                    resolve(result);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    }

    function _klaytn_get_network_id() {
        return new Promise(function(resolve, reject) {
            webjs.call("klaytn_get_network_id")
                .then(function(result) {
                    resolve(result);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    }

    function _klaytn_send_request(request) {
        return new Promise(function(resolve, reject) {
            webjs.call("klaytn_send_request", request)
                .then(function(response) {
                    resolve(Object.assign(response, {
                        "id": request["id"]
                    }));
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    }

    function _update_network_id() {
        _klaytn_get_network_id()
            .then(function(network_id) {
                _network_id = network_id;
            })
            .catch(function(error) {
                _network_id = 0;
            });
    }

    _update_network_id();

    return {
        enable: function() {
            return _klaytn_get_account_address()
                .then(function(address) {
                    return Promise.resolve([ _account = address ]);
                })
                .catch(function(error) {
                    return Promise.reject(error);
                });
        },

        send: function(request, callback) {
            _klaytn_send_request(request)
                .then(function(response) {
                    callback(null, response);
                })
                .catch(function(error) {
                    callback(error);
                });
        },

        on: function(eventName, callback) {
            //alert("on: " + eventName + ":" + callback)
        },
        
        removeListener: function(eventName, callback) {
            //alert("removeListener: " + eventName + ":" + callback)
        },
        
        wallet_watchAsset: function() {
            alert("wallet_watchAsset!!!")
        },
        
        _kaikas: {
            isEnabled: function() {
                return true;
            },
        
            isApproved: function() {
                return Promise.resolve(true);
            },
        
            isUnlocked: function() {
                return Promise.resolve(true);
            }
        },

        get selectedAddress() {
            return _account;
        },

        get networkVersion() {
            return _network_id;
        },
        
        get isKaikas() {
            return true;
        },
        
        set autoRefreshOnNetworkChange(value) {
            _auto_refresh_on_network_change = value;
        },

        get autoRefreshOnNetworkChange() {
            return _auto_refresh_on_network_change;
        },
    }
})();
