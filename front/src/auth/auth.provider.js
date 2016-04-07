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
                $http
                    .put(`/auth/user/${this.user._id}`, { data : data })
                    .success(function (response) {
                        Storage.set('user', response);
                    })
                    .error(function (err) {
                        console.error(err);
                        reject(err)
                    });
            }

            get(id) {
                return $q(function (resolve, reject) {
                    $http
                        .get(`/auth/user/${id}`)
                        .success(function (response) {
                            resolve(response);
                        })
                        .error(function (err) {
                            console.error(err);
                            reject(err)
                        });
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