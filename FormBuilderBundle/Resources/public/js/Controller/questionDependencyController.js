/**
 * Form Builder Set Question as dependent Controller
 * 
 * @author Adelbert Silla
 */
formBuilderApp.controller('questionDependencyController', ['$scope', '$filter', function($scope, $filter) {

    $scope.yesNoWidgetChoices = {"Yes":"Yes","No":"No"};

    $scope.dependencyConfig = {
        comparison: '=',
        value: null,
        behavior: 'show',
        event: 'change',
        dependents: {},
    };

    $scope.formPropertiesWithFormQuestion = [];
    $scope.parentFormProperty = null;

    $scope.$on('ngDialog.opened', function (e, $dialog) { 
        $scope.formPropertiesWithFormQuestion = $filter('filter')($scope.filteredFormProperties, { formQuestion: '!!' });

        $scope.parentFormProperty = $scope.formPropertiesWithFormQuestion[0];
        
        var currentRenderConfig = $scope.currentFormProperty.formElement.renderConfig;
        
        for (var i in currentRenderConfig.parent_dependency) {
            $scope.dependencyConfig = currentRenderConfig.parent_dependency[i];
            $scope.parentFormProperty = getFormPropertyByFormQuestionId(i);
            break;
        }

        console.log($scope.dependencyConfig);
    });

    $scope.removeConfig = function(parentFormQuestionId)
    {
        var parentFormProperty = getFormPropertyByFormQuestionId(parentFormQuestionId);
        removeDependentConfig(parentFormProperty, $scope.currentFormProperty, true);
    }

    $scope.updateDependencyConfig = function(formElement)
    {

        if(!$scope.parentFormProperty) {
            return;
        }

        var currentRenderConfig = $scope.currentFormProperty.formElement.renderConfig;
        var parentWidgetMetadata = $scope.parentFormProperty.formElement.widgetMetadata;

        addDependent($scope.parentFormProperty, $scope.currentFormProperty);

        currentRenderConfig.parent_dependency = {};
        currentRenderConfig.parent_dependency[$scope.parentFormProperty.formQuestion.id] = {
            comparison: $scope.dependencyConfig.comparison,
            behavior: $scope.dependencyConfig.behavior,
            event: $scope.dependencyConfig.event,
            value: $scope.dependencyConfig.value,
            parent_question: $scope.parentFormProperty.formQuestion
        };

        console.log('$scope.parentFormProperty.formElement: ', $scope.parentFormProperty.formElement.renderConfig);

        $scope.updateFormElement($scope.parentFormProperty.formElement);
        $scope.updateFormElement($scope.currentFormProperty.formElement);

        $scope.closeThisDialog();
    };

    $scope.getQuestionTitle = function(formProperty)
    {
//        var formSection = $scope.mapFormSections[formProperty.formElement.formSection];
//        var formSectionIndex = $scope.form.formSections.indexOf(formSection);
//        var formSectionTitle = 'Part ' + $scope.numberToRoman(formSectionIndex + 1);

        var question = $scope.limitString(formProperty.formQuestion.question, $scope.questionStringLimit);

        return question;
    };

    $scope.$watch('parentFormProperty', function(newVal, oldVal){
        if(newVal) {
            if(newVal.formElement.widgetMetadata.widget_id == 'yes_no_widget' && !$scope.isObject(newVal.formElement.widgetMetadata.widget_choices)) {
                console.log('parentFormProperty yes_no_widget: ', newVal.formElement);
                newVal.formElement.widgetMetadata.widget_choices = $scope.yesNoWidgetChoices;
                console.log('newVal.formElement.widgetMetadata.widget_choices: ', newVal.formElement.widgetMetadata.widget_choices);
                console.log('newVal.formElement.widgetMetadata.widget_choices.length: ', newVal.formElement.widgetMetadata.widget_choices.length);
            }
        }
    });

    function addDependent(parentPropertry, childFormProperty)
    {
        var value = getValue();
        var dependentsConfig = getDependentsConfig(parentPropertry);
        var dependentRenderConfig = childFormProperty.formElement.renderConfig;

        removeDependentConfig(parentPropertry, childFormProperty, false);

        if(typeof dependentsConfig[value] == 'undefined') {
            dependentsConfig[value] = {};
        }

        dependentsConfig[value].comparison = $scope.dependencyConfig.comparison;
        dependentsConfig[value].behavior = $scope.dependencyConfig.behavior;
        dependentsConfig[value].event = $scope.dependencyConfig.event;

        if(typeof dependentsConfig[value].dependents == 'undefined') {
            dependentsConfig[value].dependents = {};
        }

        var dependentKey = childFormProperty.formQuestion.id;
        if(typeof dependentsConfig[value].dependents[dependentKey] == 'undefined') {
            dependentsConfig[value].dependents[dependentKey] = { display: dependentRenderConfig.render_as };
        } else {
            dependentsConfig[value].dependents[dependentKey].display = dependentRenderConfig.render_as;
        }

        parentPropertry.formElement.renderConfig.dependents_config = dependentsConfig;
    };

    function removeDependentConfig(parentFormProperty, childFormProperty, forceSave)
    {
        var childFormQuestionId = childFormProperty.formQuestion.id;
        var dependentsConfig = getDependentsConfig(parentFormProperty);

        for(i in dependentsConfig) {

            // Temporary fixed to removed null values. NOTE: must not contain null value.
            if(!dependentsConfig[i]) {
                delete dependentsConfig[i];
                continue;
            }

            if(typeof dependentsConfig[i].dependents[childFormQuestionId] != 'undefined') {
                delete dependentsConfig[i].dependents[childFormQuestionId];
            }

            if(!$scope.isObjectAndNotEmpty(dependentsConfig[i].dependents)) {
                delete dependentsConfig[i];
            }
        }

        // Delete from child config
        childFormProperty.formElement.renderConfig.parent_dependency = {};

        if(forceSave) {
            $scope.updateFormElement(childFormProperty.formElement);
            $scope.updateFormElement(parentFormProperty.formElement);            
        }

        $scope.closeThisDialog();
    }

    function getDependentsConfig(formProperty)
    {
        var dependentsConfig = formProperty.formElement.renderConfig.dependents_config;

        if(!$scope.isObject(dependentsConfig)) {
            dependentsConfig  = {};
        }

        if(typeof formProperty.formElement.renderConfig.dependency_config == 'undefined') {
            delete formProperty.formElement.renderConfig.dependency_config;
        }

        console.log('getDependentsConfig: formProperty.formElement.renderConfig.dependents_config: ', dependentsConfig );

        return dependentsConfig ;
    };

    function getObjectValueKey(object, value)
    {
        for(var key in object){
            if(object[key] == value){
                return key;
            }
        }

        return null;
    };

    function getValue()
    {
        var value = $scope.dependencyConfig.value;
        var parentWidgetChoices = $scope.parentFormProperty.formElement.widgetMetadata.widget_choices;
        
        if($scope.isObject(parentWidgetChoices)) {
            value = getObjectValueKey(parentWidgetChoices, value);
        }
        else if($scope.isArray(parentWidgetChoices) && parentWidgetChoices.length) {
            value = parentWidgetChoices.indexOf($scope.dependencyConfig.value);         
        }

        return value;
    };

    function getFormPropertyByFormQuestionId(questionId)
    {
        for(i =0; i < $scope.formPropertiesWithFormQuestion.length; i++) {
            each = $scope.formPropertiesWithFormQuestion[i];

            if(each.formQuestion.id == questionId) {
                return each;
            }            
        }
    }
}]);