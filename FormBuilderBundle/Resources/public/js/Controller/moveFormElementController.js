/**
 * Form Builder Form Element Move Modal
 *
 * @author Kimberly Barbadillo / Adelbert Silla
 */
formBuilderApp.controller('moveFormElementController', ['$scope', '$filter', 'FormBuilderApiService', function($scope, $filter, FormBuilderApiService) {

    $scope.questionPosition = null;
    $scope.questionPositions = [];

    $scope.selectedFormSection = null;
    $scope.selectedFormProperty = null;
    $scope.selectedTabFormProperties = [];

    $scope.$on('ngDialog.opened', function (e, $dialog) {

        $scope.selectedFormSection = $scope.mapFormSections[$scope.formPropertyToMove.formElement.formSection];
        $scope.selectFormSection();
    });

    $scope.selectFormSection = function() {

        $scope.questionPosition = 'top';
        $scope.selectedTabFormProperties = $filter('moveElementCustomFilter')($scope.formProperties, {tab: $scope.selectedFormSection.id, formProperty: $scope.formPropertyToMove}, true);
        
        if($scope.selectedTabFormProperties.length) {
            $scope.questionPositions = ['top', 'before', 'after', 'bottom'];
        } else {
            $scope.questionPositions = ['top'];
        }

        $scope.selectQuestionPosition();
    };

    $scope.selectQuestionPosition = function() {
        var $selectQuestionElem = $('#move-settings').find('[ng-model=selectedFormProperty]');

        if($scope.questionPosition == 'before' || $scope.questionPosition == 'after') {
            $scope.selectedFormProperty = $scope.selectedTabFormProperties[0];
            $selectQuestionElem.prop('disabled', false);
        } else {
            $scope.selectedFormProperty = null;
            $selectQuestionElem.prop('disabled', true);
        }
    };

    $scope.move = function(){
        if($scope.selectedFormSection.id != $scope.currentTab && $scope.hasDependentsConfiguration($scope.formPropertyToMove)) {
            return;
        }

        console.log('move me');

        var newIndex = 0, newPosition = 1;
        var index = $scope.formProperties.indexOf($scope.formPropertyToMove);
        var selectedTabFormPropertiesLength = $scope.selectedTabFormProperties.length;

        switch ($scope.questionPosition) {
            case 'top' :
                newIndex = index;
                if(selectedTabFormPropertiesLength) {
                    $scope.selectedFormProperty = $scope.selectedTabFormProperties[0];
                    newPosition = $scope.selectedFormProperty.formElement.position;
                    newIndex = $scope.formProperties.indexOf($scope.selectedFormProperty);
                }
                break;

            case 'before':
                newIndex = $scope.formProperties.indexOf($scope.selectedFormProperty);
                newPosition = $scope.selectedFormProperty.formElement.position;
                break;

            case 'after':
                newIndex = $scope.formProperties.indexOf($scope.selectedFormProperty);
                newPosition = $scope.selectedFormProperty.formElement.position;
                newIndex++; newPosition++;
                break;

            case 'bottom':
                if(selectedTabFormPropertiesLength) {
                    $scope.selectedFormProperty = $scope.selectedTabFormProperties[selectedTabFormPropertiesLength - 1];
                    newPosition = $scope.selectedFormProperty.formElement.position + 1;
                    newIndex = $scope.formProperties.indexOf($scope.selectedFormProperty) + 1;
                }
                break;
        }

        // Adjust (decrement) newIndex if the destination position of the formQuestion is in before
        // the current position of the formQuestion. We do this because we are splicing it from the list.
        if(newIndex > index) {
            newIndex--;
        }

        moveFormElement($scope.formPropertyToMove, index, newIndex, newPosition);
    }

    function moveFormElement(formProperty, index, newIndex, newPosition)
    {
        // Remove formQuestion from its current position
        $scope.formProperties.splice(index, 1);

        // Update FormQuestion position and formSection before moving.
        formProperty.formElement.position = newPosition;
        formProperty.tab = $scope.selectedFormSection.id;
        formProperty.formElement.formSection = $scope.selectedFormSection.id;

        // Add formQuestion to its new position
        $scope.formProperties.splice(newIndex, 0, formProperty);

        // Update affected formElements positions
        FormBuilderApiService.moveFormElement(formProperty.formElement, function(responseData){
            angular.forEach($scope.selectedTabFormProperties, function (eachQuestion){
                if(typeof responseData[eachQuestion.formElement.id] != 'undefined') {
                    eachQuestion.formElement.position = responseData[eachQuestion.formElement.id];
                }
            });
        });

        $scope.closeThisDialog();
    }

}]).filter('moveElementCustomFilter', function() {
    return function(formProperties, params) {
        return formProperties.filter(function(each) {
            if(each.formElement.id != params.formProperty.formElement.id && params.tab == each.tab) {
                return true;
            } else {
                return false;
            }
        });
    };
});