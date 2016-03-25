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

                heap.identify({
                    email: self.user.email,
                    user_id : self.user._id,
                    name: self.user.first_name + ' ' + (self.user.last_name ? self.user.last_name : ''),

                    twitter_id: self.user.twitterId,
                    facebook_id: self.user.facebookId
                });
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
                    .put(`/user`, { userID : this.user._id, data : data })
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
                        .put(`/user`, { userID : id})
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