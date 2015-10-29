/**
	by Diovannie
*/

formBuilderApp.service('IrsFormQuestionApiService', function(Restangular, apiDefaultRequestParams) {

	var self = this;

	// Set Restangular default request parameters
    Restangular.setDefaultRequestParams(apiDefaultRequestParams);

	self.create = function(formQuestionId, data, callback) {
	    data = angular.copy(data);

        return Restangular.one('form-questions', formQuestionId).post('irs-form-questions', data).then(function(responseData){
            data = responseData;
            console.log('data: ', data);
            return callback(responseData);
        });
	};
	
    self.update = function(formQuestionId, data, callback) {
        data = angular.copy(data);
        var id = data.id;

        delete data.id;

        return Restangular.one('form-questions', formQuestionId).one('irs-form-questions', id).customPUT(data).then(function(responseData){
            data = responseData;
            return callback(responseData);
        });
    };

	return self;
});