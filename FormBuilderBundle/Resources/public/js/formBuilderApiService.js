/**
 * @author Adelbert Silla
 * 
 * Form Builder Application ApiService.    
 */

formBuilderApp.service('FormBuilderApiService', function(Restangular, apiDefaultRequestParams) {

    var self = this;

    // Set Restangular default request parameters
    Restangular.setDefaultRequestParams(apiDefaultRequestParams);

    
    // Get All Templates 
    self.getQuestionTemplates = function(callback, errorCallback) {
        return Restangular.all('question-templates').getList().then(callback, errorCallback);
    };

    // Create Form
    self.createForm = function(data, callback, errorCallback) {
        data = angular.copy(data);

        console.log('createForm: ', data);

        return Restangular.all('forms').post(data).then(callback, errorCallback);
    };
    
    // Update Form
    self.updateForm = function(data, callback, errorCallback) {

        for(var i=0; i < data.formLinks.length; i++) {
            delete data.formLinks[i].id;
        }

        var putData = {
            name: data.name,
            irsFormName: data.irsFormName,
            wpFormId: data.wpFormId,
            description: data.description,
            helpText: data.helpText,
            videoLink: data.videoLink,
            price: data.price,
            formLinks: data.formLinks,
            status: data.status
        };

        Restangular.one('forms').customPUT(putData, data.id).then(callback, errorCallback);
    };

    // Get Form
    self.getForm = function(formId, callback) {
        return Restangular.all('forms').get(formId).then(callback);
    };


    // Create Form Section
    self.createFormSection = function(formId, data, callback) {
        return Restangular.one('forms', formId).post('form-sections', data).then(function(responseData){
            responseData.form = responseData.form.id;

            return callback(responseData);
        });
    };

    // Update Form Section
    self.updateFormSection = function(formId, data, callback, errorCallback) {
        data = angular.copy(data);

        var id = data.id;
        delete data.id;

        if(typeof data.form != 'undefined') {
            delete data.form;            
        }

        return Restangular.one('forms', formId).one('form-sections', id).customPUT(data).then(callback, errorCallback);
    };
    
    // ReOrder FormSections
    self.reOrderFormSections = function(formId, data, callback) {
        return Restangular.one('forms', formId).all('form-sections/reorder').customPUT(data).then(callback);
    };
    
    // Remove Form Section
    self.removeFormSection = function(formId, data, callback, errorCallback) {
        data = angular.copy(data);

        var id = data.id;
        delete data.id;

        if(typeof errorCallback != 'function') {
            errorCallback = self.defaultErrorCallback;
        }

        return Restangular.one('forms', formId).one('form-sections', id).remove(data).then(callback, errorCallback);
    };


    // Create Form Element with Form Question
    self.createFormElementWithFormQuestion = function(data, formQuestion, callback) {
        data.formQuestion = formQuestion;

        return self.createFormElement(data, function(responseData){
            formQuestion = responseData.formQuestion;

            return callback(responseData);
        });
    };

    
    // Create Form Element
    self.createFormElement = function(data, callback) {
        data = angular.copy(data);

        if(data.renderConfig && typeof data.renderConfig == 'object') {
            data.renderConfig = JSON.stringify(data.renderConfig);            
        }

        if(data.widgetMetadata && typeof data.widgetMetadata == 'object') {
            data.widgetMetadata = JSON.stringify(data.widgetMetadata);            
        }

        return Restangular.all('form-elements').post(data).then(function(responseData){

            if(typeof responseData.formSection == 'object') {
                responseData.formSection = responseData.formSection.id;
            }

            if(typeof responseData.renderConfig != 'undefined' && responseData.renderConfig) { 
                responseData.renderConfig = JSON.parse(responseData.renderConfig);                
            }

            responseData.widgetMetadata = JSON.parse(responseData.widgetMetadata);

            return callback(responseData);
        });
    };

    // Update Form Question
    self.updateFormQuestion = function(data, formElement, callback) {
        var id = data.id;
        data = angular.copy(data);

        data.form = formElement.form;
        data.formElement = formElement.id;

        if(typeof data.form == 'object') {
            data.form = data.form.id;
        }

        if(typeof data.widgetMetadata == 'object') {
            data.widgetMetadata = JSON.stringify(data.widgetMetadata);
        }

        if(typeof data.questionTemplate != 'undefined') {
            delete data.questionTemplate;
        }

        if(typeof data.irsFormQuestion != 'undefined') {
            delete data.irsFormQuestion;
        }

        delete data.id;

        Restangular.one('form-questions').customPUT(data, id).then(callback);
    };
    
    // Get Related Form Questions
    self.getRelatedFormQuestion = function(id, callback) {
        return Restangular.one('form-questions', id).getList('related').then(callback);
    };

    // Update Form Element
    self.updateFormElement = function(data, callback) {
        data = angular.copy(data);
        console.log('API updateFormElement: ', data);
        data.renderConfig = JSON.stringify(data.renderConfig);

        if(typeof data.formQuestion != 'undefined') {
            delete data.formQuestion;
        }

        if(typeof data.formSection == 'object') {
            data.formSection = data.formSection.id;
        }

        if(typeof data.form == 'object') {
            data.form = data.form.id;
        }

        if(typeof data.widgetMetadata == 'object') {
            data.widgetMetadata = JSON.stringify(data.widgetMetadata);
        }

        Restangular.one('form-elements').customPUT(data, data.id).then(callback);
    };
    
    // Move Form Element
    self.moveFormElement = function(data, callback) {
        data = angular.copy(data);
        data.renderConfig = JSON.stringify(data.renderConfig);

        if(typeof data.formQuestion != 'undefined') {
            delete data.formQuestion;
        }

        if(typeof data.formSection == 'object') {
            data.formSection = data.formSection.id;
        }

        if(typeof data.form == 'object') {
            data.form = data.form.id;
        }

        if(typeof data.widgetMetadata == 'object') {
            data.widgetMetadata = JSON.stringify(data.widgetMetadata);
        }

        Restangular.one('form-elements').customPUT(data, data.id + '/move').then(callback);
    };

    // Remove Form Element
    self.removeFormElement = function(formElementId, callback) {
        Restangular.one('form-elements', formElementId).remove().then(callback);
    };


    // Get Form Elements
    self.getFormElements = function(formId, callback) {
        return Restangular.all('form-elements').getList({form_id: formId, sort: 'position'}).then(callback);
    };
    
    self.defaultErrorCallback = function(response) {
        alert('Error: ' + response.data.message);
    };

//    Restangular.addResponseInterceptor(function (data) {
//        var resp = data;
//        if (angular.isArray(data)) {
//            resp.originalElement = [];
//            angular.forEach(resp, function (value, key) {
//                resp.originalElement[key] = angular.copy(value);
//            });
//        } else if (angular.isObject(data)) {
//            resp.originalElement = angular.copy(data);
//        }
//        return resp;
//    });
    return self;
});
