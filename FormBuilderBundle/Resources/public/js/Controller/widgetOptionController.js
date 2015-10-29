
/**
 * Form Builder Widget Option Controller
 */
formBuilderApp.controller('widgetOptionController', ['$scope', '$filter', 'FormBuilderApiService', 'FormBuilderDataService', 
                                                    function($scope, $filter, FormBuilderApiService, FormBuilderDataService) {

    $scope.showOptionFieldContainer = true;
    $scope.widgetMetadata = {};
    $scope.widgetChoices = [];
    $scope.widgetChoicesCopy = [];

    $scope.init = function(formElement) {
        $scope.widgetMetadata = formElement.widgetMetadata; 
        $scope.widgetChoices = $scope.widgetMetadata.widget_choices;

        $scope.widgetChoicesCopy = angular.copy($scope.widgetChoices);
    }

    $scope.refreshWidgetOptionPopupData = function()
    {
        angular.copy($scope.widgetChoicesCopy, $scope.widgetChoices);
    }


    // Manage Widget options
    $scope.saveWidgetOptions = function($event, formProperty, originalOptions)
    { 
        var widgetChoices = formProperty.formElement.widgetMetadata.widget_choices;
        var checkedWidgetChoices = filterUnemptyChoices(widgetChoices);
        var indexOfProperty = $scope.formProperties.indexOf(formProperty);

        if (checkedWidgetChoices.length > 0) {
            
            var updateOptions = function(responseData) {
                var prop = FormBuilderDataService.buildFormPropertyData(formProperty.formElement, formProperty.formQuestion);
                prop.counter = formProperty.counter;

                $scope.formProperties[indexOfProperty] = prop;
                angular.copy($scope.widgetChoices, $scope.widgetChoicesCopy);
            };

            formProperty.formElement.widgetMetadata.widget_choices = checkedWidgetChoices

            FormBuilderApiService.updateFormElement(formProperty.formElement, updateOptions);
        } else {
            alert('Please make sure that widget choice is not empty.');

            $scope.refreshWidgetOptionPopupData();
        }
    }

    $scope.addWidgetOption = function(widgetChoices)
    {
        widgetChoices.push('');

        return widgetChoices;
    };

    $scope.updateWidgetOption = function(index, updatedChoice, widgetChoices)
    {
        widgetChoices[index] = updatedChoice;

        return widgetChoices;
    };

    $scope.removeWidgetOption = function(index, widgetChoices)
    {
        return widgetChoices.splice(index, 1);
    };

    // do cleanup of widgetChoices: exclude empty options, validate given choices/options
    function filterUnemptyChoices(widgetChoices)
    {
        var checkedWidgetChoices = [];

        for (var index in widgetChoices) {
            var choice = widgetChoices[index];

            if (choice.length != 0) {
                checkedWidgetChoices.push(choice);
            }
        }

        return checkedWidgetChoices;
    }
}]);