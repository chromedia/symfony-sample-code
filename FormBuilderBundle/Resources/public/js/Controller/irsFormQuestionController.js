/**
 * @author Diovannie / Adelbert Silla 
 */
formBuilderApp.controller('irsFormQuestionController', ['$scope', 'IrsFormQuestionApiService', function($scope, IrsFormQuestionApiService) {

	$scope.saveIrsQuestion = function() {
		var formQuestionId = $scope.currentFormProperty.formQuestion.id;
		var irsFormQuestion = $scope.currentFormProperty.formQuestion.irsFormQuestion;

		// Create New IrsFormQuestion
		if(typeof irsFormQuestion.id == 'undefined') {
		    IrsFormQuestionApiService.create(formQuestionId, irsFormQuestion, function(response) {
	            $scope.closeThisDialog();
	            irsFormQuestion.id = response.id;
	            $scope.currentFormProperty.formElement.isLocked = response.formQuestion.formElement.isLocked;
	        });

	    // Update IrsFormQuestion
		} else {
		    IrsFormQuestionApiService.update(formQuestionId, irsFormQuestion, function(response){
                $scope.closeThisDialog();
            });
		}
	};
}]);