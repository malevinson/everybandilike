angular
    .module('ebil.auth')
    .provider('Authentication', AuthenticationProvider);

function AuthenticationProvider() {
    this.$get = $get;

    $get.$inject = ['$q', 'Storage', '$auth', '$http'];
    function $get($q, Storage, $auth, $http) {
        class Authentication {
            constructor() {
                $auth.provider = this;
                this.user = null;
            }

            initialize() {
                var self = this;
                self.user = Storage.get('user');
            }

            setUser(user) {
                if (!this.user) {
                    this.user = user;
                } else {
                    this.user = angular.extend(this.user, user);
                }
                this.user.version = Date.now();
                Storage.set('user', this.user);
            }

            update(data) {
                return $http
                    .put(`/auth/user/${this.user._id}`, { data : data })
                    .then(function (response) {
                        Storage.set('user', response.data);
                        return response.data;
                    })
                    .catch(function (err) {
                        console.error(err);
                        return $q.reject(err);
                    });
            }

            getById(id) {
                return $http
                    .get(`/auth/user/${id}`)
                    .then(function (response) {
                        return response.data;
                    })
                    .catch(function (err) {
                        console.error(err);
                        return $q.reject(err);
                    });
            }

            getByHash(hash) {
                return $http
                    .get(`/auth/user/hash/${hash}`)
                    .then(function (response) {
                        return response.data;
                    })
                    .catch(function (err) {
                        console.error(err);
                        return $q.reject(err);
                    });
            }

            clearUser() {
                this.user = null;
                Storage.remove('user');
            }

            isAuthenticated() {
                return (!! this.user);
            }

            logout() {
                var deferred = $q.defer();
                this.clearUser();
                deferred.resolve();
                return deferred.promise;
            }
        }

        return new Authentication();
    }
}