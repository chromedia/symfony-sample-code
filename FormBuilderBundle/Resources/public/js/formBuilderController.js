/**
 * @author Adelbert Silla
 * 
 * Form Builder Application Controller
 */

formBuilderApp.controller('formBuilderController', ['$scope', '$filter', '$timeout', '$sce', 'FormBuilderApiService', 'FormBuilderDataService', 'SortableTab', 'ngDialog', 'FormBuilderHelper',
                                                    function($scope, $filter, $timeout, $sce, FormBuilderApiService, FormBuilderDataService, SortableTab, ngDialog, FormBuilderHelper) {

    $scope.CFB_CONFIG = CFB_CONFIG;

    // This is being set/update when form.formSections changed. Mapped by 'id'.
    $scope.mapFormSections = {};

    $scope.form = { status: 0, formLinks: [{ link : '', title : '' }] };
    $scope.formError = [];
    $scope.alerts = [];

    $scope.formSectionEditMode = 0;
    $scope.formProperties = [];
    $scope.filteredFormProperties = [];

    $scope.widgetWithChoices  = ['checkbox', 'radio', 'choice'];

    $scope.tinymceConfig = getTinymceConfigurations();
    $scope.questionStringLimit = 50;


    // Initialize formBuilder
    initializeFormBuilder();

    $scope.helptextToHtml = function(text){
        return $sce.trustAsHtml(text);
    };

    $scope.limitString = function(string, limit)
    {
        return string.length > limit ? $filter('limitTo')(string, limit) + '...' : string; 
    }

    // Show Dialog for Linking IRS Forms
    $scope.openLinkFormConfig = function (formProperty) {
        $scope.currentFormProperty = formProperty;
        $scope.openDialog('question.irsFormQuestion', 'irsFormQuestionController');
    };

    // Create Form
    $scope.saveForm = function() {
        $scope.disabledSaveFormBtn = true;
        var message;
        var isNew = typeof $scope.form.id == 'undefined';
        var saveCallback = function(responseData) {
            $scope.formError = [];
            showSuccessMessage(message);
            $scope.form = responseData;
            $scope.disabledSaveFormBtn = false;
            if(isNew){
                $scope.addFormSection();
            }
        };

        var errorCallback = function(errorData) {
            var errorMsg = errorData.data.message;

            if(typeof errorData.data.errors != 'undefined') {
                errorMsg += '. Please check the form for the errors.';
                $scope.formError = errorData.data.errors.children;
            }

            showErrorMessage(errorMsg);
            $scope.disabledSaveFormBtn = false;
        }

        if(isNew) {
            FormBuilderApiService.createForm($scope.form, saveCallback, errorCallback);  
            message = "Successfully saved";     
        } else {
            FormBuilderApiService.updateForm($scope.form, saveCallback, errorCallback);
            message = "Successfully updated";  
        }
    };

    // Add Form Section
    $scope.addFormSection = function() {
        var position = $scope.form.formSections.length + 1;
        var newFormSection = {name: position, position: position };

        // Add FormSection to Form
        $scope.form.formSections.push(newFormSection);

        FormBuilderApiService.createFormSection($scope.form.id, newFormSection, function(responseData){
            $scope.form.formSections[position - 1] = responseData;
            $scope.currentFormSection = responseData;
        });

        $scope.formSectionEditMode = 0;
    };

    // Show Form Section
    $scope.showTab = function(formSection, e) {
        $scope.currentFormSection = formSection;
        $scope.formSectionEditMode = $(e.target).hasClass('edit') ? 1 : 0;

        if($(e.target).hasClass('edit')) {
            $scope.formSectionEditMode = 1;
            $scope.disabledSaveFormBtn = false;
        }
    };

    // Update Form Section
    $scope.updateFormSection = function() {
        $scope.disabledSaveFormBtn = true;
        FormBuilderApiService.updateFormSection($scope.form.id, $scope.currentFormSection, 
                function(responseData){ // Success Callback
                    $scope.formSectionEditMode = 0;
                    $scope.disabledSaveFormBtn = false;
                    $scope.formError.section = [];
                    showSuccessMessage('Sucessfully updated form tab.');
                },
                function(responseData) { // Error Callback
                    $scope.disabledSaveFormBtn = false;
                    var errorMsg = responseData.data.message;
                    if(typeof responseData.data.errors != 'undefined') {
                        errorMsg += '. Please check the form for the errors.';
                        $scope.formError.section = responseData.data.errors.children;
                    }
                    showErrorMessage(errorMsg);
                }
        );
    };

    // Remove FormSection
    $scope.removeFormSection = function(formSection) {

        FormBuilderApiService.removeFormSection($scope.form.id, formSection, function(responseData){
            $scope.currentFormSection = 0;

            var index = $scope.form.formSections.indexOf(formSection);
            $scope.form.formSections.splice(index, 1); 
        });

    };

    // Add Question
    $scope.addQuestion = function(questionTemplateData) {

        var position = newFormElementPosition();
        var indexPosition = newFormElementIndexPosition();
        var formProperty = FormBuilderDataService.buildQuestionProperty(questionTemplateData, $scope.form.id, $scope.currentFormSection, position);

        FormBuilderApiService.createFormElementWithFormQuestion(formProperty.formElement, formProperty.formQuestion, function(responseData){
            if(responseData) {
                formProperty.formElement = responseData;
                formProperty.formQuestion = responseData.formQuestion;
            }
        });

        $scope.formProperties.splice(indexPosition, 0, formProperty);
    };

    // Add Element
    $scope.addElement = function(elementData) {

        var position = newFormElementPosition();
        var indexPosition = newFormElementIndexPosition();
        var formProperty = FormBuilderDataService.buildElementProperty(elementData, $scope.form.id, $scope.currentFormSection, position);

        FormBuilderApiService.createFormElement(formProperty.formElement, function(responseData){
            if(responseData) {
                $scope.formProperties[indexPosition].formElement = responseData;
            }
        });

        $scope.formProperties.splice(indexPosition, 0, formProperty);
    };

    // Update FormElement
    $scope.updateFormElement = function(formElement) {
        FormBuilderApiService.updateFormElement(formElement);
    };

    // Remove formProperty
    $scope.removeFormWidget = function(formProperty) {
 
        if(formProperty.formElement.isLocked) {

            // Temporary commented. This condition is not necessary.
            //if(formProperty.formElement.elementType == CFB_CONFIG.questionType) {
                if (Session.getUser().isSuperAdmin) {
                    ngDialog.openConfirm({
                        template: 'dialog.question.confirmDelete'
                    }).then(function () {
                        executeRemoveFormWidget(formProperty);
                    });
                    return false;
                }
                $scope.openDialog('dialog.question.restrictDelete');
            //}
        } else {
            executeRemoveFormWidget(formProperty);
        }
    };

    $scope.removeHelpfulLink = function($event,formLink) {
        $event.preventDefault();
        var index = $scope.form.formLinks.indexOf(formLink);
        $scope.form.formLinks.splice(index, 1);
    };

    $scope.addHelpfulLink = function($event) {
        $event.preventDefault();

        $scope.form.formLinks.push({ link:'', title:'' });
    };
    
    $scope.updateFormQuestion = function($event, formProperty) {
        FormBuilderApiService.updateFormQuestion(formProperty.formQuestion, formProperty.formElement);
    };

    $scope.isSuperAdminUser = function()
    {
        return Session.getUser().isSuperAdmin;
    };

    $scope.numberToRoman = function(num)
    {
    	return FormBuilderHelper.numberToRoman(num);
    };

    $scope.hasDependentsConfiguration = function(formProperty)
    {
        var renderConfig = formProperty.formElement.renderConfig;
        console.log('renderConfig: ', renderConfig);

        var hasDependentsConfig = typeof renderConfig.dependents_config != 'undefined' && $scope.isObjectAndNotEmpty(renderConfig.dependents_config);
        var hasParentDependency = typeof renderConfig.parent_dependency != 'undefined' && $scope.isObjectAndNotEmpty(renderConfig.parent_dependency);

        if( hasDependentsConfig || hasParentDependency) {
            $scope.openDialog('dialog.question.withDependents');

            return true;
        }

        return false;
    };

    $scope.isArray = function(data)
    {
        return Object.prototype.toString.call(data) == '[object Array]';
    }

    $scope.isObject = function(data)
    {
        return Object.prototype.toString.call(data) == '[object Object]';
    }

    $scope.isObjectAndNotEmpty = function(data)
    {
        return $scope.isObject(data) && Object.keys(data).length;
    }

    ////// ngDialog Section ///

    $scope.showQuestionDependencyConfig = function(formProperty){
        $scope.currentFormProperty = formProperty;
        $scope.openDialog('dialog.question.dependencyConfig', 'questionDependencyController')
    };

    // Show Dialog for Update Helptext
    $scope.openEditHelptext = function (formProperty) {
        $scope.currentFormProperty = formProperty;
        $scope.openDialog('dialog.question.editHelptext');
    };

    $scope.openMoveFormElement = function(formProperty){
        $scope.formPropertyToMove = formProperty;
        $scope.openDialog('dialog.question.moveSettings', 'moveFormElementController');
    };

    $scope.openDialog = function(template, controller) {
        var params = { template: template, scope: $scope, className: 'ngdialog-theme-default yky-dialog'};

        if(typeof controller != 'undefined' && controller) {
            params.controller = controller;
        }

        $scope.currentDialog = ngDialog.open(params);
    }

    ////// End of ngDialog Section ///

    $scope.updateFilteredFormProperties = function()
    {
        $scope.filteredFormProperties = $filter('filter')($scope.formProperties, {tab: $scope.currentTab}, true);

        // Update FormQuesiton numbering
        updateFormQuestionsCounter();
    };

    $scope.$watchCollection('form.formSections', function(newVal, oldVal){
        if(newVal && oldVal && newVal.length > oldVal.length) {
            $scope.currentFormSection = newVal[newVal.length - 1];
        }

        $scope.mapFormSections = {};
        angular.forEach(newVal, function(each){
            if(typeof each.id != 'undefined') {
                $scope.mapFormSections[each.id] = each;
            }
        });

    }, true);

    $scope.$watchCollection('formProperties', function(newVal, oldVal){
        console.log('watch: formProperties');
        $scope.updateFilteredFormProperties();
    });

    $scope.$watch('currentFormSection', function(newVal, oldVal){
        // 0 for Form Tab
        console.log('currentFormSection: ', newVal);
        if(typeof newVal != 'undefined') {
            if (newVal && typeof newVal.id != 'undefined') {
                $scope.currentTab = newVal.id;
                $scope.updateFilteredFormProperties();
            } else {
                console.log('set currentTab: ', newVal);
                $scope.currentTab = 0;
            }
        }
    });

    /*
    Get all related form and irs form question on current form question
    */
    $scope.openLinkedFormQuestions = function(formProperty) {
        $scope.fetchingRelatedFormQuestions = 1;
        FormBuilderApiService.getRelatedFormQuestion(formProperty.formQuestion.id, function(responseData) {
            $scope.fetchingRelatedFormQuestions = 0;
            formProperty.relatedFormQuestions = responseData;
        });
    };

    $scope.prepareRelatedFormQuestion = function(form, formSection, formQuestion) {
        var data = {
            formName: form.irsFormName ? form.irsFormName : form.name,
            section: formSection.name,
            questionNo: '',
            question: formQuestion.question
        };

        if(typeof formQuestion.irsFormQuestion != 'undefined') {
            data.section = formQuestion.irsFormQuestion.irsSection;
            data.question = formQuestion.irsFormQuestion.irsQuestion;

            if(formQuestion.irsFormQuestion.irsQuestionNo) {
                data.section += ': ' + formQuestion.irsFormQuestion.irsQuestionNo;
            }
        }

        return data;
    };

    $scope.closeAlert = function(index)
    {
        $scope.alerts.splice(index, 1);
    }

    function executeRemoveFormWidget(formProperty)
    {
        if($scope.hasDependentsConfiguration(formProperty)) {
            return;
        }

        var index = $scope.formProperties.indexOf(formProperty);
        FormBuilderApiService.removeFormElement(formProperty.formElement.id);
        $scope.formProperties.splice(index, 1);
    }

    function updateFormQuestionsCounter()
    {
        var ctr = 1;
        angular.forEach($scope.filteredFormProperties, function(each, key) {
            if(each.formElement.elementType == CFB_CONFIG.questionType) {
                each.counter = ctr++;
            }
        });
    }

    function newFormElementPosition()
    {
        return $scope.filteredFormProperties.length ? $scope.filteredFormProperties[$scope.filteredFormProperties.length - 1].formElement.position + 1 : 1;
    };
    
    function newFormElementIndexPosition()
    {
        var indexPosition = 0;

        if($scope.filteredFormProperties.length) {
            var lastFormElement = $scope.filteredFormProperties[$scope.filteredFormProperties.length - 1];            
            indexPosition = $scope.formProperties.indexOf(lastFormElement) + 1;
        }

        return indexPosition;
    };

    /* TODO: Move this configuration to yml */ 
    function getTinymceConfigurations() 
    {
        var defaultConfig = {
            'width' : 600,
            'height' : 200,
            'menubar' :false,
            'toolbar' : "bold italic | bullist numlist | link",
            'statusbar': false
        };

        var helptextConfig = {
            'width' : 600,
            'height' : 300,
            'menubar' :false,
            'statusbar': false,
            'toolbar' : "bold italic | bullist numlist | link"
        };

        return {
            'tabDescription' : defaultConfig,//angular.extend({}, defaultConfig),
            'formElementDescription' : defaultConfig,
            'helpText' : helptextConfig,
            'formDescription' : defaultConfig
        }; 
    };

    function showInfoMessage(message)
    {
        addAlertMessage({type: 'info', message: message, heading: 'Info!'});
    }

    function showSuccessMessage(message)
    {
        addAlertMessage({type: 'success', message: message, heading: 'Success!'});
    }

    function showErrorMessage(message)
    {
        addAlertMessage({type: 'danger', message: message, heading: 'Error!'});
    }

    function showWarningMessage(message)
    {
        addAlertMessage({type: 'warning', message: message, heading: 'Warning!'});
    }

    function addAlertMessage(alertData)
    {
        $scope.alerts.push(alertData);
        var index = $scope.alerts.indexOf(alertData);

        $timeout(function() {
            console.log('close alert message');
            $scope.alerts.splice(index, 1);
        }, 5000);
    }

    /**
     * Initialize FormBuilder
     */
    function initializeFormBuilder()
    {
        FormBuilderApiService.getQuestionTemplates(
            // SuccessCallback
            function(responseData) {
                $scope.questions = responseData;
            },
            // errorCallback
            function(errorResponse) {
                console.log('errorResponse: ', errorResponse);
            }
        );

        var formId = $('#formId').val();
        if(formId) {

            // Load Form
            FormBuilderApiService.getForm(formId, function(responseData) {
                $scope.form = responseData;

                // Select 1st Tab if exists.
                if ($scope.form.formSections.length > 0) {
                    console.log('initFormBuilder: ', $scope.form.formSections);
                    $scope.currentFormSection = $scope.form.formSections[0]; 
                }

                // initialize sortable Tab or formSection
                SortableTab.init($scope.form.formSections, function(reOrderedFormSections) {

                    // Apply sortedFormSections
                    $scope.$apply(function(){$scope.form.formSections = reOrderedFormSections;});

                    // Save sortedFormSections
                    FormBuilderApiService.reOrderFormSections($scope.form.id, reOrderedFormSections);
                });
            });

            // Load FormElements
            FormBuilderApiService.getFormElements(formId, function(responseData){
                $scope.formProperties = FormBuilderDataService.buildFormProperties(responseData);
            });
        }

    };

}]);